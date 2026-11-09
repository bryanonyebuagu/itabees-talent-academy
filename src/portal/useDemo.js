import { useContext } from 'react';
import { DemoContext } from './DemoContext';

export default function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('DemoProvider is required for portal pages.');
  return context;
}
