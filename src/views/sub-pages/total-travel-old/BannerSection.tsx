// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode, banners, accessToken }: { mode: Mode; banners?: []; accessToken?: any; }) => {
    const mainBanner = banners[0];

    return (
        <div className={classnames(styles.home_banner, styles.travel_banner, styles.search_box_3)}>
            {mainBanner && (
                <div className={classnames(styles.travel_banner_bg_image)}>
                    {mainBanner.banner_image ? (
                        <div
                          className={classnames(
                            accessToken
                              ? styles.travel_banner_bg_image_hero_loggedin
                              : styles.travel_banner_bg_image_hero
                          )}
                        >
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
        </div>
    )
}

export default BannerSection
