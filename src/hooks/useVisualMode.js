import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);
  
  const transition = (newMode, replace = false) => {
    if (replace) {
      setHistory((prev) => [...prev.slice(0, prev.length - 1), newMode]);
    } else {
      setHistory((prev) => [...prev, newMode]);
    }
    setMode(newMode) 
  }

  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory((prev) => prev.slice(0, prev.length - 1));
    } else {
      setMode(mode);
    }
  };
  return { mode, transition, back };
}