// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const StaticPageSection1 = ({ data }: { data?: []; }) => {
    return (
        <section className={classnames(styles.home_section1, styles.our_desti_sec1, styles.destination_overview_sec1, styles.stories_details_sec1, styles.moab_sec1, 'py_100')}>
            <div className={classnames(styles.container, 'container')}>
                <div className={classnames(styles.surfing_row, styles.travel_stories_faq)}>
                    {data?.main_content && (
                        <>
                            <div className={classnames(styles.surfing_text)} dangerouslySetInnerHTML={{
                                  __html: (data?.main_content || '').replace(/<h3>/g, '<h3 class="fs_35">'),
                                }}>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

export default StaticPageSection1
