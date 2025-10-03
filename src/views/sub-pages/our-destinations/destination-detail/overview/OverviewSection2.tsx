// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OverviewSection2 = ({ data }: { data?: []; }) => {

  return (
    <section className={classnames(styles.our_desti_sec2, styles.destination_overview_sec2)}>
        <div className="container">
            <div className="grid2 item_center gap_40">
                <div className={classnames(styles.grid_box)}>
                    <div dangerouslySetInnerHTML={{
                        __html: (data?.content || ''),
                    }}></div>
                </div>
                <div className={classnames(styles.grid_box)}>
                    {data?.image && (
                        <div className="full_img">
                            <img className="bx_sd" src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data.image}`} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </section>
  )
}

export default OverviewSection2
