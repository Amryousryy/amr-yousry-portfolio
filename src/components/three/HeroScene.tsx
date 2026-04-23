"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text, Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const ROLES = ["Video Editor", "Motion Designer", "Content Strategist"];
const STATS = [
  { icon: "★", value: "50+", label: "PROJECTS" },
  { icon: "◆", value: "3+", label: "YEARS" },
  { icon: "▶", value: "1M+", label: "VIEWS" },
];

function FloatingParticles() {
  const count = 1500;
  const mesh = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.getElapsedTime();
    const posArray = mesh.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3 + 1] += Math.sin(time * 0.3 + i * 0.02) * 0.003;
      
      const dx = posArray[i3] - mouse.current.x * 8;
      const dy = posArray[i3 + 1] - mouse.current.y * 8;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 3 && dist > 0) {
        const force = (3 - dist) * 0.08;
        posArray[i3] += (dx / dist) * force;
        posArray[i3 + 1] += (dy / dist) * force;
      }
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.01;
  });

  return (
    <Points ref={mesh} positions={positions} stride={3}>
      <pointsMaterial
        size={0.025}
        color="#00ffcc"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Points({ ref, positions, stride, children }: any) {
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame(() => {
    if (pointsRef.current && !ref.current) {
      (ref as any).current = pointsRef.current;
    }
  });
  
  return (
    <points ref={ref || pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      {children}
    </points>
  );
}

function ApertureBlade({ index, total, isHovered }: { index: number; total: number; isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseAngle = (index / total) * Math.PI * 2;
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    const openness = isHovered ? 0.8 + Math.sin(time * 2) * 0.2 : 0.4;
    const angle = baseAngle + time * 0.15;
    meshRef.current.position.x = Math.cos(angle) * openness;
    meshRef.current.position.y = Math.sin(angle) * openness;
    meshRef.current.rotation.z = angle + Math.PI / 2;
  });
  
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[0.4, 0.1]} />
      <meshStandardMaterial
        color="#00ffcc"
        metalness={1}
        roughness={0.1}
        emissive="#00ffcc"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function Aperture({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = clock.getElapsedTime() * 0.08;
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} onPointerOver={() => {}}>
        <mesh>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshStandardMaterial color="#1a1a2e" metalness={1} roughness={0.2} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshStandardMaterial color="#2a2a4e" metalness={1} roughness={0.3} />
        </mesh>
        {[...Array(8)].map((_, i) => (
          <ApertureBlade key={i} index={i} total={8} isHovered={isHovered} />
        ))}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.35, 32]} />
          <meshStandardMaterial color="#050508" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingPolaroid({ position, imageUrl, delay }: { position: [number, number, number]; imageUrl: string; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime() + delay;
    meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;
    meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    meshRef.current.rotation.x = Math.cos(time * 0.4) * 0.05;
  });
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color={hovered ? "#00ffcc" : "#ffffff"}
          emissive={hovered ? "#00ffcc" : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
    </Float>
  );
}

function Hero3DScene() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const [apertureHovered, setApertureHovered] = useState(false);
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#00ffcc" />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color="#ffffff" />
      <spotLight position={[0, 0, 10]} angle={0.5} penumbra={1} intensity={2} color="#00ffcc" />
      
      {!isMobile && <FloatingParticles />}
      
      <Aperture isHovered={apertureHovered} />
      
      {!isMobile && (
        <>
          <FloatingPolaroid position={[3, 1.5, -1]} imageUrl="" delay={0} />
          <FloatingPolaroid position={[-3, -1, -1]} imageUrl="" delay={1} />
          <FloatingPolaroid position={[2.5, -1.5, -2]} imageUrl="" delay={2} />
          <FloatingPolaroid position={[-2.5, 1.5, -2]} imageUrl="" delay={3} />
        </>
      )}
    </>
  );
}

export default function HeroScene() {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    const fullText = ROLES[currentRole];
    let charIndex = 0;
    setDisplayedText("");
    setIsTyping(true);
    
    const typeInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        
        setTimeout(() => {
          setCurrentRole((prev) => (prev + 1) % ROLES.length);
        }, 2000);
      }
    }, 80);
    
    return () => clearInterval(typeInterval);
  }, [currentRole, mounted]);
  
  if (!mounted) {
    return <div className="min-h-screen" />;
  }
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        dpr={[1, 2]}
        style={{ position: "absolute", inset: 0 }}
      >
        <Hero3DScene />
      </Canvas>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="font-sora text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
          AMR YOUSRY
        </h1>
        
        <div className="h-8 mb-6">
          <span className="font-vt323 text-2xl md:text-3xl text-[#00ffcc] tracking-wider">
            {displayedText}
            <span className="animate-pulse">|</span>
          </span>
        </div>
        
        <div className="pixel-text text-[#00ffcc] text-xs md:text-sm mb-8 tracking-widest">
          VISUAL STORYTELLER
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="pixel-border bg-[#0a0a0f]/80 px-4 py-2">
              <span className="text-[#00ffcc] mr-1">{stat.icon}</span>
              <span className="text-white font-bold">{stat.value}</span>
              <span className="text-[#00ffcc] ml-1">{stat.label}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-12">
          <button className="pixel-border bg-[#00ffcc]/10 text-[#00ffcc] px-8 py-4 font-vt323 text-xl hover:bg-[#00ffcc]/20 transition-colors">
            VIEW WORK
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-[#00ffcc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}