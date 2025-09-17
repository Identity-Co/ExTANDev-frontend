// React Imports
import { useEffect, useRef, useState } from 'react'

// Third-party Imports
import Slider from 'react-slick';
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

import { getDestinationsByActivity } from '@/app/server/tours'

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerSection = ({ mode, banners, filter_activities }: { mode: Mode; banners?: []; filter_activities: []; }) => {
  const slideref = useRef();
  const [destinations, setDestinations] = useState<string[]>([])
  const [selectedActivity, setSelectedActivity] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  
  useEffect(() => {
    const slides = document.querySelectorAll('.hero_slide_box');

    slides.forEach((slide) => {
      const backgroundImage = slide.style.backgroundImage;

      if (!backgroundImage) {
        slide.style.backgroundImage = 'url("'+slideref.current.getAttribute('databackground')+'")';
      }
    });

    const loadDestinations = async (activityFromUrl) => {
      const data = await getDestinationsByActivity(activityFromUrl)

      setDestinations(data || [])
    }

    const searchParams = new URLSearchParams(window.location.search)
    const activityFromUrl = searchParams.get('activity')
    const destinationFromUrl = searchParams.get('destination')

    if (activityFromUrl) {
      setSelectedActivity(activityFromUrl)

      loadDestinations(activityFromUrl);
    }

    if (destinationFromUrl) setSelectedDestination(destinationFromUrl)
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

  // Handle activity change
  const handleActivityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const activity = e.target.value
    setSelectedActivity(activity)
    setSelectedDestination('')
    setDestinations([])

    if (activity) {
      try {
        const data = await getDestinationsByActivity(activity)
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
                                <select name="activity" id="activity" required value={selectedActivity} onChange={handleActivityChange}>
                                  <option value="">Select a Activity</option>
                                  {filter_activities.map((loc) => (
                                    <option key={loc} value={loc}>
                                      {loc}
                                    </option>
                                  ))}
                                </select>
                            </div>
                            <div className={classnames(styles.search_select, styles.ss2)}>
                                <label>Destinations</label>
                                <select name="destination" id="destination" value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)}>
                                  <option value="">Select a Destination</option>
                                  {destinations.map((dest: string) => (
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
