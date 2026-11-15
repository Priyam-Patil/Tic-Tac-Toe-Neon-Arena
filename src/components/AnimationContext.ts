import { createContext, useContext } from 'react';

// Includes both the saved preference and the operating system's accessibility setting.
export const AnimationContext = createContext(false);
export const useMinimalMotion = () => useContext(AnimationContext);
