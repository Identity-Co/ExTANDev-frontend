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

const HomeSection3 = () => {
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
        perView: 3,
        spacing: 26,
        origin: 'center'
      },
      breakpoints: {
        '(max-width: 1200px)': {
          slides: {
            perView: 3,
            spacing: 26,
            origin: 'center'
          }
        },
        '(max-width: 900px)': {
          slides: {
            perView: 3,
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
    <section className={classnames(styles.home_section3, 'py_150')}>
        <div className={classnames('container')}>
            <div className={classnames(styles.head_text_center)}>
              <h2 className="fs_55">Adventure Is Calling — Are You Ready?</h2>
              <p><span className="extra_bold"><em>Adventure Network travel tours take you beyond the beaten path—</em></span>From jungle treks to hidden surf breaks, each trip is packed with adrenaline, discovery, and unforgettable moments far from the tourist trail.</p>
            </div>
            <div className={classnames(styles.network_travel)}>
              <div className={classnames(styles.network_travel_slider)}>
                <AppKeenSlider>
                  <>
                    <div ref={sliderRef} className='keen-slider mbe-6'>
                      <div className={classnames(styles.network_travel_box, 'keen-slider__slide')}>
                        <div className={classnames(styles.network_travel_top)}>
                          <div className={classnames(styles.network_travel_img)}>
                            <img src="/images/front-pages/images/network1.jpg" />
                          </div>
                          <div className={classnames(styles.network_travel_img_text)}>
                            <h3>Adventure Runs Deep in Belize</h3>
                            <div className="btn">
                                <a href="#" tabIndex={0}>View Trip</a>
                            </div>
                          </div>
                        </div>
                        <div className={classnames(styles.network_travel_bottom)}>
                          <div className={classnames(styles.network_travel_profile)}>
                            <div className={classnames(styles.network_travel_picture)}>
                              <img src="/images/front-pages/images/network-travel-picture1.jpg" />
                            </div>
                            <div className={classnames(styles.network_travel_profile_info)}>
                              <h4>Adventure Jack</h4>
                              <span>@adventurejack</span>
                            </div>
                            <div className={classnames(styles.network_travel_follow)}>
                              <span>•</span>
                              <a href="#">FOLLOW</a>
                            </div>
                          </div>
                          <div className={classnames(styles.network_travel_text)}>
                            <p>I’ve traveled a lot, but nothing compares to what I experienced through Adventure Network. </p>
                            <div className={classnames(styles.network_travel_likes)}>
                              <span>3w</span>
                              <span>45 likes</span>
                              <span>Reply</span>
                              <ul>
                                  <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                      <path id="Path_796" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"/>
                                    </svg>
                                    </a></li>
                                  <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                      <path id="Path_1207" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"/>
                                    </svg>
                                    </a></li>
                                  <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                      <path id="Path_1208" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"/>
                                    </svg>
                                    </a></li>
                                  <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
                                      <g id="Group_876" data-name="Group 876" transform="translate(18.256 -130.131)">
                                        <path id="Path_798" data-name="Path 798" d="M32.689.03l-9.3,5.4-5.5-5.4Z" transform="translate(-36.143 130.1)" fill="#696767"/>
                                        <path id="Path_799" data-name="Path 799" d="M28.752.25l-7.4,12.794-2.072-7.29Z" transform="translate(-31.551 130.822)" fill="#696767"/>
                                      </g>
                                    </svg>
                                    </a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={ classnames(styles.network_travel_box, 'keen-slider__slide')}>
                        <div className={ classnames(styles.network_travel_top)}>
                          <div className={ classnames(styles.network_travel_img)}>
                            <img src="/images/front-pages/images/network2.jpg" />
                          </div>
                          <div className={ classnames(styles.network_travel_img_text)}>
                            <h3>Dominican Republic untamed</h3>
                            <div className="btn">
                                <a href="#" tabIndex={0}>View Trip</a>
                            </div>
                          </div>
                        </div>
                        <div className={ classnames(styles.network_travel_bottom)}>
                          <div className={ classnames(styles.network_travel_profile)}>
                            <div className={ classnames(styles.network_travel_picture)}>
                              <img src="/images/front-pages/images/network-travel-picture2.jpg" />
                            </div>
                            <div className={ classnames(styles.network_travel_profile_info)}>
                              <h4>Maddie beach</h4>
                              <span>@maddiebeach</span>
                            </div>
                            <div className={ classnames(styles.network_travel_follow)}>
                              <span>•</span>
                              <a href="#">FOLLOW</a>
                            </div>
                          </div>
                          <div className={ classnames(styles.network_travel_text)}>
                            <p>The DR is a vibrant blend —where every day feels like an invitation to celebrate life.</p>
                            <div className={ classnames(styles.network_travel_likes)}>
                              <span>3w</span>
                              <span>45 likes</span>
                              <span>Reply</span>
                              <ul>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                    <path id="Path_796" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"/>
                                  </svg>
                                  </a></li>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                    <path id="Path_1207" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"/>
                                  </svg>
                                  </a></li>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                    <path id="Path_1208" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"/>
                                  </svg>
                                  </a></li>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
                                    <g id="Group_876" data-name="Group 876" transform="translate(18.256 -130.131)">
                                      <path id="Path_798" data-name="Path 798" d="M32.689.03l-9.3,5.4-5.5-5.4Z" transform="translate(-36.143 130.1)" fill="#696767"/>
                                      <path id="Path_799" data-name="Path 799" d="M28.752.25l-7.4,12.794-2.072-7.29Z" transform="translate(-31.551 130.822)" fill="#696767"/>
                                    </g>
                                  </svg>
                                  </a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={ classnames(styles.network_travel_box, 'keen-slider__slide')}>
                        <div className={ classnames(styles.network_travel_top)}>
                          <div className={ classnames(styles.network_travel_img)}>
                            <img src="/images/front-pages/images/network3.jpg" />
                          </div>
                          <div className={ classnames(styles.network_travel_img_text)}>
                            <h3>Surf the rhythm Of Costa Rica</h3>
                            <div className="btn">
                                      <a href="#" tabIndex={0}>View Trip</a>
                                  </div>
                          </div>
                        </div>
                        <div className={classnames(styles.network_travel_bottom)}>
                          <div className={classnames(styles.network_travel_profile)}>
                            <div className={classnames(styles.network_travel_picture)}>
                              <img src="/images/front-pages/images/network-travel-picture3.jpg" />
                            </div>
                            <div className={classnames(styles.network_travel_profile_info)}>
                              <h4>Mikey February</h4>
                              <span>@mikeyfebruarysurf</span>
                            </div>
                            <div className={classnames(styles.network_travel_follow)}>
                              <span>•</span>
                              <a href="#">FOLLOW</a>
                            </div>
                          </div>
                          <div className={classnames(styles.network_travel_text)}>
                            <p>Costa Rica serves up world-className waves, warm waters, and pure vibes wrapped in jungle beauty.</p>
                            <div className={classnames(styles.network_travel_likes)}>
                              <span>3w</span>
                              <span>45 likes</span>
                              <span>Reply</span>
                              <ul>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                    <path id="Path_796" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"/>
                                  </svg>
                                  </a></li>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                    <path id="Path_1207" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"/>
                                  </svg>
                                  </a></li>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                    <path id="Path_1208" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"/>
                                  </svg>
                                  </a></li>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
                                    <g id="Group_876" data-name="Group 876" transform="translate(18.256 -130.131)">
                                      <path id="Path_798" data-name="Path 798" d="M32.689.03l-9.3,5.4-5.5-5.4Z" transform="translate(-36.143 130.1)" fill="#696767"/>
                                      <path id="Path_799" data-name="Path 799" d="M28.752.25l-7.4,12.794-2.072-7.29Z" transform="translate(-31.551 130.822)" fill="#696767"/>
                                    </g>
                                  </svg>
                                  </a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={classnames(styles.network_travel_box, 'keen-slider__slide')}>
                        <div className={classnames(styles.network_travel_top)}>
                          <div className={classnames(styles.network_travel_img)}>
                            <img src="images/network2.jpg" />
                          </div>
                          <div className={classnames(styles.network_travel_img_text)}>
                            <h3>Dominican Republic untamed</h3>
                            <div className="btn">
                                <a href="#" tabIndex={0}>View Trip</a>
                            </div>
                          </div>
                        </div>
                        <div className={classnames(styles.network_travel_bottom)}>
                          <div className={classnames(styles.network_travel_profile)}>
                            <div className={classnames(styles.network_travel_picture)}>
                              <img src="/images/front-pages/images/network-travel-picture2.jpg" />
                            </div>
                            <div className={classnames(styles.network_travel_profile_info)}>
                              <h4>Maddie beach</h4>
                              <span>@maddiebeach</span>
                            </div>
                            <div className={classnames(styles.network_travel_follow)}>
                              <span>•</span>
                              <a href="#">FOLLOW</a>
                            </div>
                          </div>
                          <div className={classnames(styles.network_travel_text)}>
                            <p>The DR is a vibrant blend —where every day feels like an invitation to celebrate life.</p>
                            <div className={classnames(styles.network_travel_likes)}>
                              <span>3w</span>
                              <span>45 likes</span>
                              <span>Reply</span>
                              <ul>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                    <path id="Path_796" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"/>
                                  </svg>
                                  </a></li>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                    <path id="Path_1207" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"/>
                                  </svg>
                                  </a></li>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                    <path id="Path_1208" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"/>
                                  </svg>
                                  </a></li>
                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
                                    <g id="Group_876" data-name="Group 876" transform="translate(18.256 -130.131)">
                                      <path id="Path_798" data-name="Path 798" d="M32.689.03l-9.3,5.4-5.5-5.4Z" transform="translate(-36.143 130.1)" fill="#696767"/>
                                      <path id="Path_799" data-name="Path 799" d="M28.752.25l-7.4,12.794-2.072-7.29Z" transform="translate(-31.551 130.822)" fill="#696767"/>
                                    </g>
                                  </svg>
                                  </a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                </AppKeenSlider>
              </div>
            </div>
        </div>
    </section>
  )
}

export default HomeSection3
