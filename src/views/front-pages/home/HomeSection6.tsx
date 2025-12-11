// React Imports
import React, { useState, useEffect } from 'react';

// Third-party Imports
import Slider from 'react-slick';
import classnames from 'classnames';

// Styles Imports
import styles from './styles.module.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeSection6 = ({ data, fieldNotes }: { data?: []; fieldNotes?: []; }) => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate slidesToShow based on window width
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
    autoplaySpeed: 2000,
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1
  };

  return (
    <section className={classnames(styles.home_section6, 'pb_150 pt_50 home_section6')}>
      <div className="container">
        <div className={classnames(styles.head_text_center)}>
          { data?.field_note_title && (<h2 className="fs_55">{data?.field_note_title}</h2>) }
        </div>

        {fieldNotes.length ? (
          <div className={classnames(styles.adv_guide)}>
            <Slider {...settings} className={classnames(styles.adv_guide_slider, 'adv_guide_slider')}>
              {fieldNotes?.map((slide, index) => (
                <div key={index}>
                    <div className={classnames(styles.adv_guide_box)}>
                      <div className={classnames(styles.adv_guide_top)}>
                        <div className={classnames(styles.adv_guide_img)}>
                          {slide.feature_image && (<img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${slide.feature_image}`} alt={slide.title} />)}
                        </div>
                        <div className={classnames(styles.adv_guide_img_logo)}>
                          {slide.site_logo && (<img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${slide.site_logo}`} alt={slide.title} />)}
                        </div>
                      </div>
                      <div className={classnames(styles.adv_guide_bottom)}>
                        <div className={classnames(styles.adv_guide_text)}>
                          {slide.title && (<h4>{slide.title}</h4>)}
                          {slide.excerpt && (<p>{slide.excerpt}</p>)}

                          <div className={classnames(styles.btn, 'btn')}>
                            <a href={`${process.env.NEXT_PUBLIC_APP_URL}/adventure-guide/${slide.page_url}`}>Read More</a>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default HomeSection6;