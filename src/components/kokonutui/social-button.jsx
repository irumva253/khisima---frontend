/* eslint-disable no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Instagram, Linkedin, Link as LinkIcon } from "lucide-react";
import { IconBrandX } from "@tabler/icons-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function SocialButton({ className, ...props }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const shareButtons = [
    {
      icon: IconBrandX,
      label: "Twitter / X",
      url: "https://x.com/Khisima_lsp?t=TZlhsibDZZZPKSjhqTiEzA&s=09", 
    },
    {
      icon: Instagram,
      label: "Instagram",
      url: "https://www.instagram.com/khisima_lsp/",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/khisima/?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3B%2FwevVHPPRviJQYMgTP2Dcw%3D%3D", 
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      url: "https://wa.me/message/BJAPVTZERQWWH1", 
    },
  ];

  const handleShare = (url, index) => {
    setActiveIndex(index);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => setActiveIndex(null), 300);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Main button */}
      <motion.div
        animate={{ opacity: isVisible ? 0 : 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Button
          className={cn(
            "min-w-40 relative",
            "bg-white dark:bg-black",
            "hover:bg-gray-50 dark:hover:bg-gray-950",
            "text-black dark:text-white",
            "border border-black/10 dark:border-white/10",
            "transition-colors duration-200",
            className
          )}
          {...props}
        >
          <span className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Connect
          </span>
        </Button>
      </motion.div>

      {/* Share buttons */}
      <motion.div
        className="absolute top-0 left-0 flex h-10 overflow-hidden"
        animate={{ width: isVisible ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        {shareButtons.map((button, i) => (
          <motion.button
            type="button"
            key={`share-${button.label}`}
            aria-label={button.label}
            onClick={() => handleShare(button.url, i)}
            className={cn(
              "h-10 w-10 flex items-center justify-center",
              "bg-black dark:bg-white",
              "text-white dark:text-black",
              i === 0 && "rounded-l-md",
              i === shareButtons.length - 1 && "rounded-r-md",
              "border-r border-white/10 dark:border-black/10 last:border-r-0",
              "hover:bg-gray-900 dark:hover:bg-gray-100",
              "outline-none relative overflow-hidden",
              "transition-colors duration-200"
            )}
            animate={{
              opacity: isVisible ? 1 : 0,
              x: isVisible ? 0 : -20,
            }}
            transition={{
              duration: 0.3,
              ease: [0.23, 1, 0.32, 1],
              delay: isVisible ? i * 0.05 : 0,
            }}
          >
            <motion.div
              className="relative z-10"
              animate={{ scale: activeIndex === i ? 0.85 : 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <button.icon className="w-4 h-4" />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-white dark:bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex === i ? 0.15 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
