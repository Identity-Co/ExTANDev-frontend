// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const ToursListing = ({ data, toursData }: { data?: []; toursData?: []; }) => {
  
  console.log('toursData: ', toursData)

  return (
    <section className={classnames(styles.our_desti_sec2, styles.our_adven_sec2, 'mb-10')}>
        <div className="container">
            <div className="head_text_center">
                {data?.feature_adventure_title && (<h2 className={classnames("fs_55")}>{data?.feature_adventure_title}</h2>)}
            </div>
            <div className={classnames(styles.feature_desti_row, styles.feature_adven_row)}>

                {toursData.map((tour) => {
                    const price = tour.departures?.[0]?.lowest_price ?? "N/A";
                    const startDate = tour.departures?.[0]?.start_date
                      ? new Date(tour.departures[0].start_date).toLocaleDateString()
                      : "N/A";
                    return (
                        <div className={classnames(styles.feature_adven_box)}>
                            <div className={classnames(styles.feature_adven_top)}>
                                <div className={classnames(styles.feature_adven_img)}>
                                    <img className="bx_sd" src={tour.image} />
                                </div>
                            </div>
                            <div className={classnames(styles.feature_adven_bot)}>
                                <h3>{tour.name}</h3>
                                <span className={classnames(styles.days_price)}><span className="extra_bold">{tour.tour_days}</span> days   |  from <span className="extra_bold">USD {tour.start_price}</span>/pp <span className={classnames(styles.taxes)}>(price includes taxes and fees)</span></span>
                                <p>{tour.description}</p>
                                <div className={classnames(styles.btn, 'btn')}>
                                    <a href={tour.site_url} tabIndex="0">View Trip</a>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    </section>
  )
}

export default ToursListing
