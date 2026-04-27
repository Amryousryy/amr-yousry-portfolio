"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/three";

const mouseRef = { x: 0, y: 0 };

function FloatingPlatform({ meshRef }: { meshRef: React.RefObject<THREE.Mesh | null> }) {
  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0a0a0f"; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#00ffcc"; ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
    for (let i = 0; i <= 256; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }, []);

  return (
    <mesh ref={meshRef} position={[0, -1.5, 0]} receiveShadow>
      <cylinderGeometry args={[3, 3.5, 0.8, 32]} />
      <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} />
      <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.8, 5.8]} />
        <meshStandardMaterial map={gridTexture} transparent opacity={0.5} />
      </mesh>
    </mesh>
  );
}

function GiantCamera({ groupRef, lensRef, hovered, setHovered }: { groupRef: React.RefObject<THREE.Group | null>; lensRef: React.RefObject<THREE.Mesh | null>; hovered: boolean; setHovered: (v: boolean) => void }) {
  const { scale } = useSpring({ scale: hovered ? 1.02 : 1, config: { tension: 300, friction: 10 } });

  return (
    <animated.group
      ref={groupRef}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 0.8, 1.8]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 1.2]} ref={lensRef}>
        <cylinderGeometry args={[0.35, 0.4, 0.6, 32]} />
        <meshStandardMaterial color="#00ffcc" metalness={1} roughness={0.1} emissive="#00ffcc" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0, 1.5]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
        <meshStandardMaterial color="#050508" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.3, 0.25, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, 0, 0.3]}>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>
    </animated.group>
  );
}

function FilmReel({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  const spokes = useMemo(() => Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return { position: [Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0] as [number, number, number], rotation: [0, 0, angle] as [number, number, number] };
  }), []);

  return (
    <group ref={groupRef} position={[0, 0.5, -1.5]}>
      <mesh>
        <torusGeometry args={[1.5, 0.08, 16, 100]} />
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.2} />
      </mesh>
      {spokes.map((spoke, i) => (
        <mesh key={i} position={spoke.position} rotation={spoke.rotation}>
          <boxGeometry args={[1.8, 0.05, 0.05]} />
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.3} />
        </mesh>
      ))}
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function DirectorsChair({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  return (
    <group ref={groupRef} position={[-2, 0, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[0.6, 0.05, 0.5]} /><meshStandardMaterial color="#c41e3a" roughness={0.8} /></mesh>
      <mesh position={[0, -0.4, 0]} rotation={[0, 0.3, 0]}><boxGeometry args={[0.02, 0.8, 0.02]} /><meshStandardMaterial color="#111111" metalness={0.9} /></mesh>
      <mesh position={[0, -0.4, 0]} rotation={[0, -0.3, 0]}><boxGeometry args={[0.02, 0.8, 0.02]} /><meshStandardMaterial color="#111111" metalness={0.9} /></mesh>
      <mesh position={[0, -0.4, 0.2]} rotation={[0, -0.3, 0]}><boxGeometry args={[0.02, 0.8, 0.02]} /><meshStandardMaterial color="#111111" metalness={0.9} /></mesh>
      <mesh position={[0, -0.4, -0.2]} rotation={[0, 0.3, 0]}><boxGeometry args={[0.02, 0.8, 0.02]} /><meshStandardMaterial color="#111111" metalness={0.9} /></mesh>
      <mesh position={[0, 0.2, -0.25]} rotation={[-0.2, 0, 0]}><boxGeometry args={[0.6, 0.4, 0.03]} /><meshStandardMaterial color="#c41e3a" roughness={0.8} /></mesh>
    </group>
  );
}

function Clapperboard({ groupRef, topRef, hovered, setHovered, clapped, setClapped }: { groupRef: React.RefObject<THREE.Group | null>; topRef: React.RefObject<THREE.Mesh | null>; hovered: boolean; setHovered: (v: boolean) => void; clapped: boolean; setClapped: (v: boolean) => void }) {
  const stripesTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128; canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#000000"; ctx.fillRect(i * 16, 0, 16, 32); }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group ref={groupRef} position={[2, 1, -1]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={() => { if (!clapped) { setClapped(true); setTimeout(() => setClapped(false), 1000); } }}>
      <mesh ref={topRef} position={[0, 0.35, 0]}><boxGeometry args={[0.8, 0.15, 0.6]} /><meshStandardMaterial map={stripesTexture} /></mesh>
      <mesh position={[0, 0.1, 0]}><boxGeometry args={[0.8, 0.5, 0.6]} /><meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} /></mesh>
    </group>
  );
}

