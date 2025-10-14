'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter, useSearchParams } from 'next/navigation'

// Third-party Imports
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe, nonEmpty } from 'valibot'
import classnames from 'classnames'
import type { InferInput } from 'valibot'

//import { useNavigationStore } from '@/libs/navigation-store'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

import SignupForm from './SignupForm'
import SigninForm from './SigninForm'
import ForgotpwdForm from './ForgotpwdForm'

// Util Imports
type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
    email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address')),
    password: pipe(
        string(),
        nonEmpty('This field is required'),
        minLength(5, 'Password must be at least 5 characters long')
    )
})

// Styles Imports
import styles from './styles.module.css'

const FormSection = () => {

    // States
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [errorState, setErrorState] = useState<ErrorType | null>(null)
    const [isSubmitting , setIsSubmitting ] = useState(false)

    const [signInFrm, setSignInFrm] = useState('block')
    const [forgotPass, setForgotPass] = useState('none')

    // Hooks
    const router = useRouter()
    const searchParams = useSearchParams()

    const { settings } = useSettings()

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: valibotResolver(schema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const toggleForm = () => {
      let v1 = (signInFrm == "block") ? 'none' : 'block';
      setSignInFrm(v1)

      let v2 = (forgotPass == "block") ? 'none' : 'block';
      setForgotPass(v2)
    }
  
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
                        <div className={classnames(styles.signup_box, styles.sign_in)} style={{ display: `${signInFrm}` }}>
                            <h4>SIGN IN</h4>
                            <SigninForm toggleForm={toggleForm}/>
                        </div>
                        <div className={classnames(styles.signup_box, styles.account_box)} style={{ display: `${forgotPass}` }}>
                            <h4>ACCOUNT RECOVERY</h4>
                            <ForgotpwdForm toggleForm={toggleForm} />
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FormSection
