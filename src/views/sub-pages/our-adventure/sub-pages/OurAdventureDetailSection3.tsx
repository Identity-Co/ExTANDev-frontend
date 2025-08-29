// React Imports
import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import { Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';


// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureDetailSection3 = () => {

    const [value, setValue] = useState<string>('1')

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    const handlePrev = () => {
        setValue((prev) => {
          const num = parseInt(prev, 10);
  
          return num > 1 ? String(num - 1) : prev;
        });
    };

    const handleNext = () => {
        setValue((prev) => {
          const num = parseInt(prev, 10);

          return num < numbers.length ? String(num + 1) : prev;
        });
    };

    const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
      
    return (
        <section className={classnames(styles.adven_detl_sec3, 'cst-style-tb py_150')}>
            <div className="container">
                <TabContext value={value}>
                    <div className={classnames(styles.ultimate_row, 'bx_sd item_center')}>
                        <div className={classnames(styles.ultimate_left)}>
                            <div className={classnames(styles.ultimate_left_inner)}>
                                <div className={classnames(styles.ultimate__top)}>
                                    <h4>Ultimate Costa Rica Adventure - Itinerary</h4>
                                    <div className={classnames(styles.ultimate_trip)}>
                                        <span className={classnames(styles.san_trip)}>Trip Start: <span className="extra_bold">San Jose</span></span>
                                        <span className={classnames(styles.san_trip)}>Trip End: <span className="extra_bold">San Jose</span></span>
                                    </div>
                                </div>
                                <TabList orientation='vertical' onChange={handleChange} aria-label='vertical tabs example' className={classnames(styles.tab_lists)}>
                                    <Tab
                                        value="1"
                                        label={
                                            <div>
                                                <div className={classnames(styles.ultimate_day)}>DAY 1</div>
                                                <div className={classnames(styles.ultimate_day_info)}>Arrive in San Jose</div>
                                            </div>
                                        }
                                        className={classnames({ [styles.active]: value === "1" })}
                                      />
                                
                                    <Tab
                                        value="2"
                                        label={
                                            <div>
                                                <div className={classnames(styles.ultimate_day)}>DAY 2</div>
                                                <div className={classnames(styles.ultimate_day_info)}>Overnight rafting experience on Pacuare River</div>
                                            </div>
                                        }
                                        className={classnames({ [styles.active]: value === "2" })}
                                    />
                                
                                    <Tab
                                        value="3"
                                        label={
                                            <div>
                                                <div className={classnames(styles.ultimate_day)}>DAY 3</div>
                                                <div className={classnames(styles.ultimate_day_info)}>Raft Pacuare River in the Lower Pacuare Gorge</div>
                                            </div>
                                        }
                                        className={classnames({ [styles.active]: value === "3" })}
                                    />
                                
                                    <Tab
                                        value="4"
                                        label={
                                            <div>
                                                <div className={classnames(styles.ultimate_day)}>DAY 4</div>
                                                <div className={classnames(styles.ultimate_day_info)}>Arenal, La Fortuna Waterfall and Hot Springs</div>
                                            </div>
                                        }
                                        className={classnames({ [styles.active]: value === "4" })}
                                    />
                                
                                    <Tab
                                        value="5"
                                        label={
                                            <div>
                                                <div className={classnames(styles.ultimate_day)}>DAY 5</div>
                                                <div className={classnames(styles.ultimate_day_info)}>Kayak Lake Arenal, mud baths</div>
                                            </div>
                                        }
                                        className={classnames({ [styles.active]: value === "5" })}
                                    />
                                
                                    <Tab
                                        value="6"
                                        label={
                                            <div>
                                                <div className={classnames(styles.ultimate_day)}>DAY 6</div>
                                                <div className={classnames(styles.ultimate_day_info)}>Hike to La Cangreja Waterfall</div>
                                            </div>
                                        }
                                        className={classnames({ [styles.active]: value === "6" })}
                                    />
                                
                                    <Tab
                                        value="7"
                                        label={
                                            <div>
                                                <div className={classnames(styles.ultimate_day)}>DAY 7</div>
                                                <div className={classnames(styles.ultimate_day_info)}>Las Chorreras Waterfall and Nosara Beach</div>
                                            </div>
                                        }
                                        className={classnames({ [styles.active]: value === "7" })}
                                    />
                                
                                    <Tab
                                        value="8"
                                        label={
                                            <div>
                                                <div className={classnames(styles.ultimate_day)}>DAY 8</div>
                                                <div className={classnames(styles.ultimate_day_info)}>Mountain Bike Adventure</div>
                                            </div>
                                        }
                                        className={classnames({ [styles.active]: value === "8" })}
                                    />
                                
                                    <Tab
                                        value="9"
                                        label={
                                            <div>
                                                <div className={classnames(styles.ultimate_day)}>DAY 9</div>
                                                <div className={classnames(styles.ultimate_day_info)}>Return to San Jose</div>
                                            </div>
                                        }
                                        className={classnames({ [styles.active]: value === "9" })}
                                    />
                                            
                                </TabList>
                                <div className={classnames(styles.ultimate__bot)}>
                                    <div className={classnames(styles.btn, 'btn')}>
                                        <a href="#">DOWNLOAD ITINERAY PDF</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={classnames(styles.ultimate_right)}>
                            <div className={classnames(styles.ultimate_right_row)}>
                                {numbers.map((num) => (
                                    <TabPanel value={num.toString()} key={num} className={classnames(styles.tab_details)}>
                                        <div className={classnames(styles.ultimate_right_left)}>
                                            <p className="extra_bold text_up">DAY {num}</p>
                                            <h4>Arrive in San Jose</h4>
                                            <p>Welcome to San José, Costa Rica’s capital city! Please make your own way to Hotel Parque del Lago, located walking distance from La Sabana Park and the Museum of Costa Rican Art.</p>
                                            <p>In the evening you’ll meet with your trip leader, along with the rest of the group, for a full trip briefing and a delicious Tico dinner!</p>
                                            <p><span className="extra_bold">Accommodation:</span><br />Hotel Parque del Lago, San Jose</p>
                                            <p><span className="extra_bold">Meals:</span><br />Dinner</p>
                                        </div>
                                        <div className={classnames(styles.ultimate_right_right)}>
                                            <div className="full_img">
                                                <img src="/images/sub-pages/day.jpg" />
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
                </TabContext>
            </div>
        </section>
    )
}

export default OurAdventureDetailSection3
