// React Imports
import { useEffect, useRef, useState } from 'react'

// Third-party Imports
import Slider from 'react-slick';
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

import DestinationResortFilter from '@/components/DestinationResortFilter'

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerOverviewSection = ({ bannerData, locations, locDestinations, cur_location }: { bannerData?: []; locations?: []; locDestinations?: []; cur_location?: '' }) => {
  const slideref = useRef();

  const [location, setLocation] = useState(null);
  const [resort, setResort] = useState("Any Resorts"); // null
  const [resorts, setResorts] = useState([]);

  const [openLoc, setOpenLoc] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState("Select Destination");

  const [openRes, setOpenRes] = useState(false);
  const [selectedRes, setSelectedRes] = useState("Any Resorts");  //"Select Resort"

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


  /* const [suitable_for, setSuitableFor] = useState(null);
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
  ]; */
  
  useEffect(() => {
    const slides = document.querySelectorAll('.hero_slide_box');
    
    slides.forEach((slide) => {
      const backgroundImage = slide.style.backgroundImage;
      
      if (!backgroundImage || backgroundImage != slide.getAttribute('databackground')) {
        slide.style.backgroundImage = 'url("'+slide.getAttribute('databackground')+'")';
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
                        <DestinationResortFilter cur_dest_page={cur_location} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BannerOverviewSection
