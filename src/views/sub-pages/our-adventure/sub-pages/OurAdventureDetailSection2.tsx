// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureDetailSection1 = ({ tour }: { tour: any; }) => {
  
  return (
    <section className={classnames(styles.our_desti_sec2, styles.destination_overview_sec2, styles.adven_detl_sec2)}>
        <div className="container">
            <div className="grid2 item_center gap_64">
                <div className={classnames(styles.grid_box)}>
                    <p>{tour.description}</p>
                </div>
                <div className={classnames(styles.grid_box)}>
                    <div className="full_img">
                        <img className="bx_sd" src={tour.image} />
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default OurAdventureDetailSection1
