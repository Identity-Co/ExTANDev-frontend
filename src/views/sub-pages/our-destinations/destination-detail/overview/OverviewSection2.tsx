// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OverviewSection2 = () => {
  
  return (
    <section className={classnames(styles.our_desti_sec2, styles.destination_overview_sec2)}>
        <div className="container">
            <div className="grid2 item_center gap_40">
                <div className={classnames(styles.grid_box)}>
                    <span>The Dominican people are known around the world for their warmth, energy, and open-hearted hospitality.</span>
                    <p>They’re some of the friendliest people you’ll ever meet—always quick with a smile, a laugh, or a helping hand. Their passion infuses every part of life, from the rapid-fire rhythm of their conversations to the vibrant colors of their clothing, the lively beats of merengue and bachata, and the joy they bring to every celebration.</p>
                    <p>Whether you’re exploring a mountain village or walking through a bustling city square, you’ll feel their welcoming spirit. In the Dominican Republic, strangers quickly become friends—and every visitor is treated like family.</p>
                </div>
                <div className={classnames(styles.grid_box)}>
                    <div className="full_img">
                        <img className="bx_sd" src="/images/sub-pages/dom-dance.jpg" />
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default OverviewSection2
