import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);
  
  const transition = (newMode, replace = false) => {
    setMode(newMode);
    history.push(newMode);
  }
  const back = () => {
    //set the mode to the previous item in history array 
    if (history.length > 1) {history.pop()}; 

    const mode = history[history.length - 1]
    setMode(mode);
  }

  return { mode, transition, back };
}