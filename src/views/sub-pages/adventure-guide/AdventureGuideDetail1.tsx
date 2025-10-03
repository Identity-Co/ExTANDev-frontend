// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const BlogDetailSection1 = ({ data, mainPgData }: { data?: []; mainPgData?: []; }) => {
    return (
        <section className={classnames(styles.ambassadorship_sec1, styles.blog_section, "py_100")}>
          <div className="container">
              <div className="head_text_center">
                  {mainPgData?.listing_title && (
                    <h3 className="fs_35">{mainPgData.listing_title}</h3>
                  )}
              </div>
              <div className="grid3 gap_40">
                  {data?.map((item, index) => (
                      <div key={index} className={classnames(styles.grid_box)}>
                          <div className={classnames(styles.blog_box)}>
                              <div className={classnames(styles.shop_merch)}>
                                  <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href={`${process.env.NEXT_PUBLIC_APP_URL}/adventure-guide/${item.page_url}`}></a>
                                    {item?.feature_image && (
                                        <div className={classnames(styles.shop_merch_img)}>
                                            <img className="bx_sd" src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${item.feature_image}`} alt="" />
                                        </div>
                                    )}
                                 
                                    <div className={classnames(styles.merch_info)}>
                                      {item.title && (<h4>{item.title}</h4>)}
                                      <div className={classnames(styles.btn, 'btn')}>
                                          <a href={`${process.env.NEXT_PUBLIC_APP_URL}/adventure-guide/${item.page_url}`}>Read More</a>
                                      </div>
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

export default BlogDetailSection1
