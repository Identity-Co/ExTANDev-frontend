// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const BlogDetailSection2 = () => {
  
  return (
    <div className={classnames(styles.stories_details_sec2, styles.moab_sec2, 'pb_150')}>
        <div className="container">
            <div className={classnames(styles.stories_details_image)}>
                <div className="full_img">
                    <img src="/images/sub-pages/moab1.jpg" />
                </div>
                <span className={classnames(styles.img_alt)}>After a long and brutal ride on the hardtail in Moab, the TOPO2 MTB camper was an oasis of recovery.  Photo: Deven McCoy</span>
            </div>
        </div>
        <div className={classnames(styles.container_smll)}>
            <div className={classnames(styles.stories_details_text)}>
                <p>I stayed in early March, and the temperatures were moderate during the day, ranging from the high 50s to 60s, and dropped to the low 40s / high 30s at night. I stayed in the Sand Flats Campground with an RV for the weekend and was impressed with the trail access to Slickrock and Above Abyss on the first day. On my last full day, I pedaled up from camp to Porcupine Rim and the Raptor Route.</p>
                <h3 className={classnames(styles.py_24, 'fs_35')}>Sand Flats ($15)</h3>
                <p>Located just outside of town and the gateway to Porcupine Rim, Raptor Route, and Slickrock, this is a great place to park the car and pitch a tent if you want to ride from camp during your visit. This campground is relatively primitive, featuring vault toilets and lacking potable water. Campsites operate on a first-come, first-served basis.</p>
            </div>
        </div>
        <div className="container">
            <div className={classnames(styles.stories_details_image)}>
                <div className="full_img">
                    <img src="/images/sub-pages/moab2.jpg" />
                </div>
                <span className={classnames(styles.img_alt)}>Sunset from Sand Flats Campground.  Photo: Deven McCoy</span>
            </div>
        </div>
        <div className={classnames(styles.container_smll)}>
            <div className={classnames(styles.stories_details_text)}>
                <h3 className={classnames(styles.pb_24, 'fs_35')}>Big Bend ($15)</h3>
                <p>Located about 20 minutes from Moab, Big Bend campground can be found along Hwy 128. It sits on the banks of the Colorado River, offering great spots for kicking back at the end of a long day of riding. The Porcupine Rim trailhead is just a few miles away, so you can ride back to camp after shuttling or climbing up to the top. This campground is relatively primitive, featuring vault toilets and lacking potable water. Campsites operate on a first-come, first-served basis.</p>
                <h3 className={classnames(styles.py_24, 'fs_35')}>Klondike Bluffs ($15)</h3>
                <p>Enjoy great views of Arches National Park and Klondike Bluffs trails from this spot. Cell service is spotty at best, so don’t expect to be scrolling TikTok while out here. Klondike Bluffs Road is about 15 miles from Arches National Park and slightly further to Moab. The road has rocky sections but is passable by most vehicles. It has numerous camping areas, with the first eight spots having space for larger RVs and trailers. Another primitive site features vault toilets, lacks potable water, and operates on a first-come, first-served basis or reservations for group spots.</p>
                <h3 className={classnames(styles.py_24, 'fs_35')}>Willow Springs ($15)</h3>
                <p>Recently incorporated into the Utahraptor State Park, this rustic site will blow your mind with views and access to the Klonzo trail system right up the road. There is a lot of space for RVs and bigger vehicles here, but there is a lack of amenities, and you will find pit toilets and no potable water.</p>
            </div>
        </div>
        <div className="container">
            <div className={classnames(styles.stories_details_image)}>
                <div className="full_img">
                    <img src="/images/sub-pages/moab3.jpg" />
                </div>
                <span className={classnames(styles.img_alt)}>Up The Creek Campground entrance in Moab, Utah.  Photo: Up The Creek Campground</span>
            </div>
        </div>
    </div>
  )
}

export default BlogDetailSection2
