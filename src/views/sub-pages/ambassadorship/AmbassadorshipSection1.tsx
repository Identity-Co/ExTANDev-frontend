// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const AmbassadorshipSection1 = ({ data }: { data?: []; }) => {
  
  return (
    <section className={classnames(styles.ambassadorship_sec1)}>
        <div className="container">
            <div className={classnames(styles.ambassadorship_img, 'full_img')}>
                <img src="/images/sub-pages/ambassadorship.png" />
            </div>
            <div className={classnames(styles.amb_sec1_inner)}>
                      <pre>{JSON.stringify(data, null, 2)}</pre>

                {data?.video_title && (<h1 className="fs_55">{data.video_title}</h1>)}
                <div className={classnames(styles.ambassador_video)}>
                    {data?.youtube_video_url && (
                        <iframe width="100%" height="447" src={data.youtube_video_url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    )}
                </div>
            </div>
        </div>
    </section>
  )
}

export default AmbassadorshipSection1
