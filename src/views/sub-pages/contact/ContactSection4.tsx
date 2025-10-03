// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const ContactSection4 = ({ data }: { data?: [] }) => {
    
  return (
    <section className={classnames(styles.contact_sec4)}>
        <div className={classnames(styles.get_out)}>
            <div className="full_img">
                {data?.cta_background && (
                    <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${data?.cta_background}`} />
                )}
            </div>
            <div className={classnames(styles.get_out_text)}>
                {data?.cta_title && (
                    <h2>{data?.cta_title}</h2>
                )}
                {data?.cta_subtitle && (
                    <p>{data?.cta_subtitle}</p>
                )}
            </div>
        </div>
    </section>
  )
}

export default ContactSection4
