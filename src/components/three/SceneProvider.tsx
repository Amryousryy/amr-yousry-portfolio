"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function FilmParticles() {
  const count = 2000;
  const meshRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const teal = new THREE.Color("#00ffcc");
    const white = new THREE.Color("#ffffff");
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = Math.random() > 0.3 ? teal : white;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geo;
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
    if (!meshRef.current) return;
    
    const time = clock.getElapsedTime();
    const positionArray = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      positionArray[i3 + 1] += Math.sin(time * 0.5 + i * 0.01) * 0.002;
      
      const dx = positionArray[i3] - mouse.current.x * 5;
      const dy = positionArray[i3 + 1] - mouse.current.y * 5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 2) {
        const force = (2 - dist) * 0.05;
        positionArray[i3] += (dx / dist) * force;
        positionArray[i3 + 1] += (dy / dist) * force;
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.02;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        transparent
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Aperture() {
  const meshRef = useRef<THREE.Group>(null);
  const bladesRef = useRef<THREE.Mesh[]>([]);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = clock.getElapsedTime() * 0.1;
    
    const openness = Math.sin(clock.getElapsedTime() * 0.5) * 0.3 + 0.5;
    bladesRef.current.forEach((blade, i) => {
      if (blade) {
        blade.rotation.z = (i / 6) * Math.PI * 2;
        blade.position.x = Math.cos(blade.rotation.z) * openness * 0.8;
        blade.position.y = Math.sin(blade.rotation.z) * openness * 0.8;
      }
    });
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef}>
        <mesh>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshStandardMaterial color="#1a1a2e" metalness={1} roughness={0.2} />
        </mesh>
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              ref={(el) => { if (el) bladesRef.current[i] = el; }}
              position={[Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0]}
              rotation={[0, 0, angle + Math.PI / 2]}
            >
              <planeGeometry args={[0.3, 0.08]} />
              <meshStandardMaterial
                color="#00ffcc"
                metalness={1}
                roughness={0.1}
                emissive="#00ffcc"
                emissiveIntensity={0.2}
              />
            </mesh>
          );
        })}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.25, 32]} />
          <meshStandardMaterial color="#050508" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function CameraScene() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffcc" />
      <pointLight position={[-10, -10, 5]} intensity={0.5} color="#ffffff" />
      
      {!isMobile && <FilmParticles />}
      <Aperture />
    </>
  );
}

export default function SceneProvider({ children }: { children?: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibility = () => setIsVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div className="fixed inset-0 -z-10" style={{ background: "#050508" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        frameloop={isVisible ? "always" : "never"}
      >
        <CameraScene />
      </Canvas>
      
      <div className="film-grain" />
      
      {children}
    </div>
  );
}