function HolographicScreen({ meshRef, position, rotation, projectIndex, hovered, setHovered }: { meshRef: React.RefObject<THREE.Mesh | null>; position: [number, number, number]; rotation: [number, number, number]; projectIndex: number; hovered: boolean; setHovered: (v: boolean) => void }) {
  const screenTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 180;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0a0a0f"; ctx.fillRect(0, 0, 256, 180);
    ctx.strokeStyle = "#00ffcc"; ctx.lineWidth = 2; ctx.strokeRect(4, 4, 248, 172);
    ctx.fillStyle = "#00ffcc"; ctx.font = "12px monospace"; ctx.textAlign = "center";
    ctx.fillText(`PROJECT ${projectIndex + 1}`, 128, 90); ctx.font = "10px monospace"; ctx.fillStyle = "#ffffff"; ctx.fillText("Click to view", 128, 120);
    return new THREE.CanvasTexture(canvas);
  }, [projectIndex]);

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={meshRef} position={position} rotation={rotation} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial map={screenTexture} transparent opacity={hovered ? 1 : 0.8} emissive={hovered ? "#00ffcc" : "#000000"} emissiveIntensity={hovered ? 0.3 : 0} />
      </mesh>
      <mesh position={position} rotation={rotation}><ringGeometry args={[0.78, 0.8, 4]} /><meshBasicMaterial color="#00ffcc" transparent opacity={0.5} /></mesh>
    </Float>
  );
}

