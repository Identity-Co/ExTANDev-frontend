// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const HomeSection1 = ({ data }: { data?: []; }) => {
  
  return (
    <section className={classnames(styles.home_section1, 'pb_100')}>
      <div className={classnames(styles.container, 'container')}>
        <div className={classnames("grid2 gap_64 item-center")}>
          <div className={classnames("grid-column")}>
            <div className={classnames(styles.bamboo_boat, 'full-img')}>
              {data?.about_image ? (
                <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data?.about_image}`} style={{width: '100%'}}/>
              ):null}

              <div className={classnames(styles.location_name, styles.bamboo_boat_loc)}>
                {data?.about_location && (
                  <>
                    <img src="/images/front-pages/images/hero-location.svg" />

                    <span>{data?.about_location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={classnames("grid-column")}>
            <div className={classnames(styles.adventure_right_text)}>
              <div className={classnames(styles.advanture_text1)}>
                  {data?.about_sub_title && (<h3>{data?.about_sub_title}</h3>)}

                  { data?.about_button_link && data?.about_button_text && (
                    <a href={data?.about_button_link}> <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
                      <g id="Group_474" data-name="Group 474" transform="translate(-749 -1655)">
                        <g id="Group_473" data-name="Group 473" transform="translate(0 43)">
                          <g id="Ellipse_2" data-name="Ellipse 2" transform="translate(760 1612)" fill="none" stroke="#fff" strokeWidth="1">
                            <circle cx="3" cy="3" r="3" stroke="none"/>
                            <circle cx="3" cy="3" r="2.5" fill="none"/>
                          </g>
                          <g id="Ellipse_3" data-name="Ellipse 3" transform="translate(760 1624)" fill="none" stroke="#fff" strokeWidth="1">
                            <circle cx="3" cy="3" r="3" stroke="none"/>
                            <circle cx="3" cy="3" r="2.5" fill="none"/>
                          </g>
                          <g id="Ellipse_4" data-name="Ellipse 4" transform="translate(749 1617)" fill="none" stroke="#fff" strokeWidth="1">
                            <circle cx="3.5" cy="3.5" r="3.5" stroke="none"/>
                            <circle cx="3.5" cy="3.5" r="3" fill="none"/>
                          </g>
                          <g id="Group_472" data-name="Group 472">
                            <path id="Path_389" data-name="Path 389" d="M-643.592,1706.313l5.581,3.131" transform="translate(1399 -84)" fill="none" stroke="#fff" strokeWidth="1"/>
                            <path id="Path_390" data-name="Path 390" d="M-643.592,1703.338l5.594-3.252" transform="translate(1399 -84)" fill="none" stroke="#fff" strokeWidth="1"/>
                          </g>
                        </g>
                      </g>
                    </svg> {data?.about_button_text}</a>
                  ) }
              </div>
              <div className={classnames(styles.advanture_text2)}>
                   {data?.about_title && (<h2>{data?.about_title}</h2>)}
                  <img src="/images/front-pages/images/map-orange.svg" />
              </div>

              {data?.about_content && (
                <div dangerouslySetInnerHTML={{ __html: data?.about_content }} ></div>
              )}
            </div>
          </div>
        </div>

        {data?.username && data?.description && (
          <div className={classnames(styles.home_testimonial)}>
              <div className={classnames(styles.qt_img)}>
                  <img src="/images/front-pages/images/qt.png" />
              </div>
              <div className={classnames(styles.testimonial_box)}>
                  <p className={classnames("fs_55")}>{data?.description}</p>
                  <h4>– {data?.username}</h4>
              </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default HomeSection1
