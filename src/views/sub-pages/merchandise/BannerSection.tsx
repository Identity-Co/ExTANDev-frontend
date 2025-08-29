// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode }: { mode: Mode }) => {

  return (
    <div className={classnames(styles.home_banner, styles.merch_banner)}>
        <div className={classnames(styles.banner_bg_image)}>
            <div className={classnames(styles.banner_bg_image_hero)}>
                <img src="/images/sub-pages/shirt-merch-header.jpg" />
            </div>
        </div>
    </div>
  )
}

export default BannerSection
