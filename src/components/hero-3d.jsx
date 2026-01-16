"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef } from "react";

function AbstractShape() {
    const meshRef = useRef(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1, 0]} />
                <meshPhysicalMaterial
                    roughness={0.2}
                    metalness={0.1}
                    transmission={0.9} // Glass effect
                    thickness={1} // Refraction
                    color="#ffffff"
                    clearcoat={1}
                    clearcoatRoughness={0}
                />
            </mesh>
        </Float>
    );
}

export function Hero3D() {
    return (
        <div className="h-[400px] w-full absolute top-0 left-0 z-0 opacity-60">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <AbstractShape />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
