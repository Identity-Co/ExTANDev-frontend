// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const AdventuresDetailSection2 = () => {
  
  return (
    <section className={classnames(styles.adv_details_sec2, 'pb_100')}>
        <div className="container">
            <h2 className="fs_55 c_black">Top 5 Spots for Mountain Biking in the Dominican Republic</h2>
            <div className={classnames(styles.spots_main)}>
                <div className={classnames(styles.spots_row)}>
                    <div className={classnames(styles.spots_small)}>
                        <div className="full_img">
                            <img className="bx_sd" src="/images/sub-pages/spots1.jpg" />
                        </div>
                    </div>
                    <div className={classnames(styles.spots_big)}>
                        <h3 className="fs_35"><span>1.</span> El Choco National Park</h3>
                        <p><span className="extra_bold"><em>El Choco National Park is the most popular spot for mountain biking in the Dominican Republic with over 30 square miles of stunning nature to be explored.</em></span> Thick tropical forests can be explored by a number of different mountain biking routes, varying in difficulty. Most are well maintained throughout the year. As you ascend through the hills you’ll come across local farms, mansions, and ranches. The trails here can be tough so make sure you rent the appropriate equipment. The end goal here is the sublime view from the top of El Choco Mountain that will blow you away. The panorama takes in a beautiful view of Cabarete all the way along to Nagua.</p>
                    </div>
                </div>
                <div className={classnames(styles.spots_row, styles.rivers_row)}>
                    <div className={classnames(styles.spots_big)}>
                        <h3 className="fs_35"><span>2.</span> Cabarete</h3>
                        <p><span className="extra_bold"><em>El Choco National Park is the most popular spot for mountain biking in the Dominican Republic with over 30 square miles of stunning nature to be explored.</em></span> Thick tropical forests can be explored by a number of different mountain biking routes, varying in difficulty. Most are well maintained throughout the year. As you ascend through the hills you’ll come across local farms, mansions, and ranches. The trails here can be tough so make sure you rent the appropriate equipment. The end goal here is the sublime view from the top of El Choco Mountain that will blow you away. The panorama takes in a beautiful view of Cabarete all the way along to Nagua.</p>
                    </div>
                    <div className={classnames(styles.spots_small)}>
                        <div className="full_img">
                            <img className="bx_sd" src="/images/sub-pages/spots2.jpg" />
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.spots_row)}>
                    <div className={classnames(styles.spots_small)}>
                        <div className="full_img">
                            <img className="bx_sd" src="/images/sub-pages/spots3.jpg" />
                        </div>
                    </div>
                    <div className={classnames(styles.spots_big)}>
                        <h3 className="fs_35"><span>3.</span> Barahona</h3>
                        <p><span className="extra_bold"><em>El Choco National Park is the most popular spot for mountain biking in the Dominican Republic with over 30 square miles of stunning nature to be explored.</em></span> Thick tropical forests can be explored by a number of different mountain biking routes, varying in difficulty. Most are well maintained throughout the year. As you ascend through the hills you’ll come across local farms, mansions, and ranches. The trails here can be tough so make sure you rent the appropriate equipment. The end goal here is the sublime view from the top of El Choco Mountain that will blow you away. The panorama takes in a beautiful view of Cabarete all the way along to Nagua.</p>
                    </div>
                </div>
                <div className={classnames(styles.spots_row, styles.rivers_row)}>
                    <div className={classnames(styles.spots_big)}>
                        <h3 className="fs_35"><span>4.</span> Constanza</h3>
                        <p><span className="extra_bold"><em>El Choco National Park is the most popular spot for mountain biking in the Dominican Republic with over 30 square miles of stunning nature to be explored.</em></span> Thick tropical forests can be explored by a number of different mountain biking routes, varying in difficulty. Most are well maintained throughout the year. As you ascend through the hills you’ll come across local farms, mansions, and ranches. The trails here can be tough so make sure you rent the appropriate equipment. The end goal here is the sublime view from the top of El Choco Mountain that will blow you away. The panorama takes in a beautiful view of Cabarete all the way along to Nagua.</p>
                    </div>
                    <div className={classnames(styles.spots_small)}>
                        <div className="full_img">
                            <img className="bx_sd" src="/images/sub-pages/spots4.jpg" />
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.spots_row)}>
                    <div className={classnames(styles.spots_small)}>
                        <div className="full_img">
                            <img className="bx_sd" src="/images/sub-pages/spots5.jpg" />
                        </div>
                    </div>
                    <div className={classnames(styles.spots_big)}>
                        <h3 className="fs_35"><span>5.</span> Jarabacoa</h3>
                        <p><span className="extra_bold"><em>El Choco National Park is the most popular spot for mountain biking in the Dominican Republic with over 30 square miles of stunning nature to be explored.</em></span> Thick tropical forests can be explored by a number of different mountain biking routes, varying in difficulty. Most are well maintained throughout the year. As you ascend through the hills you’ll come across local farms, mansions, and ranches. The trails here can be tough so make sure you rent the appropriate equipment. The end goal here is the sublime view from the top of El Choco Mountain that will blow you away. The panorama takes in a beautiful view of Cabarete all the way along to Nagua.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default AdventuresDetailSection2
