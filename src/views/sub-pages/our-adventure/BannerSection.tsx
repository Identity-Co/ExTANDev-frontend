// React Imports
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

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

const BannerSection = ({ mode, banners, filter_categories }: { mode: Mode; banners?: []; filter_categories: []; }) => {
  const slideref = useRef();
  const [destinations, setDestinations] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')

  const searchParams = useSearchParams()
  
  useEffect(() => {
    const slides = document.querySelectorAll('.hero_slide_box');

    slides.forEach((slide) => {
      const backgroundImage = slide.style.backgroundImage;

      if (!backgroundImage) {
        slide.style.backgroundImage = 'url("'+slideref.current.getAttribute('databackground')+'")';
      }
    });

    const loadDestinations = async (categoryFromUrl) => {
      const matchedCategory = filter_categories.find(loc => loc.category_name === categoryFromUrl)
      if (matchedCategory) {
        const cat_id = matchedCategory._id
        const data = await getDestinationsByCustomCategory(cat_id)
        setDestinations(data || [])
      }
    }

    //const searchParams = new URLSearchParams(window.location.search)
    const categoryFromUrl = searchParams.get('category')
    const destinationFromUrl = searchParams.get('destination')

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
      loadDestinations(categoryFromUrl);
    } else {
      setSelectedCategory('')
      setDestinations([])
    }

    if (destinationFromUrl) {
      setSelectedDestination(destinationFromUrl)
    } else {
      setSelectedDestination('')
    }
  }, [searchParams]);

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
