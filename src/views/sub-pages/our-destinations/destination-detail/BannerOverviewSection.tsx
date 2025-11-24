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

const BannerOverviewSection = ({ bannerData }: { bannerData?: []; }) => {
  const slideref = useRef();

  const [suitable_for, setSuitableFor] = useState(null);
  const [season, setSeason] = useState(null);

    const [openSF, setOpenSF] = useState(false);
    const [selectedSF, setSelectedSF] = useState("- Select -");

    const [openSea, setOpenSea] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState("- Select -");

  useEffect(() => {
    // Get query string from current URL
    const searchParams = new URLSearchParams(window.location.search);

    // Get specific parameters
    const _suitable_for = searchParams.get("suitable_for");
    const _season = searchParams.get("season");

    if(_suitable_for !== undefined && _suitable_for) {
        setSuitableFor(_suitable_for); 
        setSelectedSF(_suitable_for);
    }
    if(_season !== undefined && _season) {
        setSeason(_season); 
        setSelectedSeason(_season);
    }
    console.log(_suitable_for, _season)
  }, []);
  
  useEffect(() => {
    const slides = document.querySelectorAll('.hero_slide_box');
    
    slides.forEach((slide) => {
      const backgroundImage = slide.style.backgroundImage;
      
      if (!backgroundImage || backgroundImage != slide.getAttribute('databackground')) {
        slide.style.backgroundImage = 'url("'+slide.getAttribute('databackground')+'")';
      }
    });
  }, []);

    const suitable_for_opt = [
        {item: "Couple", icon: '/images/svg/couple.svg'}, 
        {item: "Family", icon: '/images/svg/family.svg'}, 
        {item: "Kids Friendly", icon: '/images/svg/kids.svg'}, 
        {item: "Senior Friendly", icon: '/images/svg/senior.svg'}, 
        {item: "Solo", icon: '/images/svg/solo.svg'}
    ];
    const season_opt = [
        {item: "All Year", icon: '/images/svg/snow.svg'}, 
        {item: "Monsoon", icon: '/images/svg/monsoon.svg'}, 
        {item: "Summer", icon: '/images/svg/sumer.svg'}, 
        {item: "Winter", icon: '/images/svg/winter.svg'}
    ];

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
              {bannerData?.map((item, index) => {
                const imageUrl = `${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${item.image}`;

                return (
                  <div 
                  key={`home-slider-${index}`}
                  className={classnames(styles.hero_slide_box, 'hero_slide_box')}
                  ref={slideref}
                  databackground={imageUrl}
                  style={{
                    backgroundImage: `url("${imageUrl}")`,
                  }}
                  >
                    <div className={classnames(styles.hero_slide_container)}>
                        <div className={classnames(styles.hero_slide_text)}>
                            {item.title && <h1>{item.title}</h1>}
                            <div dangerouslySetInnerHTML={{
                                  __html: (item?.content || ''),
                                }}>
                            </div>
                        </div>
                        <div className={classnames(styles.hero_slide_location)}>
                            <div className={classnames(styles.location_name)}>
                                <img src="/images/front-pages/images/hero-location.svg" />
                                {item.location && <span>{item.location}</span>}
                            </div>
                        </div>
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
                            <input type="hidden" name="suitable_for" value={suitable_for??''} />
                            <input type="hidden" name="season" value={season??''} />
                            
                            <div className={classnames(styles.search_select, styles.ss1)}>
                                <label>Suitable For</label>
                                <div className={`custom-select ${openSF ? 'active' : ''}`}>
                                    <div 
                                      className="select-selected"
                                      onClick={() => {setOpenSF(!openSF); setOpenSea(false)}}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <div>
                                        <span className="select-icn">
                                          <img src="/images/svg/solo.svg" alt=""  />
                                        </span>
                                        <span>{selectedSF}</span>
                                      </div>

                                      <img
                                        src="/images/svg/down-arrow.svg"
                                        alt=""
                                        style={{
                                          transform: openSF ? "rotate(180deg)" : "rotate(0deg)",
                                          transition: "0.2s",
                                        }}
                                      />
                                    </div>

                                    {openSF && (
                                      <div className="select-items">
                                        {suitable_for_opt.map((sf, index) => (
                                          <div
                                            key={index}
                                            onClick={() => {
                                              setSelectedSF(sf.item);
                                              setSuitableFor(sf.item)
                                              setOpenSF(false);
                                            }}
                                            style={{ cursor: "pointer" }}
                                          >
                                            <span>
                                              <img src={sf.icon} alt="" />
                                            </span>
                                            {sf.item}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                            </div>
                            <div className={classnames(styles.search_select, styles.ss2)}>
                                <label>Season / Best Time</label>
                                <div className={`custom-select ${openSea ? 'active' : ''}`}>
                                    <div 
                                      className="select-selected"
                                      onClick={() => {setOpenSea(!openSea); setOpenSF(false)}}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <div>
                                        <span className="select-icn">
                                          <img src="/images/svg/winter.svg" alt=""  />
                                        </span>
                                        <span>{selectedSeason}</span>
                                      </div>

                                      <img
                                        src="/images/svg/down-arrow.svg"
                                        alt=""
                                        style={{
                                          transform: openSea ? "rotate(180deg)" : "rotate(0deg)",
                                          transition: "0.2s",
                                        }}
                                      />
                                    </div>

                                    {openSea && (
                                      <div className="select-items">
                                        {season_opt.map((ss, index) => (
                                          <div
                                            key={index}
                                            onClick={() => {
                                              setSelectedSeason(ss.item);
                                              setSeason(ss.item)
                                              setOpenSea(false);
                                            }}
                                            style={{ cursor: "pointer" }}
                                          >
                                            <span>
                                              <img src={ss.icon} alt="" />
                                            </span>
                                            {ss.item}
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

export default BannerOverviewSection
