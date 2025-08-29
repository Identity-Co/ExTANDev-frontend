// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const ContactSection1 = () => {
  
  return (
    <section className={classnames(styles.ambassadorship_sec1, styles.contact_sec1, 'pt_100')}>
        <div className="container">
            <div className={classnames(styles.contact_container)}>
                <div className="grid2 gap_48">
                    <div className={classnames(styles.grid_box)}>
                        <div className={classnames(styles.contact_left)}>
                            <h3>Get in touch and</h3>
                            <h2>Pack your bags</h2>
                            <p>If you’re ready to get out there, we’re ready to help. Shoot us a message and let’s go!</p>
                        </div>
                    </div>
                    <div className={classnames(styles.grid_box)}>
                        <div className={classnames(styles.contact_right)}>
                            <p>Got questions? Ideas? <span className="extra_bold"><em>Ready to get out there and travel like you mean it?</em></span> Whether you’re a traveler looking to join a trip, a content creator interested in our ambassador program, or a brand wanting to collaborate—we’d love to connect.</p>
                            <p><span className="extra_bold"><em>Fill out the form below and our team will get back to you faster than you can pack your bags.</em></span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default ContactSection1
