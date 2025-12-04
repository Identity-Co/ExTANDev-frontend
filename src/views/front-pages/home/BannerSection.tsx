// React Imports
import { useEffect, useRef, useState } from 'react'

// Third-party Imports
import Slider from 'react-slick';
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

import Image from "next/image";

import DestinationResortFilter from '@/components/DestinationResortFilter'

// Styles Imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './styles.module.css'


const BannerSection = ({ mode, banners, locations, locDestinations }: { mode: Mode; banners?: []; locations?: []; locDestinations?: []; }) => {
  const slideref = useRef();

  const [location, setLocation] = useState(null);
  const [resort, setResort] = useState("Any Resorts");  //null
  const [resorts, setResorts] = useState([]);

  const [openLoc, setOpenLoc] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState("Select Destination");

  const [openRes, setOpenRes] = useState(false);
  const [selectedRes, setSelectedRes] = useState("Any Resorts");  //"Select Resort"

  /* useEffect(() => {
    // Get query string from current URL
    const searchParams = new URLSearchParams(window.location.search);

    // Get specific parameters
    const _location = searchParams.get("location");
    const _resort = searchParams.get("resort");

    if(_location !== undefined) setLocation(_location);
    if(_resort !== undefined) setResort(_resort);
  }, []); */
  
  useEffect(() => {
    const slides = document.querySelectorAll('.hero_slide_box');
    
    slides.forEach((slide) => {
      const backgroundImage = slide.style.backgroundImage;
      
      if (!backgroundImage || backgroundImage != slide.getAttribute('databackground')) {
        slide.style.backgroundImage = 'url("'+slide.getAttribute('databackground')+'")';
      }
    });
  }, []);

  useEffect(() => {
    setResortItems()
  }, [location]);

  function setResortItems() {
    const _resorts = locDestinations.filter(item => item.destination_location==location)
    
    const resortsArr = _resorts.map(item => item.resorts?.resorts);

    const _resortsItems = resortsArr
      .filter(Array.isArray)
      .flatMap(subArray => subArray.map(item => item.title));

    const resortsItems = _resortsItems.sort((a, b) => a.localeCompare(b));

    setResorts([...new Set(resortsItems)])
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 6000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className={classnames(styles.home_banner, 'home_banner top-banner')}>
      <div className={classnames(styles.home_banner_slide)}>
          <Slider {...settings} className={classnames(styles.home_hero_slider, 'home_hero_slider')}>
            {banners?.map((item, index) => {
              const imageUrl = `${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${item.banner_image}`;
              
              return (
                <div
                  key={`home-slider-${index}`}
                  className={classnames(styles.hero_slide_box, 'hero_slide_box')}
                  ref={slideref} databackground={imageUrl}
                  style={{
                    backgroundImage: `url("${imageUrl}")`,
                  }}
                >
                  <div className={styles.hero_slide_container}>
                    <div className={styles.hero_slide_text}>
                      {item.sub_title && <p>{item.sub_title}</p>}
                      {item.title && <h1>{item.title}</h1>}

                      {item.button_text && item.button_link && (
                        <div className="btn">
                          <a href={item.button_link}>{item.button_text}</a>
                        </div>
                      )}
                    </div>

                    <div className={styles.hero_slide_location}>
                      <div className={styles.location_name}>
                        <img src="/images/front-pages/images/hero-location.svg" alt="Location" />
                        <span>Kirroughtree, Scotland</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
      </div>
      <div className={classnames(styles.search_box)}>
          <div className={classnames(styles.container, 'container')}>
              <div className={classnames(styles.search_box_inner)}>
                  <div className={classnames(styles.search_row)}>
                      <DestinationResortFilter />
                  </div>
              </div>
          </div>
      </div>
  </div>
  )
}

export default BannerSection
