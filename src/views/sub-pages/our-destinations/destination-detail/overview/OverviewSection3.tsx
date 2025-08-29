// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OverviewSection3 = () => {
  
  return (
    <section className={classnames(styles.destination_overview_sec3, 'pt_100')}>
        <div className="container">
            <div className="grid2 item_center gap_40">
                <div className={classnames(styles.grid_box)}>
                    <div className="full_img">
                        <img className="bx_sd" src="/images/sub-pages/untamed.jpg" />
                    </div>
                </div>
                <div className={classnames(styles.grid_box)}>
                    <h2 className="fs_55">Untamed & Unforgettable</h2>
                    <p>The Dominican Republic is a stunning Caribbean paradise where breathtaking natural beauty meets heart-pounding adventure. From its pristine white-sand beaches and lush mountain landscapes to its vibrant culture and warm hospitality, the island offers something for every traveler.</p>
                    <p>Beyond the postcard-perfect scenery lies a world of exhilarating activities—ziplining through jungle canopies, horseback riding to hidden waterfalls, rafting down rushing rivers, or hiking dramatic peaks. Whether you crave relaxation or adrenaline, the Dominican Republic delivers an unforgettable blend of serenity and excitement in one unforgettable destination.</p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default OverviewSection3