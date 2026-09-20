"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function WorkflowOrb() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;

    group.current.rotation.y = state.clock.elapsedTime * 0.12;
    group.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
  });

  return (
    <group ref={group}>
      {/* Main glass/orange sphere */}
      <mesh>
        <sphereGeometry args={[1.45, 64, 64]} />

        <MeshDistortMaterial
          color="#ff9b78"
          roughness={0.15}
          metalness={0.05}
          transmission={0.35}
          thickness={1}
          distort={0.25}
          speed={1.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner cube */}
      <mesh>
        <boxGeometry args={[0.8, 0.8, 0.8]} />

        <meshStandardMaterial
          color="#fff8f1"
          transparent
          opacity={0.65}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Teal orbit */}
      <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[1.9, 0.025, 24, 150]} />

        <meshBasicMaterial
          color="#5ccfc1"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Peach orbit */}
      <mesh rotation={[1, 0.3, 0.7]}>
        <torusGeometry args={[2.15, 0.018, 24, 150]} />

        <meshBasicMaterial
          color="#f7c79b"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Pink orbit */}
      <mesh rotation={[0.4, 0.8, 1]}>
        <torusGeometry args={[1.65, 0.012, 20, 120]} />

        <meshBasicMaterial
          color="#f3a6bd"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Orbiting spheres */}
      <mesh position={[2.05, 0.4, 0]}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#48bfae" />
      </mesh>

      <mesh position={[-1.9, 0.8, 0.3]}>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial color="#f4b36f" />
      </mesh>

      <mesh position={[1.5, -1.3, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#ef9fb6" />
      </mesh>
    </group>
  );
}

function FloatingParticle({
  position,
  color,
  size = 0.05,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={1}
    >
      <mesh position={position}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{
          position: [0, 0, 7],
          fov: 40,
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={2.5} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={3}
        />

        <pointLight
          position={[3, 2, 4]}
          intensity={20}
          color="#ffc2a8"
        />

        <pointLight
          position={[-4, -2, 4]}
          intensity={15}
          color="#8ee6dc"
        />

        <Float
          speed={1.2}
          floatIntensity={0.7}
          rotationIntensity={0.2}
        >
          <WorkflowOrb />
        </Float>

        <FloatingParticle
          position={[3, 1.7, 0]}
          color="#58cbbd"
          size={0.08}
        />

        <FloatingParticle
          position={[-2.8, 1.5, 0]}
          color="#f4bd82"
          size={0.08}
        />

        <FloatingParticle
          position={[2.8, -1.5, 0]}
          color="#ef9fb6"
          size={0.07}
        />

        <FloatingParticle
          position={[-2.5, -1.3, 0]}
          color="#a9ddd7"
          size={0.05}
        />
      </Canvas>
    </div>
  );
}