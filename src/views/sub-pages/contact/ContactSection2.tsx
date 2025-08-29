// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const ContactSection2 = () => {
  
  return (
    <section className={classnames(styles.contact_sec2, 'pb_100')}>
        <div className="container">
            <div className={classnames(styles.contact_container)}>
                <div className={classnames(styles.contact_form, 'bx_sd')}>
                    <div className={classnames(styles.contact_form_row)}>
                        <div className={classnames(styles.contact_half_box)}>
                            <label>First name*</label>
                            <input type="text" placeholder="" />
                        </div>
                        <div className={classnames(styles.contact_half_box)}>
                            <label>Last name*</label>
                            <input type="text" placeholder="" />
                        </div>
                        <div className={classnames(styles.contact_full_box)}>
                            <label>Email*</label>
                            <input type="email" placeholder="" />
                        </div>
                        <div className={classnames(styles.contact_half_box)}>
                            <label>Country</label>
                            <select>
                              <option value="">Country 1</option>
                              <option value="">Country 2</option>
                              <option value="">Country 3</option>
                              <option value="">Country 4</option>
                            </select>
                        </div>
                        <div className={classnames(styles.contact_half_box)}>
                            <label>Phone</label>
                            <input type="number" placeholder="" />
                        </div>
                        <div className={classnames(styles.contact_full_box)}>
                            <label>How can we help?</label>
                            <textarea></textarea>
                        </div>
                        <div className={classnames(styles.contact_full_box, styles.checkbox_label)}>
                            <input type="checkbox" />
                            <label>Get monthly inspiration. Subscribe to our newsletter.</label>
                        </div>
                        <div className={classnames(styles.contact_full_box, styles.checkbox_label)}>
                            <input type="checkbox" />
                            <label>I agree to receive other communications fro Adventure Network.</label>
                        </div>
                        <div className={classnames(styles.contact_full_box)}>
                            <p>You can unsubscribe at any time. We are committed to protecting your privacy. Please review our <a href="#">Privacy Policy.</a></p>
                        </div>
                        <div className={classnames(styles.contact_full_box)}>
                            <input type="submit" value="Submit" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default ContactSection2
