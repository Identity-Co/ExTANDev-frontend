// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode }: { mode: Mode }) => {

  return (
    <div className={classnames(styles.home_banner, styles.stay_banner, styles.search_box_3)}>
        <div className={classnames(styles.banner_bg_image)}>
            <div className={classnames(styles.banner_bg_image_hero)}>
                <img src="/images/sub-pages/stay-banner.jpg" />
            </div>
            <div className="container">
                <div className={classnames(styles.banner_bg_image_text)}>
                    <h1 className="fs_90">STAYS</h1>
                </div>
            </div>
        </div>
        <div className={classnames(styles.search_box)}>
            <div className={classnames(styles.container, 'container')}>
                <div className={classnames(styles.search_box_inner)}>
                    <div className={classnames(styles.travel_filter)}>
                        <ul>
                            <li className={classnames(styles.active)}><a href="#">STAYS</a></li>
                            <li><a href="#">FLIGHTS</a></li>
                            <li><a href="#">CARS</a></li>
                            <li><a href="#">PACKAGES</a></li>
                            <li><a href="#">THINGS TO DO</a></li>
                            <li><a href="#">CRUISES</a></li>
                        </ul>
                    </div>
                    <div className={classnames(styles.search_row)}>
                        <form>
                            <div className={classnames(styles.search_select, styles.ss1)}>
                                <label>Destinations</label>
                                <select name="cars" id="cars">
                                  <option value="">Destinations 1</option>
                                  <option value="">Destinations 2</option>
                                  <option value="">Destinations 3</option>
                                  <option value="">Destinations 4</option>
                                </select>
                            </div>
                            <div className={classnames(styles.search_select, styles.ss2)}>
                                <label>Dates</label>
                                <select name="cars" id="cars">
                                  <option value="">Dates 1</option>
                                  <option value="">Dates 2</option>
                                  <option value="">Dates 3</option>
                                  <option value="">Dates 4</option>
                                </select>
                            </div>
                            <div className={classnames(styles.search_select, styles.ss3)}>
                                <label>Travelers</label>
                                <select name="cars" id="cars">
                                  <option value="">Travelers 1</option>
                                  <option value="">Travelers 2</option>
                                  <option value="">Travelers 3</option>
                                  <option value="">Travelers 4</option>
                                </select>
                            </div>
                            <div className={classnames(styles.search_btn)}>
                                <input type="submit" name="" value="Search" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BannerSection
