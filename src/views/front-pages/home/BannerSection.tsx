// React Imports
import { useEffect, useRef } from 'react'

// Third-party Imports
import Slider from 'react-slick';
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerSection = ({ mode, banners, filter_locations }: { mode: Mode; banners?: []; filter_locations: [] }) => {
  const slideref = useRef();
  
    useEffect(() => {
    const slides = document.querySelectorAll('.hero_slide_box');
    
    slides.forEach((slide) => {
      const backgroundImage = slide.style.backgroundImage;
      
      if (!backgroundImage) {
        slide.style.backgroundImage = 'url("'+slideref.current.getAttribute('databackground')+'")';
      }
    });
  }, []);

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
    <div className={classnames(styles.home_banner, 'top-banner')}>
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
                      <form action="/tours/" method="get">
                          <div className={classnames(styles.search_select, styles.ss1)}>
                              <label>Destinations</label>
                              <select name="location" id="location" required>
                                <option value="">Select a Destination</option>
                                {filter_locations.map((loc) => (
                                  <option key={loc} value={loc}>
                                    {loc}
                                  </option>
                                ))}
                              </select>
                          </div>
                          <div className={classnames(styles.search_select, styles.ss2)}>
                              <label>Date</label>
                              <input type="date" name="date" id="date" required />
                          </div>
                          <div className={classnames(styles.search_btn)}>
                              <input type="submit" name="" value="Search" />
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </div>
  )
}

export default BannerSection
