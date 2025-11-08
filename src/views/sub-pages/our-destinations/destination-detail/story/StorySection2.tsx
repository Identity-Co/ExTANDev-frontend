// React Imports
import React from 'react';
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

import LikesShare from '@/views/shared/like-share-section/LikeShareSection'

const StorySection2 = ({ data }: { data?: []; }) => { 
    const [expanded, setExpanded] = useState<string | false>(false)
    const [expandedGroups, setExpandedGroups] = useState({});
    const [activeItem, setActiveItem] = useState(null); // Track which item is active

    const toggleGroupContent = (groupKey) => {
        setExpandedGroups(prev => ({
          ...prev,
          [groupKey]: !prev[groupKey]
        }));
        // Toggle active item - if clicking the same item, close it
        setActiveItem(prev => prev === groupKey ? null : groupKey);
    };

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

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
    };

    // Group items by their cycle position
    const groupedItems = [];
    let currentAccordionGroup = [];
    let currentBoxGroup = [];

    Array.from({ length: data.length }).forEach((_, index) => {
        const recordNumber = index + 1;
        const positionInCycle = (index % 10);
        
        // Determine the layout type based on position in the 10-record cycle
        let layoutType;
        if (positionInCycle < 4) {
            layoutType = 'accordion'; // First 4 records
        } else if (positionInCycle < 6) {
            layoutType = 'box'; // Next 2 records
        } else {
            layoutType = 'accordion'; // Last 4 records
        }

        const recordData = {
            id: recordNumber,
            _id: data[index]._id,
            userProfile: data[index].userprofile,
            name: data[index].name,
            date: data[index].date,
            username: data[index].username,
            location: data[index].location,
            content: data[index].content,
            gallery: data[index].gallery,
        };

        const item = { recordNumber, recordData, index, layoutType };

        if (layoutType === 'accordion') {
            // If we were collecting boxes, push them first
            if (currentBoxGroup.length > 0) {
                groupedItems.push({ type: 'box', items: [...currentBoxGroup] });
                currentBoxGroup = [];
            }
            currentAccordionGroup.push(item);
        } else { // box layout
            // If we were collecting accordions, push them first
            if (currentAccordionGroup.length > 0) {
                groupedItems.push({ type: 'accordion', items: [...currentAccordionGroup] });
                currentAccordionGroup = [];
            }
            currentBoxGroup.push(item);
        }
    });

    // Push any remaining groups
    if (currentAccordionGroup.length > 0) {
        groupedItems.push({ type: 'accordion', items: currentAccordionGroup });
    }
    if (currentBoxGroup.length > 0) {
        groupedItems.push({ type: 'box', items: currentBoxGroup });
    }

    const TruncateHTMLContent = ({ html, wordLimit = 10 }) => {
      if (!html) return null;

      const truncateHTML = (htmlString, limit) => {
        let wordCount = 0;
        let result = '';
        let inTag = false;
        let currentWord = '';

        for (let i = 0; i < htmlString.length && wordCount < limit; i++) {
          const char = htmlString[i];
          
          if (char === '<') {
            inTag = true;
            if (currentWord) {
              result += currentWord;
              currentWord = '';
            }
            result += char;
          } else if (char === '>') {
            inTag = false;
            result += char;
          } else if (inTag) {
            result += char;
          } else {
            if (char.match(/\s/)) {
              if (currentWord) {
                result += currentWord + char;
                currentWord = '';
                wordCount++;
              } else {
                result += char;
              }
            } else {
              currentWord += char;
            }
          }
        }

        // Add the last word if we have one
        if (currentWord && wordCount < limit) {
          result += currentWord;
        }

        return result + (wordCount >= limit ? '...' : '');
      };

      return <div dangerouslySetInnerHTML={{ __html: truncateHTML(html, wordLimit) }} />;
    };

    return (
        <section className={classnames(styles.faq_section, styles.our_desti_sec2, styles.destination_stories_sec1, styles.destination_stories_sec_faq, "pb_150")}>
            <div className="container">
                {groupedItems.map((group, groupIndex) => {
                    if (group.type === 'accordion') {
                        return (
                            <div key={`accordion-${groupIndex}`} className={classnames(styles.faq, styles.travel_stories_faq, 'travel_stories_faq')}>
                                {group.items.map(({ recordNumber, recordData, index }) => (
                                    <div key={recordNumber} className={classnames(styles.faq_box)}>
                                        <Accordion expanded={expanded === index ? true : false} onChange={handleChange(index)}>
                                            <AccordionSummary 
                                                id={`panel-header-${recordNumber}`}
                                                aria-controls={`panel-content-${recordNumber}`}
                                                sx={{ padding: 0, '& .MuiAccordionSummary-expandIconWrapper': { display: 'none'} }}
                                            >
                                                <div className={classnames(styles.question, (expanded === index ? styles.open : ''))}>
                                                    <div className={classnames(styles.network_travel_profile)}>
                                                        <div className={classnames(styles.network_travel_picture)}>
                                                            <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${recordData?.userProfile}`} />
                                                        </div>
                                                        <div className={classnames(styles.adv_post_top_right)}>
                                                            <div className={classnames(styles.network_travel_profile_info)}>
                                                                <div className={classnames(styles.network_travel_profile_info_inner)}>
                                                                    {recordData?.name && <h4>{recordData?.name}</h4>}
                                                                    <div className={classnames(styles.network_travel_follow)}>
                                                                        <span>•</span>
                                                                        <a href="#" tabIndex="-1">FOLLOW</a>
                                                                    </div>
                                                                </div>
                                                                {recordData?.username && <span>{recordData?.username}</span>}
                                                            </div>
                                                            <div className={classnames(styles.adv_trailblazer)}>
                                                                {recordData?.date && <span>{formatDate(recordData?.date)}</span>}
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
                                                            {recordData?.location && <span>{recordData?.location}</span>}
                                                        </div>
                                                        <div className={classnames(styles.storie_content)}>
                                                            <div dangerouslySetInnerHTML={{
                                                                __html: (recordData?.content || ''),
                                                              }}>
                                                            </div>
                                                        </div>
                                                        <Slider {...settings} className={classnames(styles.adv_post_img_slide, 'adv_post_img_slide')}>
                                                            {recordData?.gallery.map((gallery, galleryIndex) => (
                                                                <div key={galleryIndex}>
                                                                    <div className={classnames(styles.adv_post_img_box)}>
                                                                        <div className={classnames(styles.post_api_img)}>
                                                                            <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${gallery}`} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </Slider>
                                                        <LikesShare collectionName='destination_story' color='orange' collectionID={recordData?._id} format="comment,like,reply" />
                                                    </div>
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                ))}
                            </div>
                        );
                    } else { // box layout
                        return (
                            <div key={`box-${groupIndex}`} className={classnames(styles.travel_stories_info)}>
                                <div className="grid2 gap_40">
                                    {group.items.map(({ recordNumber, recordData }) => {
                                        const itemKey = `${groupIndex}-${recordNumber}`;
                                        const isActive = activeItem === itemKey;
                                        
                                        return (
                                            <div key={recordNumber} className={classnames(styles.grid_box)}>
                                                <div className={classnames(styles.storie_infobox, 'bx_sd')}>
                                                    <div className={classnames(styles.storie_info_image)}>
                                                        <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${recordData?.gallery[0]}`} />
                                                    </div>
                                                    <div className={classnames(styles.storie_info_content, styles.travel_stories_faq, 'travel_stories_faq')}>
                                                        <div className={classnames(styles.network_travel_profile)}>
                                                            <div className={classnames(styles.network_travel_picture)}>
                                                                <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${recordData?.userProfile}`} />
                                                            </div>
                                                            <div className={classnames(styles.adv_post_top_right)}>
                                                                <div className={classnames(styles.network_travel_profile_info)}>
                                                                    <div className={classnames(styles.network_travel_profile_info_inner)}>
                                                                        {recordData?.name && <h4>{recordData?.name}</h4>}
                                                                        <div className={classnames(styles.network_travel_follow)}>
                                                                            <span>•</span>
                                                                            <a href="#" tabIndex="-1">FOLLOW</a>
                                                                        </div>
                                                                    </div>
                                                                    {recordData?.username && <span>{recordData?.username}</span>}
                                                                </div>
                                                                <div className={classnames(styles.adv_trailblazer)}>
                                                                    {recordData?.date && <span>{formatDate(recordData?.date)}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h3>Surfing the Wild Side of South Africa</h3>
                                                        <TruncateHTMLContent html={recordData?.content} wordLimit={10} />
                                                        <div className={classnames(styles.more_btn)}>
                                                            <a href="#" onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleGroupContent(itemKey);
                                                            }}>
                                                                {isActive ? 'Show less' : 'Continue reading'} 
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14.353" height="9.113" viewBox="0 0 14.353 9.113" style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                                  <path id="Path_793" data-name="Path 793" d="M0,0V2.792L5.553,7.12,0,11.538v2.814L9.113,7.1Z" transform="translate(14.353) rotate(90)" fill="#fff" opacity="0.985"></path>
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Content outside of grid2 gap_40 div */}
                                <div className={classnames(styles.grpbx_content, 'grpbx_content')}>
                                    {group.items.map(({ recordNumber, recordData }) => {
                                        const itemKey = `${groupIndex}-${recordNumber}`;
                                        const isActive = activeItem === itemKey;
                                        
                                        return (
                                            <div key={recordNumber}>
                                                {isActive && (
                                                    <div className={classnames(styles.answercont)}>
                                                        <div className={classnames(styles.answer)}>
                                                            <div className={classnames(styles.storie_location)}>
                                                                <img src="/images/sub-pages/black-map.svg" />
                                                                {recordData?.location && <span>{recordData?.location}</span>}
                                                            </div>
                                                            <div className={classnames(styles.storie_content)}>
                                                                <div dangerouslySetInnerHTML={{
                                                                    __html: (recordData?.content || ''),
                                                                  }}>
                                                                </div>
                                                            </div>
                                                            <Slider {...settings} className={classnames(styles.adv_post_img_slide, 'adv_post_img_slide')}>
                                                                {recordData?.gallery.map((gallery, galleryIndex) => (
                                                                    <div key={galleryIndex}>
                                                                        <div className={classnames(styles.adv_post_img_box)}>
                                                                            <div className={classnames(styles.post_api_img)}>
                                                                                <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${gallery}`} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </Slider>
                                                            <LikesShare collectionName='destination_story' color='orange' collectionID={recordData?._id} format="comment,like,reply" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </section>
    )
}

export default StorySection2