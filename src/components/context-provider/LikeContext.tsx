import React, { createContext, useContext, useState } from "react";

type LikesContextType = {
  likes: Record<number, boolean>;
  currentLikes: Record<number, number>;
  toggleLike: (eventId: number, value: boolean) => void;
  setAllLikes: (map: Record<number, boolean>) => void;
  setAllLikesCont: (map: Record<number, number>) => void;
};


const LikesContext = createContext<LikesContextType>({
  likes: {},
  currentLikes: {},
  toggleLike: () => { },
  setAllLikes: () => { },
  setAllLikesCont: () => { },
});

export const LikesProvider = ({ children }: { children: React.ReactNode }) => {
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [currentLikes, setCurrentLikes] = useState<Record<number, number>>({});

  const setAllLikes = (map: Record<number, boolean>) => {
    setLikes(map);
  };

  const setAllLikesCont = (map: Record<number, number>) => {
    setCurrentLikes(map);
  };

  const toggleLike = (eventId: number, value: boolean) => {
    setLikes(prev => ({ ...prev, [eventId]: value }));

    setCurrentLikes(prev => ({
      ...prev, [eventId]: value
        ? (prev[eventId] ?? 0) + 1
        : (prev[eventId] ?? 1) - 1
    }));
  };

  return (
    <LikesContext.Provider value={{ likes, toggleLike, setAllLikes, currentLikes, setAllLikesCont }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => useContext(LikesContext);