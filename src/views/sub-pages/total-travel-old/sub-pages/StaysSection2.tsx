// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const StaysSection2 = () => {
  
  return (
    <section className={classnames(styles.travel_sec2, 'pb_150')}>
        <div className="container">
            <div className="full_img">
                <img src="/images/sub-pages/stay.jpg" />
            </div>
        </div>
    </section>
  )
}

export default StaysSection2
