// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const HomeSection1 = () => {
  
  return (
    <section className={classnames(styles.home_section1, 'pb-100')}>
      <div className={classnames('container')}>
        <div className={classnames("grid2 gap-64 item-center")}>
          <div className={classnames("grid-column")}>
            <div className={classnames(styles.bamboo_boat, 'full-img')}>
              <img src="/images/front-pages/images/bamboo-boat.jpg" />
              <div className={classnames(styles.location_name, styles.bamboo_boat_loc)}>
                  <img src="/images/front-pages/images/hero-location.svg" />
                  <span>Samana, Dominican Republic</span>
              </div>
            </div>
          </div>
          <div className={classnames("grid-column")}>
            <div className={classnames(styles.adventure_right_text)}>
              <div className={classnames(styles.advanture_text1)}>
                  <h3>ADVENTURE NETWORK</h3>
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
              <div className={classnames(styles.advanture_text2)}>
                  <h2>Travel Like You Mean It</h2>
                  <img src="/images/front-pages/images/map-orange.svg" />
              </div>
              <p>
                <span>
                  <em>Adventure Network is your passport to the world’s most sought-after adventure resorts, eco-lodges, and remote escapes.</em>
                </span> We go beyond the brochure to uncover adrenaline-rich experiences and soul-stirring settings for travelers who want stories, not souvenirs.
              </p>
              <p>Our mission is twofold: to help bold travelers—the explorers, the seekers, the trailblazers—easily access the world’s most remarkable and remote journeys, and to give the providers of these experiences—lodges, tour operators, guides, and beyond—a direct line to an audience that truly values them.</p>
              <p><span><em>Simply put, we aim to be the leading platform for the growing movement of travel rooted in adventure, culture, sustainability, and discovery.</em></span></p>
            </div>
          </div>
        </div>
        <div className={classnames(styles.home_testimonial)}>
            <div className={classnames(styles.qt_img)}>
                <img src="/images/front-pages/images/qt.png" />
            </div>
            <div className={classnames(styles.testimonial_box)}>
                <p className={classnames("fs-55")}>Two roads diverged in a wood and I – I took the one less traveled by, and that has made all the difference.”</p>
                <h4>– ROBERT FROST</h4>
            </div>
        </div>
    </div>
    </section>
  )
}

export default HomeSection1
