// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const StorySection1 = () => {
  
  return (
    <section className={classnames(styles.home_section1, styles.our_desti_sec1, styles.destination_overview_sec1)}>
        <div className={classnames(styles.container, 'container')}>
            <div className={classnames(styles.destination_overview_tab)}>
                <ul className={classnames(styles.destination_tab)}>
                    <li><a href="#">Overview</a></li>
                    <li><a href="#">Resorts</a></li>
                    <li><a href="#">Adventures</a></li>
                    <li className={classnames(styles.active)}><a href="#">Stories</a></li>
                </ul>
            </div>
            <div className={classnames(styles.head_text_center, 'head_text_center')}>
                <div className={classnames(styles.adventure_right_text)}>
                    <h2 className="fs_70">Travel stories</h2>
                    <p><span className="extra_bold"><em>We love hearing about your adventures.</em></span> We encourage the Adventure Network community comes to share and connect. Whether it’s a photo from the trail, a journal from the jungle, or a memory that won’t fade, your story might just inspire someone else’s next great escape. </p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default StorySection1
