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
import { createPaymentIntent } from '@/app/server/payments'

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
    travel_frequency: pipe(string(), minLength(1, 'This field is required')),
    budget: pipe(string(), minLength(1, 'This field is required')),
    opt_in: optional(boolean()),
    terms: pipe(boolean(), check(value => value === true, 'You must agree to the terms.')),
})

const SignupForm = () => {
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

    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])
    const [captchaValue, setCaptchaValue] = useState(null);
    const [captchaErr, setCaptchaErr] = useState('');

    const interests = ['Eco Adventure', 'Wellness', 'Culinary', 'Wildlife & Safari', 'Cultural & Heritage', 'Luxury Travel', 'Yoga & Meditation']
    const destinations = ['Belize', 'Dominican Republic', 'Costa Rica', 'Colombia', 'El Salvador', 'Jamaica', 'Puerto Rico', 'Barbados']

    // Hooks
    const router = useRouter()
    const searchParams = useSearchParams()

    const { settings } = useSettings()

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)
    const handleClickShowPasswordRe = () => setIsPasswordShownRe(show => !show)

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
            travel_interests: [],
            preferred_destinations: [],
            travel_frequency: '',
            budget: '',
            opt_in: true,
            terms: false
        }
    })

    const handleSelect = (value) => {
      setSelectedLevel(value); // set hidden field value
    };

    const toggleInterests = (id: string) => {
      const arr = selectedInterests

      if (selectedInterests.includes(id)) {
        arr.splice(arr.indexOf(id), 1)
        setSelectedInterests([...arr])
      } else {
        arr.push(id)
        setSelectedInterests([...arr])
      }
    }

    const toggleDestinations = (id: string) => {
      const arr = selectedDestinations

      if (selectedDestinations.includes(id)) {
        arr.splice(arr.indexOf(id), 1)
        setSelectedDestinations([...arr])
      } else {
        arr.push(id)
        setSelectedDestinations([...arr])
      }
    }

    // Call backend to create PaymentIntent
    /* Hold for Now------
    
    useEffect(() => {
      const fetchPaymentIntent = async () => {
        if (selectedLevel !== 2) return;
        try {
          const pIntent = await createPaymentIntent(); // wait for the promise
          console.log("pIntent:", pIntent);
          setIntentID(pIntent?.id);
          setClientSecret(pIntent?.client_secret);
        } catch (err) {
          console.error("Error creating PaymentIntent:", err);
        }
      };

      fetchPaymentIntent();

    }, [selectedLevel]);*/

    const handleSignup = async () => {
      const data = getValues();

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
        travel_interests: selectedInterests,
        preferred_destinations: selectedDestinations,
        travel_frequency: data.travel_frequency,
        budget: data.budget,
        opt_in: data.opt_in,
        captcha: captchaValue,
        subscription_level: selectedLevel,
        role: 'user'
      }

      console.log('fData :: ', fData)

      const user = await User.signUp(fData)

      console.log('User.signUp response: ', user)

      if (user?.status === false) {
        setCaptchaErr(user.message)
      } else {
        setIsSuccess(true)
        //router.push('/success')
      }
    }

    /* const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
      if (!captchaValue) {
        setCaptchaErr('Please complete CAPTCHA')

        return;
      }

      //const stripe = useStripe();
      //const elements = useElements();
      const stripe = await stripePromise;
      if (stripe && clientSecret) { // && elements
        const elements = stripe.elements({ clientSecret });
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: "http://localhost:3001/success",
          },
        });

        if (error) {
          console.error(error.message);
          alert(error.message);
          return;
        } else if (paymentIntent) {
          console.log("PaymentIntent ID:", paymentIntent.id);
          console.log("Payment status:", paymentIntent.status);
          console.log("Amount:", paymentIntent.amount);
        } else {
          console.log("Payment confirmed!");
        }
      }

      const fData = {
        "membership_level" : selectedLevel,
        "first_name" : data.first_name,
        "last_name" : data.last_name,
        "email" : data.email,
        "phone" : data.phone,
        "password": data.password,
        "travel_interests": selectedInterests,
        "preferred_destinations": selectedDestinations,
        "travel_frequency": data.travel_frequency,
        "budget": data.budget,
        "opt_in": data.opt_in,
        "captcha": captchaValue,
        "subscription_level" : selectedLevel,
      }

      console.log('fData: ', fData)

      const user = await User.signUp(fData)

      console.log('user Response: ', user)

      if (user.status == false) {
        setCaptchaErr(user.message)
      }
    };

    if (!clientSecret) return <p>Loading...</p>; */

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
              {/* <form noValidate action={() => {}} autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 custom-reset-fld'> */}
              {/* <form noValidate autoComplete='off' onSubmit={handleSubmit(async () => {
                if (!captchaValue) {
                  setCaptchaErr('Please complete CAPTCHA');
                  return;
                }

                console.log("SUBMIT:", selectedLevel, clientSecret);

                if (selectedLevel === 2) {
                  if (!clientSecret) return; // wait for PaymentIntent
                }

                if (selectedLevel === 2 && clientSecret) {
                  // Premium: Payment + Signup
                  return (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <PremiumPaymentSection handleSignup={handleSignup} />
                    </Elements>
                  )
                } else {
                  // Basic: just signup
                  await handleSignup()
                }
              })} className='flex flex-col gap-5 custom-reset-fld'> */}

              {/* <form noValidate autoComplete="off" className="flex flex-col gap-5 custom-reset-fld"> */}

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
                      <div className={classnames(styles.input_full_box, 'input_full_box')}>
                        <Typography className='font-medium whitespace-nowrap flex-grow min-is-[225px]'>Travel Interests</Typography>
                        <FormGroup>
                          {interests.map((interest, index) => (
                            <FormControlLabel
                              key={`interest-${index}`}
                              className='mie-0'
                              control={
                                <Checkbox
                                  id={`interest-${index}`}
                                  onChange={() => toggleInterests(interest)}
                                  checked={selectedInterests.includes(interest)}
                                />
                              }
                              label={interest}
                            />
                          ))}
                        </FormGroup>
                      </div>
                      <div className={classnames(styles.input_full_box, 'input_full_box')}>
                        <Typography className='font-medium whitespace-nowrap flex-grow min-is-[225px]'>Preferred Destinations</Typography>
                        <FormGroup>
                          {destinations.map((destination, index) => (
                            <FormControlLabel
                              key={`destination-${index}`}
                              className='mie-0'
                              control={
                                <Checkbox
                                  id={`destination-${index + 1}`}
                                  onChange={() => toggleDestinations(destination)}
                                  checked={selectedDestinations.includes(destination)}
                                />
                              }
                              label={destination}
                            />
                          ))}
                        </FormGroup>
                      </div>

                      <div className={classnames(styles.input_full_box, 'input_full_box')}>
                        <Controller
                          name='travel_frequency'
                          control={control}
                          rules={{ required: 'This field is required' }}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel id='travel_frequency-select'>Select Travel Frequency *</InputLabel>
                              <Select
                                {...field}
                                fullWidth
                                id='select-travel_frequency'
                                label='Select Travel Frequency *'
                                className='mbe-1'
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                labelId='travel_frequency-select'
                                inputProps={{ placeholder: 'Select Travel Frequency *' }}
                              >
                                <MenuItem value='Rarely'>Rarely</MenuItem>
                                <MenuItem value='Once a Year'>Once a Year</MenuItem>
                                <MenuItem value='2–3 Times a Year'>2–3 Times a Year</MenuItem>
                                <MenuItem value='Monthly'>Monthly</MenuItem>
                                <MenuItem value='Weekly'>Weekly</MenuItem>
                              </Select>
                              {errors.travel_frequency ?
                                <p className="custom-error-class">{errors?.travel_frequency?.message}</p>
                              :''}
                            </FormControl>
                          )}
                        />
                      </div>

                      <div className={classnames(styles.input_full_box, 'input_full_box')}>
                          <Controller
                            name='budget'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='budget'
                                label='Budget *'
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                slotProps={{
                                  input: {
                                    startAdornment: (
                                      <InputAdornment position='start'>
                                          <i className='ri-money-dollar-circle-line' />
                                      </InputAdornment>
                                    )
                                  }
                                }}
                                {...((errors.budget || errorState !== null) && {
                                  error: true,
                                  helperText: errors?.budget?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                      </div>

                      <div className={classnames(styles.input_full_box , 'input_full_box')}>
                        <Controller
                          name="opt_in"
                          control={control}
                          defaultValue={true}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={field.value}
                                />
                              }
                              label="Opt-in for Marketing"
                            />
                          )}
                        />
                      </div>

                      <div>
                        <ReCAPTCHA sitekey="6Ldfpq4rAAAAAEZ8oYMZQSOei2zToLoQ1z1zojiu" onChange={setCaptchaValue} />
                        {captchaErr && (
                          <p className={classnames(styles.custom_error_class)}>{captchaErr}</p>
                        )}
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

                      {/* selectedLevel === 1 && (
                        <div className={classnames(styles.input_full_box, styles.submit_btn)}>
                          <input type="button" value="Create an account"
                            onClick={async () => {
                              if (!captchaValue) {
                                setCaptchaErr("Please complete CAPTCHA")
                                return
                              }
                              await handleSignup()
                            }}
                          />
                        </div>
                      ) */}

                      {/* selectedLevel === 1 && (
                        <div className={classnames(styles.input_full_box, styles.submit_btn)}>
                            <input type="submit" value="Create an account" />
                        </div>
                      ) */}

                      {/* selectedLevel==2 && (
                        <>
                            <Elements stripe={stripePromise} options={{clientSecret}}>
                              <PaymentElement />
                            </Elements>
                        </>
                      ) */}

                      {/* Premium signup */}
                      {/* selectedLevel === 2 && clientSecret && (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                          <PremiumPaymentSection handleSignup={handleSignup} captchaValue={captchaValue} />
                        </Elements>
                      ) */}

                      {/* selectedLevel === 2 && clientSecret && (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                          <PremiumPaymentSection handleSignup={handleSignup} />
                        </Elements>
                      ) */}

                  </div>
                </form>
              )}

              {selectedLevel === 2 && clientSecret && currentStep == 2 && (
                <div className="paymentFormBox">
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PremiumPaymentSection handleSignup={handleSignup} captchaValue={captchaValue} />
                  </Elements>
                </div>
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


// ---------------------------
// PremiumPaymentSection
// ---------------------------
const PremiumPaymentSection = ({ handleSignup, captchaValue }) => {
  //const stripe = useStripe()
  //const elements = useElements()

  const stripe = '';
  const elements = '';

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!captchaValue) {
      alert("Please complete CAPTCHA")
      return
    }

    if (!stripe || !elements) return

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: "http://localhost:3001/success" },
      redirect: "if_required",
    })

    if (error) {
      alert(error.message)

      return
    }

    console.log("Payment response:", paymentIntent)

    if (paymentIntent?.status === "succeeded") {
      console.log("✅ Payment successful:", paymentIntent.id)

      await handleSignup()
    } else {
      console.log("⚠️ Payment status:", paymentIntent?.status)
    }

    //console.log('Payment successful', paymentIntent?.id)
    //await handleSignup()
  }

  return (
    <form onSubmit={handlePayment}>
      {/*<PaymentElement />*/}
      <div className={classnames(styles.input_full_box, styles.submit_btn)}>
          <input type="submit" value="Confirm Payment & Signup" />
      </div>
    </form>
  )
}

