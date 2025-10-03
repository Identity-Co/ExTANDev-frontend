// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode, data }: { mode: Mode; data?: [] }) => {

  return (
    <div className={classnames(styles.home_banner, styles.merch_banner)}>
        <div className={classnames(styles.banner_bg_image)}>
            <div className={classnames(styles.banner_bg_image_hero)}>
                {data && (
                    <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data}`} />
                )}
            </div>
        </div>
    </div>
  )
}

export default BannerSection
