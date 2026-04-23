import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Text, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import useMouseParallax from '@/hooks/useMouseParallax';

const FilmStudioIsland = () => {
  const groupRef = useRef<THREE.Group>(null);
  const islandRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.Group>(null);
  const reelRef = useRef<THREE.Mesh>(null);
  const clapperTopRef = useRef<THREE.Mesh>(null);
  const { target } = useMouseParallax();
  const scroll = useScroll();
  
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const scrollOffset = scroll.offset; // 0 to 1

    // 1. Mouse Parallax
    if (islandRef.current) {
      islandRef.current.rotation.y = THREE.MathUtils.lerp(
        islandRef.current.rotation.y,
        target.current.x * 0.2,
        0.1
      );
      islandRef.current.rotation.x = THREE.MathUtils.lerp(
        islandRef.current.rotation.x,
        target.current.y * 0.1,
        0.1
      );
    }

    // 2. Floating Animation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }

    // 3. Scroll-based Animations
    // 0 -> 0.3: Zoom out
    // 0.3 -> 0.6: Rotate
    // 0.6 -> 0.9: Shrink and move
    
    if (islandRef.current) {
      // Zoom/Position Z
      islandRef.current.position.z = THREE.MathUtils.lerp(0, -5, scroll.range(0, 0.3));
      
      // Rotation Y
      islandRef.current.rotation.y += scroll.range(0.3, 0.3) * Math.PI;
      
      // Scale and Position XY
      const shrinkFactor = 1 - scroll.range(0.6, 0.3) * 0.5;
      islandRef.current.scale.set(shrinkFactor, shrinkFactor, shrinkFactor);
      
      islandRef.current.position.x = THREE.MathUtils.lerp(0, -2, scroll.range(0.6, 0.3));
      islandRef.current.position.y = THREE.MathUtils.lerp(0, -1, scroll.range(0.6, 0.3));
    }

    // 4. Film Reel Rotation
    if (reelRef.current) {
      reelRef.current.rotation.z += delta * (0.5 + scrollOffset * 5);
    }

    // 5. Camera Pulse
    if (cameraRef.current) {
      const scale = hovered ? 1.05 : 1;
      cameraRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={islandRef}>
        {/* a) FLOATING PLATFORM BASE */}
        <mesh position={[0, -1, 0]} receiveShadow>
          <cylinderGeometry args={[3, 3.5, 0.8, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          {/* Top pixel grid overlay */}
          <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[6, 6]} />
            <meshStandardMaterial 
              color="#00ffcc" 
              transparent 
              opacity={0.1} 
              wireframe
            />
          </mesh>
        </mesh>

        {/* b) GIANT CINEMA CAMERA */}
        <group 
          ref={cameraRef} 
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          {/* Body */}
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.8, 1.8]} />
            <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Lens */}
          <group position={[0, 0, 1.2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.35, 0.6, 32]} />
              <meshStandardMaterial color="#111111" metalness={0.9} />
            </mesh>
            {/* Lens Ring Teal */}
            <mesh position={[0, 0, 0.31]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.32, 0.02, 16, 100]} />
              <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} />
            </mesh>
            {/* Inner Glass */}
            <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
              <meshStandardMaterial color="#050505" roughness={0} />
            </mesh>
          </group>
          {/* Viewfinder */}
          <mesh position={[0, 0.5, -0.4]}>
            <boxGeometry args={[0.3, 0.25, 0.2]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          {/* Handle */}
          <mesh position={[0.65, 0.2, 0]}>
            <boxGeometry args={[0.15, 0.5, 0.15]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        </group>

        {/* c) FILM REEL */}
        <group position={[0, 0, -1.5]}>
          <mesh ref={reelRef} rotation={[0, 0, 0]}>
            <torusGeometry args={[1.5, 0.08, 16, 100]} />
            <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.2} />
            {/* Spokes */}
            {[...Array(8)].map((_, i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
                <boxGeometry args={[3, 0.05, 0.05]} />
                <meshStandardMaterial color="#ffd700" metalness={1} />
              </mesh>
            ))}
          </mesh>
        </group>

        {/* d) DIRECTOR'S CHAIR */}
        <group position={[-2, -0.2, 0.5]} rotation={[0, Math.PI / 4, 0]}>
          {/* Seat */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.6, 0.05, 0.5]} />
            <meshStandardMaterial color="#c41e3a" />
          </mesh>
          {/* Back */}
          <mesh position={[0, 0.8, -0.25]}>
            <boxGeometry args={[0.6, 0.4, 0.03]} />
            <meshStandardMaterial color="#c41e3a" />
            <Text
              position={[0, 0, 0.02]}
              fontSize={0.06}
              font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4svRKh63pcKBuAtpFQvH69A.ttf"
              color="white"
            >
              DIRECTOR
            </Text>
          </mesh>
          {/* Legs */}
          <group position={[0, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0.2, 0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]} position={[0, 0.2, 0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0.2, -0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]} position={[0, 0.2, -0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
              <meshStandardMaterial color="#333" />
            </mesh>
          </group>
        </group>

        {/* e) CLAPPERBOARD */}
        <ClapperBoard position={[2, 0, 1]} />

        {/* f) STUDIO LIGHTS */}
        <StudioLight position={[-2.5, 0, -1.5]} rotation={[0, Math.PI / 4, 0]} />
        <StudioLight position={[2.5, 0, -1.5]} rotation={[0, -Math.PI / 4, 0]} />

        {/* g) HOLOGRAPHIC SCREENS */}
        <HolographicScreen position={[-3, 1.5, -1]} rotation={[0, 0.5, 0]} color="#00ffcc" />
        <HolographicScreen position={[3, 1.2, 0]} rotation={[0, -0.5, 0]} color="#00ffcc" />
        <HolographicScreen position={[0, 2, -2]} rotation={[0.2, 0, 0]} color="#00ffcc" />

        {/* h) PIXEL GRID FLOOR */}
        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshBasicMaterial color="#00ffcc" transparent opacity={0.03} wireframe />
        </mesh>
      </group>
    </group>
  );
};

