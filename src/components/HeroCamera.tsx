"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

const ACCENT = "#c9723f";
const BODY = "#18140f";
const METAL = "#2a2620";

function CameraModel() {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const reduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onChange = () => (reduced.current = mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    if (reduced.current) {
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.5, 4, delta);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.05, 4, delta);
      return;
    }

    spin.current += delta * 0.1;
    const targetY = spin.current + state.pointer.x * 0.45;
    const targetX = -state.pointer.y * 0.22;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3.2, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3.2, delta);
    g.position.y = Math.sin(spin.current * 1.3) * 0.06;
  });

  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: BODY, roughness: 0.5, metalness: 0.35 }),
    []
  );
  const metalMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: METAL, roughness: 0.35, metalness: 0.45 }),
    []
  );
  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: ACCENT, roughness: 0.55, metalness: 0.15 }),
    []
  );
  const glassMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#05070a", roughness: 0.08, metalness: 0.2 }),
    []
  );

  return (
    <group ref={group} rotation={[0.05, -0.5, 0]}>
      <RoundedBox args={[1.7, 1.05, 0.55]} radius={0.08} smoothness={4} material={bodyMat} />

      {/* grip stripe */}
      <RoundedBox
        args={[0.26, 1.05, 0.06]}
        radius={0.05}
        smoothness={2}
        position={[0.62, 0, 0.29]}
        material={accentMat}
      />

      {/* viewfinder hump */}
      <RoundedBox
        args={[0.5, 0.26, 0.36]}
        radius={0.06}
        smoothness={2}
        position={[0, 0.66, -0.04]}
        material={metalMat}
      />

      {/* shutter button */}
      <mesh position={[0.66, 0.58, 0.08]} material={metalMat}>
        <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
      </mesh>

      {/* lens barrel */}
      <group position={[0, -0.02, 0.28]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.28]} material={metalMat}>
          <cylinderGeometry args={[0.4, 0.44, 0.6, 40]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]} material={accentMat}>
          <cylinderGeometry args={[0.44, 0.44, 0.04, 40]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.59]} material={glassMat}>
          <cylinderGeometry args={[0.36, 0.36, 0.04, 40]} />
        </mesh>
        <mesh position={[0.12, 0.14, 0.62]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#f4f1ea" />
        </mesh>
      </group>
    </group>
  );
}

export default function HeroCamera() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.6], fov: 32 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 2]} intensity={1.8} color="#fff3e6" />
      <directionalLight position={[-3, 1, -2]} intensity={0.7} color={ACCENT} />
      <pointLight position={[0, -1, 3]} intensity={0.4} color="#ffffff" />
      <CameraModel />
    </Canvas>
  );
}
