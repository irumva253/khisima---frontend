/* eslint-disable no-unused-vars */
"use client";;
/**
 * @author: @dorian_baffier
 * @description: Dynamic Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const greetings = [
    { text: "こんにちは", language: "Japanese" },
    { text: "Bonjour", language: "French" },
    { text: "Hola", language: "Spanish" },
    { text: "안녕하세요", language: "Korean" },
    { text: "Ciao", language: "Italian" },
    { text: "Hallo", language: "German" },
    { text: "こんにちは", language: "Japanese" },
    { text: "Habari", language: "Swahili" },
    { text: "Hello", language: "English" },
];

const DynamicText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex >= greetings.length) {
          clearInterval(interval);
          setIsAnimating(false);
          return prevIndex;
        }

        return nextIndex;
      });
    }, 1000); // slower so you can see it

    return () => clearInterval(interval);
  }, [isAnimating]);

  const textVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -10, opacity: 0 },
  };

  return (
    <span className="inline-block font-semibold text-blue-700">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={textVariants.hidden}
          animate={textVariants.visible}
          exit={textVariants.exit}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          {greetings[currentIndex].text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};


export default DynamicText;
