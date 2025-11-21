import React, { createContext, useContext, useState } from "react";

type LikesContextType = {
  likes: Record<number, boolean>;
  toggleLike: (eventId: number, value: boolean) => void;
};

const LikesContext = createContext<LikesContextType>({
  likes: {},
  toggleLike: () => {},
});

export const LikesProvider = ({ children }: { children: React.ReactNode }) => {
  const [likes, setLikes] = useState<Record<number, boolean>>({});

  const toggleLike = (eventId: number, value: boolean) => {
    setLikes(prev => ({ ...prev, [eventId]: value }));
  };

  return (
    <LikesContext.Provider value={{ likes, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => useContext(LikesContext);