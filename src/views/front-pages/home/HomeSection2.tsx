// React Imports
import React, { useState, useEffect } from 'react'

// Third-party Imports
import classnames from 'classnames'
import Slider from 'react-slick';

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeSection2 = ({ slides }: { slides?: []; }) => {
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

  /*const slides = [
    {
      title: 'JADE JUNGLE RESORT',
      sub_title: 'BELIZE',
      image: '/images/front-pages/images/jade-slider.jpg',
    },
    {
      title: 'JADE JUNGLE RESORT',
      sub_title: 'BELIZE',
      image: '/images/front-pages/images/jade-slider.jpg',
    },
    {
      title: 'JADE JUNGLE RESORT',
      sub_title: 'BELIZE',
      image: '/images/front-pages/images/jade-slider.jpg',
    }
  ]*/

  return (
    <section key={`section-3`} className={classnames(styles.home_section2, 'home_section2')}>
      <div className={classnames(styles.home_slider, 'home_slider')}>
        <Slider {...settings} className={classnames(styles.home_slider2, 'home_slider2')}>
            {slides?.map((item, index) => (
                <div key={'slide-' + index} className={classnames(styles.resort_box_main, {
                    [styles.lastSlide]: index === slides.length - 1,
                  })}>
                  <div className={classnames(styles.resort_box)}>
                      <div className={classnames(styles.resort_img)}>
                          {item.image && (<img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${item.image}`} alt={item.title} />)}
                      </div>
                      <div className={classnames(styles.resort_text)}>
                          {item.title && (<h3>{item.title}</h3>)}
                          {item.sub_title && (<p>{item.sub_title}</p>)}

                          {item.button_text && item.button_link && (
                            <div className={classnames(styles.btn, 'btn')}>
                              <a href={item.button_link}>{item.button_text}</a>
                            </div>
                          )}
                      </div>
                  </div>
                </div>
            ))}
        </Slider>
      </div>

      {slides.length && (
        <div className={classnames(styles.destination_btn)}>
            <a href="#"> View All Destinations → </a>
        </div>
      )}
  </section>
  )
}

export default HomeSection2
