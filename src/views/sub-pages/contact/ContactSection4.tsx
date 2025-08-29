// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const ContactSection4 = () => {
  
  return (
    <section className={classnames(styles.contact_sec4)}>
        <div className={classnames(styles.get_out)}>
            <div className="full_img">
                <img src="/images/sub-pages/hiker-contact.jpg" />
            </div>
            <div className={classnames(styles.get_out_text)}>
                <h2>Get out there</h2>
                <p>Travel Like You Mean It</p>
            </div>
        </div>
    </section>
  )
}

export default ContactSection4
