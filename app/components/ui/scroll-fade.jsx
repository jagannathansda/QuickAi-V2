"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollFade({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 55%", "start 25%"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.05, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [20, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y, width: "100%" }}>
      {children}
    </motion.div>
  );
}