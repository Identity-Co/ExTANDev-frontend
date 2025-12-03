// Third-party Imports
import classnames from 'classnames'
import { useState } from 'react'

import Slider from 'react-slick'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// Styles Imports
import styles from './styles.module.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const ResortsSection1 = ({ data }: { data?: [] }) => {  
  if(!data)
    return

  const [expandedAccordions, setExpandedAccordions] = useState<{ [key: string]: boolean }>({})

  const handleAccordionChange = (panelId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [panelId]: isExpanded
    }))
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 6000,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  
  return (
    <section className={classnames(styles.jade_jungle_rooms_sec2, 'pb_150 jade_jungle_rooms_sec2')}>
      <div className="container">
          <div className={classnames(styles.jungle_rooms_main)}>
            {data?.map((item: any, index: number) => {
              const panelId = `panel-${index}`
              const isExpanded = expandedAccordions[panelId] || false
              
              return (
                <div key={`room-${index}`} className={classnames(styles.jungle_room_row)}>
                  <div className={classnames(styles.jungle_room_left)}>
                    <Slider {...settings} className={classnames(styles.jungle_room_slide_box, 'jungle_room_slide_box')}>
                      {item?.gallery?.map((gItem: string, j: number) => (
                        <div key={`gallery-${index}-${j}`} className={classnames(styles.jungle_room_slide)}>
                          <div className={classnames(styles.jungle_room_img)}>
                            <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${gItem}`} />
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                  <div className={classnames(styles.jungle_room_right)}>
                    {item?.title && <h3>{item.title}</h3>}
                    <div
                      dangerouslySetInnerHTML={{ __html: item?.description || '' }}
                    ></div>
                    <div className={classnames(styles.faq, 'faq')}>
                      <div className={classnames(styles.faq_box, 'faq_box')}>
                        <Accordion
                          expanded={isExpanded}
                          onChange={handleAccordionChange(panelId)}
                        >
                          <AccordionSummary 
                            id={`panel-header-${index}`}
                            aria-controls={`panel-content-${index}`}
                            sx={{ padding: 0, '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' } }}
                          >
                            <div className={classnames(styles.question, 'question', { [styles.open]: isExpanded })}>
                              <h4>Features</h4>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className={classnames(styles.answercont)}>
                              <div className={classnames(styles.answer)}>
                                <div
                                  dangerouslySetInnerHTML={{ __html: item?.feature_description || '' }}
                                ></div>
                                <ul>
                                  {item?.features_lists?.map((fItem: string, k: number) => (
                                    <li key={`feature-${index}-${k}`}>{fItem}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
      </div>
    </section>
  )
}

export default ResortsSection1