function FilmStudioScene({ isVisibleRef }: { isVisibleRef: React.RefObject<boolean> }) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  // Refs
  const platformRef = useRef<THREE.Mesh>(null);
  const cameraGroupRef = useRef<THREE.Group>(null);
  const cameraLensRef = useRef<THREE.Mesh>(null);
  const reelGroupRef = useRef<THREE.Group>(null);
  const chairGroupRef = useRef<THREE.Group>(null);
  const clapperGroupRef = useRef<THREE.Group>(null);
  const clapperTopRef = useRef<THREE.Mesh>(null);
  const light1Ref = useRef<THREE.SpotLight>(null);
  const light2Ref = useRef<THREE.SpotLight>(null);
  const screenRefs = useRef<(THREE.Mesh | null)[]>([]);

  // States
  const [cameraHovered, setCameraHovered] = useState(false);
  const [clapperHovered, setClapperHovered] = useState(false);
  const [clapperClapped, setClapperClapped] = useState(false);
  const [screensHovered, setScreensHovered] = useState([false, false, false]);
  const scrollRef = useRef(0);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { mouseRef.x = (e.clientX / window.innerWidth - 0.5) * 2; mouseRef.y = -(e.clientY / window.innerHeight - 0.5) * 2; };
    const handleScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("scroll", handleScroll); };
  }, []);

  useFrame(({ clock }) => {
    if (!isVisibleRef.current) return;
    const t = clock.getElapsedTime();
    const dt = clock.getDelta();

    // 1. Platform
    if (platformRef.current) platformRef.current.position.y = Math.sin(t * 0.5) * 0.2;

    // 2. Camera
    if (cameraGroupRef.current) {
      cameraGroupRef.current.position.y = -0.3 + Math.sin(t * 0.3) * 0.1;
      targetRotation.current.x = mouseRef.y * 0.15; targetRotation.current.y = mouseRef.x * 0.15;
      cameraGroupRef.current.rotation.x += (targetRotation.current.x - cameraGroupRef.current.rotation.x) * 0.05;
      cameraGroupRef.current.rotation.y += (targetRotation.current.y - cameraGroupRef.current.rotation.y) * 0.05;
    }
    if (cameraLensRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.02;
      cameraLensRef.current.scale.setScalar(cameraHovered ? pulse : 1);
    }

    // 3. Film Reel
    if (reelGroupRef.current) reelGroupRef.current.rotation.z += dt * (0.5 + scrollRef.current * 0.002);

    // 4. Chair
    if (chairGroupRef.current) chairGroupRef.current.position.y = -0.5 + Math.sin(t * 0.4) * 0.05;

    // 5. Clapperboard
    if (clapperGroupRef.current) {
      clapperGroupRef.current.position.y = 1 + Math.sin(t) * 0.1;
      clapperGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    }
    if (clapperTopRef.current) {
      if (!clapperClapped) clapperTopRef.current.rotation.x = clapperHovered ? -0.3 : 0;
      else clapperTopRef.current.rotation.x = Math.sin(t * 10) * 0.05 - 0.3;
    }

    // 6. Lights
    if (light1Ref.current) light1Ref.current.intensity = 1 + Math.sin(t * 2) * 0.5;
    if (light2Ref.current) light2Ref.current.intensity = 1.2 + Math.sin(t * 2 + 1) * 0.3;

    // 7. Screens
    screenRefs.current.forEach((screen, i) => {
      if (screen) {
        screen.position.y = [1.5, 2, 2.5][i] + Math.sin(t * 0.5 + i) * 0.1;
        screen.rotation.y = [ -0.3, 0.3, 0][i] + t * 0.2;
      }
    });
  });

  return (
    <>
      <ambientLight intensity={0.3} /><pointLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" /><pointLight position={[-5, 3, 5]} intensity={0.3} color="#00ffcc" />
      <Stars radius={100} depth={50} count={isMobile ? 500 : 3000} factor={4} saturation={0} fade speed={1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}><planeGeometry args={[16, 16]} /><meshStandardMaterial color="#050508" transparent opacity={0.6} /></mesh>
      <FloatingPlatform meshRef={platformRef} />
      <GiantCamera groupRef={cameraGroupRef} lensRef={cameraLensRef} hovered={cameraHovered} setHovered={setCameraHovered} />
      <FilmReel groupRef={reelGroupRef} />
      <DirectorsChair groupRef={chairGroupRef} />
      <Clapperboard groupRef={clapperGroupRef} topRef={clapperTopRef} hovered={clapperHovered} setHovered={setClapperHovered} clapped={clapperClapped} setClapped={setClapperClapped} />
      <group position={[-2, 1.5, 2]}>
        <mesh><cylinderGeometry args={[0.03, 0.03, 1.5]} /><meshStandardMaterial color="#333333" /></mesh>
        <spotLight ref={light1Ref} position={[0, 1, 0]} angle={0.5} penumbra={0.5} color="#fff5e0" />
      </group>
      <group position={[2, 1.5, 2]}>
        <mesh><cylinderGeometry args={[0.03, 0.03, 1.5]} /><meshStandardMaterial color="#333333" /></mesh>
        <spotLight ref={light2Ref} position={[0, 1, 0]} angle={0.5} penumbra={0.5} color="#fff5e0" />
      </group>
      {!isMobile && (
        <>
          <HolographicScreen meshRef={(el) => { screenRefs.current[0] = el; }} position={[3, 1.5, 0]} rotation={[0, -0.3, 0]} projectIndex={0} hovered={screensHovered[0]} setHovered={(v) => { const s = [...screensHovered]; s[0] = v; setScreensHovered(s); }} />
          <HolographicScreen meshRef={(el) => { screenRefs.current[1] = el; }} position={[-3, 2, 0]} rotation={[0, 0.3, 0]} projectIndex={1} hovered={screensHovered[1]} setHovered={(v) => { const s = [...screensHovered]; s[1] = v; setScreensHovered(s); }} />
          <HolographicScreen meshRef={(el) => { screenRefs.current[2] = el; }} position={[0, 2.5, -2]} rotation={[0, 0, 0]} projectIndex={2} hovered={screensHovered[2]} setHovered={(v) => { const s = [...screensHovered]; s[2] = v; setScreensHovered(s); }} />
        </>
      )}
    </>
  );
}

export default function FilmStudioIsland() {
  const isVisibleRef = useRef(true);
  const { gl } = useThree();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { 
      isVisibleRef.current = entry.isIntersecting; 
    }, { threshold: 0 });
    
    observer.observe(gl.domElement);
    return () => observer.disconnect();
  }, [gl]);

  return <FilmStudioScene isVisibleRef={isVisibleRef} />;
}
