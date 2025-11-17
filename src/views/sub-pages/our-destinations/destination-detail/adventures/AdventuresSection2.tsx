// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const AdventuresSection2 = ({ data, isOverviewDetailPage, setIsOverviewDetailPage, isOverviewDetailPageID, setIsOverviewDetailPageID }: { data?: []; isOverviewDetailPage; setIsOverviewDetailPage; isOverviewDetailPageID?: ''; setIsOverviewDetailPageID; }) => { 

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // optional for smooth scrolling
      });
    };
  
  return (
    <section className={classnames(styles.our_desti_sec2)}>
        <div className="container">
            <div className={classnames(styles.feature_desti_row)}>
                {data?.adventure_lists?.map((item, index) => (
                    <div key={index} className={classnames(styles.network_travel_box)}>
                        <div className={classnames(styles.network_travel_top)}>
                            <a onClick={(e) => {
                            e.preventDefault();
                            setIsOverviewDetailPageID(item?._id);
                            setIsOverviewDetailPage(true);
                            scrollToTop();
                          }}></a>
                            <div className={classnames(styles.network_travel_img)}>
                                <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${item.feature_image}`} />
                            </div>
                            <div className={classnames(styles.network_travel_img_text)}>
                                {item?.title && ( <h3 className="fs_70">{item?.title}</h3> )}
                                <div className={classnames(styles.btn, 'btn')}>
                                    <a onClick={(e) => {
                                        e.preventDefault();
                                        setIsOverviewDetailPageID(item?._id);
                                        setIsOverviewDetailPage(true);
                                        scrollToTop();
                                      }}>Explore</a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default AdventuresSection2
