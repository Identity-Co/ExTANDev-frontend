// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode }: { mode: Mode }) => {

  return (
    <div className={classnames(styles.home_banner, styles.moab_banner)}>
        <div className={classnames(styles.banner_bg_image)}>
            <div className={classnames(styles.banner_bg_image_hero)}>
                <img src="/images/sub-pages/mikey-tube.jpg" />
            </div>
            <div className="container">
                <div className={classnames(styles.banner_bg_image_text, styles.banner_text_left)}>
                    <h1>A Mountain Biker’s<br /> Guide to Moab, Utah</h1>
                    <p>A first-timer’s guide to eating, camping, mountain biking, and more.</p>
                </div>
            </div>
            <div className={classnames(styles.moab_banner_icon)}>
                <img src="/images/sub-pages/bike.svg" />
            </div>
        </div>
        <div className={classnames(styles.search_box)}>
            <div className={classnames(styles.container, 'container')}>
                <div className={classnames(styles.search_box_inner)}>
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
                                <label>Resort/Hotel</label>
                                <select name="cars" id="cars">
                                  <option value="">Resort 1</option>
                                  <option value="">Resort 2</option>
                                  <option value="">Resort 3</option>
                                  <option value="">Resort 4</option>
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
