"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function getReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function CameraBody() {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = getReducedMotion();

  useFrame(({ clock }) => {
    if (!meshRef.current || reducedMotion) return;
    const time = clock.getElapsedTime();
    
    const breathe = 1 + Math.sin(time * 0.4) * 0.008;
    meshRef.current.scale.set(breathe, breathe, 1);
    
    meshRef.current.rotation.y = Math.sin(time * 0.25) * 0.04;
    meshRef.current.rotation.z = Math.sin(time * 0.15) * 0.02;
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.02 : 1}
    >
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 1.2, 0.35]} />
        <meshPhysicalMaterial
          color={hovered ? "#0a0a15" : "#060610"}
          metalness={0.98}
          roughness={0.02}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={1}
        />
      </mesh>

      <mesh position={[0, 0, 0.18]}>
        <boxGeometry args={[1.6, 1, 0.05]} />
        <meshPhysicalMaterial
          color="#111122"
          metalness={0.95}
          roughness={0.05}
          transmission={0.3}
          thickness={0.2}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh position={[0.55, 0.1, 0.2]}>
        <cylinderGeometry args={[0.28, 0.32, 0.15, 32]} />
        <meshPhysicalMaterial
          color="#0d0d18"
          metalness={0.95}
          roughness={0.05}
          clearcoat={1}
        />
      </mesh>

      <mesh position={[0.55, 0.1, 0.28]}>
        <cylinderGeometry args={[0.22, 0.26, 0.05, 32]} />
        <meshPhysicalMaterial
          color="#00ffcc"
          emissive="#00ffcc"
          emissiveIntensity={hovered ? 0.4 : 0.15}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh position={[-0.55, 0.1, 0.2]}>
        <cylinderGeometry args={[0.22, 0.26, 0.12, 32]} />
        <meshPhysicalMaterial
          color="#0d0d18"
          metalness={0.95}
          roughness={0.05}
          clearcoat={1}
        />
      </mesh>

      <mesh position={[-0.55, 0.1, 0.27]}>
        <cylinderGeometry args={[0.18, 0.2, 0.03, 32]} />
        <meshPhysicalMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[0, -0.45, 0.19]}>
        <boxGeometry args={[0.6, 0.15, 0.08]} />
        <meshPhysicalMaterial
          color="#111122"
          metalness={0.95}
          roughness={0.05}
          clearcoat={1}
        />
      </mesh>

      <mesh position={[-0.5, 0.35, 0.2]}>
        <boxGeometry args={[0.2, 0.15, 0.06]} />
        <meshPhysicalMaterial
          color={hovered ? "#1a1a2e" : "#0d0d18"}
          metalness={0.9}
          roughness={0.1}
          clearcoat={0.8}
        />
      </mesh>

      <mesh position={[0.3, -0.35, 0.2]}>
        <boxGeometry args={[0.15, 0.1, 0.04]} />
        <meshStandardMaterial
          color={hovered ? "#00ffcc" : "#005544"}
          emissive={hovered ? "#00ffcc" : "#003322"}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function GlowOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00ffcc) },
        uIntensity: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uIntensity;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float pulse = 0.8 + 0.2 * sin(uTime * 0.6);
          float glow = (0.08 / (dist + 0.03)) * pulse * uIntensity;
          float alpha = clamp(glow, 0.0, 0.4);
          float vignette = 1.0 - smoothstep(0.3, 0.5, dist);
          gl_FragColor = vec4(uColor * vignette, alpha * vignette);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame(({ clock }) => {
    if (shaderMaterial.uniforms) {
      shaderMaterial.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0.55, 0.1, 0.35]} material={shaderMaterial}>
      <planeGeometry args={[1.2, 1.2]} />
    </mesh>
  );
}

function ParticleField({ count = 150 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const reducedMotion = getReducedMotion();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 3;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || reducedMotion) return;
    const time = clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.01;
    pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#00ffcc"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function AmbientParticles({ count = 80 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const reducedMotion = getReducedMotion();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || reducedMotion) return;
    const time = clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3 + 1] += Math.sin(time * 0.3 + i * 0.2) * 0.0005;
      posArray[i3] += Math.cos(time * 0.2 + i * 0.15) * 0.0003;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#ffffff"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function LensFlare() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !meshRef.current.material) return;
    const time = clock.getElapsedTime();
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.1 + Math.sin(time * 0.8) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0.55, 0.1, 0.32]}>
      <circleGeometry args={[0.35, 32]} />
      <meshBasicMaterial
        color="#00ffcc"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);
  const smoothPointer = useRef({ x: 0, y: 0 });
  const reducedMotion = getReducedMotion();

  useFrame(() => {
    if (reducedMotion) return;
    
    smoothPointer.current.x += (pointer.x - smoothPointer.current.x) * 0.03;
    smoothPointer.current.y += (pointer.y - smoothPointer.current.y) * 0.03;
    
    const targetX = smoothPointer.current.x * 0.5;
    const targetY = smoothPointer.current.y * 0.3;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    
    vec.set(0, 0, 0);
    camera.lookAt(vec);
  });

  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.15} color="#0a0a15" />
      <pointLight position={[3, 2, 4]} intensity={1.5} color="#00ffcc" distance={15} />
      <pointLight position={[-3, -1, 3]} intensity={0.8} color="#ffffff" distance={12} />
      <pointLight position={[0, -2, 2]} intensity={0.4} color="#0066ff" distance={8} />
      <spotLight
        position={[0, 0, 5]}
        angle={0.6}
        penumbra={1}
        intensity={2}
        color="#00ffcc"
        distance={20}
      />
    </>
  );
}

function Scene() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 4;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      {!prefersReducedMotion && <CameraRig />}
      <Lights />
      
      <Float
        speed={isMobile ? 0.8 : 1}
        rotationIntensity={isMobile ? 0.02 : prefersReducedMotion ? 0 : 0.03}
        floatIntensity={isMobile ? 0.1 : prefersReducedMotion ? 0 : 0.15}
      >
        <CameraBody />
        {!prefersReducedMotion && <GlowOrb />}
        {!prefersReducedMotion && <LensFlare />}
      </Float>
      
      {!prefersReducedMotion && <AmbientParticles count={isMobile ? 40 : 80} />}
      {!isMobile && !prefersReducedMotion && <ParticleField count={isMobile ? 60 : 150} />}
      
      <Environment preset="night" environmentIntensity={0.3} />
    </>
  );
}

interface PremiumHeroSceneProps {
  className?: string;
}

export default function PremiumHeroScene({ className }: PremiumHeroSceneProps) {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (!mounted) {
    return (
      <div className={className} style={{ position: "absolute", inset: 0, background: "#050508" }} />
    );
  }

  if (prefersReducedMotion) {
    return (
      <div 
        className={className} 
        style={{ 
          position: "absolute", 
          inset: 0, 
          background: "linear-gradient(180deg, #050508 0%, #0a0a12 100%)" 
        }} 
      />
    );
  }

  return (
    <div className={className} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#050508"]} />
        <fog attach="fog" args={["#050508", 4, 12]} />
        <Scene />
      </Canvas>
    </div>
  );
}