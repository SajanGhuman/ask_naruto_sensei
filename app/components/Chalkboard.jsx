import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";

export const Chalkboard = (props) => {
  const group = useRef();
  const { scene } = useGLTF("/models/chalkboard.glb");

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  );
};

// Preload the model for better performance
useGLTF.preload("/models/chalkboard.glb");
