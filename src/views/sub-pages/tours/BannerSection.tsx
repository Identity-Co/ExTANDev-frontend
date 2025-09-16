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
    <div className={classnames(styles.home_banner, styles.destination_overview_banner, styles.adventure_banner, 'home_banner top-banner destination_overview_banner')}>
        <div className={classnames(styles.home_banner_slide)}>
            <Slider {...settings} className={classnames(styles.home_hero_slider, 'home_hero_slider')}>
                <div
                  className={classnames(styles.hero_slide_box, 'hero_slide_box')} 
                  ref={slideref} databackground="https://adventureapi.deepripple.com/uploads/banners/1757590762251-total-travel.jpg"
                  style={{
                    backgroundImage: "https://adventureapi.deepripple.com/uploads/banners/1757590762251-total-travel.jpg",
                  }}
                >
                    <div className={classnames(styles.hero_slide_container)}>
                        <div className={classnames(styles.hero_slide_text)}>
                            <h1>Tours</h1>
                        </div>
                    </div>
                </div>
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
