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

const OurDestinationsFeaturedResorts = ({ sectionProps }: sectionProp) => {
    return (
        <section className={classnames(styles.our_desti_sec4, ...sectionProps.class?.split(' ').map(cls => styles[cls]).filter(Boolean), sectionProps.general_class?.trim() || '' )}>
            <div className={classnames('container')}>
                <div className={classnames(styles.head_text_center, 'head_text_center')}>
                    <h2 className={sectionProps.heading_class || ''}>Featured resorts</h2>
                </div>
                <div className={classnames(styles.feature_resort_row)}>
                    {sectionProps.resorts?.map((item, index) => (
                        <div key={index} className={classnames(styles.network_travel_box)}>
                            <div className={classnames(styles.network_travel_top)}>
                                <a className={classnames(styles.fl_bx_lnk_glb, 'fl_bx_lnk_glb')} href="#" tabIndex="0"></a>
                                <div className={classnames(styles.network_travel_img)}>
                                    <img src={`${item.image === 1 ? '' : item.image}`} />
                                </div>
                                <div className={classnames(styles.network_travel_img_text)}>
                                    {item.sub_title && <span>{item.sub_title}</span>}
                                    {item.title && <h4>{item.title}</h4>}
                                    {item.description && <p>{item.description}</p>}
                                    <div className={classnames(styles.btn, 'btn')}>
                                        <a href="#">BOOK NOW</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {sectionProps.resorts.length == 0 && (<h2 align="center"> Comming Soon </h2>)}
            </div>
        </section>
    )
}

export default OurDestinationsFeaturedResorts
