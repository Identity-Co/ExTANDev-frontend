// React Imports
import { useEffect, useRef, useState } from 'react'

// Third-party Imports
import Slider from 'react-slick';
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerSection = ({ mode, banners, locations, locDestinations, scrollRef }: { mode: Mode; banners?: []; locations?: []; locDestinations?: []; scrollRef?: [] }) => {
  const slideref = useRef();

  const [location, setLocation] = useState(null);
  const [resort, setResort] = useState(null);
  const [resorts, setResorts] = useState([]);

  const [openLoc, setOpenLoc] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState("Select Destination");

  const [openRes, setOpenRes] = useState(false);
  const [selectedRes, setSelectedRes] = useState("Select Resort");

  useEffect(() => {
    // Get query string from current URL
    const searchParams = new URLSearchParams(window.location.search);

    // Get specific parameters
    const _location = searchParams.get("location");
    const _resort = searchParams.get("resort");

    if(_location !== undefined && _location) setLocation(_location); setSelectedLoc(_location);
    if(_resort !== undefined && _resort) setResort(_resort); setSelectedRes(_resort);
    console.log(_location, _resort)
  }, []);
  
  useEffect(() => {
    const slides = document.querySelectorAll('.hero_slide_box');
    
    slides.forEach((slide) => {
      const backgroundImage = slide.style.backgroundImage;
      
      if (!backgroundImage || backgroundImage != slide.getAttribute('databackground')) {
        slide.style.backgroundImage = 'url("'+slide.getAttribute('databackground')+'")';
      }
    });

    setResortItems()
  }, []);

  useEffect(() => {
    setResortItems()
  }, [location]);

  function setResortItems() {
    const _resorts = locDestinations.filter(item => item.destination_location==location)
    
    const resortsArr = _resorts.map(item => item.resorts?.resorts);

    const _resortsItems = resortsArr
      .filter(Array.isArray)
      .flatMap(subArray => subArray.map(item => item.title));

    const resortsItems = _resortsItems.sort((a, b) => a.localeCompare(b));

    setResorts([...new Set(resortsItems)])
  }

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
    <div className={classnames(styles.home_banner, 'home_banner top-banner')}>
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

                    {item.location && (
                      <div className={styles.hero_slide_location}>
                        <div className={styles.location_name}>
                          <img src="/images/front-pages/images/hero-location.svg" alt="Location" />
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
      <div className={classnames(styles.search_box)} ref={scrollRef}>
          <div className={classnames(styles.container, 'container')}>
              <div className={classnames(styles.search_box_inner)}>
                  <div className={classnames(styles.search_row)}>
                      <form>
                          <input type="hidden" name="location" value={location??''} />
                          <input type="hidden" name="resort" value={resort??''} />

                          <div className={classnames(styles.search_select, styles.ss1)}>
                              <label>Destinations</label>
                              <div className={`custom-select ${openLoc ? 'active' : ''}`}>
                                <div 
                                  className="select-selected"
                                  onClick={() => {setOpenLoc(!openLoc); setOpenRes(false)}}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div>
                                    <span className="select-icn">
                                      <img src="/images/svg/map-pin.svg" alt=""  />
                                    </span>
                                    <span>{selectedLoc}</span>
                                  </div>

                                  <img
                                    src="/images/svg/down-arrow.svg"
                                    alt=""
                                    style={{
                                      transform: openLoc ? "rotate(180deg)" : "rotate(0deg)",
                                      transition: "0.2s",
                                    }}
                                  />
                                </div>

                                {openLoc && (
                                  <div className="select-items">
                                    {locations.map((loc, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          setSelectedLoc(loc);
                                          setLocation(loc)
                                          setOpenLoc(false);
                                        }}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <span>
                                          <img src="/images/svg/map-pin.svg" alt="" />
                                        </span>
                                        {loc}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                          </div>
                          <div className={classnames(styles.search_select, styles.ss2)}>
                              <label>Resort/Hotel</label>

                              <div className={`custom-select ${openRes ? 'active' : ''}`}>
                                <div 
                                  className="select-selected"
                                  onClick={() => {setOpenRes(!openRes); setOpenLoc(false)}}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div>
                                    <span className="select-icn">
                                      <img src="/images/svg/hotel.svg" alt=""  />
                                    </span>
                                    <span>{selectedRes}</span>
                                  </div>

                                  <img
                                    src="/images/svg/down-arrow.svg"
                                    alt=""
                                    style={{
                                      transform: openRes ? "rotate(180deg)" : "rotate(0deg)",
                                      transition: "0.2s",
                                    }}
                                  />
                                </div>

                                {openRes && (
                                  <div className="select-items">
                                    {resorts.map((res, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          setSelectedRes(res);
                                          setResort(res)
                                          setOpenRes(false);
                                        }}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <span>
                                          <img src="/images/svg/hotel.svg" alt="" />
                                        </span>
                                        {res}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
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
