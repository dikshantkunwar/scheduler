import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);
  
  const transition = (newMode) => {
    setMode(newMode);
    history.push(newMode);
  }
  const back = () => {
    //set the mode to the previous item in history array 
    console.log(history)
    if (history.length > 1) {history.pop()}; 

    const mode = history[history.length - 1]
    console.log(mode);
    setMode(mode);
  }

  return { mode, transition, back };
}