// store/animationStore.js
import { create } from "zustand";

export const useAINaruto = create((set, get) => ({
  animation: "idle",
  setAnimation: (animation) => set({ animation }),
  messages: [],
  currentMessage: null,
  character: "naruto",
  loading: false,

  askAI: async (question) => {
    if (!question) return;

    const message = {
      question,
      id: get().messages.length,
      answer: "",
    };

    set({ loading: true });

    try {
      const aiResponse = await fetch(`/api/ai?question=${question}`);
      const data = await aiResponse.json();

      if (!data.japanese || data.japanese.trim() === "") {
        data.japanese =
          "申し訳ありませんが、日本語の翻訳が見つかりませんでした。";
      }

      message.answer = data;

      set((state) => ({
        messages: [...state.messages, message],
        currentMessage: message,
        loading: false,
      }));

      await get().playMessage(message);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      set({ loading: false });
    }
  },

  playMessage: async (message) => {
    set({ currentMessage: message, loading: false });

    try {
      const audioRes = await fetch(`/api/tts?text=${message.answer.japanese}`);
      const audio = await audioRes.blob();
      const audioUrl = URL.createObjectURL(audio);
      const audioPlayer = new Audio(audioUrl);

      message.audioPlayer = audioPlayer;
      message.audioPlayer.onended = () => {
        set({ currentMessage: null });
      };

      set((state) => ({
        loading: false,
        messages: state.messages.map((m) =>
          m.id === message.id ? message : m,
        ),
      }));

      message.audioPlayer.play();
    } catch (error) {
      console.error("Error playing message:", error);
      set({ loading: false });
    }
  },

  stopMessage: (message) => {
    if (message.audioPlayer) {
      message.audioPlayer.pause();
    }
    set({ currentMessage: null });
  },
}));
