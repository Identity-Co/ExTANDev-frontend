// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const AdventuresDetailSection3 = ({ map_image }: { map_image?: ''; }) => {
    
    if(map_image){
      return (
        <section className={classnames(styles.adv_details_sec3)}>
            <div className="container">
                <div className={classnames(styles.adv_map_box)}>
                    <div className={classnames(styles.adv_map_image, 'center')}>
                        <img className="mx_100" src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${map_image}`} />
                    </div>
                </div>
            </div>
        </section>
      )
    }
}

export default AdventuresDetailSection3
