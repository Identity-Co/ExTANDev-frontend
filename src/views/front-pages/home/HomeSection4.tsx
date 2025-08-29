// React Imports
import React from 'react'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const HomeSection4 = ({ data }: { data?: []; }) => {

  return (
    <section className={classnames(styles.home_section4, 'py_100')}>
        <div className={classnames(styles.container, 'container')}>
            <div className={classnames(styles.become_row)}>
                <div className={classnames(styles.become_left)}>
                    <div className={classnames(styles.become_left_inner)}>
                        <div className={classnames(styles.become_left_text)}>
                            {data?.adventure_title && (<h2 className="fs_55">{data?.adventure_title}</h2>)}

                            {data?.adventure_content && (
                                <div dangerouslySetInnerHTML={{ __html: data?.adventure_content }} ></div>
                            )}

                            { data?.adventure_button_link && data?.adventure_button_text && (
                                <div className={classnames(styles.btn, 'btn')}>
                                    <a href={data?.adventure_button_link}>{data?.adventure_button_text}</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.become_right)}>
                    <div className={classnames(styles.become_img)}>
                        <div className="full_img">
                            {data?.adventure_image ? (
                                <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data?.adventure_image}`} />
                            ) : (
                                <img src="/images/front-pages/images/become-advanture.jpg" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={classnames(styles.insta_feed)}>
                <div className="full_img">
                    <img src="/images/front-pages/images/insta-feed.png" />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HomeSection4
