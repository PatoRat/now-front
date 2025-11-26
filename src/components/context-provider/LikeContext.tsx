import React, { createContext, useContext, useState } from "react";

type LikesContextType = {
  likes: Record<number, boolean>;
  toggleLike: (eventId: number, value: boolean) => void;
  setAllLikes: (map: Record<number, boolean>) => void;
};


const LikesContext = createContext<LikesContextType>({
  likes: {},
  toggleLike: () => { },
  setAllLikes: () => {},
});

export const LikesProvider = ({ children }: { children: React.ReactNode }) => {
  const [likes, setLikes] = useState<Record<number, boolean>>({});

  const setAllLikes = (map: Record<number, boolean>) => {
    setLikes(map);
  };
  const toggleLike = (eventId: number, value: boolean) => {
    setLikes(prev => ({ ...prev, [eventId]: value }));
  };

  return (
    <LikesContext.Provider value={{ likes, toggleLike, setAllLikes }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => useContext(LikesContext);