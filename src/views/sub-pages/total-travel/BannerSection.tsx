// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode, banners }: { mode: Mode; banners?: [] }) => {
    const mainBanner = banners[0];

    return (
        <div className={classnames(styles.home_banner, styles.travel_banner, styles.search_box_3)}>
            {mainBanner && (
                <div className={classnames(styles.travel_banner_bg_image)}>
                    {mainBanner.banner_image ? (
                        <div className={classnames(styles.travel_banner_bg_image_hero)}>
                            <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${mainBanner.banner_image}`} />
                        </div>
                    ) : null}
                    <div className={classnames(styles.travel_banner_bg_image_text)}>
                        <div className={classnames(styles.hero_slide_container)}>
                            <div className={classnames(styles.hero_slide_text)}>
                                {mainBanner.title ? (<h1>{mainBanner.title}</h1>) : null}
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
