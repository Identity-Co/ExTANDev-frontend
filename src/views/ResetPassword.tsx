'use client'

// React Imports
import { useEffect, useState } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Third-party Imports
import classnames from 'classnames'

import { useSettings } from '@core/hooks/useSettings'
import { useSearchParams, useParams, useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress';

import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe, nonEmpty, optional, boolean, number, check } from 'valibot'

import { toast } from 'react-toastify';

// Styles Imports
import styles from './styles.module.css'

import { updateUser } from '@/app/server/users'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const passwordStrength = check<string>(
  value => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(value),
  'Password must be 8–20 characters and include at least one letter and one number.'
)

const schema = object({
    password: pipe(
      string(),
      nonEmpty('This field is required'),
      passwordStrength
    ),
    re_password: pipe(string(), minLength(1, 'This field is required')),
})

const LandingPageWrapper = ({ mode, pgData }: { mode: Mode; pgData?: [] }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isPasswordShownRe, setIsPasswordShownRe] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [formError , setFormError ] = useState('')
  const [isSubmitting , setIsSubmitting ] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const searchParams = useSearchParams()
  const [userEmail, setUserEmail] = useState(searchParams.get('email'))
  const [userToken, setUserToken] = useState(searchParams.get('token'))

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowPasswordRe = () => setIsPasswordShownRe(show => !show)
  
  // Hooks
  const { updatePageSettings } = useSettings()
  const router = useRouter()
  
  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
      control,
      handleSubmit,
      reset,
      setError,
      clearErrors,
      formState: { errors }
  } = useForm<FormData>({
      resolver: valibotResolver(schema),
      defaultValues: {
          password: '',
          re_password: '',
      }
  })


  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setFormError('');

    // Password mismatch
    if (data.password !== data.re_password) {
      setError("re_password", {
        type: "manual",
        message: "Passwords do not match"
      })
      return
    }

    setIsSubmitting(true);

    let data_raw = {
        "email": userEmail,
        "token": userToken,
        "password": data.password
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forget-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data_raw)
    })

    const log = await res.json()
    if (res && res.ok) {
      if(log.success == true) {
        toast.success('Password updated successfully.')
      } else {
        setFormError('Password updates failed')
      }
    } else {
      setFormError(log.errors.message)
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <section className={classnames(styles.cta_section, styles.ambassadorship_banner, 'py_150')}></section>

      <section className={classnames(styles.ambassadorship_sec1)}>
        <div className="container">
            <div className={classnames(styles.ambassadorship_img, 'full_img')}>
                <img src={`http://192.168.1.201:5001/uploads/pages/1757668852386-ambassadorship.png`} />
            </div>
        </div>
      </section>

      <section className={classnames(styles.ambassadorship_sec3, 'pb_100')}>
        <div className="container">
            <div className={classnames(styles.ambassadorship_sec3_inner)}>
              <div className={classnames(styles.signup_box, styles.sign_in)}>
                <h4>Reset Password</h4>
                <form
                  noValidate
                  action={() => {}}
                  autoComplete='off'
                  onSubmit={handleSubmit(onSubmit)}
                  className='flex flex-col gap-5'
                >
                  <div className={classnames(styles.input_full_box , 'input_full_box')}>
                      <Controller
                        name='password'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                              {...field}
                              fullWidth
                              label='Password *'
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
                      <Controller
                        name='re_password'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label='Confirm Password *'
                            id='login-re_password'
                            type={isPasswordShownRe ? 'text' : 'password'}
                            onChange={e => {
                              field.onChange(e.target.value)
                              clearErrors("re_password")
                              errorState !== null && setErrorState(null)
                            }}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <IconButton
                                      size='small'
                                      edge='end'
                                      onClick={handleClickShowPasswordRe}
                                      onMouseDown={e => e.preventDefault()}
                                      aria-label='toggle password visibility'
                                    >
                                      <i className={isPasswordShownRe ? 'ri-eye-off-line' : 'ri-eye-line'} />
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
                            {...(errors.re_password && { error: true, helperText: errors.re_password.message })}
                          />
                        )}
                      />
                  </div>

                  <div className={classnames(styles.input_full_box, styles.submit_btn)}>
                      <button type="submit" disabled={isSubmitting}> Save </button>
                      {isSubmitting ? <CircularProgress style={{marginLeft: '8px', color: 'white'}} size={20} thickness={6} /> : ''}
                  </div>
                </form>
              </div>
            </div>
        </div>
      </section>
    </>
  )
}

export default LandingPageWrapper
