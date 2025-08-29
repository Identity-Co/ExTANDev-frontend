// React Imports
import React from 'react'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

type sectionProp = {
  sectionProps: {
  }
}

const InstagramFeed = ({ sectionProps }: sectionProp) => {
  return (
    <section className={classnames(styles.our_desti_sec5, sectionProps.general_class?.trim() || '')}>
        <div className="container">
            {sectionProps?.username &&
                <div className="head_text_center">
                    <h2 className="fs_35">Follow us {sectionProps.username}</h2>
                </div>
            }
            <div className={classnames(styles.follow_feed)}>
                <div className="full_img">
                    <img src="/images/sub-pages/insta-feed.jpg" />
                </div>
            </div>
        </div>
    </section>
  )
}

export default InstagramFeed