// React Imports
import React, { useState, useEffect } from 'react'

import Slider from "react-slick";

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './styles.module.css'

// Nested slider component
type sectionProp = {
  sectionProps: {}
}

const InnerSlider = () => {
  // States
  const Isettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    arrows: true,            // Show left/right arrows
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        }
      },
    ]
  };

  return (
    <Slider {...Isettings} className='mbe-6'>
      {[1, 2, 3, 4].map((img, idx) => (
        <div key={idx} className={classnames(styles.adv_post_img_box)}>
          <div className={classnames(styles.post_api_img)}>
            <img
              src={`/images/front-pages/images/jungle-climb-guy${img === 1 ? '' : img}.jpg`}
              alt={`Slide ${img}`}
            />
          </div>
        </div>
      ))}
    </Slider>
  );
};

const InstagramFeedSlider = ({ sectionProps }: sectionProp) => {

  const [centerPadding, setCenterPadding] = useState("0px");

  useEffect(() => {
    function updatePadding() {
    if (window.innerWidth < 768) {
        const pxValue = 16.89 * (window.innerWidth * 0.01); // 29vw in px
        
        setCenterPadding(`${pxValue}px`);
      } else {
        const pxValue = 24.89 * (window.innerWidth * 0.01); // 29vw in px
        
        setCenterPadding(`${pxValue}px`);
      }
    }

    updatePadding();
    window.addEventListener("resize", updatePadding);
    
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  // States
  const settings = {
    centerMode: true,
    centerPadding,
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          //centerPadding: "150px",
        }
      },
      {
        breakpoint: 575,
        settings: {
          //centerPadding: "60px",
        }
      },
    ]
  };

  const listItems = [];

  for (let i = 0; i < 4; i++) {
    listItems.push(
      <div key={'slide-' + i} className={classnames(styles.adventure_post_box)}>
          <div className={classnames(styles.network_travel_bottom)}>
              <div className={classnames(styles.network_travel_profile)}>
                  <div className={classnames(styles.network_travel_picture)}>
                      <img src="/images/front-pages/images/network-travel-picture1.jpg"/>
                  </div>
                  <div className={classnames(styles.adv_post_top_right)}>
                      <div className={classnames(styles.network_travel_profile_info)}>
                          <h4>Adventure Jack</h4>
                          <span>@adventurejack</span>
                      </div>
                      <div className={classnames(styles.network_travel_follow)}>
                          <span>•</span>
                          <a href="#" tabIndex={-1}>FOLLOW</a>
                      </div>
                      <div className={classnames(styles.adv_trailblazer)}>
                          <span>ADVENTURE NETWORK trailblazer</span>
                      </div>
                  </div>
              </div>
              <div className={classnames(styles.network_travel_text)}>
                  <p><span className="extra_bold"><em>I’ve traveled a lot, but nothing compares to what I experienced through Adventure Network.</em></span> The destinations were jaw-dropping, the people were incredible, and the adventures were the kind that stick with you long after you’re home. It felt less like a trip—and more like being part of something bigger.</p>
                  <div className={classnames(styles.network_travel_likes)}>
                      <span>3w</span>
                      <span>45 likes</span>
                      <span>Reply</span>
                      <ul>
                          <li><a href="#" tabIndex={-1}><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                            <path id="" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"></path>
                          </svg>
                          </a></li>
                          <li><a href="#" tabIndex={-1}><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                            <path id="" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"></path>
                          </svg>
                          </a></li>
                          <li><a href="#" tabIndex={-1}><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                            <path id="" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"></path>
                          </svg>
                          </a></li>
                          <li><a href="#" tabIndex={-1}><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
                            <g id="" data-name="Group 876" transform="translate(18.256 -130.131)">
                              <path id="" data-name="Path 798" d="M32.689.03l-9.3,5.4-5.5-5.4Z" transform="translate(-36.143 130.1)" fill="#696767"></path>
                              <path id="" data-name="Path 799" d="M28.752.25l-7.4,12.794-2.072-7.29Z" transform="translate(-31.551 130.822)" fill="#696767"></path>
                            </g>
                          </svg>
                          </a></li>
                      </ul>
                  </div>
              </div>
          </div>
          
          <div className={classnames(styles.adv_post_img_slide, 'adv_post_img_slide')}>
          
            <InnerSlider />
            
          </div>
      </div>); // Remember to add a unique key prop
  }

  return (
    <section className={classnames(styles.home_section5, (sectionProps && sectionProps.class) && sectionProps.class)}>
      <div className={classnames(styles.adventure_post)}>
        
            <Slider {...settings} className={classnames(styles.adventure_post_slide, 'adventure_post_slide')}>
              {listItems}
            </Slider>
        
      </div>
    </section>
  )
}

export default InstagramFeedSlider
