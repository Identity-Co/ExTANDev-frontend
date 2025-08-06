'use client'

import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress';

// Third-party Imports
import classnames from 'classnames'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe } from 'valibot'
import type { InferInput } from 'valibot'

import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address'))
})

// Util Imports

const ForgotPasswordV2 = ({ mode }: { mode: Mode }) => {
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting , setIsSubmitting ] = useState(false)
  const [isSent, setIsSent] = useState(0)

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-forgot-password-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-forgot-password-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-forgot-password-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-forgot-password-light-border.png'

  // Hooks
  
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const { settings } = useSettings()

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forget-password-request `, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    const log = await res.json()
    
    if (res && res.ok) {
      if(log.success == true) {
          setIsSent(1)
      } else {
        setErrorState({"message": Array('Email sending failed')})
      }
    } else {
      setErrorState({"message": Array('Email sending failed')})
    }

    setIsSubmitting(false)
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='plb-12 pis-12'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[500px] max-is-full bs-auto'
          />
        </div>
        <Illustrations
          image1={{ src: '/images/illustrations/objects/tree-2.png' }}
          image2={null}
          maskImg={{ src: authBackground }}
        />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href={'/'}
          className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
          <div>
            <Typography variant='h4'>Forgot Password 🔒</Typography>
            <Typography className='mbs-1'>
              Enter your email and we&#39;ll send you instructions to reset your password
            </Typography>
          </div>
          <form key={1} noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5' name="frmS1">
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField autoFocus fullWidth label='Email' name='email2' id='email'
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...((errors.email || errorState !== null) && {
                    error: true,
                    helperText: errors?.email?.message || errorState?.message[0]
                  })}
                />
              )}
            />
            <Button fullWidth variant='contained' name="submitS1" type='submit' disabled={isSubmitting}>
              Continue {isSubmitting ? <CircularProgress style={{marginLeft: '8px', color: '#fff'}} size={24} thickness={6} /> : ''}
            </Button>
            <Typography className='flex justify-center items-center' color='primary.main'>
              <Link href='/login/' className='flex items-center'>
                <i className='ri-arrow-left-s-line' />
                <span>Back to Login</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordV2
