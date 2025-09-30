// React Imports
import { useEffect, useRef, useState } from 'react'

// Third-party Imports
import Slider from 'react-slick';
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

import { getDestinationsByCustomCategory } from '@/app/server/tours'

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerSection = ({ mode, filter_categories }: { mode: Mode; filter_categories: []; }) => {
  const slideref = useRef();
  const [destinations, setDestinations] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  
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

  // Handle Category change
  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.selectedOptions[0]

    const categoryName = e.target.value
    const category = selectedOption.getAttribute("data-id");
    setSelectedCategory(categoryName)
    setSelectedDestination('')
    setDestinations([])

    if (category) {
      try {
        const data = await getDestinationsByCustomCategory(category)
        setDestinations(data || [])
      } catch (err) {
        console.error('Failed to fetch destinations:', err)
        setDestinations([])
      }
    }
  }

  return (
    <div className={classnames(styles.home_banner, styles.destination_overview_banner, 'home_banner top-banner destination_overview_banner')}>
        <div className={classnames(styles.home_banner_slide)}>
            <Slider {...settings} className={classnames(styles.home_hero_slider, 'home_hero_slider')}>
              <div className={classnames(styles.hero_slide_box, 'hero_slide_box')} ref={slideref} databackground="/images/sub-pages/surf-head-copy.jpg" style={{backgroundImage: `url('/images/sub-pages/surf-head-copy.jpg')`}}>
                  <div className={classnames(styles.hero_slide_container)}>
                      <div className={classnames(styles.hero_slide_text)}>
                          <h1>COSTA RICA CALLING</h1>
                          <p>Surf to the rhythm of Costa Rica, <span>where warm waves, tropical vibes, and pura vida energy set the pace for every ride</span></p>
                      </div>
                      <div className={classnames(styles.hero_slide_location)}>
                          <div className={classnames(styles.location_name)}>
                              <img src="/images/front-pages/images/hero-location.svg" />
                              <span>Roca Bruja break – costa rica</span>
                          </div>
                      </div>
                  </div>
              </div>
              <div className={classnames(styles.hero_slide_box, 'hero_slide_box')} ref={slideref} databackground="/images/sub-pages/surf-head-copy.jpg" style={{backgroundImage: `url('/images/sub-pages/surf-head-copy.jpg')`}}>
                  <div className={classnames(styles.hero_slide_container)}>
                      <div className={classnames(styles.hero_slide_text)}>
                          <h1>COSTA RICA CALLING</h1>
                          <p>Surf to the rhythm of Costa Rica, <span>where warm waves, tropical vibes, and pura vida energy set the pace for every ride</span></p>
                      </div>
                      <div className={classnames(styles.hero_slide_location)}>
                          <div className={classnames(styles.location_name)}>
                              <img src="/images/front-pages/images/hero-location.svg" />
                              <span>Roca Bruja break – costa rica</span>
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
                        <form action="/our-adventure/" method="get">
                            <div className={classnames(styles.search_select, styles.ss1)}>
                                <label>Activity</label>
                                <select name="category" id="category" required value={selectedCategory} onChange={handleCategoryChange}>
                                  <option value="">Select a Travel Style</option>
                                  {filter_categories.map((loc) => (
                                    <option key={loc._id} value={loc.category_name} data-id={loc._id}>
                                      {loc.category_name}
                                    </option>
                                  ))}
                                </select>
                            </div>
                            <div className={classnames(styles.search_select, styles.ss2)}>
                                <label>Destinations</label>
                                <select name="destination" id="destination" value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)}>
                                  <option value="">Select a Destination</option>
                                  {Array.isArray(destinations) && destinations.map((dest: string) => (
                                    <option key={dest} value={dest}>
                                      {dest}
                                    </option>
                                  ))}
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
