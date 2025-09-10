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
                    <div className={classnames(styles.signup_box, styles.sign_in)}>
                        <h4>SIGN IN</h4>
                        <SigninForm />
                    </div>
                    <div className={classnames(styles.signup_box, styles.account_box)}>
                        <h4>ACCOUNT RECOVERY</h4>
                        <form>
                            <div className={classnames(styles.input_row)}>
                                <div className={classnames(styles.input_full_box, styles.pass_ref, styles.recovery)}>
                                    <span>Enter your e-mail address below to reset your password</span>
                                </div>
                                <div className={classnames(styles.input_full_box, styles.email)}>
                                    <label>E-mail</label>
                                    <input type="email" placeholder="E-mail" />
                                </div>
                                <div className={classnames(styles.input_full_box, styles.btnset)}>
                                    <a className={classnames(styles.back_btn)} href="#">Back</a>
                                    <div className={classnames(styles.submit_btn)}>
                                        <input type="submit" value="Sign in" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default AmbassadorshipSection3
