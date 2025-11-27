// React Imports
import { useEffect, useRef, useState } from 'react'

// Third-party Imports
import classnames from 'classnames'

import { getFilteredTours, getFilteredCount } from '@/app/server/tours'

// Styles Imports
import styles from './styles.module.css'

const AdventuresSection1 = ({ data, filter_categories, dest_data, setCurrentTours, setCurrentCat }: { data?: []; filter_categories?: []; dest_data?: any; setCurrentTours: any; setCurrentCat: any; }) => {

  //console.log('filter_categories : ', filter_categories)

  const [selected_category, setSelectedCategory] = useState(null);
  const [selectedAct, setSelectedAct] = useState("- Select -");
  const [openAct, setOpenAct] = useState(false);

  const handleCategoryChange = async () => {
    if (selectedAct) {
      try {
        setCurrentCat(selectedAct)

        const t_data = await getFilteredTours(selectedAct, dest_data.destination_location, 1);
        setCurrentTours(t_data || []);
        //setDestinations(t_data || [])
      } catch (err) {
        console.error('Failed to fetch tours:', err)
        setCurrentTours([])

        //setDestinations([])
      }
    }
  }

  return (
    <section className={classnames(styles.home_section1, styles.our_desti_sec1, styles.destination_overview_sec1)}>
        <div className={classnames(styles.container, 'container')}>
            <div className={classnames(styles.head_text_center, 'head_text_center')}>
                <div className={classnames(styles.adventure_right_text)}>
                    {data?.about_title && <h2 className="fs_70">{data?.about_title}</h2>}
                    <div dangerouslySetInnerHTML={{
                        __html: (data?.about_content || ''),
                      }}>
                    </div>
                    {data?.button_text && data?.button_link && (
                      <div className={classnames(styles.advanture_text1)}>
                          <a href={data?.button_link}> <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
                            <g id="Group_474" data-name="Group 474" transform="translate(-749 -1655)">
                              <g id="Group_473" data-name="Group 473" transform="translate(0 43)">
                                <g id="Ellipse_2" data-name="Ellipse 2" transform="translate(760 1612)" fill="none" stroke="#fff" strokeWidth="1">
                                  <circle cx="3" cy="3" r="3" stroke="none"/>
                                  <circle cx="3" cy="3" r="2.5" fill="none"/>
                                </g>
                                <g id="Ellipse_3" data-name="Ellipse 3" transform="translate(760 1624)" fill="none" stroke="#fff" strokeWidth="1">
                                  <circle cx="3" cy="3" r="3" stroke="none"/>
                                  <circle cx="3" cy="3" r="2.5" fill="none"/>
                                </g>
                                <g id="Ellipse_4" data-name="Ellipse 4" transform="translate(749 1617)" fill="none" stroke="#fff" strokeWidth="1">
                                  <circle cx="3.5" cy="3.5" r="3.5" stroke="none"/>
                                  <circle cx="3.5" cy="3.5" r="3" fill="none"/>
                                </g>
                                <g id="Group_472" data-name="Group 472">
                                  <path id="Path_389" data-name="Path 389" d="M-643.592,1706.313l5.581,3.131" transform="translate(1399 -84)" fill="none" stroke="#fff" strokeWidth="1"/>
                                  <path id="Path_390" data-name="Path 390" d="M-643.592,1703.338l5.594-3.252" transform="translate(1399 -84)" fill="none" stroke="#fff" strokeWidth="1"/>
                                </g>
                              </g>
                            </g>
                          </svg> {data?.button_text}</a>
                      </div>
                    )}

                    <div className={classnames(styles.activity_form)}>
                        <form>
                            <input type="hidden" name="adventure_activity" value='' />
                            
                            <div className={classnames(styles.search_select, styles.ss1)}>
                                <label>Activity</label>
                                <div className={`custom-select ${openAct ? 'active' : ''}`}>
                                    <div 
                                      className="select-selected"
                                      onClick={() => {setOpenAct(!openAct);}}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <div>
                                        <span className="select-icn">
                                          <img src="/images/svg/solo.svg" alt=""  />
                                        </span>
                                        <span>{selectedAct}</span>
                                      </div>

                                      <img
                                        src="/images/svg/down-arrow.svg"
                                        alt=""
                                        style={{
                                          transform: openAct ? "rotate(180deg)" : "rotate(0deg)",
                                          transition: "0.2s",
                                        }}
                                      />
                                    </div>

                                    {openAct && (
                                      <div className="select-items">
                                        {filter_categories.map((loc, index) => (
                                          <div
                                            key={index}
                                            onClick={() => {
                                              setSelectedAct(loc.category_name);
                                              setSelectedCategory(loc._id)
                                              setOpenAct(false);
                                            }}
                                            style={{ cursor: "pointer" }}
                                          >
                                            <span>
                                              { loc.image ? (<img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${loc.image}`} alt="" />) : (<img src="/images/svg/walking-svgrepo-com.svg" alt="" />) }
                                            </span>
                                            {loc.category_name}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                            </div>

                            <div className={classnames(styles.search_btn)}>
                                <input type="button" name="" value="Search" onClick={() => { handleCategoryChange(); }} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default AdventuresSection1
