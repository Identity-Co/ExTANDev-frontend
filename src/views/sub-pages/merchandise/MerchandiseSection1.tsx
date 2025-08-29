// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const MerchandiseSection1 = () => {
  
  return (
    <section className={classnames(styles.ambassadorship_sec1, styles.merch_sec1, 'py_100')}>
        <div className="container">
            <div className={classnames(styles.head_text_center, 'head_text_center')}>
                <h3 className="fs_44">Shop adventure network merch</h3>
            </div>
            <div className="grid2 gap_48">
                <div className={classnames(styles.grid_box)}>
                    <div className={classnames(styles.shop_merch)}>
                        <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href="#"></a>
                        <div className={classnames(styles.shop_merch_img)}>
                            <img className="bx_sd" src="/images/sub-pages/adventure-merch-cool-badge.jpg" />
                        </div>
                        <div className={classnames(styles.merch_info)}>
                            <h4>Mens products</h4>
                            <div className={classnames(styles.btn, 'btn')}>
                                <a href="#">Shop now</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.grid_box)}>
                    <div className={classnames(styles.shop_merch)}>
                        <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href="#"></a>
                        <div className={classnames(styles.shop_merch_img)}>
                            <img className="bx_sd" src="/images/sub-pages/merch-main-girl.jpg" />
                        </div>
                        <div className={classnames(styles.merch_info)}>
                            <h4>woMens products</h4>
                            <div className={classnames(styles.btn, 'btn')}>
                                <a href="#">Shop now</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default MerchandiseSection1
