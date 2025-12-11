// React Imports
import { useState, useEffect } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import { Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { getActivitiesByIds } from '@/app/server/tours'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureDetailSection4 = ({ tour, tour_details }: { tour: any; tour_details: any; }) => {
    const [activities, setActivities] = useState<Record<number, any>>({});
    const [value, setValue] = useState<string>('1')
    const [expandedDay, setExpandedDay] = useState<string | null>('1')
    const totalDays = tour_details?.days_summary?.length ?? 0;

    useEffect(() => {
        const allIds = tour_details?.days_summary
          .flatMap((day: any) => day.optional_activities)
          .filter((id: number) => id > 0);

        if (allIds?.length) {
          (async () => {
            const res = await getActivitiesByIds(allIds);
            const mapped: Record<number, any> = {};
            res.forEach((act: any) => {
              mapped[act.api_activity_id] = act;
            });
            setActivities(mapped);
          })();
        }
    }, [tour_details]);

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    const handleAccordionToggle = (day: string) => {
        setExpandedDay(expandedDay === day ? null : day)
    }

    const handlePrev = () => {
        setValue((prev) => {
          const num = parseInt(prev, 10);
          return num > 1 ? String(num - 1) : prev;
        });
        setExpandedDay((prev) => {
          const num = parseInt(prev || '1', 10);
          return num > 1 ? String(num - 1) : prev;
        });
    };

    const handleNext = () => {
        setValue((prev) => {
          const num = parseInt(prev, 10);
          return num < numbers.length ? String(num + 1) : prev;
        });
        setExpandedDay((prev) => {
          const num = parseInt(prev || '1', 10);
          return num < numbers.length ? String(num + 1) : prev;
        });
    };

    const numbers = Array.from({ length: totalDays }, (_, i) => i + 1);

    const formatLabel = (text: string) => {
        if (!text) return ''
        return text
          .toLowerCase()
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
    }

    // Render desktop tab view
    const renderDesktopView = () => (
        <div className={classnames(styles.ultimate_row, 'bx_sd')}>
            <div className={classnames(styles.ultimate_left)}>
                <div className={classnames(styles.ultimate_left_inner)}>
                    <div className={classnames(styles.ultimate_left_inner_hight)}>
                        <div className={classnames(styles.ultimate__top)}>
                            <h4>{tour.name} - Itinerary</h4>
                            <div className={classnames(styles.ultimate_trip)}>
                                <span className={classnames(styles.san_trip)}>Trip Start: <span className="extra_bold">{tour_details?.geography?.start_city}</span></span>
                                <span className={classnames(styles.san_trip)}>Trip End: <span className="extra_bold">{tour_details?.geography?.finish_city}</span></span>
                            </div>
                        </div>
                        <TabList orientation='vertical' onChange={handleChange} aria-label='vertical tabs example' className={classnames(styles.tab_lists, styles.ultimate_days)}>
                            {tour_details?.days_summary?.map(day => (
                              <Tab
                                key={day.day}
                                value={String(day.day)}
                                label={
                                  <div>
                                    <div className={classnames(styles.ultimate_day)}>DAY {day.day}</div>
                                    <div className={classnames(styles.ultimate_day_info)}>{day.label}</div>
                                  </div>
                                }
                                className={classnames({ [styles.active]: value === String(day.day) })}
                              />
                            ))}
                        </TabList>
                    </div>
                    {tour_details?.site_links?.download_pdf !='' && (
                        <div className={classnames(styles.ultimate__bot)}>
                            <div className={classnames(styles.btn, 'btn')}>
                                <a href={tour_details?.site_links?.download_pdf} target="_blank">DOWNLOAD ITINERAY PDF</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={classnames(styles.ultimate_right)}>
                <div className={classnames(styles.ultimate_right_row)}>
                    {tour_details?.days_summary?.map(day => (
                        <TabPanel value={String(day.day)} key={day.day} className={classnames(styles.tab_details)}>
                            <div className={classnames(styles.ultimate_right_left)}>
                                <p className="extra_bold text_up">DAY {day.day}</p>
                                <h4>{day.label}</h4>
                                <p>{day.summary}</p>

                                {day.components.map(comp => (
                                    <p key={comp.name??comp.type}><span className="extra_bold">{comp.name!=''?comp.name:formatLabel(comp.type)}:</span><br />{comp.summary}</p>
                                ))}

                                {day.optional_activities.length>0 && (
                                    <h4>Optional Activities</h4>
                                )}
                                {day.optional_activities.map((id: number) => {
                                  const activity = activities[id];
                                  return activity ? (
                                    <p key={id}>
                                      <span className="extra_bold">{activity.activity_name}:</span><br />
                                      {activity.description}
                                    </p>
                                  ) : '';
                                })}
                            </div>
                            <div className={classnames(styles.ultimate_right_right)}>
                                <div className="full_img">
                                    <img src={tour_details.map_image??tour.image} />
                                </div>
                            </div>
                        </TabPanel>
                    ))}
                </div>
                <div className={classnames(styles.ultimate_prev_next)}>
                    <div className={classnames(styles.btn_set)}>
                        <div className={classnames(styles.btn, 'btn')}>
                            <button onClick={handlePrev} disabled={value === "1"}>PREV. DAY</button>
                        </div>
                        <div className={classnames(styles.btn, 'btn')}>
                            <button onClick={handleNext} disabled={value === String(numbers.length)}>NEXT DAY</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    // Render mobile accordion view
    const renderMobileView = () => (
        <div className={classnames(styles.mobile_accordion, 'bx_sd')}>
            <div className={classnames(styles.ultimate__top, styles.mobile_header)}>
                <h4>{tour.name} - Itinerary</h4>
                <div className={classnames(styles.ultimate_trip)}>
                    <span className={classnames(styles.san_trip)}>Trip Start: <span className="extra_bold">{tour_details?.geography?.start_city}</span></span>
                    <span className={classnames(styles.san_trip)}>Trip End: <span className="extra_bold">{tour_details?.geography?.finish_city}</span></span>
                </div>
            </div>

            {tour_details?.days_summary?.map(day => (
                <div 
                    key={day.day} 
                    className={classnames(
                        styles.accordion_item, 
                        { 
                            [styles.active]: expandedDay === String(day.day),
                            [styles.accordion_active]: expandedDay === String(day.day) 
                        }
                    )}
                >
                    <div 
                        className={classnames(
                            styles.accordion_header,
                            { [styles.active]: expandedDay === String(day.day) }
                        )} 
                        onClick={() => handleAccordionToggle(String(day.day))}
                    >
                        <div className={classnames(styles.accordion_header_content)}>
                            <div className={classnames(styles.ultimate_day)}>DAY {day.day}</div>
                            <div className={classnames(styles.ultimate_day_info)}>{day.label}</div>
                        </div>
                        <span className={classnames(
                            styles.accordion_icon,
                            { [styles.active]: expandedDay === String(day.day) }
                        )}>
                            {expandedDay === String(day.day) ? '−' : '+'}
                        </span>
                    </div>
                    
                    {expandedDay === String(day.day) && (
                        <div className={classnames(
                            styles.accordion_content,
                            { [styles.active]: expandedDay === String(day.day) }
                        )}>
                            <div className={classnames(styles.ultimate_right_left)}>
                                <p className="extra_bold text_up">DAY {day.day}</p>
                                <h4>{day.label}</h4>
                                <p>{day.summary}</p>

                                {day.components.map(comp => (
                                    <p key={comp.name??comp.type}><span className="extra_bold">{comp.name!=''?comp.name:formatLabel(comp.type)}:</span><br />{comp.summary}</p>
                                ))}

                                {day.optional_activities.length>0 && (
                                    <h4>Optional Activities</h4>
                                )}
                                {day.optional_activities.map((id: number) => {
                                  const activity = activities[id];
                                  return activity ? (
                                    <p key={id}>
                                      <span className="extra_bold">{activity.activity_name}:</span><br />
                                      {activity.description}
                                    </p>
                                  ) : '';
                                })}
                            </div>
                            <div className={classnames(styles.ultimate_right_right)}>
                                <div className="full_img">
                                    <img src={tour_details.map_image??tour.image} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {tour_details?.site_links?.download_pdf !='' && (
                <div className={classnames(styles.ultimate__bot, styles.mobile_download)}>
                    <div className={classnames(styles.btn, 'btn')}>
                        <a href={tour_details?.site_links?.download_pdf} target="_blank">DOWNLOAD ITINERAY PDF</a>
                    </div>
                </div>
            )}

            <div className={classnames(styles.ultimate_prev_next, styles.mobile_navigation)}>
                <div className={classnames(styles.btn_set)}>
                    <div className={classnames(styles.btn, 'btn')}>
                        <button onClick={handlePrev} disabled={expandedDay === "1"}>PREV. DAY</button>
                    </div>
                    <div className={classnames(styles.btn, 'btn')}>
                        <button onClick={handleNext} disabled={expandedDay === String(numbers.length)}>NEXT DAY</button>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <section className={classnames(styles.adven_detl_sec3, 'cst-style-tb py_150')}>
            <div className="container">
                <TabContext value={value}>
                    {/* Desktop View */}
                    <div className={classnames(styles.tab_desktop_view)}>
                        {renderDesktopView()}
                    </div>
                    
                    {/* Mobile View */}
                    <div className={classnames(styles.tab_mobile_view)}>
                        {renderMobileView()}
                    </div>
                </TabContext>
            </div>
        </section>
    )
}

export default OurAdventureDetailSection4