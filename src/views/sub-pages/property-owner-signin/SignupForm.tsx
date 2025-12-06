'use client'

// React Imports
import { useState, useRef, React, useEffect } from 'react'
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

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
import { object, minLength, string, email, pipe, nonEmpty, optional, boolean, number, check, maxLength } from 'valibot'
import classnames from 'classnames'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'

import dynamic from "next/dynamic";

// import { ReCAPTCHA } from "react-google-recaptcha"; 
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false, // important!
});

//import { useNavigationStore } from '@/libs/navigation-store'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

import * as User from '@/app/server/users'

// Styles Imports
import styles from './styles.module.css'

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY);
const stripePromise = '';

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
    membership_level: optional(number()),
    first_name: pipe(string(), minLength(1, 'This field is required')),
    last_name: pipe(string(), minLength(1, 'This field is required')),
    email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address')),
    phone: pipe(string(), minLength(10, 'This field is required'), maxLength(10, 'Phone number must be 10 digit valid number.')),
    password: pipe(
        string(),
        nonEmpty('This field is required'),
        minLength(5, 'Password must be at least 5 characters long')
    ),
    re_password: pipe(string(), minLength(1, 'This field is required')),
    terms: pipe(boolean(), check(value => value === true, 'You must agree to the terms.')),
})

const SignupForm = () => {
    const recaptchaRef = useRef(null);

    const [refId, setRefId] = useState("");
    const [intentID, setIntentID] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [is_success, setIsSuccess] = useState(false);

    // States
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isPasswordShownRe, setIsPasswordShownRe] = useState(false)
    const [errorState, setErrorState] = useState<ErrorType | null>(null)
    const [isSubmitting , setIsSubmitting ] = useState(false)
    const [selectedLevel, setSelectedLevel] = useState(1);

    const [captchaValue, setCaptchaValue] = useState(null);
    const [captchaErr, setCaptchaErr] = useState('');

    // Hooks
    const router = useRouter()
    const searchParams = useSearchParams()

    const { settings } = useSettings()

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)
    const handleClickShowPasswordRe = () => setIsPasswordShownRe(show => !show)

    const ref_id = searchParams.get('ref_id')

    useEffect(() => {
      if(ref_id && ref_id!='' && refId == '') {
        setRefId(ref_id);
      }
    }, []);

    const {
        control,
        handleSubmit,
        getValues,
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
            terms: false
        }
    })

    const handleSelect = (value) => {
      setSelectedLevel(value); // set hidden field value
    };

    const handleSignup = async () => {
      const data = getValues();

      setCaptchaErr('')

      const phone_value = {
        country_name: 'us',
        country_code: '+1',
        number: data.phone
      }

      const fData = {
        membership_level: selectedLevel,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: phone_value,
        password: data.password,
        captcha: captchaValue,
        subscription_level: selectedLevel,
        role: 'property_owner',
      }

      if(refId){
        fData.referance_id = refId
      }

      const user = await User.signUp(fData)

      if (Object.keys(user).length === 0 || user?.status === false || user?.success === false) {
        setCaptchaErr(user?.message || 'Something went wrong, try again')

        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        setCaptchaValue(null);

      } else {
        setIsSuccess(true)
        //router.push('/success')
      }
    }

    return (
        <>
          {!is_success && selectedLevel === null && (
            <div className="levelsDiv">
              <h3>Membership Level</h3>
              <div className="level_main">
                <div className="levelOuter">
                  <p><strong>Basic</strong></p>
                  <p>core functionality</p>
                  <p>newsletters</p>
                  <p>$0.00 / Year</p>
                  <button type="button" value="1" className="btn memberhip-btn" onClick={() => handleSelect(1)}>Continue</button>
                </div>

                <div className="levelOuter">
                  <p><strong>Premium</strong></p>
                  <p>core functionality</p>
                  <p>newsletters</p>
                  <p>travel discounts</p>
                  <p>$99.99 / Year</p>
                  <button type="button" value="2" className="btn memberhip-btn" onClick={() => handleSelect(2)}>Continue</button>
                </div>
              </div>
            </div>
          )}

          {!is_success && selectedLevel && (
            <div className="formDiv">

              {currentStep == 1 && (
                <form
                  action={() => {}}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(async () => {
                    if (!captchaValue) {
                      setCaptchaErr('Please complete CAPTCHA')
                      return
                    }

                    if (selectedLevel === 1) {
                      await handleSignup()
                    } else if(selectedLevel == 2) {
                      setCurrentStep(2)
                    }
                    // For level=2 we render Stripe form instead, so no submit here
                  })}
                  className="flex flex-col gap-5 custom-reset-fld"
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
                                type='first_name'
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
                      <div className={classnames(styles.input_full_box, 'input_full_box')}>
                          <Controller
                            name='last_name'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='last_name'
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
                      <div className={classnames(styles.input_full_box, 'input_full_box')}>
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
                      <div className={classnames(styles.input_full_box, 'input_full_box')}>
                          <Controller
                            name='phone'
                            control={control}
                            rules={{ required: true,
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Only numbers are allowed",
                              },
                            }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='phone'
                                label='Phone Number *'
                                inputProps={{
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                }}
                                onChange={e => {
                                  const value = e.target.value.replace(/\D/g, "");
                                  field.onChange(value);
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
                      <div className={classnames(styles.input_full_box, 'input_full_box')}>
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
                      <div className={classnames(styles.input_full_box, 'input_full_box')}>
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

                      <div>
                        <ReCAPTCHA ref={recaptchaRef} sitekey="6Ldfpq4rAAAAAEZ8oYMZQSOei2zToLoQ1z1zojiu" onChange={setCaptchaValue} />
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

                      {/* Basic signup */}
                      {selectedLevel === 1 && (
                        <input type="submit" value="Create an account" />
                      )}
                      {selectedLevel === 2 && (
                        <input type="submit" value="Continue" />
                      )}

                      {captchaErr && (
                        <p className={classnames(styles.custom_error_class)}>{captchaErr}</p>
                      )}

                  </div>
                </form>
              )}

            </div>
          )}

          {is_success && (
            <div className="paymentFormBox">
              <Typography variant='h3' className='text-center mb-2'>Thank You!</Typography>
              <Typography variant='h6' className='text-center mb-2'>Your registration process has been completed.</Typography>
              <Typography variant='h6' className='text-center mb-2'>Please login using your email and password to access your account.</Typography>
            </div>
          )}
          
        </>
    )
}

export default SignupForm