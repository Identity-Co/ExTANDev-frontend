// Third-party Imports
import classnames from 'classnames'

import SignupForm from './SignupForm'
import SigninForm from './SigninForm'

// Styles Imports
import styles from './styles.module.css'

const AmbassadorshipSection3 = () => {
  
  return (
    <section className={classnames(styles.ambassadorship_sec3, 'pb_100')}>
        <div className="container">
            <div className={classnames(styles.ambassadorship_sec3_inner)}>
                <div className="grid2 gap_24">
                <div className={classnames(styles.grid_box)}>
                    <div className={classnames(styles.signup_box)}>
                        <h4>SIGN UP</h4>
                        <SignupForm />
                    </div>
                </div>
                <div className={classnames(styles.grid_box)}>
                    <SigninForm />
                </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default AmbassadorshipSection3
