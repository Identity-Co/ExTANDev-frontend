// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const CTASection = ({ data }: { data?: []; }) => {
  if(!data?.subscribe_title && !data?.share_title)
    return false;

  return (
    <section className={classnames(styles.cta_section, 'py_50')}>
        <div className={classnames('container')}>
            <div className={classnames(styles.cta_row)}>
                <div className={classnames(styles.cta_box, styles.cta_left)}>
                    <div className={classnames(styles.cta_info)}>
                        {data?.subscribe_title && (<h2 className="fs_55">{data?.subscribe_title}</h2>)}
                        {data?.subscribe_sub_title && (<p>{data?.subscribe_sub_title}</p>)}

                        { data?.subscribe_button_text && data?.subscribe_button_link && (
                            <div className={classnames(styles.btn, 'btn')}>
                                <a href={data?.subscribe_button_link} tabIndex="0">{data?.subscribe_button_text}</a>
                            </div>
                        )}
                    </div>
                </div>
                <div className={classnames(styles.cta_box, styles.cta_right)}>
                    <div className={classnames(styles.cta_info, 'cta_info')}>
                        {data?.share_title && (<h2 className="fs_55">{data?.share_title}</h2>)}
                        {data?.share_sub_title && (<p>{data?.share_sub_title}</p>)}

                        { data?.share_button_text && data?.share_button_link && (
                            <div className={classnames(styles.btn, 'btn')}>
                                <a href={data?.share_button_link} tabIndex="0">{data?.share_button_text}</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default CTASection
