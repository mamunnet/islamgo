import { createContext, useContext, useState, ReactNode } from 'react';

export interface AudioState {
  isPlaying: boolean;
  currentSurah: number;
  currentTime: number;
  duration: number;
  audioUrl: string;
}

interface AudioContextType {
  audioState: AudioState;
  setAudioState: (state: AudioState | ((prev: AudioState) => AudioState)) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentSurah: 1,
    currentTime: 0,
    duration: 0,
    audioUrl: '',
  });

  return (
    <AudioContext.Provider value={{ audioState, setAudioState }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
