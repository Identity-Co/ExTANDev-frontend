// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const ServicesSection3 = ({ data }: { data?: []; }) => {
    if(!data)
    return

  return (
    <section className={classnames(styles.jade_jungle_services_sec3, 'py_100')}>
        <div className={classnames(styles.container, 'container')}>
            <div className="fs_35" dangerouslySetInnerHTML={{
                  __html: (data?.review_text || ''),
                }}>
            </div>
            <div className={classnames(styles.star_review)}>
                {[...Array(5)].map((_, index) => {
                  const isFilled = index < data?.rating;

                  return (
                    <span
                      key={index}
                      className={classnames({ [styles.filled]: isFilled })}
                    >
                      {isFilled ? '★' : '☆'}
                    </span>
                  );
                })}
            </div>
            {data?.reviewer_name && <p>{data?.reviewer_name} - <strong>TRIP ADVISOR REVIEW</strong></p>}
        </div>
    </section>
  )
}

export default ServicesSection3
