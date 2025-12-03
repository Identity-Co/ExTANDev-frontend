// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OffersSection3 = ({ data }: { data?: []; }) => {
  if(!data)
    return
  
  return (
    <section className={classnames(styles.contact_sec4)}>
        <div className={classnames(styles.get_out)}>
            <div className="full_img">
              <img
                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data}`}
                alt="Bottom Image"
              />
            </div>
        </div>
    </section>
  )
}

export default OffersSection3
