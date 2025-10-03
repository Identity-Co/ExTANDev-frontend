// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode, data, bannerImage }: { mode: Mode; data?: []; bannerImage?: ''; }) => {
  return (
    <div className={classnames(styles.home_banner, styles.merch_banner)}>
        <div className={classnames(styles.banner_bg_image)}>
            {bannerImage && (
                <div className={classnames(styles.banner_bg_image_hero)}>
                    <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${bannerImage}`} alt="Banner Image" />
                </div>
            )}
        </div>
    </div>
  )
}

export default BannerSection
