'use client'

// React Imports
import { useState, useEffect  } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

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

// import GoogleAuthButton from "@/components/GoogleAuthButton";

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
    const [errorMessage, setErrorMessage] = useState('')
    const [user, setUser] = useState<any>(null)

    // Hooks
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname();

    const isTotalTravel = pathname.includes('total-travel');

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

            let redirectURL = '';

            // Vars
            if(isTotalTravel == 1) {
              //redirectURL = '/total-travel/';
              window.location.reload();
              return;
            } else {
              redirectURL = searchParams.get('redirectTo') ?? '/my-account/'
            }

            router.replace(redirectURL)
        } else {
            if (res?.error) {
                setIsSubmitting(false)
                const error = res?.error

                setErrorState({"message": Array(error)})
            }
        }
    }

    useEffect(() => {
    }, [user])

    // Google Login
    useEffect(() => {
      // 1. Create script element
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        /* global google */
        google.accounts.id.initialize({
          client_id: "899760202984-plt5aioi3p8ctsr3tvroku9v9hm4ad25.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });
        google.accounts.id.renderButton(
          document.getElementById("googleSignIn"),
          { theme: "outline", size: "large" }
        );
      };

      document.body.appendChild(script);

      // Load Facebook SDK script
      window.fbAsyncInit = function () {
        FB.init({
          appId: '1380308580372397',
          cookie: true,
          xfbml: true,
          version: 'v21.0', // latest version as of 2025
        })
      }

      ;(function (d, s, id) {
        let js: any,
          fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) return
        js = d.createElement(s)
        js.id = id
        js.src = 'https://connect.facebook.net/en_US/sdk.js'
        fjs.parentNode.insertBefore(js, fjs)
      })(document, 'script', 'facebook-jssdk')

      return () => {
        document.body.removeChild(script);
      };
      console.log(user.name, user.email);
    }, [user]);

    const handleGoogleResponse = async (response) => {
      setErrorMessage('')

      try {
        console.log(response)
        /*const res = await axios.post("http://localhost:5001/v1/api/auth/google-login", {
          token: response.credential,
        });*/
        const _res = await fetch(`https://adventureapi.deepripple.com/v1/api/auth/google-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${session?.user?.userToken}`
          },
          body: JSON.stringify({'token': response.credential})
        })

        const data = await _res.json();
        console.log("Google login success:", data);

        if (data?.data) {
          const res = await signIn('credentials', {
              email: data?.data.email,
              password: data?.data.email+'_'+data?.data.googleId,
              redirect: false
          })

          console.log('res: ', res)

          if (res && res.ok && res.error === null) {
              // setLoading(true)

              let redirectURL = '';

              // Vars
              if(isTotalTravel == 1) {
                //redirectURL = '/total-travel/';
                window.location.reload();
                return;
              } else {
                redirectURL = searchParams.get('redirectTo') ?? '/my-account/'
              }

              router.replace(redirectURL)
          } else {
              if (res?.error) {
                  setIsSubmitting(false)
                  const error = res?.error

                  setErrorState({"message": Array(error)})
              }
          }
        } else {
          setErrorMessage(data?.message)
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleFacebookLogin = () => {
      window.FB.login(
        (response: any) => {
          if (response.authResponse) {
            console.log('Facebook login success:', response)
            window.FB.api('/me', { fields: 'name,email,picture' }, (profile: any) => {
              setUser(profile)
            })
          } else {
            console.log('User cancelled login or did not fully authorize.')
          }
        },
        { scope: 'email,public_profile' }
      )
    }

    const responseFacebook = async (response) => {
      console.log(response)
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
                          Invalid Email or Password.
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

            <div style={{ marginTop: "20px" }}>
              <div id="googleSignIn"></div>
            </div>


            <div style={{ marginTop: "20px" }}>
              <button 
                onClick={handleFacebookLogin} 
                style={{
                  backgroundColor: "#1877F2",
                  color: "white",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "6px",
                  width: "100%",
                  cursor: "pointer"
                }}
              >Sign in with Facebook</button>
            </div>

            <div className={classnames(styles.input_full_box , 'input_full_box')}>
              {errorMessage && (
                <Typography
                  variant='caption'
                  color='red'
                  sx={{ display: 'block', mt: 0.5, ml: 1 }}
                >
                  {errorMessage}
                </Typography>
              )}
            </div>
        </>
    )
}

export default SigninForm
