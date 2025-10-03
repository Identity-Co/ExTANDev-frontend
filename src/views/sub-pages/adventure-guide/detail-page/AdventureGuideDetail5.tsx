// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const BlogDetailSection5 = ({ data }: { data?: []; }) => {
  return (
    <section className={classnames(styles.moab_sec4, 'pb_100')}>
        <div className="container">
            <div className={classnames(styles.home_testimonial)}>
                <div className={classnames(styles.qt_img)}>
                    <img src="/images/sub-pages/qt.png" />
                </div>
                <div className={classnames(styles.testimonial_box)}>
                    {data?.author_testimonial && data?.author_testimonial !== "" && (
                        <p className="fs_55">{data?.author_testimonial}</p>
                    )}
                    <div className={classnames(styles.testi_auth)}>
                        {data?.author_image && data?.author_image !== "" && (
                            <div className={classnames(styles.testi_auth_image)}>
                                <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data.author_image}`} alt={data?.author_name || 'image'} />
                            </div>
                        )}

                        {data?.author_name && data?.author_name !== "" && (
                            <div className={classnames(styles.auth_name)}>
                                {data?.author_testimonial && data?.author_testimonial !== "" && (
                                    <span>By {data?.author_name}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default BlogDetailSection5
