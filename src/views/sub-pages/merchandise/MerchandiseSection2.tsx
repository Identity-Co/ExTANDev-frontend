// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const MerchandiseSection2 = () => {
  
  return (
    <section className={classnames(styles.merch_sec2)}>
        <div className="container">
            <div className={classnames(styles.head_text_center, 'head_text_center')}>
                <h3 className="fs_44">Shop by category</h3>
            </div>
            <div className="grid3 gap_24">
                <div className={classnames(styles.grid_box)}>
                    <div className={classnames(styles.shop_merch)}>
                        <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href="#"></a>
                        <div className={classnames(styles.shop_merch_img)}>
                            <img className="bx_sd" src="/images/sub-pages/adventure-bottle-copy-2.jpg" />
                        </div>
                        <div className={classnames(styles.merch_info)}>
                            <div className={classnames(styles.btn, 'btn')}>
                                <a href="#">Accessories</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.grid_box)}>
                    <div className={classnames(styles.shop_merch)}>
                        <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href="#"></a>
                        <div className={classnames(styles.shop_merch_img)}>
                            <img className="bx_sd" src="/images/sub-pages/adventure-back-pack-copy.jpg" />
                        </div>
                        <div className={classnames(styles.merch_info)}>
                            <div className={classnames(styles.btn, 'btn')}>
                                <a href="#">Gear</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.grid_box)}>
                    <div className={classnames(styles.shop_merch)}>
                        <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href="#"></a>
                        <div className={classnames(styles.shop_merch_img)}>
                            <img className="bx_sd" src="/images/sub-pages/Rectangle-4333.jpg" />
                        </div>
                        <div className={classnames(styles.merch_info)}>
                            <div className={classnames(styles.btn, 'btn')}>
                                <a href="#">Luggage</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default MerchandiseSection2
