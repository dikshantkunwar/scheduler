import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);
  
  const transition = (newMode, replace = false) => {
    history.push(mode);
    if (replace) history.pop();
    setMode(newMode) 
  }

  const back = () => {
    setMode(history.pop());
  }
  return { mode, transition, back };
}