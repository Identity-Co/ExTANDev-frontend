// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode, data }: { mode: Mode; data?: []; }) => {
  return (
    <div className={classnames(styles.home_banner, styles.merch_banner)}>
        <div className={classnames(styles.banner_bg_image)}>
            {data?.banner_image && (
                <div className={classnames(styles.banner_bg_image_hero)}>
                    <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data?.banner_image}`} alt="Banner Image" />
                </div>
            )}
        </div>
        <div className="container">
            {data?.banner_title && (
                <div className={classnames(styles.banner_bg_image_text)}>
                    <h1 className={data?.banner_title_font_size ? `${data.banner_title_font_size}` : ''}>{data.banner_title}</h1>
                </div>
            )}
        </div>
    </div>
  )
}

export default BannerSection
