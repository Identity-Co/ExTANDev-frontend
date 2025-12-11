// React Imports
import React, { useEffect, useState, useRef } from 'react'

// Third-party Imports
import classnames from 'classnames'

import { filterDestination, filterDestinationByTags } from '@/app/server/destinations'

// Styles Imports
import styles from './styles.module.css'

type sectionProp = {
  sectionProps: {
  }
  hasParam
  isPaginated: false
}

const OurDestinationsFeaturedDestinations = ({ sectionProps, hasParam, isPaginated }: sectionProp) => {
    if(!sectionProps?.destinations?.data?.length)
      return false;

    const totalDestinations = parseInt(sectionProps?.destinations?.pagination?.totalItems)
    const [resortParam, setResortParam] = useState("");
    const [locationParam, setLocationParam] = useState("");
    const [currentDestinations, setCurrentDestinations] = useState(sectionProps?.destinations?.data)
    const [currentPage, setCurrentPage] = useState(1)
    const recordsPerPage = 9
    const totalPages = Math.ceil(totalDestinations / recordsPerPage)
    const sectionRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search);

      const _resort = searchParams.get("resort");
      const _location = searchParams.get("location");

      if(_location !== undefined && _location) {
        setLocationParam(_location)
      }

      if(_resort !== undefined && _resort) {
        setResortParam(_resort);
      }
    }, []);

    if(isPaginated && hasParam){

      useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const page = parseInt(params.get('page') || '1', 10)
        const clampedPage = Math.min(Math.max(page, 1), totalPages)

        setCurrentPage(clampedPage)

        const loadTours = async () => {
          await fetchTours(resortParam, locationParam, clampedPage)
        }

        loadTours()
      }, [totalPages])
    }

    const fetchTours = async (resort_: string, location_: string, page: number) => {
      let data: any = [];
      if(resort_ == 'Any Resorts'){
        data = await filterDestination("", "", page);
      }else{
        data = await filterDestinationByTags(resort_, location_, page)
      }
      setCurrentDestinations(data?.data)
    }

    const handlePageChange = (page: number) => {
      const clampedPage = Math.min(Math.max(page, 1), totalPages)
      setCurrentPage(clampedPage)

      const params = new URLSearchParams(window.location.search)
      params.set('page', clampedPage.toString())
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)

      fetchTours(resortParam, locationParam, clampedPage)

      sectionRef.current?.scrollIntoView({ behavior: 'smooth' })

      setTimeout(() => {
        window.scrollBy({
          top: -200,
          behavior: 'smooth'
        })
      }, 300)

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
        <section className={classnames(...sectionProps.class?.split(' ').map(cls => styles[cls]).filter(Boolean), sectionProps.general_class?.trim() || '')} ref={sectionRef}>
          <div className={classnames('container')}>
            <div className={classnames(styles.head_text_center, 'head_text_center')}>
              <h2 className={sectionProps.heading_class || ''}>Featured Destinations</h2>
            </div>
            <div className={classnames(styles.feature_desti_row)}>
                {currentDestinations?.map((item, index) => {
                  const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/our-destinations/${item?.page_url ?? ''}`;

                  const exploreUrl = resortParam === "Any Resorts" ? `${baseUrl}?hide_resorts=1` : baseUrl;

                  return (
                    <div key={index} className={classnames(styles.network_travel_box)}>
                      <div className={classnames(styles.network_travel_top)}>
                        <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href={exploreUrl} tabIndex="0"></a>
                        <div className={classnames(styles.network_travel_img)}>
                          <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${item?.image}`} />
                        </div>
                        <div className={classnames(styles.network_travel_img_text)}>
                          {item?.title && <h3 className={sectionProps.box_title_class?.trim() || ''}>{item?.title}</h3>}
                          {item?.sub_title && <p>{item?.sub_title}</p>}
                          <div className={classnames(styles.btn, 'btn')}>
                            <a href={exploreUrl}>Explore</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

            </div>

            {sectionProps.destinations.length == 0 && (<h2 align="center"> Comming Soon </h2>)}
          </div>

          {(isPaginated && hasParam) && (
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
          )}
        </section>
    )
}

export default OurDestinationsFeaturedDestinations
