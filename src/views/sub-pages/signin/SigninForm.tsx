'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress';

// Third-party Imports
import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe, nonEmpty } from 'valibot'
import classnames from 'classnames'
import type { SubmitHandler } from 'react-hook-form'
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

type SignInProps = {
  toggleForm: () => void
}

const SigninForm = ({ toggleForm }: SignInProps) => {

    // States
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [errorState, setErrorState] = useState<ErrorType | null>(null)
    const [isSubmitting , setIsSubmitting ] = useState(false)

    const [signInFrm, setSignInFrm] = useState('block')
    const [forgotPass, setForgotPass] = useState('none')
    const [forgotMessage, setForgotMessage] = useState(null)
    const [recoveryEmail, setRecoveryEmail] = useState('')

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

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        setIsSubmitting(true)

        const res = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        })

        console.log('res: ', res)

        if (res && res.ok && res.error === null) {
            // setLoading(true)

            // Vars
            const redirectURL = searchParams.get('redirectTo') ?? '/my-account/'

            router.replace(redirectURL)
        } else {
            if (res?.error) {
                setIsSubmitting(false)
                const error = res?.error

                setErrorState({"message": Array(error)})
            }
        }
    }
  
    return (
        <>
            <form
                noValidate
                action={() => {}}
                autoComplete='off'
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col gap-5 custom-reset-fld'
            >

                <div className={classnames(styles.input_row)}>
                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Controller
                          name='email'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='email'
                              label='Email'
                              onChange={e => {
                                field.onChange(e.target.value)
                                errorState !== null && setErrorState(null)
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-mail-line' />
                                    </InputAdornment>
                                  )
                                }
                              }}
                              error={Boolean(errors.email || errorState)}
                            />
                          )}
                        />
                    </div>
                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Controller
                          name='password'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='Password'
                              id='login-password'
                              type={isPasswordShown ? 'text' : 'password'}
                              onChange={e => {
                                field.onChange(e.target.value)
                                errorState !== null && setErrorState(null)
                              }}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment position='end'>
                                      <IconButton
                                        size='small'
                                        edge='end'
                                        onClick={handleClickShowPassword}
                                        onMouseDown={e => e.preventDefault()}
                                        aria-label='toggle password visibility'
                                      >
                                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-lock-line' />
                                    </InputAdornment>
                                  )
                                }
                              }}
                              {...(errors.password && { error: true, helperText: errors.password.message })}
                            />
                          )}
                        />
                    </div>
                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                      {/* 👇 External error message */}
                      {(errors.email || errorState) && (
                        <Typography
                          variant='caption'
                          color='error'
                          sx={{ display: 'block', mt: 0.5, ml: 1 }}
                        >
                          Invalid Username or Password.
                        </Typography>
                      )}
                    </div>

                    <div className='flex justify-between items-center flex-wrap gap-x-3 gap-y-1'>
                      <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
                      <Typography className='text-end' color='primary.main' sx={{ cursor: 'pointer' }} onClick={toggleForm}>
                        Forgot password?
                      </Typography>
                    </div>
                    <div className={classnames(styles.input_full_box, styles.submit_btn)}>
                        <Button fullWidth variant='contained' type='submit' disabled={isSubmitting}>
                          Log In
                          {isSubmitting ? <CircularProgress style={{marginLeft: '8px', color: 'white'}} size={20} thickness={6} /> : ''}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default SigninForm
