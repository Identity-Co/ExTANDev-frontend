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

const ForgotpwdForm = () => {

    // States
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [errorState, setErrorState] = useState<ErrorType | null>(null)
    const [isSubmitting , setIsSubmitting ] = useState(false)

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
  
    return (
        <>
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
        </>
    )
}

export default ForgotpwdForm
