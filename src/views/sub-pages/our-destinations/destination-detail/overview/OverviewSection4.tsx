// React Imports
import React, { useState, useEffect } from 'react'

// Third-party Imports
import classnames from 'classnames'
import Slider from 'react-slick';

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OverviewSection4 = () => {
  const [centerPadding, setCenterPadding] = useState("0px");

  useEffect(() => {
    function updatePadding() {
      const pxValue = 12.811 * (window.innerWidth * 0.01); // 29vw in px
      
      setCenterPadding(`${pxValue}px`);
    }

    updatePadding();
    window.addEventListener("resize", updatePadding);
    
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding,
  };

  const slides = [
    {
      image: '/images/sub-pages/over1.jpg',
    },
    {
      image: '/images/sub-pages/over2.jpg',
    },
    {
      image: '/images/sub-pages/over3.jpg',
    }
  ]

  return (

    <section key={`section-3`} className={classnames(styles.home_section2, 'home_section2 py_100')}>
        <div className={classnames(styles.home_slider, 'home_slider')}>
          <Slider {...settings} className={classnames(styles.home_slider2, 'home_slider2')}>
              {slides?.map((item, index) => (
                  <div key={'slide-' + index} className={classnames(styles.resort_box_main)}>
                    <div className={classnames(styles.resort_box)}>
                      <div className={classnames(styles.resort_img)}>
                        <img src={item.image} />
                      </div>
                    </div>
                  </div>
              ))}
          </Slider>
        </div>
    </section>   
  )
}

export default OverviewSection4