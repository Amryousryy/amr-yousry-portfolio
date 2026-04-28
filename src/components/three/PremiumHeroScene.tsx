"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function getReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function CameraBody({ groupRef, hovered }: { groupRef: React.RefObject<THREE.Group | null>; hovered: boolean }) {
  return (
    <group ref={groupRef} scale={hovered ? 1.02 : 1}>
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
        <meshPhysicalMaterial color="#0d0d18" metalness={0.95} roughness={0.05} clearcoat={1} />
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
        <meshPhysicalMaterial color="#0d0d18" metalness={0.95} roughness={0.05} clearcoat={1} />
      </mesh>
      <mesh position={[-0.55, 0.1, 0.27]}>
        <cylinderGeometry args={[0.18, 0.2, 0.03, 32]} />
        <meshPhysicalMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.45, 0.19]}>
        <boxGeometry args={[0.6, 0.15, 0.08]} />
        <meshPhysicalMaterial color="#111122" metalness={0.95} roughness={0.05} clearcoat={1} />
      </mesh>
      <mesh position={[-0.5, 0.35, 0.2]}>
        <boxGeometry args={[0.2, 0.15, 0.06]} />
        <meshPhysicalMaterial color={hovered ? "#1a1a2e" : "#0d0d18"} metalness={0.9} roughness={0.1} clearcoat={0.8} />
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

function GlowOrb({ shaderMaterial }: { shaderMaterial: THREE.ShaderMaterial }) {
  return (
    <mesh position={[0.55, 0.1, 0.35]} material={shaderMaterial}>
      <planeGeometry args={[1.2, 1.2]} />
    </mesh>
  );
}

function ParticleField({ count = 150, pointsRef }: { count?: number; pointsRef: React.RefObject<THREE.Points | null> }) {
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

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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

function AmbientParticles({ count = 80, pointsRef, shaderMaterial }: { count?: number; pointsRef: React.RefObject<THREE.Points | null>; shaderMaterial: THREE.ShaderMaterial }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = THREE.MathUtils.randFloatSpread(10);
      pos[i * 3 + 1] = THREE.MathUtils.randFloatSpread(8);
      pos[i * 3 + 2] = THREE.MathUtils.randFloatSpread(5);
    }
    return pos;
  }, [count]);

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  );
}

