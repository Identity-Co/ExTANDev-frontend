// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const ServicesSection2 = ({ data, imageLeft, sectionIndex }: { data?: []; imageLeft?: false; sectionIndex?: 0 }) => {
  if(!data)
    return

  let counter = 1;

  if(!imageLeft){
    counter = 2;
  }

  return (
    <section
      className={classnames(
        styles.jade_jungle_services_sec2,
        'jade_jungle_services_sec2',
        sectionIndex === 0 ? styles.our_desti_sec2 : '',
        sectionIndex === 0 ? 'pb_100' : 'py_100'
      )}
      >
        <div className={classnames(styles.container, 'container')}>
          {data?.map((service, index) => {
            ++counter;

            return (
              <div key={index} className="grid2 item_center gap_40">
                {counter % 2 === 0 ? (
                  <>
                    <div className="grid_box">
                      <div className="full_img">
                        {service?.image && (
                          <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${service.image}`} />
                        )}
                      </div>
                    </div>
                    <div className="grid_box">
                      {service?.title && <h2 className="fs_40">{service?.title}</h2>}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: service?.content || '',
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid_box">
                      {service?.title && <h2 className="fs_40">{service?.title}</h2>}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: service?.content || '',
                        }}
                      />
                    </div>
                    <div className="grid_box">
                      <div className="full_img">
                        {service?.image && (
                          <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${service.image}`} />
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
    </section>
  )
}

export default ServicesSection2
