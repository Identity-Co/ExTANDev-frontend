// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode }: { mode: Mode }) => {

  return (
    <section className={classnames(styles.cta_section, styles.ambassadorship_banner, 'py_150')}></section>
  )
}

export default BannerSection
