// React Imports
import React, { useState, useEffect, useCallback } from 'react'

import Slider from "react-slick";

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './styles.module.css'

import { getToursByIds, getActivitiesByIds } from '@/app/server/tours';
import { compressImage } from '@/app/server/image_compress';

import LikesShare from '@/views/shared/like-share-section/LikeShareSection'

// Nested slider component
type sectionProp = {
  sectionProps: {}
}

function truncateHTMLWords(html: string, limit = 50) {
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/);
  const truncated = words.slice(0, limit).join(' ');
  const result = words.length > limit ? `${truncated}…` : truncated;

  return result;
}

const getCompressedUrl = (src, width = 800, quality = 80) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/image_compress/compress?url=${encodeURIComponent(src)}&width=${width}&quality=${quality}&format=webp`;
};

const compressBatch = async (urls, options = {}) => {
  //setLoading(true);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/image_compress/compress/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls, options })
    });
    return await response.json();
  } finally {
    //setLoading(false);
  }
};

const transformToursWithCompressedImages = async (tours) => {
  const transformedTours = await Promise.all(
    tours.map(async (tour) => {
      const imageUrls = tour.details.gallery_images
        .slice(0, 5)
        .map(img => img.url);
      
      const compressedUrls = await compressBatch(imageUrls);
      
      return {
        ...tour,
        details: {
          ...tour.details,
          gallery_images: compressedUrls
        }
      };
    })
  );
  
  return transformedTours;
};


const InnerSlider = (images: string[]) => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getSlidesToShow = () => {
    //if (windowWidth < 575) return 1;
    if (windowWidth < 1025) return 2;
    return 3;
  };

  // States
  const Isettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    arrows: true,            // Show left/right arrows
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1
  };

  return (
    <Slider {...Isettings} className='mbe-6'>
      {images?.images
        ?.filter(item => item.type === "IMAGE")
        .slice(0, 4)
        .map((img, idx) => (
          <div key={idx} className={classnames(styles.adv_post_img_box)}>
            <div className={classnames(styles.post_api_img)}>
              <img
                //src={getCompressedUrl(img.url)}
                src={img.url}
                alt={`Slide ${idx + 1}`}
                width="350"
                height="350"
                loading="lazy"
              />
            </div>
          </div>
        ))}
    </Slider>
  );
};

const InstagramFeedSlider = ({ sectionProps }: sectionProp) => {
  const [toursData, settoursData] = useState<any>(null);

  const listsString = JSON.stringify(sectionProps?.lists ?? []);

  const fetchInitialData = useCallback(async () => {

    try {
      const toursList = await getToursByIds(sectionProps?.lists?? []);

      //sconst compressedData = await transformToursWithCompressedImages(toursList);

      /*const toursWithSimpleImageArrays = toursList.map(tour => ({
        ...tour,
        details: {
          ...tour.details,
          gallery_images: tour.details.gallery_images
            .slice(0, 5)
            .map(img => img.url) // Just the URL strings
        }
      }));*/
      
      if(toursList){
        settoursData(toursList)
      }

    } catch (error) {
      console.error('Error tours', error);
    } finally {
      //
    }
  }, [listsString]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  /*const [centerPadding, setCenterPadding] = useState("0px");

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
  }, []);*/

  // States

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getSlidesToShow = () => {
    if (windowWidth < 575) return 1;
    if (windowWidth < 1025) return 2;
    return 3;
  };

  const settings = {
    //centerMode: true,
    //centerPadding,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    pauseOnHover: true
  };

  const listItems = [];

  toursData?.map((fData, index) => {
    listItems.push(
      <div key={'slide-' + index} className={classnames(styles.adventure_post_box)}>
          <div className={classnames(styles.network_travel_bottom)}>
              <div className={classnames(styles.network_travel_profile)}>
                  <div className={classnames(styles.network_travel_picture)}>
                      {fData?.image && <img src={fData?.image}/> }
                  </div>
                  <div className={classnames(styles.adv_post_top_right)}>
                      <div className={classnames(styles.network_travel_profile_info)}>
                          {fData?.name && <h4>{fData?.name}</h4>}
                      </div>
                  </div>
              </div>
              <div className={classnames(styles.network_travel_text)}>
                  {fData?.description &&
                    <p
                      dangerouslySetInnerHTML={{ __html: truncateHTMLWords(fData?.description || '', 40) }}
                    />
                  }
                  <LikesShare collectionName='adventure_post' collectionID={fData?._id} />
              </div>
          </div>
          
          <div className={classnames(styles.adv_post_img_slide, 'adv_post_img_slide')}>
          
            <InnerSlider images={fData?.details?.gallery_images} />
            
          </div>
      </div>); // Remember to add a unique key prop
  })

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
