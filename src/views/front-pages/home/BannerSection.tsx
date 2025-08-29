// React Imports
import { useState } from 'react'

// Third-party Imports
import classnames from 'classnames'
import type { TrackDetails } from 'keen-slider/react'
import { useKeenSlider } from 'keen-slider/react'

// Styled Component Imports
import AppKeenSlider from '@/libs/styles/AppKeenSlider'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode }: { mode: Mode }) => {
  // States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [details, setDetails] = useState<TrackDetails>()

  // Hooks
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slideChanged: slider => setCurrentSlide(slider.track.details.rel),
      created: () => setLoaded(true),
      detailsChanged: s => setDetails(s.track.details),
      slides: {
        perView: 1,
        origin: 'center'
      },
      breakpoints: {
        '(max-width: 1200px)': {
          slides: {
            perView: 1,
            spacing: 26,
            origin: 'center'
          }
        },
        '(max-width: 900px)': {
          slides: {
            perView: 1,
            spacing: 26,
            origin: 'center'
          }
        },
        '(max-width: 600px)': {
          slides: {
            perView: 1,
            spacing: 26,
            origin: 'center'
          }
        }
      }
    },
    [
      slider => {
        let timeout: ReturnType<typeof setTimeout>
        const mouseOver = false

        function clearNextTimeout() {
          clearTimeout(timeout)
        }

        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }

        slider.on('created', nextTimeout)
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <div className={classnames(styles.home_banner, 'top-banner')}>
      <div className={classnames(styles.home_banner_slide)}>
          <div className={classnames(styles.home_hero_slider)}>
            <AppKeenSlider>
              <>
                <div ref={sliderRef} className='keen-slider mbe-6'>
                  <div className={classnames(styles.hero_slide_box, 'keen-slider__slide')} style={{backgroundImage: `url('/images/front-pages/images/tan-head-ireland.jpg')`}}>
                      <div className={classnames(styles.hero_slide_container)}>
                          <div className={classnames(styles.hero_slide_text)}>
                              <p>Discover once-in-a-lifetime destinations for those who crave more than just a view.</p>
                              <h1>Adventure Out there</h1>
                              <div className="btn">
                                  <a href="#">Join now</a>
                              </div>
                          </div>
                          <div className={classnames(styles.hero_slide_location)}>
                              <div className={classnames(styles.location_name)}>
                                  <img src="/images/front-pages/images/hero-location.svg" />
                                  <span>Kirroughtree, Scotland</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className={classnames(styles.hero_slide_box, 'keen-slider__slide')} style={{backgroundImage: `url('/images/front-pages/images/tan-head-ireland.jpg')`}}>
                      <div className={classnames(styles.hero_slide_container)}>
                          <div className={classnames(styles.hero_slide_text)}>
                              <p>Discover once-in-a-lifetime destinations for those who crave more than just a view.</p>
                              <h2>Adventure Out there</h2>
                              <div className="btn">
                                  <a href="#">Join now</a>
                              </div>
                          </div>
                          <div className={classnames(styles.hero_slide_location)}>
                              <div className={classnames(styles.location_name)}>
                                  <img src="/images/front-pages/images/hero-location.svg" />
                                  <span>Kirroughtree, Scotland</span>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              </>
            </AppKeenSlider>
          </div>
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
