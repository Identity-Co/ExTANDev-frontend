// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const AmbassadorshipSection1 = () => {
  
  return (
    <section className={classnames(styles.ambassadorship_sec1)}>
        <div className="container">
            <div className={classnames(styles.ambassadorship_img, 'full_img')}>
                <img src="/images/sub-pages/signup.png" />
            </div>
        </div>
    </section>
  )
}

export default AmbassadorshipSection1
