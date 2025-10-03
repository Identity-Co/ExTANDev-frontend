// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const ContactSection1 = ({ data }: { data?: [] }) => {
  
  return (
    <section className={classnames(styles.ambassadorship_sec1, styles.contact_sec1, 'pt_100')}>
        <div className="container">
            <div className={classnames(styles.contact_container)}>
                <div className="grid2 gap_48">
                    <div className={classnames(styles.grid_box)}>
                        <div className={classnames(styles.contact_left)}>
                            { data?.about_subtitle && (
                                <h3>{data?.about_subtitle}</h3>
                            )}
                            { data?.about_title && (
                                <h2>{data?.about_title}</h2>
                            )}
                            { data?.about_description && (
                                <p>{data?.about_description}</p>
                            )}
                        </div>
                    </div>
                    <div className={classnames(styles.grid_box)}>
                        <div className={classnames(styles.contact_right)}>
                            <div dangerouslySetInnerHTML={{
                                    __html: (data?.about_content || '').replace(/<em>/g, '<em class="extra_bold">'),
                                }}>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default ContactSection1
