// React Imports
import { useEffect, useRef, useState } from 'react'

// Third-party Imports
import classnames from 'classnames'

import { getFilteredTours, getFilteredCount } from '@/app/server/tours'

// Styles Imports
import styles from './styles.module.css'

const AdventuresSection2 = ({ data, isOverviewDetailPage, setIsOverviewDetailPage, isOverviewDetailPageID, setIsOverviewDetailPageID, dest_data, currentTours, setCurrentTours, currentCat }: { data?: []; isOverviewDetailPage; setIsOverviewDetailPage; isOverviewDetailPageID?: ''; setIsOverviewDetailPageID; dest_data?: any; currentTours?: []; setCurrentTours?: any; currentCat?: any; setCurrentCat: any; }) => {
    
    const [currentPage, setCurrentPage] = useState(1)
    const [totalTours, setTotalTours] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const recordsPerPage = 12

    const fetchTours = async (category: string, destination: string, page: number) => {
        const t_data = await getFilteredTours(category, destination, page);
        setCurrentTours(t_data || []);
    };

    const fetchTourCount = async(category: string, destination: string) => {
        const t_count = await getFilteredCount(category, destination);
        console.log("Total Count:: ", t_count);
        setTotalTours(t_count || 1);
    }

    useEffect(() => {
        setTotalPages(Math.ceil(totalTours / recordsPerPage));
        console.log("Total Pages:: ", totalPages);
    }, [totalTours]);


    /*const fetchTours = async () => {
        const t_count = await getFilteredCount(currentCat, dest_data.destination_location)
        const t_data = await getFilteredTours(currentCat, dest_data.destination_location, currentPage)

        setTotalTours(t_count)
        setCurrentTours(t_data)

        const totalPgs = Math.ceil(t_count / recordsPerPage)
        setTotalPages(totalPgs)
    }*/

    useEffect(() => {
        console.log(currentCat);
        fetchTours(currentCat, dest_data.destination_location, 1);
        fetchTourCount(currentCat, dest_data.destination_location);
        // setCurrentPage(1)
    }, [currentCat]);

    const handlePageChange = (page: number) => {
      const clampedPage = Math.min(Math.max(page, 1), totalPages)
      setCurrentPage(clampedPage)

      fetchTours(currentCat, dest_data.destination_location, clampedPage)
      // fetchTours()
    }

    const getPaginationRange = (
      currentPage: number,
      totalPages: number,
      delta = 3
    ): (number | string)[] => {
      if (totalPages <= 1) return []

      const range: (number | string)[] = []
      const left = Math.max(currentPage - delta, 2)
      const right = Math.min(currentPage + delta, totalPages - 1)

      range.push(1)
      if (left > 2) range.push('...')
      for (let i = left; i <= right; i++) range.push(i)
      if (right < totalPages - 1) range.push('...')
      range.push(totalPages)

      return range
    }
    

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // optional for smooth scrolling
      });
    };
  
  return (
    <section className={classnames(styles.our_desti_sec2)}>
        <div className="container">
            {/* <div className={classnames(styles.feature_desti_row)}>
                {data?.map((item, index) => (
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

            {!data.length && (
                <h2 align="center"> No Data Found. </h2>
            )} */}



            <div className={classnames(styles.feature_desti_row, styles.feature_adven_row)}>
                {currentTours?.map((tour) => {
                    const price = tour.departures?.[0]?.lowest_price ?? "N/A";
                    const startDate = tour.departures?.[0]?.start_date
                      ? new Date(tour.departures[0].start_date).toLocaleDateString()
                      : "N/A";
                    return (
                        <div className={classnames(styles.feature_adven_box)} key={tour._id}>
                            <div className={classnames(styles.feature_adven_top)}>
                                <div className={classnames(styles.feature_adven_img)}>
                                    <img className="bx_sd" src={tour.image} />
                                </div>
                            </div>
                            <div className={classnames(styles.feature_adven_bot)}>
                                <h3>{tour.name}</h3>
                                <span className={classnames(styles.days_price)}><span className="extra_bold">{tour.tour_days}</span> days   |  from <span className="extra_bold">USD {tour.start_price}</span>/pp <span className={classnames(styles.taxes)}>(price includes taxes and fees)</span></span>
                                <p>{tour.description
                                    .split(' ')
                                    .slice(0, 50)
                                    .join(' ')}
                                  {tour.description.split(' ').length > 50 ? '...' : ''}</p>
                                <div className={classnames(styles.btn, 'btn')}>
                                    <a href={`/our-adventure/${tour.slug}/`} tabIndex="0">View Trip</a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
             <div className={styles.pagination}>
                
              {getPaginationRange(currentPage, totalPages).map((page, idx) =>
                typeof page === 'string' ? (
                  <span key={idx} className={styles.ellipsis}>{page}</span>
                ) : (
                  <button
                    key={idx}
                    className={classnames({ [styles.active]: page === currentPage })}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div> 
        </div>
    </section>
  )
}

export default AdventuresSection2
