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

const BannerOverviewSection = ({ resortName, bannerData, bookingUrl, bookingDateFormat }: { resortName?: ''; bannerData?: []; bookingUrl?: ''; bookingDateFormat?: ''; }) => {
  const [tabValue, setTabValue] = useState(0);
  const slideref = useRef();

  const [season, setSeason] = useState(null);

  const [selectedSF, setSelectedSF] = useState("- Select -");

  const [openGust, setOpenGust] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState("1 Guest");

  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [isOpenDates, setIsOpenDates] = useState(false);

  const handleDateChange = (field, value) => {
    const newDateRange = {
      ...dateRange,
      [field]: value
    };
    
    // Ensure end date is after start date
    if (field === 'start' && newDateRange.end && new Date(value) >= new Date(newDateRange.end)) {
      const nextDay = new Date(value);
      nextDay.setDate(nextDay.getDate() + 1);
      newDateRange.end = nextDay.toISOString().split('T')[0];
    }
    
    setDateRange(newDateRange);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Function to format date for booking URL (YYYY-MM-DD)
  const formatDateForBooking = (dateString, bookingDateFormat = 'YYYY-MM-DD') => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return '';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const monthShort = date.toLocaleString('default', { month: 'short' });
    const monthFull = date.toLocaleString('default', { month: 'long' });
    
    // Map format patterns to their values
    const formatMap = {
        'YYYY': year,
        'YY': String(year).slice(-2),
        'MM': month,
        'M': String(date.getMonth() + 1),
        'DD': day,
        'D': String(date.getDate()),
        'Mon': monthShort,
        'Month': monthFull,
    };
    
    // Replace format patterns with actual values
    let formattedDate = bookingDateFormat;
    
    // Replace all format patterns
    Object.keys(formatMap).forEach(pattern => {
        formattedDate = formattedDate.replace(new RegExp(pattern, 'g'), formatMap[pattern]);
    });
    
    return encodeURIComponent(formattedDate);
  };

  const togglePicker = () => {
    setIsOpenDates(!isOpenDates);
    setOpenGust(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(bannerData);
  };

  const getBookingUrl = () => {
    if (!dateRange.start || !dateRange.end) {
      return '#';
    }
    
    // Format dates for booking URL
    const checkinDate = formatDateForBooking(dateRange.start, bookingDateFormat);
    const checkoutDate = formatDateForBooking(dateRange.end, bookingDateFormat);
    
    // Get the booking URL and replace placeholders
    const bookingUrlTemplate = bookingUrl || '/';
    const finalUrl = bookingUrlTemplate
      .replace('DTCHECKIN', checkinDate)
      .replace('DTCHECKOUT', checkoutDate)
      .replace('DTGUESTS', selectedGuests);
    
    return finalUrl;
  };

  // Handle Book Now link click
  const handleBookNowClick = (e) => {
    if (!dateRange.start || !dateRange.end) {
      e.preventDefault();
      alert("Please select check-in and check-out dates");
      return;
    }

    setIsOpenDates(false);
    setOpenGust(false);
    
    // Link will open in new tab (target="_blank" handles this)
    // No need for additional logic here
  };
  
  useEffect(() => {
    const slides = document.querySelectorAll('.hero_slide_box');
    
    slides.forEach((slide) => {
      const backgroundImage = slide.style.backgroundImage;
      if (!backgroundImage || backgroundImage != slide.getAttribute('databackground')) {
        slide.style.backgroundImage = 'url("'+slide.getAttribute('databackground')+'")';
      }
    });
  }, [bannerData]);

    const season_opt = [
        {item: "1 Guest", icon: '/images/svg/guest.svg'}, 
        {item: "2 Guests", icon: '/images/svg/guest.svg'}, 
        {item: "3 Guests", icon: '/images/svg/guest.svg'}, 
        {item: "4 Guests", icon: '/images/svg/guest.svg'},
        {item: "5 Guests", icon: '/images/svg/guest.svg'},
        {item: "6 Guests", icon: '/images/svg/guest.svg'}
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
    <div className={classnames(styles.home_banner, styles.destination_overview_banner, styles.jade_jungle_banner, 'home_banner')}>
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
                            {resortName && <h1>{resortName}</h1>}
                            <div className={classnames(styles.banner_content)} dangerouslySetInnerHTML={{
                                  __html: (item?.content || ''),
                                }}>
                            </div>
                        </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
        </div>
        <div className={classnames(styles.search_box, styles.resort_search_box)}>
            <div className={classnames(styles.container, 'container')}>
                <div className={classnames(styles.search_box_inner)}>
                    <div className={classnames(styles.search_row)}>
                        <form>                            
                            <div className={classnames(styles.search_select, styles.ss1)}>
                              <div className={classnames(styles.date_range_container)}>
                                <div className={classnames(styles.date_range_field)} onClick={togglePicker}>
                                  <div className={classnames(styles.date_range_display, 'select-selected')}>
                                    <div className="calendar-icon">
                                      <img src="/images/svg/calendar-days.svg" alt=""  />
                                    </div>
                                    <div className={classnames(styles.date_segment, styles.check_in)}>
                                      <div className={classnames(styles.date_value)}>{dateRange.start ? formatDate(dateRange.start) : 'Check-in'}</div>
                                    </div>
                                    
                                    <div className={classnames(styles.date_segment)}>
                                      <div className={classnames(styles.arrow)}><img src="/images/svg/right-arrow.svg" alt=""  /></div>
                                    </div>
                                    
                                    <div className={classnames(styles.date_segment, styles.check_out)}>
                                      <div className={classnames(styles.date_value)}>{dateRange.end ? formatDate(dateRange.end) : 'Check-out'}</div>
                                    </div>
                                  </div>
                                </div>

                                {isOpenDates && (
                                  <div className={classnames(styles.date_picker_popup)}>                                      
                                    <div className={classnames(styles.dates_grid)}>
                                      {/* Calendar would go here */}
                                      <div className={classnames(styles.picker_content)}>
                                        <div className={classnames(styles.date_inputs_row)}>
                                          <div className={classnames(styles.single_date_input)}>
                                            <label>Check-in</label>
                                            <input
                                              type="date"
                                              value={dateRange.start}
                                              onChange={(e) => handleDateChange('start', e.target.value)}
                                              min={new Date().toISOString().split('T')[0]}
                                              className={classnames(styles.popup_date_input)}
                                            />
                                          </div>
                                          
                                          <div className={classnames(styles.single_date_input)}>
                                            <label>Check-out</label>
                                            <input
                                              type="date"
                                              value={dateRange.end}
                                              onChange={(e) => handleDateChange('end', e.target.value)}
                                              min={dateRange.start || new Date().toISOString().split('T')[0]}
                                              className={classnames(styles.popup_date_input)}
                                            />
                                          </div>
                                        </div>
                                        
                                        <div className={classnames(styles.picker_actions, 'btn')}>
                                          <button type="button" onClick={() => setIsOpenDates(false)}>
                                            Close
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={classnames(styles.search_select, styles.ss2)}>
                                <div className={`custom-select ${openGust ? 'active' : ''}`}>
                                    <div 
                                      className="select-selected"
                                      onClick={() => {setOpenGust(!openGust); setIsOpenDates(false)}}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <div>
                                        <span className="select-icn">
                                          <img src="/images/svg/guest.svg" alt=""  />
                                        </span>
                                        <span>{selectedGuests}</span>
                                      </div>

                                      <img
                                        src="/images/svg/down-arrow.svg"
                                        alt=""
                                        style={{
                                          transform: openGust ? "rotate(180deg)" : "rotate(0deg)",
                                          transition: "0.2s",
                                        }}
                                      />
                                    </div>

                                    {openGust && (
                                      <div className="select-items">
                                        {season_opt.map((ss, index) => (
                                          <div
                                            key={index}
                                            onClick={() => {
                                              setSelectedGuests(ss.item);
                                              setSeason(ss.item)
                                              setOpenGust(false);
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
                                <a 
                                  href={getBookingUrl()} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={handleBookNowClick}
                                  className={classnames(styles.book_now_link)}
                                >
                                  Book Now
                                </a>
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