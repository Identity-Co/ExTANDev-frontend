// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode, data }: { mode: Mode; data?: []; }) => {
  return (
    <div className={classnames(styles.home_banner, styles.moab_banner)}>
        <div className={classnames(styles.banner_bg_image)}>
            <div className={classnames(styles.banner_bg_image_hero)}>
                {data?.banner_image && (
                    <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${data.banner_image}`} />
                )}
            </div>
            <div className="container">
                <div className={classnames(styles.banner_bg_image_text, styles.banner_text_left)}>
                    {/*<h1>A Mountain Biker’s<br /> Guide to Moab, Utah</h1>*/}
                    {data?.title && (
                        <h1>{data.title}</h1>
                    )}

                    {data?.banner_description && (
                        <p>{data.banner_description}</p>
                    )}
                </div>
            </div>
            {data?.site_logo && (
                <div className={classnames(styles.moab_banner_icon)}>
                    <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${data.site_logo}`} />
                </div>
            )}
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
