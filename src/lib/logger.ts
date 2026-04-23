type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  [key: string]: unknown;
}

interface LoggerOptions {
  service: string;
  level?: LogLevel;
}

class Logger {
  private service: string;
  private level: LogLevel;
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(options: LoggerOptions) {
    this.service = options.service;
    this.level = options.level || "info";
  }

  private log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    if (this.levels[level] < this.levels[this.level]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.service,
      ...meta,
    };

    const output = JSON.stringify(entry);
    
    switch (level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }

  debug(message: string, meta?: Record<string, unknown>) {
    this.log("debug", message, meta);
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.log("error", message, meta);
  }
}

export const apiLogger = new Logger({ service: "api", level: (process.env.LOG_LEVEL as LogLevel) || "info" });
export const dbLogger = new Logger({ service: "database", level: (process.env.LOG_LEVEL as LogLevel) || "info" });
export const authLogger = new Logger({ service: "auth", level: (process.env.LOG_LEVEL as LogLevel) || "info" });

export default Logger;