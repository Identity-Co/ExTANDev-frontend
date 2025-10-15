'use client'

// React Imports
import { useState, useRef } from 'react'

// Next Imports
import Link from 'next/link'

import AccountSidebar from './../AccountSidebar'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress';

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import classnames from 'classnames'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe, nonEmpty, optional, boolean, number, check } from 'valibot'

import { toast } from 'react-toastify';

import { changePassword } from '@/app/server/users'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const passwordStrength = check<string>(
  value => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(value),
  'Password must be 8–20 characters and include at least one letter and one number.'
)

const schema = object({
    current_password: pipe(
      string(),
      nonEmpty('This field is required'),
      passwordStrength
    ),
    password: pipe(
      string(),
      nonEmpty('This field is required'),
      passwordStrength
    ),
    re_password: pipe(string(), minLength(1, 'This field is required')),
})

// Styles Imports
import styles from './../styles.module.css'

const ChangePassword = ({ user }: {user?:{}}) => {
    // States
    const [isPasswordShownC, setIsPasswordShownC] = useState(false)
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isPasswordShownRe, setIsPasswordShownRe] = useState(false)
    const [errorState, setErrorState] = useState<ErrorType | null>(null)
    const [formError , setFormError ] = useState('')
    const [isSubmitting , setIsSubmitting ] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleClickShowPasswordC = () => setIsPasswordShownC(show => !show)
    const handleClickShowPassword = () => setIsPasswordShown(show => !show)
    const handleClickShowPasswordRe = () => setIsPasswordShownRe(show => !show)

    // ✅ Ref for message
    const messageRef = useRef<HTMLDivElement | null>(null)

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
            current_password: '',
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

        const _fdata = {
          'current_password': data.current_password,
          'password': data.password
        }

        const res = await changePassword(_fdata);

        console.log(res)

        if(res && res.success) {
          reset();
          toast.success('Password changed successfully.')
          setTimeout(() => {
              messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
          }, 200)
        } else {
          setFormError(res?.errors?.message || "Something went wrong. Please try again.")
        }
        setIsSubmitting(false)
    }
  
    return (
      <div className={classnames(styles.grid_box)}>
        <div className={classnames(styles.input_full_box , 'input_full_box')}>
          <h4> Change Password </h4>
        </div>

        <form
          noValidate
          action={() => {}}
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-5'
        >
          <div className={classnames(styles.input_full_box , 'input_full_box')}>
              <Controller
                name='current_password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Current Password *'
                    id='login-current_password'
                    type={isPasswordShownC ? 'text' : 'password'}
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
                              onClick={handleClickShowPasswordC}
                              onMouseDown={e => e.preventDefault()}
                              aria-label='toggle password visibility'
                            >
                              <i className={isPasswordShownC ? 'ri-eye-off-line' : 'ri-eye-line'} />
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
                    {...(errors.current_password && { error: true, helperText: errors.current_password.message })}
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

          {formError && (
            <Typography variant="error" color="red" className="text-center font-medium">
                {formError}
            </Typography>
          )}

          <div className={classnames(styles.input_full_box, styles.submit_btn)}>
              <button type="submit" disabled={isSubmitting}> Save </button>
              {isSubmitting ? <CircularProgress style={{marginLeft: '8px', color: 'white'}} size={20} thickness={6} /> : ''}
          </div>
        </form>
      </div>
    )
}

export default ChangePassword
