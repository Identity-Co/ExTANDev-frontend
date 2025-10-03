// React Imports

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OverviewSection3 = ({ data }: { data?: []; }) => {
  
  return (
    <section className={classnames(styles.destination_overview_sec3, 'pt_100')}>
        <div className="container">
            <div className="grid2 item_center gap_40">
                <div className={classnames(styles.grid_box)}>
                    {data?.image && (
                        <div className="full_img">
                            <img className="bx_sd" src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data.image}`} />
                        </div>
                    )}
                </div>
                <div className={classnames(styles.grid_box)}>
                    <div dangerouslySetInnerHTML={{
                        __html: (data?.content || '').replace(/<h2>/g, '<h2 class="fs_55">'),
                    }}></div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default OverviewSection3