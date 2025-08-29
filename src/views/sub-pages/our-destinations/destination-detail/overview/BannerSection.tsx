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

const BannerSection = ({ mode }: { mode: Mode }) => {
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
    <div className={classnames(styles.home_banner, styles.destination_overview_banner, 'home_banner top-banner destination_overview_banner')}>
        <div className={classnames(styles.home_banner_slide)}>
            <Slider {...settings} className={classnames(styles.home_hero_slider, 'home_hero_slider')}>
              <div className={classnames(styles.hero_slide_box, 'hero_slide_box')} ref={slideref} databackground="/images/sub-pages/jungle-hike.jpg" style={{backgroundImage: `url('/images/sub-pages/jungle-hike.jpg')`}}>
                  <div className={classnames(styles.hero_slide_container)}>
                      <div className={classnames(styles.hero_slide_text)}>
                          <h1>Adventure Lives here</h1>
                          <p>Explore the DR’s untamed side—<span>where jungle hikes, river rapids, and mountain adventures redefine island travel.</span></p>
                      </div>
                      <div className={classnames(styles.hero_slide_location)}>
                          <div className={classnames(styles.location_name)}>
                              <img src="/images/front-pages/images/hero-location.svg" />
                              <span>Jarabacoa – Dominican Republic</span>
                          </div>
                      </div>
                  </div>
              </div>
              <div className={classnames(styles.hero_slide_box, 'hero_slide_box')} ref={slideref} databackground="/images/sub-pages/jungle-hike.jpg" style={{backgroundImage: `url('/images/sub-pages/jungle-hike.jpg')`}}>
                  <div className={classnames(styles.hero_slide_container)}>
                      <div className={classnames(styles.hero_slide_text)}>
                          <h1>Adventure Lives here</h1>
                          <p>Explore the DR’s untamed side—<span>where jungle hikes, river rapids, and mountain adventures redefine island travel.</span></p>
                      </div>
                      <div className={classnames(styles.hero_slide_location)}>
                          <div className={classnames(styles.location_name)}>
                              <img src="/images/front-pages/images/hero-location.svg" />
                              <span>Jarabacoa – Dominican Republic</span>
                          </div>
                      </div>
                  </div>
              </div>
            </Slider>
        </div>
        <div className={classnames(styles.search_box)}>
            <div className={classnames(styles.container, 'container')}>
                <div className={classnames(styles.search_box_inner)}>
                    <div className={classnames(styles.search_row)}>
                        <form>
                            <div className={classnames(styles.search_select, styles.ss1)}>
                                <label>Destinations</label>
                                <select name="cars" id="cars">
                                  <option value="">Destinations 1</option>
                                  <option value="">Destinations 2</option>
                                  <option value="">Destinations 3</option>
                                  <option value="">Destinations 4</option>
                                </select>
                            </div>
                            <div className={classnames(styles.search_select, styles.ss2)}>
                                <label>Resort/Hotel</label>
                                <select name="cars" id="cars">
                                  <option value="">Resort 1</option>
                                  <option value="">Resort 2</option>
                                  <option value="">Resort 3</option>
                                  <option value="">Resort 4</option>
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
