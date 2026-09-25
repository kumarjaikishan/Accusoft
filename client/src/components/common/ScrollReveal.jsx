import React, { useEffect, useRef, useState } from "react";

export const ScrollReveal = ({
  children,
  animation = "animate-fade-in-up",
  delay = 0,
  className = "",
  threshold = 0.1,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`${className} ${
        isVisible ? animation : "opacity-0 pointer-events-none"
      }`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
