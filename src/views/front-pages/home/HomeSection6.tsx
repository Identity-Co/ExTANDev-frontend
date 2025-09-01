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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 575);

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
    autoplaySpeed: 2000,
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
      }
    ]
  };

  const staticImgs = ['https://adventure.deepripple.com/images/front-pages/images/guide1.jpg', 'https://adventure.deepripple.com/images/front-pages/images/guide2.jpg', 'https://adventure.deepripple.com/images/front-pages/images/guide3.jpg', 'https://adventure.deepripple.com/images/front-pages/images/guide2.jpg']

  const staticLogos = ['https://adventure.deepripple.com/images/front-pages/images/bike.png', 'https://adventure.deepripple.com/images/front-pages/images/surfer-logo.png', 'https://adventure.deepripple.com/images/front-pages/images/powder-white-logo.png', 'https://adventure.deepripple.com/images/front-pages/images/surfer-logo.png']

  return (
    <section className={classnames(styles.home_section6, 'pb_150 home_section6')}>
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
                          {/*slide.image && (<img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${slide.image}`} alt={slide.title} />)*/}
                          {slide.image && (<img src={`${staticImgs[index]}`} alt={slide.title} />)}
                        </div>
                        <div className={classnames(styles.adv_guide_img_logo)}>
                          {/*slide.logo && (<img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${slide.logo}`} alt={slide.title} />)*/}
                          {slide.logo && (<img src={`${staticLogos[index]}`} alt={slide.title} />)}
                        </div>
                      </div>
                      <div className={classnames(styles.adv_guide_bottom)}>
                        <div className={classnames(styles.adv_guide_text)}>
                          {slide.title && (<h4>{slide.title}</h4>)}
                          {slide.description && (<p>{slide.description}</p>)}

                          {slide.button_text && slide.button_link && (
                            <div className={classnames(styles.btn, 'btn')}>
                              <a href={slide.button_link}>{slide.button_text}</a>
                            </div>
                          )}
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