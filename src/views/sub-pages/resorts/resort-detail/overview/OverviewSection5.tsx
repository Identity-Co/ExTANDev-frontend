// React Imports
import React, { useState, useEffect } from 'react'

// Third-party Imports
import Slider from 'react-slick';
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OverviewSection5 = ({ data }: { data?: []; }) => {
    if(!data)
        return

    const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    const truncateWords = (text, limit = 45) => {
      const words = text.split(" ");
      return words.slice(0, limit).join(" ") + (words.length > limit ? "..." : "");
    };

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
    <section className={classnames(styles.jade_jungle_sec4, 'py_150 jade_jungle_sec4')}>
        <div className="container">
            <h2 className="fs_55 center">Activities & Adventures</h2>
            <div className={classnames(styles.activities_adventures)}>
                <Slider {...settings} className={classnames(styles.activities_slider, 'activities_slider')}>
                    {data?.map((item, index) => (
                        <div key={`activity_${index}`} className={classnames(styles.property_info_box)}>
                            <div className={classnames(styles.property_info_inner)}>
                                <div className={classnames(styles.property_info_img)}>
                                    <img src={item?.image} alt={item?.name} />
                                </div>
                                <div className={classnames(styles.property_info_text)}>
                                    {item?.name && <h3 className="fs_35">{item?.name}</h3> }
                                    <p>{truncateWords(item?.description)}</p>
                                    <a className={classnames(styles.activities_read_more_btn)} href={`${process.env.NEXT_PUBLIC_APP_URL}/our-adventures/${item?.slug ?? ''}`}>Read More <svg xmlns="http://www.w3.org/2000/svg" width="14.085" height="8.943" viewBox="0 0 14.085 8.943">
                                    <path data-name="Path 461" d="M0,0V2.74L5.45,6.987,0,11.323v2.762L8.943,6.97Z" transform="translate(14.085) rotate(90)" fill="#237b81"/>
                                    </svg></a>
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

export default OverviewSection5