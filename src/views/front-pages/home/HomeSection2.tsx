// React Imports
import React, { useState } from 'react'

// Third-party Imports
import classnames from 'classnames'
import type { TrackDetails } from 'keen-slider/react'
import { useKeenSlider } from 'keen-slider/react'

// Styled Component Imports
import AppKeenSlider from '@/libs/styles/AppKeenSlider'

// Styles Imports
import styles from './styles.module.css'

const HomeSection2 = () => {
  // States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [details, setDetails] = useState<TrackDetails>()

  const slides = [
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
  ]

  // Hooks
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slideChanged: slider => setCurrentSlide(slider.track.details.rel),
      created: () => setLoaded(true),
      detailsChanged: s => setDetails(s.track.details),
      slides: {
        perView: 1.5,
        spacing: 26,
        origin: 'center'
      },
      breakpoints: {
        '(max-width: 1200px)': {
          slides: {
            perView: 1.5,
            spacing: 26,
            origin: 'center'
          }
        },
        '(max-width: 900px)': {
          slides: {
            perView: 1.5,
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
    <section key={`section-3`} className={classnames(styles.home_section2)}>
      <div className={classnames(styles.home_slider2)}>
        <AppKeenSlider>
          <>
            <div ref={sliderRef} className='keen-slider mbe-6'>
              {slides?.map((item, index) => (
                <React.Fragment key={'slide-' + index}>
                  <div key={'slide-' + index} className={classnames(styles.resort_box, 'keen-slider__slide')}>
                      <div className={classnames(styles.resort_img)}>
                          <img src={item.image} />
                      </div>
                      <div className={classnames(styles.resort_text)}>
                          <h3>{item.title}</h3>
                          <p>{item.sub_title}</p>
                          <div className={classnames(styles.btn, 'btn')}>
                              <a href="#" tabIndex={0}>BOOK NOW</a>
                          </div>
                      </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </>
        </AppKeenSlider>
      </div>
      <div className={classnames(styles.destination_btn)}>
          <a href="#"> View All Destinations → </a>
      </div>
  </section>
  )
}

export default HomeSection2
