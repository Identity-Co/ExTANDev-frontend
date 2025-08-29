// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const TotalTravelSection1 = ({ data }: { data?: [] }) => {
  
  return (
    <section className={classnames(styles.home_section1, styles.our_desti_sec1)}>
        <div className="container">
            <div className={classnames(styles.head_text_center, 'head_text_center')}>
                <div className={classnames(styles.adventure_right_text)}>
                    {data.about_title ? (<h2 className="fs_55">{data.about_title}</h2>) : null}

                    {data?.about_content && (
                        <div dangerouslySetInnerHTML={{ __html: data?.about_content }} ></div>
                    )}
                </div>
            </div>
        </div>
    </section>
  )
}

export default TotalTravelSection1
