import React, { useState, useEffect } from "react";
import { Dimensions } from 'react-native';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function useWindowSize() {
  
  const [dimensions, setDimensions] = useState({ window, screen });
  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

  return dimensions.window;
}