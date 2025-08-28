"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

export const CardCarousel = ({
  items = [],
  autoSlide = true,
  autoSlideInterval = 3000,
  showArrows = true,
  showDots = true,
  className = "",
}) => {
  if (!items.length) return null;

  return (
    <div className={className}>
      <Swiper
        spaceBetween={30}
        centeredSlides
        loop
        slidesPerView="auto"
        grabCursor
        autoplay={autoSlide ? { delay: autoSlideInterval, disableOnInteraction: false } : false}
        pagination={showDots ? { clickable: true } : false}
        navigation={showArrows ? true : false}
        effect="coverflow"
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5 }}
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
      >
        {items.map((item, index) => (
          <SwiperSlide
            key={item.id || index}
            style={{ width: "260px" }} // Fixed card width
            className="flex justify-center"
          >
            <div className="flex flex-col rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {item.content && (
                <div className="p-4 text-center">
                  {item.content}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
