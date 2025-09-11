'use client'

// React Imports
import { useState, useRef } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe, nonEmpty, optional, boolean, number, check } from 'valibot'
import classnames from 'classnames'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'

import * as User from '@/app/server/users'

// Util Imports
type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const passwordStrength = check<string>(
  value => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(value),
  'Password must be 8–20 characters and include at least one letter and one number.'
)

const phoneValidation = check<string>(
  value => /^\+?[1-9]\d{9,14}$/.test(value),
  'Please enter a valid phone number'
)

const schema = object({
    first_name: pipe(string(), minLength(1, 'This field is required')),
    last_name: pipe(string(), minLength(1, 'This field is required')),
    email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address')),
    phone: pipe(string(), phoneValidation),
    password: pipe(
      string(),
      nonEmpty('This field is required'),
      passwordStrength
    ),
    re_password: pipe(string(), minLength(1, 'This field is required')),
    instagram_url: optional(string()),
    facebook_url: optional(string()),
    pinterest_url: optional(string()),
    twitterx_url: optional(string()),
    whatsapp_url: optional(string()),
    tiktok_url: optional(string()),
    terms: pipe(boolean(), check(value => value === true, 'You must agree to the terms.')),
})

// Styles Imports
import styles from './styles.module.css'

const SignupForm = () => {

    // States
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isPasswordShownRe, setIsPasswordShownRe] = useState(false)
    const [errorState, setErrorState] = useState<ErrorType | null>(null)
    const [formError , setFormError ] = useState('')
    const [isSubmitting , setIsSubmitting ] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Hooks
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)
    const handleClickShowPasswordRe = () => setIsPasswordShownRe(show => !show)

    // ✅ Ref for message
    const messageRef = useRef<HTMLDivElement | null>(null)

    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm<FormData>({
        resolver: valibotResolver(schema),
        defaultValues: {
            membership_level: 0,
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            password: '',
            re_password: '',
            instagram_url: '',
            facebook_url: '',
            pinterest_url: '',
            twitterx_url: '',
            whatsapp_url: '',
            tiktok_url: '',
            terms: false
        }
    })

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        setFormError('');

      //e.preventDefault();

      //console.log('Form data: ', data)
      //console.log('selectedInterests: ', selectedInterests)
      //console.log('selectedDestinations: ', selectedDestinations)

      // Password mismatch
      if (data.password !== data.re_password) {
        setError("re_password", {
          type: "manual",
          message: "Passwords do not match"
        })
        return
      }

      const fData = {
        "first_name" : data.first_name,
        "last_name" : data.last_name,
        "email" : data.email,
        "phone" : {
            "country_name": "us",
            "country_code": "+1",
            "number": data.phone
        },
        "password": data.password,
        "socialmedia_urls": {
            "instagram_url": data.instagram_url ?? '',
            "facebook_url": data.facebook_url ?? '',
            "pinterest_url": data.pinterest_url ?? '',
            "twitterx_url": data.twitterx_url ?? '',
            "whatsapp_url": data.whatsapp_url ?? '',
            "tiktok_url": data.tiktok_url ?? ''
        },
        role: "ambassador",
        status: 1,
        ambassador_status: 0
      }

      console.log('fData: ', fData)

      const user = await User.signUpAmbassador(fData)

      console.log('user Response: ', user)

      if(user.success || user._id) {
        setIsSubmitted(true)

        setTimeout(() => {
            messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 200)
      } else {
        setFormError(user?.errors?.message || "Something went wrong. Please try again.")
      }

      // Send form data + captcha to backend
      /* const res = await fetch("http://localhost:5000/verify-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captcha: captchaValue }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Form submitted successfully ✅");
      } else {
        alert("CAPTCHA failed ❌");
      } */
    };
  
    return (
      <>
        {isSubmitted ? (
            <div ref={messageRef}>
              <Typography
                variant="body1"
                className="text-center text-green-600 font-medium"
              >
                Your ambassador application has been submitted successfully.<br />
                Our team will review your details and update you shortly.
              </Typography>
            </div>
        ) : (
            <form
                noValidate
                action={() => {}}
                autoComplete='off'
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col gap-5 custom-reset-fld'
            >
                <div className={classnames(styles.input_row)}>
                    <div className={classnames(styles.input_full_box, 'input_full_box')}>
                        <Controller
                          name='first_name'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              autoFocus
                              type='text'
                              label='First Name *'
                              onChange={e => {
                                field.onChange(e.target.value)
                                errorState !== null && setErrorState(null)
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-user-line' />
                                    </InputAdornment>
                                  )
                                }
                              }}
                              {...((errors.first_name || errorState !== null) && {
                                error: true,
                                helperText: errors?.first_name?.message || errorState?.message[0]
                              })}
                            />
                          )}
                        />
                    </div>
                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Controller
                          name='last_name'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='text'
                              label='Last Name *'
                              onChange={e => {
                                field.onChange(e.target.value)
                                errorState !== null && setErrorState(null)
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-user-line' />
                                    </InputAdornment>
                                  )
                                }
                              }}
                              {...((errors.last_name || errorState !== null) && {
                                error: true,
                                helperText: errors?.last_name?.message || errorState?.message[0]
                              })}
                            />
                          )}
                        />
                    </div>
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
                              label='Email *'
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
                              {...((errors.email || errorState !== null) && {
                                error: true,
                                helperText: errors?.email?.message || errorState?.message[0]
                              })}
                            />
                          )}
                        />
                    </div>
                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Controller
                          name='phone'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='text'
                              label='Phone Number *'
                              onChange={e => {
                                field.onChange(e.target.value)
                                errorState !== null && setErrorState(null)
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-phone-line' />
                                    </InputAdornment>
                                  )
                                }
                              }}
                              {...((errors.phone || errorState !== null) && {
                                error: true,
                                helperText: errors?.phone?.message || errorState?.message[0]
                              })}
                            />
                          )}
                        />
                    </div>

                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Typography className='font-small center'>Your password is 8-20 characters,<br />includes one letter and one number</Typography>
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

                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Typography className='font-small center'>Share Social Media links (at least one)</Typography>
                    </div>
                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Controller
                          name='instagram_url'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='url'
                              label='Instagram URL'
                              onChange={e => {
                                field.onChange(e.target.value)
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-instagram-line' />
                                    </InputAdornment>
                                  )
                                }
                              }}
                            />
                          )}
                        />
                    </div>
                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Controller
                          name='facebook_url'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='url'
                              label='Facebook URL'
                              onChange={e => {
                                field.onChange(e.target.value)
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-facebook-circle-line' />
                                    </InputAdornment>
                                  )
                                }
                              }}
                            />
                          )}
                        />
                    </div>
                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Controller
                          name='pinterest_url'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='url'
                              label='Pinterest URL'
                              onChange={e => {
                                field.onChange(e.target.value)
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-pinterest-line' />
                                    </InputAdornment>
                                  )
                                }
                              }}
                            />
                          )}
                        />
                    </div>
                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Controller
                          name='twitterx_url'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='url'
                              label='Twitter/X URL'
                              onChange={e => {
                                field.onChange(e.target.value)
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-twitter-x-line' />
                                    </InputAdornment>
                                  )
                                }
                              }}
                            />
                          )}
                        />
                    </div>
                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Controller
                          name='whatsapp_url'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='url'
                              label='WhatsApp URL'
                              onChange={e => {
                                field.onChange(e.target.value)
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-whatsapp-line' />
                                    </InputAdornment>
                                  )
                                }
                              }}
                            />
                          )}
                        />
                    </div>
                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Controller
                          name='tiktok_url'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='url'
                              label='TikTok URL'
                              onChange={e => {
                                field.onChange(e.target.value)
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-tiktok-line' />
                                    </InputAdornment>
                                  )
                                }
                              }}
                            />
                          )}
                        />
                    </div>

                    <div className={classnames(styles.input_full_box , 'input_full_box')}>
                      <Controller
                        name="terms"
                        control={control}
                        rules={{ required: 'You must agree to continue' }}
                        defaultValue={false}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={field.value}
                                onChange={e => {
                                  field.onChange(e.target.checked)
                                  errorState !== null && setErrorState(null)
                                }}
                              />
                            }
                            label={
                              <>
                                I agree to the{' '}
                                <Link href="/terms-of-use/" target="_blank">Terms of Service</Link> &{' '}
                                <Link href="/privacy-policy/" target="_blank">Privacy Policy</Link>
                              </>
                            }
                          />
                        )}
                      />
                      {errors.terms && (
                        <p className={classnames(styles.custom_error_class)}>{errors.terms.message}</p>
                      )}
                    </div>

                    {formError && (
                        <Typography variant="error" className="text-center text-green-600 font-medium">
                            {formError}
                        </Typography>
                    )}

                    <div className={classnames(styles.input_full_box, styles.submit_btn)}>
                        <input type="submit" value="Create an account" disabled={isSubmitting} />
                        {isSubmitting ? <CircularProgress style={{marginLeft: '8px', color: 'white'}} size={20} thickness={6} /> : ''}
                    </div>
                </div>
            </form>
        )}
      </>
    )
}

export default SignupForm
