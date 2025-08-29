// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const AdventuresDetailSection3 = () => {
  
  return (
    <section className={classnames(styles.adv_details_sec3)}>
        <div className="container">
            <div className={classnames(styles.adv_map_box)}>
                <div className={classnames(styles.adv_map_image, 'center')}>
                    <img className="mx_100" src="/images/sub-pages/adv-map.svg" />
                </div>
            </div>
        </div>
    </section>
  )
}

export default AdventuresDetailSection3
