// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OverviewSection2 = ({ data }: { data?: []; }) => {
  if(!data)
    return

  return (
    <section className={classnames(styles.jade_jungle_sec2)}>
      <div className="container">
          <h2 className="fs_55 center">Property Highlights</h2>
          <div className="grid3 gap_16">
            {data?.map((item: string, index: number) => (
              <div key={index} className={classnames(styles.property_info_box)}>
                  <div className={classnames(styles.property_info_inner)}>
                      <div className={classnames(styles.property_info_img)}>
                          {item?.image && (
                            <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${item.image}`} />
                          )}
                      </div>
                      <div className={classnames(styles.property_info_text, 'center')}>
                          {item?.title && ( 
                            <h3 className="fs_35">{item?.title}</h3>
                          )}
                          {item?.description && ( 
                            <p>{item.description}</p>
                          )}
                      </div>
                  </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  )
}

export default OverviewSection2
