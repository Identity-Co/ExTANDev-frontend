// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const BlogDetailSection5 = () => {
  
  return (
    <section className={classnames(styles.moab_sec4, 'pb_100')}>
        <div className="container">
            <div className={classnames(styles.home_testimonial)}>
                <div className={classnames(styles.qt_img)}>
                    <img src="/images/sub-pages/qt.png" />
                </div>
                <div className={classnames(styles.testimonial_box)}>
                    <p className="fs_55">MOAB LEAVES IT’S MARK – not just in dust on your gear, but in the memories etched in every red rock vista.”</p>
                    <div className={classnames(styles.testi_auth)}>
                        <div className={classnames(styles.testi_auth_image)}>
                            <img src="/images/sub-pages/testi-auth.jpg" />
                        </div>
                        <div className={classnames(styles.auth_name)}>
                            <span>By Devin McCoy</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default BlogDetailSection5
