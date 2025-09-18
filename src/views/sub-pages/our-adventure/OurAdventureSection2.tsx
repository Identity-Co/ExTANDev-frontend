// React Imports
import { useEffect, useState } from 'react'

import { getFilteredTours } from '@/app/server/tours'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OurAdventureSection2 = ({ data, toursData, totalTours }: { data?: []; toursData?: []; totalTours?: 0; }) => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [currentTours, setCurrentTours] = useState(toursData)
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 12
  const totalPages = Math.ceil(totalTours / recordsPerPage)

  const fetchTours = async (category: number, destination: string, page: number) => {
    const data = await getFilteredTours(category, destination, page)
    setCurrentTours(data)
  }

  // Update currentPage from URL query if exists
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const page = parseInt(params.get('page') || '1', 10)
    const clampedPage = Math.min(Math.max(page, 1), totalPages)

    setCurrentPage(clampedPage)

    const categoryFromUrl = params.get('category') || ''
    const destinationFromUrl = params.get('destination') || ''
    setSelectedCategory(categoryFromUrl)
    setSelectedDestination(destinationFromUrl)

    const loadTours = async () => {
      await fetchTours(categoryFromUrl, destinationFromUrl, clampedPage)
    }

    //fetchTours(categoryFromUrl, destinationFromUrl, page)
    loadTours()
  }, [totalPages])

    // Handle page change
    const handlePageChange = (page: number) => {
      const clampedPage = Math.min(Math.max(page, 1), totalPages)
      setCurrentPage(clampedPage)

      const params = new URLSearchParams(window.location.search)
      params.set('page', clampedPage.toString())
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)

      fetchTours(selectedCategory, selectedDestination, clampedPage)
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

  return (
    <section className={classnames(styles.our_desti_sec2, styles.our_adven_sec2)}>
        <div className="container">
            <div className="head_text_center">
                {data?.feature_adventure_title && (<h2 className={classnames("fs_55")}>{data?.feature_adventure_title}</h2>)}
            </div>
            <div className={classnames(styles.feature_desti_row, styles.feature_adven_row)}>

                {currentTours.map((tour) => {
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
                                    <a href={tour.site_url} tabIndex="0">View Trip</a>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Pagination */}
                
            </div>
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

export default OurAdventureSection2
