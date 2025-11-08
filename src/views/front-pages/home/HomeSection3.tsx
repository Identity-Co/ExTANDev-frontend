// React Imports
import React, { useState, useEffect } from 'react'

// Third-party Imports
import Slider from 'react-slick';
import classnames from 'classnames'

//import type { TrackDetails } from 'keen-slider/react'
//import { useKeenSlider } from 'keen-slider/react'

// Styled Component Imports
//import AppKeenSlider from '@/libs/styles/AppKeenSlider'

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import LikesShare from '@/views/shared/like-share-section/LikeShareSection'

const HomeSection3 = ({ adventurePosts }: { adventurePosts?: []; }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 575);
    };

    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: isMobile,
    arrows: !isMobile,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 9000,
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
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <section className={classnames(styles.home_section3, 'py_150 home_section3')}>
        <div className={classnames('container')}>
            <div className={classnames(styles.head_text_center)}>
              <h2 className="fs_55">Adventure Is Calling — Are You Ready?</h2>
              <p><span className="extra_bold"><em>Adventure Network travel tours take you beyond the beaten path—</em></span>From jungle treks to hidden surf breaks, each trip is packed with adrenaline, discovery, and unforgettable moments far from the tourist trail.</p>
            </div>
            <div className={classnames(styles.network_travel)}>
              <Slider {...settings} className={classnames(styles.network_travel_slider, 'network_travel_slider')}>
                  {adventurePosts?.map((item, index) => (
                    <div key={index} className={classnames(styles.network_travel_box)}>
                      <div className={classnames(styles.network_travel_top)}>
                        <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href={`/our-adventure/${item?.slug?? ''}`} tabIndex="0"></a>
                        <div className={classnames(styles.network_travel_img)}>
                          {item.image && (<img src={item.image} alt={item.title} />)}
                        </div>
                        <div className={classnames(styles.network_travel_img_text)}>
                          {item.name && (<h3>{item.name}</h3>)}
                          <div className={classnames(styles.btn, 'btn')}>
                              <a href={`/our-adventure/${item?.slug?? ''}`}>View Trip</a>
                          </div>
                        </div>
                      </div>
                      <div className={classnames(styles.network_travel_bottom)}>
                        { 1==2 && (<div className={classnames(styles.network_travel_profile)}>
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
                        </div> )}
                        <div className={classnames(styles.network_travel_text)}>
                          { 1==2 && (<p>I’ve traveled a lot, but nothing compares to what I experienced through Adventure Network. </p>)}
                          <LikesShare collectionName='adventure_post' collectionID={item?._id} />
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
            </div>
        </div>
    </section>
  )
}

export default HomeSection3
