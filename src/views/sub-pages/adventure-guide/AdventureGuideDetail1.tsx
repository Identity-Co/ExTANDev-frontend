import React, { useEffect, useState, useRef } from 'react'
// Third-party Imports
import classnames from 'classnames'

import { getAllAdventureGuides } from '@/app/server/adventure_guide'

// Styles Imports
import styles from './styles.module.css'

const BlogDetailSection1 = ({ data, mainPgData }: { data?: []; mainPgData?: []; }) => {
    const totalAdventurePosts = parseInt(data?.total)
    const [currentAdventurePosts, setCurrentAdventurePosts] = useState(data?.data)
    const [currentPage, setCurrentPage] = useState(1)
    const recordsPerPage = 12
    const totalPages = Math.ceil(totalAdventurePosts / recordsPerPage)
    const sectionRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const params = new URLSearchParams(window.location.search)
      const page = parseInt(params.get('page') || '1', 10)
      const clampedPage = Math.min(Math.max(page, 1), totalPages)

      setCurrentPage(clampedPage)

      const loadTours = async () => {

        await fetchAdvPosts(clampedPage)
      }

      loadTours()
    }, [totalPages])

    const fetchAdvPosts = async (page: number) => {
      const data = await getAllAdventureGuides('https://surfer.com/.rss/feed/07d7f01a-6514-4c7a-b782-251f979a691a.xml', 'Surf Culture', page, recordsPerPage);
      setCurrentAdventurePosts(data?.data)
    }

    const handlePageChange = (page: number) => {
      const clampedPage = Math.min(Math.max(page, 1), totalPages)
      setCurrentPage(clampedPage)

      const params = new URLSearchParams(window.location.search)
      params.set('page', clampedPage.toString())
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)

      fetchAdvPosts(clampedPage)

      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
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
        <section className={classnames(styles.ambassadorship_sec1, styles.blog_section, "py_100")} ref={sectionRef}>
          <div className="container">
              <div className="head_text_center">
                  {mainPgData?.listing_title && (
                    <h3 className="fs_35">{mainPgData.listing_title}</h3>
                  )}
              </div>
              <div className="grid3 gap_40">
                  {currentAdventurePosts?.map((item, index) => {

                    let url: string = '';
                    let fImage: string = '';

                    if(item?.external){
                      url = item?.link;
                      fImage = item?.image;
                    }else{
                      url = `/adventure-guide/${item.page_url}`;
                      fImage = `${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${item.feature_image}`;
                    }

                    return (
                      <div key={index} className={classnames(styles.grid_box)}>
                        <div className={classnames(styles.blog_box)}>
                          <div className={classnames(styles.shop_merch)}>
                            <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href={url} target={item?.external ? "_blank" : undefined}></a>

                            {fImage && (
                              <div className={classnames(styles.shop_merch_img)}>
                                <img
                                  className="bx_sd"
                                  src={fImage}
                                  alt={item.title}
                                />
                              </div>
                            )}

                            <div className={classnames(styles.merch_info)}>
                              {item.title && <h4>{item.title}</h4>}
                              <div className={classnames(styles.btn, 'btn')}>
                                <a href={url} target={item?.external ? "_blank" : undefined}>Read More</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
          </div>
          {(totalAdventurePosts > 9) && (
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

export default BlogDetailSection1
