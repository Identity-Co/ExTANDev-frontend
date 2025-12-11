// React Imports
import React, { useState, useEffect } from 'react'

// Third-party Imports
import Slider from 'react-slick';
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import LikesShare from '@/views/shared/like-share-section/LikeShareSection'

const AdventureGuideDetail6 = ({ data, adventurePosts }: { data?: []; adventurePosts?: []; }) => {
  if(!adventurePosts.length)
    return false;
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate slidesToShow based on window width - same as your working code
  const getSlidesToShow = () => {
    if (windowWidth < 576) return 1;
    if (windowWidth < 1025) return 2;
    return 3;
  };

  const getDots = () => windowWidth < 1024;
  const getArrows = () => windowWidth >= 1024;

  const settings = {
    dots: getDots(),
    arrows: getArrows(),
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000, // Changed from 9000 to match your working code
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1
  };

  return (
    <section className={classnames(styles.home_section3, 'pb_150 home_section3')}>
        <div className={classnames('container')}>
            <div className={classnames(styles.head_text_center)}>
              {data?.adventure_slider_title && <h2 className="fs_55">{data?.adventure_slider_title}</h2>}
              <div dangerouslySetInnerHTML={{
                  __html: (data?.adventure_slider_description || ''),
              }}></div>
            </div>
            <div className={classnames(styles.network_travel)}>
              <Slider {...settings} className={classnames(styles.network_travel_slider, 'network_travel_slider')}>
                  {adventurePosts?.map((item, index) => (
                    <div key={index} className={classnames(styles.network_travel_box)}>
                      <div className={classnames(styles.network_travel_top)}>
                        <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href={`/our-adventures/${item?.slug?? ''}`} tabIndex="0"></a>
                        <div className={classnames(styles.network_travel_img)}>
                          {item.image && (<img src={item.image} alt={item.title} />)}
                        </div>
                        <div className={classnames(styles.network_travel_img_text)}>
                          {item.name && (<h3>{item.name}</h3>)}
                          <div className={classnames(styles.btn, 'btn')}>
                              <a href={`/our-adventures/${item?.slug?? ''}`}>View Trip</a>
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
                          { 1==2 && (<p>I've traveled a lot, but nothing compares to what I experienced through Adventure Network. </p>)}
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

export default AdventureGuideDetail6