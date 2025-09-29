// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureDetailSection1 = ({ tour, tour_details }: { tour: any; tour_details: any; }) => {
  function truncateByWords(text, wordLimit = 50) {
    if (!text) return ''
    const words = text.split(/\s+/)
    if (words.length <= wordLimit) return text
    return words.slice(0, wordLimit).join(' ') + '...'
  }
  return (
    <section className={classnames(styles.home_section1, styles.our_desti_sec1, styles.our_adven_sec1)}>
      <div className="container">
          <div className={classnames(styles.head_text_center, 'head_text_center')}>
              <div className={classnames(styles.adventure_right_text)}>
                  <h2 className="fs_70">{tour.name}</h2>
                  <p>{truncateByWords(tour.description)}</p>
                  <div className={classnames(styles.advanture_text1)}>
                      <a href="#"> <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
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
                      </svg> Share</a>
                  </div>
              </div>
          </div>
          <div className={classnames(styles.adven_dtl_top)}>
              <ul>
                  <li><span className="extra_bold">{tour.tour_days} Days</span></li>
                  {/* <li>Avg Group Size: <span className="extra_bold">12</span></li>
                  <li>Activity Level <span className="extra_bold">2</span></li> */}
                  <li>Trip Start: <span className="extra_bold">{tour_details?.geography?.start_city}</span></li>
                  <li>Trip End: <span className="extra_bold">{tour_details?.geography?.finish_city}</span></li>
                  <li>Trip Code: <span className="extra_bold">{tour.product_line}</span></li>
                  <li>From: <span className="extra_bold">${tour.start_price}</span></li>
              </ul>
          </div>
      </div>
    </section>
  )
}

export default OurAdventureDetailSection1
