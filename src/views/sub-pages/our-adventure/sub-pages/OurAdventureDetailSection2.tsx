// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureDetailSection1 = () => {
  
  return (
    <section className={classnames(styles.our_desti_sec2, styles.destination_overview_sec2, styles.adven_detl_sec2)}>
        <div className="container">
            <div className="grid2 item_center gap_64">
                <div className={classnames(styles.grid_box)}>
                    <p><span>Get off the beaten path and into the water with our Costa Rica Surf Adventure—</span> an unforgettable journey along one of the most biodiverse coastlines in the world. From the laid-back beaches of Nosara to the powerful breaks of Dominical, you’ll ride waves framed by lush jungle and volcanic cliffs. Whether you’re a seasoned surfer chasing the perfect swell or a beginner looking to find your footing, our expert local guides will take you to the best spots for your level.</p>
                    <p>In between surf sessions, explore waterfalls, unwind in coastal villages, and soak in the pura vida lifestyle that makes Costa Rica so legendary. This is more than just a surf trip—it’s an immersive adventure into the heart of wild, wave-rich paradise.</p>
                </div>
                <div className={classnames(styles.grid_box)}>
                    <div className="full_img">
                        <img className="bx_sd" src="/images/sub-pages/surf-wolk.jpg" />
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default OurAdventureDetailSection1
