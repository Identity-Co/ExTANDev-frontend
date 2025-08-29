// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const TotalTravelSection2 = ({ data }: { data?: [] }) => {
    return (
        <section className={classnames(styles.travel_sec2, 'pb_150')}>
            <div className="container">
                <div className={classnames(styles.smart_travel_main)}>
                    {data.travel_sections?.map((item, index) => {
                        const isReverse = item.direction=="image_first" ? true : false;

                        return (
                            <div key={`travels-${index}`} className={classnames(styles.smart_travel_row, { [styles.rivers_row]: isReverse, })}>
                                <div className={classnames(styles.smart_travel_small)} style={{ order: isReverse ? 1 : 0 }}>
                                    <div className={classnames(styles.smart_travel_text)}>
                                        {item.title && (<h4>{item.title}</h4>)}

                                        {item?.content && (
                                            <div dangerouslySetInnerHTML={{ __html: item?.content }} ></div>
                                        )}
                                    </div>
                                </div>
                                {item?.image && (
                                    <div className={classnames(styles.smart_travel_big)} style={{ order: isReverse ? 0 : 1 }}>
                                        <div className="full_img">
                                            <img className="bx_sd" src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${item.image}`} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default TotalTravelSection2