function LensFlare({ meshRef }: { meshRef: React.RefObject<THREE.Mesh | null> }) {
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

function Scene({ isVisibleRef }: { isVisibleRef: React.RefObject<boolean> }) {
  const { camera, pointer, viewport } = useThree();
  const isMobile = viewport.width < 4;
  const reducedMotion = getReducedMotion();

  // Component Refs
  const cameraBodyRef = useRef<THREE.Group>(null);
  const particleFieldRef = useRef<THREE.Points>(null);
  const ambientParticlesRef = useRef<THREE.Points>(null);
  const lensFlareRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Shared Animation Values
  const vec = useMemo(() => new THREE.Vector3(), []);
  const smoothPointer = useRef({ x: 0, y: 0 });

  // Shader Materials
  const orbMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0x00ffcc) }, uIntensity: { value: 1.0 } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform float uTime; uniform vec3 uColor; uniform float uIntensity; varying vec2 vUv; void main() { vec2 center = vUv - 0.5; float dist = length(center); float pulse = 0.8 + 0.2 * sin(uTime * 0.6); float glow = (0.08 / (dist + 0.03)) * pulse * uIntensity; float alpha = clamp(glow, 0.0, 0.4); float vignette = 1.0 - smoothstep(0.3, 0.5, dist); gl_FragColor = vec4(uColor * vignette, alpha * vignette); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  const ambientMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSize: { value: 0.015 }, uColor: { value: new THREE.Color("#ffffff") }, uOpacity: { value: 0.2 } },
    vertexShader: `uniform float uTime; uniform float uSize; void main() { vec3 pos = position; pos.y += sin(uTime * 0.2 + position.x * 0.5) * 0.1; pos.x += cos(uTime * 0.1 + position.z * 0.3) * 0.05; vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); gl_PointSize = uSize * (300.0 / -mvPosition.z); gl_Position = projectionMatrix * mvPosition; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uOpacity; void main() { float dist = length(gl_PointCoord - vec2(0.5)); if (dist > 0.5) discard; float alpha = smoothstep(0.5, 0.2, dist) * uOpacity; gl_FragColor = vec4(uColor, alpha); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  useFrame(({ clock }) => {
    if (!isVisibleRef.current) return;
    const time = clock.getElapsedTime();

    // 1. Camera Rig Logic
    if (!reducedMotion) {
      smoothPointer.current.x += (pointer.x - smoothPointer.current.x) * 0.03;
      smoothPointer.current.y += (pointer.y - smoothPointer.current.y) * 0.03;
      camera.position.x += (smoothPointer.current.x * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (smoothPointer.current.y * 0.3 - camera.position.y) * 0.02;
      vec.set(0, 0, 0);
      camera.lookAt(vec);
    }

    // 2. Camera Body Logic
    if (cameraBodyRef.current && !reducedMotion) {
      const breathe = 1 + Math.sin(time * 0.4) * 0.008;
      cameraBodyRef.current.scale.set(breathe, breathe, 1);
      cameraBodyRef.current.rotation.y = Math.sin(time * 0.25) * 0.04;
      cameraBodyRef.current.rotation.z = Math.sin(time * 0.15) * 0.02;
    }

    // 3. Shader Uniforms
    orbMaterial.uniforms.uTime.value = time;
    ambientMaterial.uniforms.uTime.value = time;

    // 4. Particle Field Rotation
    if (particleFieldRef.current && !reducedMotion) {
      particleFieldRef.current.rotation.y = time * 0.01;
      particleFieldRef.current.rotation.x = Math.sin(time * 0.05) * 0.02;
    }

    // 5. Lens Flare Opacity
    if (lensFlareRef.current?.material) {
      (lensFlareRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(time * 0.8) * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#0a0a15" />
      <pointLight position={[3, 2, 4]} intensity={1.5} color="#00ffcc" distance={15} />
      <pointLight position={[-3, -1, 3]} intensity={0.8} color="#ffffff" distance={12} />
      <pointLight position={[0, -2, 2]} intensity={0.4} color="#0066ff" distance={8} />
      <spotLight position={[0, 0, 5]} angle={0.6} penumbra={1} intensity={2} color="#00ffcc" distance={20} />
      
      <Float
        speed={isMobile ? 0.8 : 1}
        rotationIntensity={isMobile ? 0.02 : reducedMotion ? 0 : 0.03}
        floatIntensity={isMobile ? 0.1 : reducedMotion ? 0 : 0.15}
      >
        <group onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <CameraBody groupRef={cameraBodyRef} hovered={hovered} />
        </group>
        {!reducedMotion && <GlowOrb shaderMaterial={orbMaterial} />}
        {!reducedMotion && <LensFlare meshRef={lensFlareRef} />}
      </Float>
      
      {!reducedMotion && <AmbientParticles count={isMobile ? 40 : 80} pointsRef={ambientParticlesRef} shaderMaterial={ambientMaterial} />}
      {!isMobile && !reducedMotion && <ParticleField count={150} pointsRef={particleFieldRef} />}
      
      <Environment preset="night" environmentIntensity={0.3} />
    </>
  );
}

export default function PremiumHeroScene({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    setMounted(true);
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.01 }); // Use very low threshold to catch exit/entry immediately

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!mounted) return <div className={className} style={{ position: "absolute", inset: 0, background: "#050508" }} />;

  return (
    <div ref={containerRef} className={className} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
        frameloop={isVisible ? "always" : "never"}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true
        }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color("#050508"), 1)}
      >
        <color attach="background" args={["#050508"]} />
        <fog attach="fog" args={["#050508", 4, 12]} />
        <Scene isVisibleRef={isVisibleRef} />
      </Canvas>
    </div>
  );
}
