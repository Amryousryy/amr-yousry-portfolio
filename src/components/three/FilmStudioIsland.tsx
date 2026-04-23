"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/three";

const mouseRef = { x: 0, y: 0 };

function FloatingPlatform() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i <= 256; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }, []);

  return (
    <mesh ref={meshRef} position={[0, -1.5, 0]} receiveShadow>
      <cylinderGeometry args={[3, 3.5, 0.8, 32]} />
      <meshStandardMaterial
        color="#1a1a1a"
        metalness={0.7}
        roughness={0.4}
      />
      <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.8, 5.8]} />
        <meshStandardMaterial map={gridTexture} transparent opacity={0.5} />
      </mesh>
    </mesh>
  );
}

function GiantCamera() {
  const groupRef = useRef<THREE.Group>(null);
  const lensRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetRotation = useRef({ x: 0, y: 0 });

  const { scale } = useSpring({
    scale: hovered ? 1.02 : 1,
    config: { tension: 300, friction: 10 },
  });

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = -0.3 + Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
      
      targetRotation.current.x = mouseRef.y * 0.15;
      targetRotation.current.y = mouseRef.x * 0.15;
      
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.05;
    }
    
    if (lensRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.02;
      lensRef.current.scale.setScalar(hovered ? pulse : 1);
    }
  });

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

function FilmReel() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const speed = 0.5 + scrollRef.current * 0.002;
      groupRef.current.rotation.z += clock.getDelta() * speed;
    }
  });

  const spokes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return {
        position: [Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0] as [number, number, number],
        rotation: [0, 0, angle] as [number, number, number],
      };
    });
  }, []);

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

function DirectorsChair() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = -0.5 + Math.sin(clock.getElapsedTime() * 0.4) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[-2, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.5]} />
        <meshStandardMaterial color="#c41e3a" roughness={0.8} />
      </mesh>
      
      <mesh position={[0, -0.4, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.02, 0.8, 0.02]} />
        <meshStandardMaterial color="#111111" metalness={0.9} />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.02, 0.8, 0.02]} />
        <meshStandardMaterial color="#111111" metalness={0.9} />
      </mesh>
      <mesh position={[0, -0.4, 0.2]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.02, 0.8, 0.02]} />
        <meshStandardMaterial color="#111111" metalness={0.9} />
      </mesh>
      <mesh position={[0, -0.4, -0.2]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.02, 0.8, 0.02]} />
        <meshStandardMaterial color="#111111" metalness={0.9} />
      </mesh>
      
      <mesh position={[0, 0.2, -0.25]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.03]} />
        <meshStandardMaterial color="#c41e3a" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Clapperboard() {
  const groupRef = useRef<THREE.Group>(null);
  const topRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clapped, setClapped] = useState(false);

  const stripesTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    const stripeWidth = 16;
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#000000";
      ctx.fillRect(i * stripeWidth, 0, stripeWidth, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = 1 + Math.sin(clock.getElapsedTime()) * 0.1;
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
    }
    
    if (topRef.current && !clapped) {
      topRef.current.rotation.x = hovered ? -0.3 : 0;
    } else if (topRef.current && clapped) {
      topRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 10) * 0.05 - 0.3;
    }
  });

  const handleClick = () => {
    if (!clapped) {
      setClapped(true);
      setTimeout(() => setClapped(false), 1000);
    }
  };

  return (
    <group
      ref={groupRef}
      position={[2, 1, -1]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <mesh ref={topRef} position={[0, 0.35, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.6]} />
        <meshStandardMaterial map={stripesTexture} />
      </mesh>
      
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

function StudioLights() {
  const light1Ref = useRef<THREE.SpotLight>(null);
  const light2Ref = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (light1Ref.current) {
      light1Ref.current.intensity = 1 + Math.sin(t * 2) * 0.5;
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = 1.2 + Math.sin(t * 2 + 1) * 0.3;
    }
  });

  return (
    <>
      <group position={[-2, 1.5, 2]}>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 1.5]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.9, 0]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.1]} />
          <meshStandardMaterial color="#fff5e0" emissive="#fff5e0" emissiveIntensity={0.5} />
        </mesh>
        <spotLight
          ref={light1Ref}
          position={[0, 1, 0]}
          angle={0.5}
          penumbra={0.5}
          intensity={1}
          color="#fff5e0"
          target-position={[0, -1, 0]}
        />
      </group>
      
      <group position={[2, 1.5, 2]}>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 1.5]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.9, 0]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.1]} />
          <meshStandardMaterial color="#fff5e0" emissive="#fff5e0" emissiveIntensity={0.5} />
        </mesh>
        <spotLight
          ref={light2Ref}
          position={[0, 1, 0]}
          angle={0.5}
          penumbra={0.5}
          intensity={1.2}
          color="#fff5e0"
          target-position={[0, -1, 0]}
        />
      </group>
    </>
  );
}

function HolographicScreen({ position, rotation, projectIndex }: { position: [number, number, number]; rotation: [number, number, number]; projectIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5 + projectIndex) * 0.1;
      meshRef.current.rotation.y = rotation[1] + clock.getElapsedTime() * 0.2;
    }
  });

  const screenTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 180;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, 256, 180);
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 248, 172);
    ctx.fillStyle = "#00ffcc";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`PROJECT ${projectIndex + 1}`, 128, 90);
    ctx.font = "10px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Click to view", 128, 120);
    return new THREE.CanvasTexture(canvas);
  }, [projectIndex]);

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          map={screenTexture}
          transparent
          opacity={hovered ? 1 : 0.8}
          emissive={hovered ? "#00ffcc" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      
      <mesh position={position} rotation={rotation}>
        <ringGeometry args={[0.78, 0.8, 4]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.5} />
      </mesh>
    </Float>
  );
}

function PixelGridFloor() {
  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#050508";
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = "rgba(0, 255, 204, 0.1)";
    ctx.lineWidth = 1;
    const gridSize = 32;
    for (let x = 0; x <= 512; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[16, 16]} />
      <meshStandardMaterial map={gridTexture} transparent opacity={0.6} />
    </mesh>
  );
}

function FilmStudioScene() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 5, 20]} />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-5, 3, 5]} intensity={0.3} color="#00ffcc" />
      
      <Stars radius={100} depth={50} count={isMobile ? 500 : 3000} factor={4} saturation={0} fade speed={1} />
      
      <PixelGridFloor />
      <FloatingPlatform />
      <GiantCamera />
      <FilmReel />
      <DirectorsChair />
      <Clapperboard />
      <StudioLights />
      
      {!isMobile && (
        <>
          <HolographicScreen position={[3, 1.5, 0]} rotation={[0, -0.3, 0]} projectIndex={0} />
          <HolographicScreen position={[-3, 2, 0]} rotation={[0, 0.3, 0]} projectIndex={1} />
          <HolographicScreen position={[0, 2.5, -2]} rotation={[0, 0, 0]} projectIndex={2} />
        </>
      )}
    </>
  );
}

export default function SceneCanvas({ children }: { children?: React.ReactNode }) {
  return (
    <div className="fixed inset-0 -z-10" style={{ background: "#050508" }}>
      <Canvas
        camera={{ near: 0.1, far: 1000, position: [0, 0, 8] }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
        aria-label="Interactive 3D cinematic scene showing a film studio island with floating platform, giant camera, film reel, director's chair, clapperboard, and holographic project screens"
        role="img"
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('WebGL context lost, attempting restore...');
          });
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored');
          });
        }}
      >
        <FilmStudioScene />
      </Canvas>
      
      <div className="film-grain" aria-hidden="true" />
      
      {children}
    </div>
  );
}