import React, { useRef, useEffect, useState } from "react";
import { Html, useGLTF, useAnimations } from "@react-three/drei";
import { useAINaruto } from "../hooks/useAINaruto";

export function Character(props) {
  const group = useRef();
  const [animation, setAnimation] = useState("idle");
  const currentMessage = useAINaruto((state) => state.currentMessage);
  const loading = useAINaruto((state) => state.loading);

  // Load model and animations
  const { nodes, materials, scene } = useGLTF("/models/naruto3.glb");
  const { animations } = useGLTF("/models/animations.glb");

  // Set up animations
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (loading) {
      setAnimation("thinking");
    } else if (currentMessage) {
      setAnimation("talking");
    } else {
      setAnimation("idle");
    }
  }, [currentMessage, loading]);

  useEffect(() => {
    // Play the default animation initially
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
    }

    return () => {
      actions[animation]?.fadeOut(0.5);
    };
  }, [animation, actions]);

  const [thinkingText, setThinkingText] = useState(".");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setThinkingText((thinkingText) => {
          if (thinkingText.length === 3) {
            return ".";
          }
          return thinkingText + ".";
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <group ref={group} {...props} dispose={null}>
      {loading && (
        <Html position-y={1.8}>
          <div className="flex justify-center items-center -translate-x-1/2">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex items-center justify-center duration-75 rounded-full h-8 w-8 bg-white/80">
                {thinkingText}
              </span>
            </span>
          </div>
        </Html>
      )}
      <group name="Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="Narutoobjcleanermaterialmergergles" />
        </group>
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name="Object_2"
            geometry={nodes.Object_2.geometry}
            material={materials["nr2_eye.png.002"]}
            skeleton={nodes.Object_2.skeleton}
          />
          <skinnedMesh
            name="Object_3"
            geometry={nodes.Object_3.geometry}
            material={materials["1"]}
            skeleton={nodes.Object_3.skeleton}
          />
          <skinnedMesh
            name="Object_4"
            geometry={nodes.Object_4.geometry}
            material={materials["nr2_tex02.png.002"]}
            skeleton={nodes.Object_4.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}
useGLTF.preload("/models/naruto3.glb");
useGLTF.preload("/models/animations.glb");
