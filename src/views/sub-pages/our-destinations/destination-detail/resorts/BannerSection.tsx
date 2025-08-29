// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode }: { mode: Mode }) => {

  return (
    <div className={classnames(styles.home_banner)}>
        <div className={classnames(styles.banner_bg_image)}>
            <div className={classnames(styles.banner_bg_image_hero)}>
                <img src="/images/sub-pages/resort-banner.jpg" />
            </div>
            <div className="container">
                <div className={classnames(styles.banner_bg_image_text)}>
                    <h1 className="fs_90">Resorts</h1>
                </div>
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
