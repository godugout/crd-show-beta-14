import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FlightAnimationContextType {
  isFlightActive: boolean;
  setFlightActive: (active: boolean) => void;
}

const FlightAnimationContext = createContext<FlightAnimationContextType | undefined>(undefined);

interface FlightAnimationProviderProps {
  children: ReactNode;
}

export const FlightAnimationProvider: React.FC<FlightAnimationProviderProps> = ({ children }) => {
  const [isFlightActive, setIsFlightActive] = useState(false);

  const setFlightActive = (active: boolean) => {
    setIsFlightActive(active);
  };

  return (
    <FlightAnimationContext.Provider value={{ isFlightActive, setFlightActive }}>
      {children}
    </FlightAnimationContext.Provider>
  );
};

export const useFlightAnimation = () => {
  const context = useContext(FlightAnimationContext);
  if (context === undefined) {
    throw new Error('useFlightAnimation must be used within a FlightAnimationProvider');
  }
  return context;
};