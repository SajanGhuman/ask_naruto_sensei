"use client";
import { CameraControls, Environment, Gltf, Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Character } from "./Character";
import { TypingBox } from "./TypingBox";
import { Leva, button, useControls } from "leva";
import { MessagesList } from "./MessagesList";
import { Chalkboard } from "./Chalkboard";
import { degToRad } from "three/src/math/MathUtils.js";
import { useEffect, useRef } from "react";
import { useAINaruto } from "../hooks/useAINaruto";

export const Experience = () => {
  return (
    <>
      <div className="z-10 md:justify-center fixed bottom-4 left-4 right-4 flex gap-3 flex-wrap justify-stretch">
        <TypingBox />
      </div>
      <Leva hidden />
      <Canvas camera={{ position: [0, 0, 0.0001] }}>
        <Environment preset="sunset" />
        <ambientLight intensity={0.8} color="pink" />
        <CameraManager />
        <Html
          position={[8, 1, 8]}
          rotation-y={degToRad(-160)}
          transform
          distanceFactor={2.1}
        >
          <MessagesList />
        </Html>
        <Chalkboard
          position={[1.5, -1.3, 1.5]}
          rotation-y={degToRad(20)}
          scale={0.9}
        />
        <Character
          character={"Naruto"}
          position={[3, -1.3, 0.4]}
          rotation-y={degToRad(-100)}
          scale={1.2}
        />
        <Gltf src="/models/ramen-2.glb" position={[-1, -4, -5]} scale={1} />
      </Canvas>
    </>
  );
};

const CAMERA_POSITIONS = {
  default: [
    -0.00008514763332560263, 0.00001139930098787945, -0.000051185315042856364,
  ],
  loading: [
    -0.00009348015450701242, 0.000012189743996386439, -0.00003335971904329608,
  ],
  speaking: [
    -0.00006647104701327163, -3.6315374047486454e-7, -0.00007470922318107862,
  ],
};

const CAMERA_ZOOMS = {
  default: 1,
  loading: 1.3,
  speaking: 2.1204819420055387,
};

const CameraManager = () => {
  const controls = useRef();
  const loading = useAINaruto((state) => state.loading);
  const currentMessage = useAINaruto((state) => state.currentMessage);

  useEffect(() => {
    if (loading) {
      controls.current?.setPosition(...CAMERA_POSITIONS.loading, true);
      controls.current?.zoomTo(CAMERA_ZOOMS.loading, true);
    } else if (currentMessage) {
      controls.current?.setPosition(...CAMERA_POSITIONS.speaking, true);
      controls.current?.zoomTo(CAMERA_ZOOMS.speaking, true);
    } else {
      controls.current?.setPosition(...CAMERA_POSITIONS.default, true);
      controls.current?.zoomTo(CAMERA_ZOOMS.default, true);
    }
  }, [loading, currentMessage]);

  useControls("Helper", {
    getCameraPosition: button(() => {
      const position = controls.current.getPosition();
      const zoom = controls.current.camera.zoom;
      console.log([...position], zoom);
    }),
  });

  return (
    <CameraControls
      ref={controls}
      minZoom={1}
      maxZoom={3}
      polarRotateSpeed={-0.3}
      azimuthRotateSpeed={-0.3}
      mouseButtons={{
        left: 1,
        wheel: 16,
      }}
      touches={{ one: 32, two: 512 }}
    />
  );
};
