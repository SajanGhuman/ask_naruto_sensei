import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

const DebugGLTF = () => {
  const { animations } = useGLTF("/models/animation_naruto_talking.glb");

  useEffect(() => {
    console.log("Loaded animations:", animations);
    animations.forEach((animation, index) => {
      console.log(` ${animation.name}`);
    });
  }, [animations]);

  return null; // This component doesn't render anything
};

export default DebugGLTF;
