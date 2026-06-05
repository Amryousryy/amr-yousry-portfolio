/**
 * Phase 19 — CI Server Start Strategy
 *
 * Starts the Next.js production server, waits for /api/health,
 * runs the specified QA script, then kills the server.
 *
 * Usage:
 *   node scripts/qa/run-with-server.mjs <qa-script-path> [args...]
 *
 * Example:
 *   node scripts/qa/run-with-server.mjs scripts/qa/public-contract-smoke.mjs
 *
 * Environment:
 *   PORT            — server port (default: 3001)
 *   HOSTNAME        — server host (default: localhost)
 *   SERVER_TIMEOUT  — max wait for server start in ms (default: 30000)
 *   QA_TIMEOUT      — max QA script run time in ms (default: 60000)
 */
import { spawn } from "node:child_process";
import { request as httpRequest } from "node:http";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = parseInt(process.env.PORT || "3001", 10);
const HOST = process.env.HOSTNAME || "localhost";
const SERVER_TIMEOUT = parseInt(process.env.SERVER_TIMEOUT || "30000", 10);
const QA_TIMEOUT = parseInt(process.env.QA_TIMEOUT || "60000", 10);

const qaScript = process.argv[2];
if (!qaScript) {
  console.error("Usage: node scripts/qa/run-with-server.mjs <qa-script> [args...]");
  process.exit(1);
}

const qaArgs = process.argv.slice(3);
let serverProcess = null;
let serverStarted = false;
let timedOut = false;

function log(msg) {
  console.log(`[run-with-server] ${msg}`);
}

function findNextCli() {
  // Use node to run Next.js CLI directly — works cross-platform
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const nextCli = resolve(scriptDir, "..", "..", "node_modules", "next", "dist", "bin", "next");
  if (existsSync(nextCli)) return nextCli;
  // fallback
  return resolve(scriptDir, "..", "..", "node_modules", "next", "dist", "bin", "next");
}

function startServer() {
  return new Promise((resolve, reject) => {
    const nextCli = findNextCli();
    const projectRoot = resolve(nextCli, "..", "..", "..", "..");
    log(`Starting server: node ${nextCli} start -p ${PORT} -H ${HOST} (cwd: ${projectRoot})`);
    serverProcess = spawn(process.execPath, [nextCli, "start", "-p", String(PORT), "-H", HOST], {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, PORT: String(PORT), HOSTNAME: HOST },
    });

    let stderrBuf = "";
    serverProcess.stdout.on("data", (data) => {
      const text = data.toString();
      process.stdout.write(text);
      if (!serverStarted && (text.includes("started") || text.includes("ready") || text.includes("localhost") || text.includes("listening"))) {
        serverStarted = true;
        resolve();
      }
    });

    serverProcess.stderr.on("data", (data) => {
      const text = data.toString();
      process.stderr.write(text);
      stderrBuf += text;
      // Some Next.js versions output startup info on stderr
      if (!serverStarted && (text.includes("started") || text.includes("ready") || text.includes("localhost") || text.includes("listening"))) {
        serverStarted = true;
        resolve();
      }
    });

    serverProcess.on("error", (err) => reject(err));

    serverProcess.on("exit", (code, signal) => {
      if (!serverStarted) {
        const detail = stderrBuf ? ` (stderr: ${stderrBuf.trim().slice(0, 200)})` : "";
        reject(new Error(`Server exited with code ${code} signal ${signal} before starting${detail}`));
      }
    });
  });
}

function waitForHealth(url, timeout) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      if (timedOut) return reject(new Error("Timed out waiting for server"));
      if (Date.now() - start > timeout) {
        return reject(new Error(`Server not healthy within ${timeout}ms`));
      }
      const req = httpRequest(url, { method: "GET", timeout: 3000 }, (res) => {
        if (res.statusCode === 200) return resolve();
        setTimeout(check, 500);
      });
      req.on("error", () => setTimeout(check, 500));
      req.on("timeout", () => { req.destroy(); setTimeout(check, 500); });
      req.end();
    }
    check();
  });
}

function runQAScript() {
  return new Promise((resolve, reject) => {
    log(`Running QA script: ${qaScript} ${qaArgs.join(" ")}`);
    const child = spawn("node", [qaScript, ...qaArgs], {
      stdio: "inherit",
      env: { ...process.env, QA_BASE_URL: `http://${HOST}:${PORT}` },
    });
    const timer = setTimeout(() => {
      log("QA script timed out — killing");
      child.kill("SIGTERM");
      reject(new Error("QA script timed out"));
    }, QA_TIMEOUT);
    child.on("exit", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`QA script exited with code ${code}`));
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function cleanup() {
  return new Promise((resolve) => {
    if (serverProcess && !serverProcess.killed) {
      log("Stopping server");
      try {
        serverProcess.kill("SIGTERM");
      } catch {
        // process may already be dead
      }
      setTimeout(() => {
        try {
          if (serverProcess && !serverProcess.killed) {
            serverProcess.kill("SIGKILL");
          }
        } catch {
          // ignore
        }
        resolve();
      }, 3000);
    } else {
      resolve();
    }
  });
}

async function main() {
  let exitCode = 0;
  try {
    await startServer();
    const healthUrl = `http://${HOST}:${PORT}/api/health`;
    log(`Waiting for health check at ${healthUrl}`);
    await waitForHealth(healthUrl, SERVER_TIMEOUT);
    log("Server is healthy — running QA script");
    await runQAScript();
    log("QA script completed successfully");
  } catch (err) {
    console.error(`[run-with-server] ERROR: ${err.message}`);
    exitCode = 1;
  } finally {
    timedOut = true;
    await cleanup();
    process.exit(exitCode);
  }
}

main();
