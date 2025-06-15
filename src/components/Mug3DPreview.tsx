
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Mug3DPreviewProps = {
  mugColor?: string;
  imgUrl?: string | null;
};

function Mug({ mugColor = "#ffffff" }: { mugColor?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Mug Body - Simple cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 1.6]} />
        <meshStandardMaterial color={mugColor} />
      </mesh>
      
      {/* Mug Handle - Torus */}
      <mesh position={[1.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.1]} />
        <meshStandardMaterial color={mugColor} />
      </mesh>
      
      {/* Mug Rim */}
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[1, 0.03]} />
        <meshStandardMaterial color="#ddd" />
      </mesh>
    </group>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-gray-500">Loading 3D preview...</div>
    </div>
  );
}

export const Mug3DPreview: React.FC<Mug3DPreviewProps> = ({
  mugColor = "#ffffff",
  imgUrl,
}) => {
  return (
    <div className="w-[340px] h-[340px] bg-gray-50 rounded-lg">
      <Canvas
        camera={{ 
          position: [0, 1, 4], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          intensity={0.6} 
          position={[5, 5, 5]} 
          castShadow={false}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.3} />
        
        <Suspense fallback={null}>
          <Mug mugColor={mugColor} />
        </Suspense>
      </Canvas>
    </div>
  );
};
