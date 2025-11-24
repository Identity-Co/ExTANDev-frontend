// React Imports
import { useState} from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// Third-party Imports
import Slider from 'react-slick';
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TotalTravelSection1 = () => {

    const [expanded, setExpanded] = useState<string | false>(false)

    const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 6000,
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

      const slides = [
        {
          image: "/images/sub-pages/str1.jpg",
        },
        {
          image: "/images/sub-pages/str2.jpg",
        },
        {
          image: "/images/sub-pages/str3.jpg",
        },
        {
          image: "/images/sub-pages/str2.jpg",
        }
      ];

    return (
        <section className={classnames(styles.faq_section, styles.our_desti_sec2, styles.destination_stories_sec1, "pb_150")}>
            <div className="container">
                <div className={classnames(styles.faq, styles.travel_stories_faq, 'travel_stories_faq')}>
                    <div className={classnames(styles.faq_box)}>
                        <Accordion expanded={expanded === '1' ? true : false} onChange={handleChange('1')}>
                                <AccordionSummary 
                                    id='panel-header-1'
                                    aria-controls='panel-content-1'
                                    sx={{ padding: 0, '& .MuiAccordionSummary-expandIconWrapper': { display: 'none'} }}
                                    >
                                    <div className={classnames(styles.question, (expanded === '1' ? styles.open : ''))}>
                                        <div className={classnames(styles.network_travel_profile)}>
                                            <div className={classnames(styles.network_travel_picture)}>
                                                <img src="/images/sub-pages/jungle-jill.jpg" />
                                            </div>
                                            <div className={classnames(styles.adv_post_top_right)}>
                                                <div className={classnames(styles.network_travel_profile_info)}>
                                                    <div className={classnames(styles.network_travel_profile_info_inner)}>
                                                        <h4>Jungle Jill</h4>
                                                        <div className={classnames(styles.network_travel_follow)}>
                                                            <span>•</span>
                                                            <a href="#" tabIndex="-1">FOLLOW</a>
                                                        </div>
                                                    </div>
                                                    <span>@junglejilltraveler</span>
                                                </div>
                                                <div className={classnames(styles.adv_trailblazer)}>
                                                    <span>August 30, 2025</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={classnames(styles.more_btn)}>
                                            <a>More <svg xmlns="http://www.w3.org/2000/svg" width="14.353" height="9.113" viewBox="0 0 14.353 9.113">
                                              <path id="Path_793" data-name="Path 793" d="M0,0V2.792L5.553,7.12,0,11.538v2.814L9.113,7.1Z" transform="translate(14.353) rotate(90)" fill="#fff" opacity="0.985"/>
                                            </svg></a>
                                        </div>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className={classnames(styles.answercont)}>
                                        <div className={classnames(styles.answer)}>
                                            <div className={classnames(styles.storie_location)}>
                                                <img src="/images/sub-pages/black-map.svg" />
                                                <span>Jarabacoa Hike 2025</span>
                                            </div>
                                            <div className={classnames(styles.storie_content)}>
                                                <p><span className="extra_bold"><em>We set out just after sunrise, the mountain air still cool as we climbed into the hills above Jarabacoa.</em></span> Our guide, Carlos, led the way—part storyteller, part mountain goat—as we hiked through cloud forests thick with pine and orchids. By mid-morning, we were waist-deep in the Río Jimenoa, wading through crystal-clear pools and scrambling over slick rocks on our way to a hidden waterfall that felt straight out of a movie. No crowds, no signs—just us and the roar of water crashing down into a turquoise basin. We jumped in, laughing like kids, adrenaline still buzzing from the canyon rappel we’d done an hour before.</p>
                                            </div>
                                            <Slider {...settings} className={classnames(styles.adv_post_img_slide, 'adv_post_img_slide')}>
                                                {slides.map((slide, index) => (
                                                    <div key={index}>
                                                        <div className={classnames(styles.adv_post_img_box)}>
                                                            <div className={classnames(styles.post_api_img)}>
                                                                <img src={slide.image} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </Slider>
                                            <div className={classnames(styles.network_travel_likes)}>
                                                <span>22 comments</span>
                                                <span>45 likes</span>
                                                <span>Reply</span>
                                                <ul>
                                                    <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                                      <path id="" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"></path>
                                                    </svg>
                                                    </a></li>
                                                    <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                                      <path id="" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"></path>
                                                    </svg>
                                                    </a></li>
                                                    <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                                      <path id="" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"></path>
                                                    </svg>
                                                    </a></li>
                                                    <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
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
                                </AccordionDetails>
                        </Accordion>
                    </div>
                    <div className={classnames(styles.faq_box)}>
                        <Accordion expanded={expanded === '2' ? true : false} onChange={handleChange('2')}>
                            <AccordionSummary 
                                    id='panel-header-2'
                                    aria-controls='panel-content-2'
                                    sx={{ padding: 0, '& .MuiAccordionSummary-expandIconWrapper': { display: 'none'} }}
                                    >
                                <div className={classnames(styles.question, (expanded === '2' ? styles.open : ''))}>
                                    <div className={classnames(styles.network_travel_profile)}>
                                        <div className={classnames(styles.network_travel_picture)}>
                                            <img src="/images/sub-pages/jungle-jill1.jpg" />
                                        </div>
                                        <div className={classnames(styles.adv_post_top_right)}>
                                            <div className={classnames(styles.network_travel_profile_info)}>
                                                <div className={classnames(styles.network_travel_profile_info_inner)}>
                                                    <h4>Travel master</h4>
                                                    <div className={classnames(styles.network_travel_follow)}>
                                                        <span>•</span>
                                                        <a href="#" tabIndex="-1">FOLLOW</a>
                                                    </div>
                                                </div>
                                                <span>@travelmasteradventures</span>
                                            </div>
                                            <div className={classnames(styles.adv_trailblazer)}>
                                                <span>August 30, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classnames(styles.more_btn)}>
                                        <a>More <svg xmlns="http://www.w3.org/2000/svg" width="14.353" height="9.113" viewBox="0 0 14.353 9.113">
                                          <path id="Path_793" data-name="Path 793" d="M0,0V2.792L5.553,7.12,0,11.538v2.814L9.113,7.1Z" transform="translate(14.353) rotate(90)" fill="#fff" opacity="0.985"/>
                                        </svg></a>
                                    </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={classnames(styles.answercont)}>
                                    <div className={classnames(styles.answer)}>
                                        <div className={classnames(styles.storie_location)}>
                                            <img src="/images/sub-pages/black-map.svg" />
                                            <span>Jarabacoa Hike 2025</span>
                                        </div>
                                        <div className={classnames(styles.storie_content)}>
                                            <p><span className="extra_bold"><em>We set out just after sunrise, the mountain air still cool as we climbed into the hills above Jarabacoa.</em></span> Our guide, Carlos, led the way—part storyteller, part mountain goat—as we hiked through cloud forests thick with pine and orchids. By mid-morning, we were waist-deep in the Río Jimenoa, wading through crystal-clear pools and scrambling over slick rocks on our way to a hidden waterfall that felt straight out of a movie. No crowds, no signs—just us and the roar of water crashing down into a turquoise basin. We jumped in, laughing like kids, adrenaline still buzzing from the canyon rappel we’d done an hour before.</p>
                                        </div>
                                        <Slider {...settings} className={classnames(styles.adv_post_img_slide, 'adv_post_img_slide')}>
                                            {slides.map((slide, index) => (
                                                <div key={index}>
                                                    <div className={classnames(styles.adv_post_img_box)}>
                                                        <div className={classnames(styles.post_api_img)}>
                                                            <img src={slide.image} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                        <div className={classnames(styles.network_travel_likes)}>
                                            <span>22 comments</span>
                                            <span>45 likes</span>
                                            <span>Reply</span>
                                            <ul>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                                  <path id="" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                                  <path id="" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                                  <path id="" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
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
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <div className={classnames(styles.faq_box)}>
                        <Accordion expanded={expanded === '3' ? true : false} onChange={handleChange('3')}>
                            <AccordionSummary 
                                    id='panel-header-3'
                                    aria-controls='panel-content-3'
                                    sx={{ padding: 0, '& .MuiAccordionSummary-expandIconWrapper': { display: 'none'} }}
                                    >
                                <div className={classnames(styles.question, (expanded === '3' ? styles.open : ''))}>
                                <div className={classnames(styles.network_travel_profile)}>
                                    <div className={classnames(styles.network_travel_picture)}>
                                        <img src="/images/sub-pages/jungle-jill2.jpg" />
                                    </div>
                                    <div className={classnames(styles.adv_post_top_right)}>
                                        <div className={classnames(styles.network_travel_profile_info)}>
                                            <div className={classnames(styles.network_travel_profile_info_inner)}>
                                                <h4>Akashi</h4>
                                                <div className={classnames(styles.network_travel_follow)}>
                                                    <span>•</span>
                                                    <a href="#" tabIndex="-1">FOLLOW</a>
                                                </div>
                                            </div>
                                            <span>@akashitraveler</span>
                                        </div>
                                        <div className={classnames(styles.adv_trailblazer)}>
                                            <span>August 30, 2025</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={classnames(styles.more_btn)}>
                                    <a>More <svg xmlns="http://www.w3.org/2000/svg" width="14.353" height="9.113" viewBox="0 0 14.353 9.113">
                                      <path id="Path_793" data-name="Path 793" d="M0,0V2.792L5.553,7.12,0,11.538v2.814L9.113,7.1Z" transform="translate(14.353) rotate(90)" fill="#fff" opacity="0.985"/>
                                    </svg></a>
                                </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={classnames(styles.answercont)}>
                                    <div className={classnames(styles.answer)}>
                                        <div className={classnames(styles.storie_location)}>
                                            <img src="/images/sub-pages/black-map.svg" />
                                            <span>Jarabacoa Hike 2025</span>
                                        </div>
                                        <div className={classnames(styles.storie_content)}>
                                            <p><span className="extra_bold"><em>We set out just after sunrise, the mountain air still cool as we climbed into the hills above Jarabacoa.</em></span> Our guide, Carlos, led the way—part storyteller, part mountain goat—as we hiked through cloud forests thick with pine and orchids. By mid-morning, we were waist-deep in the Río Jimenoa, wading through crystal-clear pools and scrambling over slick rocks on our way to a hidden waterfall that felt straight out of a movie. No crowds, no signs—just us and the roar of water crashing down into a turquoise basin. We jumped in, laughing like kids, adrenaline still buzzing from the canyon rappel we’d done an hour before.</p>
                                        </div>
                                        <Slider {...settings} className={classnames(styles.adv_post_img_slide, 'adv_post_img_slide')}>
                                            {slides.map((slide, index) => (
                                                <div key={index}>
                                                    <div className={classnames(styles.adv_post_img_box)}>
                                                        <div className={classnames(styles.post_api_img)}>
                                                            <img src={slide.image} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                        <div className={classnames(styles.network_travel_likes)}>
                                            <span>22 comments</span>
                                            <span>45 likes</span>
                                            <span>Reply</span>
                                            <ul>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                                  <path id="" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                                  <path id="" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                                  <path id="" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
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
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <div className={classnames(styles.faq_box)}>
                        <Accordion expanded={expanded === '4' ? true : false} onChange={handleChange('4')}>
                            <AccordionSummary 
                                    id='panel-header-4'
                                    aria-controls='panel-content-4'
                                    sx={{ padding: 0, '& .MuiAccordionSummary-expandIconWrapper': { display: 'none'} }}
                                    >
                                <div className={classnames(styles.question, (expanded === '4' ? styles.open : ''))}>
                                    <div className={classnames(styles.network_travel_profile)}>
                                        <div className={classnames(styles.network_travel_picture)}>
                                            <img src="/images/sub-pages/jungle-jill3.jpg" />
                                        </div>
                                        <div className={classnames(styles.adv_post_top_right)}>
                                            <div className={classnames(styles.network_travel_profile_info)}>
                                                <div className={classnames(styles.network_travel_profile_info_inner)}>
                                                    <h4>Slick rick</h4>
                                                    <div className={classnames(styles.network_travel_follow)}>
                                                        <span>•</span>
                                                        <a href="#" tabIndex="-1">FOLLOW</a>
                                                    </div>
                                                </div>
                                                <span>@slickricktraveler</span>
                                            </div>
                                            <div className={classnames(styles.adv_trailblazer)}>
                                                <span>August 30, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classnames(styles.more_btn)}>
                                        <a>More <svg xmlns="http://www.w3.org/2000/svg" width="14.353" height="9.113" viewBox="0 0 14.353 9.113">
                                          <path id="Path_793" data-name="Path 793" d="M0,0V2.792L5.553,7.12,0,11.538v2.814L9.113,7.1Z" transform="translate(14.353) rotate(90)" fill="#fff" opacity="0.985"/>
                                        </svg></a>
                                    </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={classnames(styles.answercont)}>
                                    <div className={classnames(styles.answer)}>
                                        <div className={classnames(styles.storie_location)}>
                                            <img src="/images/sub-pages/black-map.svg" />
                                            <span>Jarabacoa Hike 2025</span>
                                        </div>
                                        <div className={classnames(styles.storie_content)}>
                                            <p><span className="extra_bold"><em>We set out just after sunrise, the mountain air still cool as we climbed into the hills above Jarabacoa.</em></span> Our guide, Carlos, led the way—part storyteller, part mountain goat—as we hiked through cloud forests thick with pine and orchids. By mid-morning, we were waist-deep in the Río Jimenoa, wading through crystal-clear pools and scrambling over slick rocks on our way to a hidden waterfall that felt straight out of a movie. No crowds, no signs—just us and the roar of water crashing down into a turquoise basin. We jumped in, laughing like kids, adrenaline still buzzing from the canyon rappel we’d done an hour before.</p>
                                        </div>
                                        <Slider {...settings} className={classnames(styles.adv_post_img_slide, 'adv_post_img_slide')}>
                                            {slides.map((slide, index) => (
                                                <div key={index}>
                                                    <div className={classnames(styles.adv_post_img_box)}>
                                                        <div className={classnames(styles.post_api_img)}>
                                                            <img src={slide.image} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                        <div className={classnames(styles.network_travel_likes)}>
                                            <span>22 comments</span>
                                            <span>45 likes</span>
                                            <span>Reply</span>
                                            <ul>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                                  <path id="" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                                  <path id="" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                                  <path id="" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
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
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
                <div className={classnames(styles.travel_stories_info)}>
                    <div className="grid2 gap_40">
                        <div className={classnames(styles.grid_box)}>
                            <div className={classnames(styles.storie_infobox, 'bx_sd')}>
                                <div className={classnames(styles.storie_info_image)}>
                                    <img src="/images/sub-pages/storie1.jpg" />
                                </div>
                                <div className={classnames(styles.storie_info_content, styles.travel_stories_faq, 'travel_stories_faq')}>
                                    <div className={classnames(styles.network_travel_profile)}>
                                        <div className={classnames(styles.network_travel_picture)}>
                                            <img src="/images/sub-pages/storie-info1.jpg" />
                                        </div>
                                        <div className={classnames(styles.adv_post_top_right)}>
                                            <div className={classnames(styles.network_travel_profile_info)}>
                                                <div className={classnames(styles.network_travel_profile_info_inner)}>
                                                    <h4>Mikey February </h4>
                                                    <div className={classnames(styles.network_travel_follow)}>
                                                        <span>•</span>
                                                        <a href="#" tabIndex="-1">FOLLOW</a>
                                                    </div>
                                                </div>
                                                <span>@mikeyfebruarysurfs</span>
                                            </div>
                                            <div className={classnames(styles.adv_trailblazer)}>
                                                <span>September 3, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                    <h3>Surfing the Wild Side of South Africa</h3>
                                    <p>Hidden breaks, warm waves, and wild coastlines—J-Bay delivers the ride of a lifetime…</p>
                                    <div className={classnames(styles.more_btn)}>
                                        <a href="#">Continue reading <svg xmlns="http://www.w3.org/2000/svg" width="14.353" height="9.113" viewBox="0 0 14.353 9.113">
                                          <path id="Path_793" data-name="Path 793" d="M0,0V2.792L5.553,7.12,0,11.538v2.814L9.113,7.1Z" transform="translate(14.353) rotate(90)" fill="#fff" opacity="0.985"></path>
                                        </svg></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={classnames(styles.grid_box)}>
                            <div className={classnames(styles.storie_infobox, 'bx_sd')}>
                                <div className={classnames(styles.storie_info_image)}>
                                    <img src="/images/sub-pages/storie2.jpg" />
                                </div>
                                <div className={classnames(styles.storie_info_content, styles.travel_stories_faq, 'travel_stories_faq')}>
                                    <div className={classnames(styles.network_travel_profile)}>
                                        <div className={classnames(styles.network_travel_picture)}>
                                            <img src="/images/sub-pages/storie-info2.jpg" />
                                        </div>
                                        <div className={classnames(styles.adv_post_top_right)}>
                                            <div className={classnames(styles.network_travel_profile_info)}>
                                                <div className={classnames(styles.network_travel_profile_info_inner)}>
                                                    <h4>Garrett chow</h4>
                                                    <div className={classnames(styles.network_travel_follow)}>
                                                        <span>•</span>
                                                        <a href="#" tabIndex="-1">FOLLOW</a>
                                                    </div>
                                                </div>
                                                <span>@garrett_chow</span>
                                            </div>
                                            <div className={classnames(styles.adv_trailblazer)}>
                                                <span>December 11, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                    <h3>Mountain Trails, Colombia jungle Thrills</h3>
                                    <p>Colombia offers epic rides with serious altitude and unforgettable views.…</p>
                                    <div className={classnames(styles.more_btn)}>
                                        <a href="#">Continue reading <svg xmlns="http://www.w3.org/2000/svg" width="14.353" height="9.113" viewBox="0 0 14.353 9.113">
                                          <path id="Path_793" data-name="Path 793" d="M0,0V2.792L5.553,7.12,0,11.538v2.814L9.113,7.1Z" transform="translate(14.353) rotate(90)" fill="#fff" opacity="0.985"></path>
                                        </svg></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.faq, styles.travel_stories_faq, 'travel_stories_faq')}>
                    <div className={classnames(styles.faq_box)}>
                        <Accordion expanded={expanded === '5' ? true : false} onChange={handleChange('5')}>
                            <AccordionSummary 
                                    id='panel-header-5'
                                    aria-controls='panel-content-5'
                                    sx={{ padding: 0, '& .MuiAccordionSummary-expandIconWrapper': { display: 'none'} }}
                                    >
                                <div className={classnames(styles.question, (expanded === '5' ? styles.open : ''))}>
                                    <div className={classnames(styles.network_travel_profile)}>
                                        <div className={classnames(styles.network_travel_picture)}>
                                            <img src="/images/sub-pages/jungle-jill1.jpg" />
                                        </div>
                                        <div className={classnames(styles.adv_post_top_right)}>
                                            <div className={classnames(styles.network_travel_profile_info)}>
                                                <div className={classnames(styles.network_travel_profile_info_inner)}>
                                                    <h4>Travel master</h4>
                                                    <div className={classnames(styles.network_travel_follow)}>
                                                        <span>•</span>
                                                        <a href="#" tabIndex="-1">FOLLOW</a>
                                                    </div>
                                                </div>
                                                <span>@travelmasteradventures</span>
                                            </div>
                                            <div className={classnames(styles.adv_trailblazer)}>
                                                <span>August 30, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classnames(styles.more_btn)}>
                                        <a>More <svg xmlns="http://www.w3.org/2000/svg" width="14.353" height="9.113" viewBox="0 0 14.353 9.113">
                                          <path id="Path_793" data-name="Path 793" d="M0,0V2.792L5.553,7.12,0,11.538v2.814L9.113,7.1Z" transform="translate(14.353) rotate(90)" fill="#fff" opacity="0.985"/>
                                        </svg></a>
                                    </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={classnames(styles.answercont)}>
                                    <div className={classnames(styles.answer)}>
                                        <div className={classnames(styles.storie_location)}>
                                            <img src="/images/sub-pages/black-map.svg" />
                                            <span>Jarabacoa Hike 2025</span>
                                        </div>
                                        <div className={classnames(styles.storie_content)}>
                                            <p><span className="extra_bold"><em>We set out just after sunrise, the mountain air still cool as we climbed into the hills above Jarabacoa.</em></span> Our guide, Carlos, led the way—part storyteller, part mountain goat—as we hiked through cloud forests thick with pine and orchids. By mid-morning, we were waist-deep in the Río Jimenoa, wading through crystal-clear pools and scrambling over slick rocks on our way to a hidden waterfall that felt straight out of a movie. No crowds, no signs—just us and the roar of water crashing down into a turquoise basin. We jumped in, laughing like kids, adrenaline still buzzing from the canyon rappel we’d done an hour before.</p>
                                        </div>
                                        <Slider {...settings} className={classnames(styles.adv_post_img_slide, 'adv_post_img_slide')}>
                                            {slides.map((slide, index) => (
                                                <div key={index}>
                                                    <div className={classnames(styles.adv_post_img_box)}>
                                                        <div className={classnames(styles.post_api_img)}>
                                                            <img src={slide.image} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                        <div className={classnames(styles.network_travel_likes)}>
                                            <span>22 comments</span>
                                            <span>45 likes</span>
                                            <span>Reply</span>
                                            <ul>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                                  <path id="" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                                  <path id="" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                                  <path id="" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
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
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <div className={classnames(styles.faq_box)}>
                        <Accordion expanded={expanded === '6' ? true : false} onChange={handleChange('6')}>
                            <AccordionSummary 
                                    id='panel-header-6'
                                    aria-controls='panel-content-6'
                                    sx={{ padding: 0, '& .MuiAccordionSummary-expandIconWrapper': { display: 'none'} }}
                                    >
                                <div className={classnames(styles.question, (expanded === '6' ? styles.open : ''))}>
                                    <div className={classnames(styles.network_travel_profile)}>
                                        <div className={classnames(styles.network_travel_picture)}>
                                            <img src="/images/sub-pages/jungle-jill2.jpg" />
                                        </div>
                                        <div className={classnames(styles.adv_post_top_right)}>
                                            <div className={classnames(styles.network_travel_profile_info)}>
                                                <div className={classnames(styles.network_travel_profile_info_inner)}>
                                                    <h4>Akashi</h4>
                                                    <div className={classnames(styles.network_travel_follow)}>
                                                        <span>•</span>
                                                        <a href="#" tabIndex="-1">FOLLOW</a>
                                                    </div>
                                                </div>
                                                <span>@akashitraveler</span>
                                            </div>
                                            <div className={classnames(styles.adv_trailblazer)}>
                                                <span>August 30, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classnames(styles.more_btn)}>
                                        <a>More <svg xmlns="http://www.w3.org/2000/svg" width="14.353" height="9.113" viewBox="0 0 14.353 9.113">
                                          <path id="Path_793" data-name="Path 793" d="M0,0V2.792L5.553,7.12,0,11.538v2.814L9.113,7.1Z" transform="translate(14.353) rotate(90)" fill="#fff" opacity="0.985"/>
                                        </svg></a>
                                    </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={classnames(styles.answercont)}>
                                    <div className={classnames(styles.answer)}>
                                        <div className={classnames(styles.storie_location)}>
                                            <img src="/images/sub-pages/black-map.svg" />
                                            <span>Jarabacoa Hike 2025</span>
                                        </div>
                                        <div className={classnames(styles.storie_content)}>
                                            <p><span className="extra_bold"><em>We set out just after sunrise, the mountain air still cool as we climbed into the hills above Jarabacoa.</em></span> Our guide, Carlos, led the way—part storyteller, part mountain goat—as we hiked through cloud forests thick with pine and orchids. By mid-morning, we were waist-deep in the Río Jimenoa, wading through crystal-clear pools and scrambling over slick rocks on our way to a hidden waterfall that felt straight out of a movie. No crowds, no signs—just us and the roar of water crashing down into a turquoise basin. We jumped in, laughing like kids, adrenaline still buzzing from the canyon rappel we’d done an hour before.</p>
                                        </div>
                                        <Slider {...settings} className={classnames(styles.adv_post_img_slide, 'adv_post_img_slide')}>
                                            {slides.map((slide, index) => (
                                                <div key={index}>
                                                    <div className={classnames(styles.adv_post_img_box)}>
                                                        <div className={classnames(styles.post_api_img)}>
                                                            <img src={slide.image} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                        <div className={classnames(styles.network_travel_likes)}>
                                            <span>22 comments</span>
                                            <span>45 likes</span>
                                            <span>Reply</span>
                                            <ul>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                                  <path id="" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                                  <path id="" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                                  <path id="" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
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
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <div className={classnames(styles.faq_box)}>
                        <Accordion expanded={expanded === '7' ? true : false} onChange={handleChange('7')}>
                            <AccordionSummary 
                                    id='panel-header-7'
                                    aria-controls='panel-content-7'
                                    sx={{ padding: 0, '& .MuiAccordionSummary-expandIconWrapper': { display: 'none'} }}
                                    >
                                <div className={classnames(styles.question, (expanded === '7' ? styles.open : ''))}>
                                    <div className={classnames(styles.network_travel_profile)}>
                                        <div className={classnames(styles.network_travel_picture)}>
                                            <img src="/images/sub-pages/jungle-jill3.jpg" />
                                        </div>
                                        <div className={classnames(styles.adv_post_top_right)}>
                                            <div className={classnames(styles.network_travel_profile_info)}>
                                                <div className={classnames(styles.network_travel_profile_info_inner)}>
                                                    <h4>Slick rick</h4>
                                                    <div className={classnames(styles.network_travel_follow)}>
                                                        <span>•</span>
                                                        <a href="#" tabIndex="-1">FOLLOW</a>
                                                    </div>
                                                </div>
                                                <span>@slickricktraveler</span>
                                            </div>
                                            <div className={classnames(styles.adv_trailblazer)}>
                                                <span>August 30, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classnames(styles.more_btn)}>
                                        <a>More <svg xmlns="http://www.w3.org/2000/svg" width="14.353" height="9.113" viewBox="0 0 14.353 9.113">
                                          <path id="Path_793" data-name="Path 793" d="M0,0V2.792L5.553,7.12,0,11.538v2.814L9.113,7.1Z" transform="translate(14.353) rotate(90)" fill="#fff" opacity="0.985"/>
                                        </svg></a>
                                    </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={classnames(styles.answercont)}>
                                    <div className={classnames(styles.answer)}>
                                        <div className={classnames(styles.storie_location)}>
                                            <img src="/images/sub-pages/black-map.svg" />
                                            <span>Jarabacoa Hike 2025</span>
                                        </div>
                                        <div className={classnames(styles.storie_content)}>
                                            <p><span className="extra_bold"><em>We set out just after sunrise, the mountain air still cool as we climbed into the hills above Jarabacoa.</em></span> Our guide, Carlos, led the way—part storyteller, part mountain goat—as we hiked through cloud forests thick with pine and orchids. By mid-morning, we were waist-deep in the Río Jimenoa, wading through crystal-clear pools and scrambling over slick rocks on our way to a hidden waterfall that felt straight out of a movie. No crowds, no signs—just us and the roar of water crashing down into a turquoise basin. We jumped in, laughing like kids, adrenaline still buzzing from the canyon rappel we’d done an hour before.</p>
                                        </div>
                                        <Slider {...settings} className={classnames(styles.adv_post_img_slide, 'adv_post_img_slide')}>
                                            {slides.map((slide, index) => (
                                                <div key={index}>
                                                    <div className={classnames(styles.adv_post_img_box)}>
                                                        <div className={classnames(styles.post_api_img)}>
                                                            <img src={slide.image} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                        <div className={classnames(styles.network_travel_likes)}>
                                            <span>22 comments</span>
                                            <span>45 likes</span>
                                            <span>Reply</span>
                                            <ul>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                                  <path id="" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                                  <path id="" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                                  <path id="" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"></path>
                                                </svg>
                                                </a></li>
                                                <li><a href="#" tabIndex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
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
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TotalTravelSection1
