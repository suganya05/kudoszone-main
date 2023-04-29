import React, { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import "./Carousel.scss";

interface ICarousel {
  children: ReactNode;
}

const Carousel: React.FC<ICarousel> = ({ children }) => {
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!carouselRef?.current) return;
    const carousel = carouselRef?.current as any;
    setWidth(carousel.scrollWidth - carousel.offsetWidth);
  }, []);

  return (
    <motion.div ref={carouselRef} className="carousel">
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        className="inner-carousel"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default React.memo(Carousel);
