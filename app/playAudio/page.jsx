'use client'
import { useEffect, useRef, useState } from "react";

const AudioPlayer = () => {
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch("/api/tts");
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        } else {
          console.error("Failed to fetch audio");
        }
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
    };

    fetchAudio();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, [audioUrl]);

  return (
    <div>
      {audioUrl && (
        <audio ref={audioRef} autoPlay>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default AudioPlayer;
