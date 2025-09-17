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

const BannerSection = ({ mode, banners }: { mode: Mode; banners?: [] }) => {
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
    <div className={classnames(styles.home_banner, styles.destination_overview_banner, styles.adventure_banner, 'home_banner top-banner destination_overview_banner')}>
        <div className={classnames(styles.home_banner_slide)}>
            <Slider {...settings} className={classnames(styles.home_hero_slider, 'home_hero_slider')}>
              {banners?.map((item, index) => {
                const imageUrl = `${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${item.banner_image}`;

                return (
                  <div 
                    key={`adv-slider-${index}`}
                    className={classnames(styles.hero_slide_box, 'hero_slide_box')} 
                    ref={slideref} databackground={imageUrl} 
                    style={{
                      backgroundImage: `url("${imageUrl}")`,
                    }}
                  >
                      <div className={classnames(styles.hero_slide_container)}>
                          <div className={classnames(styles.hero_slide_text)}>
                              {item.title && <h1>{item.title}</h1>}
                              {item.sub_title && <p>{item.sub_title}</p>}
                          </div>

                          {item.location && (
                            <div className={classnames(styles.hero_slide_location)}>
                              <div className={classnames(styles.location_name)}>
                                <img src="/images/front-pages/images/hero-location.svg" />
                                <span>{item.location}</span>
                              </div>
                            </div>
                          )}
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
                        <form>
                            <div className={classnames(styles.search_select, styles.ss1)}>
                                <label>Activity</label>
                                <select name="cars" id="cars">
                                  <option value="">Activity 1</option>
                                  <option value="">Activity 2</option>
                                  <option value="">Activity 3</option>
                                  <option value="">Activity 4</option>
                                </select>
                            </div>
                            <div className={classnames(styles.search_select, styles.ss2)}>
                                <label>Destinations</label>
                                <select name="cars" id="cars">
                                  <option value="">Destinations 1</option>
                                  <option value="">Destinations 2</option>
                                  <option value="">Destinations 3</option>
                                  <option value="">Destinations 4</option>
                                </select>
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
