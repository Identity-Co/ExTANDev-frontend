// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const MerchandiseSection3 = () => {
  
  return (
    <section className={classnames(styles.merch_sec3)}>
        <div className={classnames(styles.merch_club)}>
            <div className="full_img">
                <img src="/images/sub-pages/adventure-beach-girl-copy-2.jpg" />
            </div>
            <div className="container">
                <div className={classnames(styles.join_club, 'bx_sd')}>
                    <h4 className="fs_35">Join our merch club to receive monthly promos</h4>
                    <span>Type your email below and <span className="extra_bold"><em>Get Out There.</em></span></span>
                    <div className={classnames(styles.promos)}>
                        <div className={classnames(styles.pomos_box)}>
                            <input type="email" placeholder="Add your email here" />
                        </div>
                        <div className={classnames(styles.pomos_box)}>
                            <input type="submit" value="Send" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default MerchandiseSection3
