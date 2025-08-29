// Third-party Imports
import classnames from 'classnames'

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
                        <form>
                            <div className={classnames(styles.input_row)}>
                                <div className={classnames(styles.input_full_box)}>
                                    <label>First name</label>
                                    <input type="text" placeholder="First name" />
                                </div>
                                <div className={classnames(styles.input_full_box)}>
                                    <label>Last name</label>
                                    <input type="text" placeholder="Last name" />
                                </div>
                                <div className={classnames(styles.input_full_box)}>
                                    <label>E-mail</label>
                                    <input type="email" placeholder="E-mail" />
                                </div>
                                <div className={classnames(styles.input_full_box)}>
                                    <label>Phone</label>
                                    <input type="number" placeholder="Phone" />
                                </div>
                                <div className={classnames(styles.input_full_box, styles.pass_ref)}>
                                    <span>Your password is 8-20 characters,<br /> includes one letter and one number</span>
                                </div>
                                <div className={classnames(styles.input_full_box)}>
                                    <label>Password</label>
                                    <input type="password" placeholder="Password" />
                                </div>
                                <div className={classnames(styles.input_full_box)}>
                                    <label>Confirm password</label>
                                    <input type="password" placeholder="Confirm password" />
                                </div>
                                <div className={classnames(styles.input_full_box, styles.checkbox_label)}>
                                    <input type="checkbox" />
                                    <label>i agree to the <a href="#">Terms of Service & Privacy Policy</a></label>
                                </div>
                                <div className={classnames(styles.input_full_box, styles.submit_btn)}>
                                    <input type="submit" value="Create an account" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={classnames(styles.grid_box)}>
                    <div className={classnames(styles.signup_box, styles.sign_in)}>
                        <h4>SIGN IN</h4>
                        <form>
                            <div className={classnames(styles.input_row)}>
                                <div className={classnames(styles.input_full_box, styles.email)}>
                                    <label>E-mail</label>
                                    <input type="email" placeholder="E-mail" />
                                </div>
                                <div className={classnames(styles.input_full_box)}>
                                    <label>Password</label>
                                    <input type="password" placeholder="Password" />
                                </div>
                                <div className={classnames(styles.input_full_box, styles.checkbox_label)}>
                                    <input type="checkbox" />
                                    <label>Remember <a className={classnames(styles.forgot_pass)} href="#">Forgot your password?</a></label>
                                </div>
                                <div className={classnames(styles.input_full_box, styles.submit_btn)}>
                                    <input type="submit" value="Sign in" />
                                </div>
                                <div className={classnames(styles.input_full_box, styles.pass_ref)}>
                                    <span>New member? <a href="#">Create account</a></span>
                                </div>
                            </div>
                        </form>
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
