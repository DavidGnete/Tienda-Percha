"use client";
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import styles from './mainSwiper.module.css';

import 'swiper/css';
import 'swiper/css/pagination';



import { Pagination, Autoplay } from 'swiper/modules';


interface Props {
  images: string[],
  clasName?: string,


}

export const Mainswiper = ({images, clasName}: Props) => {
  return (
    <div className={clasName}>
        <Swiper  pagination={{
        }}
        loop
        autoplay={{delay: 4000, disableOnInteraction: false,}}
        centeredSlides={true}
        modules={[Pagination, Autoplay]}
        className={styles.mySwiper} >
        {
          images.map ( (image, index) => (
          <SwiperSlide key={image}>
            <Image 
            src={`/promotion/${image}`}
            alt={`Promoción Tu Perchita ${index + 1}`}
            fill
            sizes='100vw'
            // Solo la primera foto se carga de inmediato; las demás cuando se necesitan
            priority={index === 0}
            className='object-contain'/>
          </SwiperSlide>
          ))

          
        }

        
       
      </Swiper>
    </div>
  )
}
