import { createContext, useContext } from 'react';

export const LearningContext = createContext(null);

export function useLearning() {
  const context = useContext(LearningContext);

  if (!context) {
    throw new Error('useLearning must be used inside LearningProvider.');
  }

  return context;
}
