import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = ({ isVisible }) => {
  const fullText = "Let your words travel. Let your data speak.";
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const typingSpeed = 100;
  const pauseDelay = 1500;

  useEffect(() => {
    let timeout;

    if (!isDeleting && index <= fullText.length) {
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, index + 1));
        setIndex(index + 1);
      }, typingSpeed);
    } else if (isDeleting && index >= 0) {
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, index));
        setIndex(index - 1);
      }, typingSpeed);
    } else if (!isDeleting && index > fullText.length) {
      // Pause at end
      timeout = setTimeout(() => setIsDeleting(true), pauseDelay);
    } else if (isDeleting && index < 0) {
      // Start typing again
      setIsDeleting(false);
      setIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [index, isDeleting]);

  return (
    <section
      id="cta"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden group"
      style={{
        background: "linear-gradient(135deg, #3a7acc 0%, #2563eb 100%)",
      }}
    >
      {/* Floating shapes */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div
        className={`max-w-4xl mx-auto text-center text-white relative z-10 transition-opacity duration-700 ${
          isVisible.cta ? "opacity-100 animate-fade-in-up" : "opacity-0"
        }`}
      >
        {/* Continuous typewriter heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-snug">
          {displayedText}
          <span className="border-r-2 border-white animate-blink ml-1">&nbsp;</span>
        </h2>

        <p className="text-lg sm:text-xl md:text-2xl mb-10 opacity-90 leading-relaxed max-w-3xl mx-auto">
          Ready to bring African languages into your digital strategy? Let's work together to
          make language equity real.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
                to="/get-quote"
                className="inline-block bg-white text-blue-600 font-semibold text-lg px-10 py-3 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
                Request Quote
            </Link>
            <Link
                to="/contact"
                className="inline-block bg-blue-600 text-white font-semibold text-lg px-10 py-3 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 hover:shadow-2xl transform opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
            >
                Contact Us
            </Link>
            </div>

      </div>
    </section>
  );
};

export default CTA;