const ClapperBoard = ({ position }: { position: [number, number, number] }) => {
  const topRef = useRef<THREE.Mesh>(null);
  const [clapped, setClapped] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (topRef.current) {
      const targetRotation = clapped ? 0 : 0.5;
      topRef.current.rotation.x = THREE.MathUtils.lerp(topRef.current.rotation.x, targetRotation, 0.2);
    }
  });

  return (
    <group 
      position={position} 
      onPointerEnter={() => setClapped(true)}
      onPointerLeave={() => setClapped(false)}
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Bottom Board */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.05]} />
          <meshStandardMaterial color="#111" />
          <Text
             position={[0, 0, 0.03]}
             fontSize={0.04}
             font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4svRKh63pcKBuAtpFQvH69A.ttf"
             color="white"
          >
            SCENE: 01{"\n"}TAKE: 24
          </Text>
        </mesh>
        {/* Top Board */}
        <group position={[0, 0.25, 0]}>
          <mesh ref={topRef} position={[0, 0.075, 0]}>
            <boxGeometry args={[0.8, 0.15, 0.05]} />
            <meshStandardMaterial color="#222" />
            {/* Stripes (simplified as wireframe overlay for now) */}
            <mesh position={[0, 0, 0.03]}>
              <planeGeometry args={[0.8, 0.15]} />
              <meshBasicMaterial color="white" wireframe />
            </mesh>
          </mesh>
        </group>
      </Float>
    </group>
  );
};

const StudioLight = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
  const lightRef = useRef<THREE.SpotLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1 + Math.sin(state.clock.getElapsedTime() * 10) * 0.5;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Stand */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Light Head */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <spotLight
        ref={lightRef}
        position={[0, 1, 0.1]}
        angle={0.5}
        penumbra={0.5}
        intensity={2}
        color="#fff5e0"
        target-position={[0, 0, 5]}
      />
    </group>
  );
};

const HolographicScreen = ({ position, rotation, color }: { position: [number, number, number], rotation: [number, number, number], color: string }) => {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position} rotation={rotation}>
        <mesh>
          <planeGeometry args={[1.5, 1]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
        {/* Border */}
        <mesh>
          <planeGeometry args={[1.55, 1.05]} />
          <meshBasicMaterial color={color} wireframe />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.08}
          font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4svRKh63pcKBuAtpFQvH69A.ttf"
          color="white"
        >
          PROJECT
        </Text>
      </group>
    </Float>
  );
};

export default FilmStudioIsland;
