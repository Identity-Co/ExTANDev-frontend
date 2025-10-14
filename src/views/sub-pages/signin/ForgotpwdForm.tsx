'use client'

// React Imports
import { useState } from 'react'

// Next Imports
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
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe, nonEmpty } from 'valibot'
import classnames from 'classnames'
import type { InferInput } from 'valibot'

//import { useNavigationStore } from '@/libs/navigation-store'

import { toast } from 'react-toastify';

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
    email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address'))
})

// Styles Imports
import styles from './styles.module.css'

type ForgotProps = {
  toggleForm: () => void
}

const ForgotpwdForm = ({ toggleForm }: ForgotProps) => {

    // States
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [errorState, setErrorState] = useState<ErrorType | null>(null)
    const [isSubmitting , setIsSubmitting ] = useState(false)
    const [formError , setFormError ] = useState('')

    // Hooks
    const router = useRouter()
    const searchParams = useSearchParams()

    const { settings } = useSettings()

    const {
        control,
        handleSubmit, reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: valibotResolver(schema),
        defaultValues: {
            email: '',
        }
    })

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        setIsSubmitting(true)
        setFormError('');

        console.log(data);

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
            reset()
            toast.success('Email sent successfully.')
          } else {
            setFormError(log.errors.message)
          }
        } else {
          setFormError(log.errors.message)
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
                    <div className={classnames(styles.input_full_box, styles.pass_ref, styles.recovery)}>
                        <span>Enter your e-mail address below to reset your password</span>
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
                              {...((errors.email || errorState !== null) && {
                                error: true,
                                helperText: errors?.email?.message || errorState?.message[0]
                              })}
                            />
                          )}
                        />
                    </div>

                    {formError && (
                      <Typography variant="error" className="text-center text-green-600 font-medium">
                          {formError}
                      </Typography>
                    )}

                    <div className={classnames(styles.input_full_box, styles.btnset)}>
                        <button className={classnames(styles.back_btn)} type="button" onClick={toggleForm}>Back</button>
                        <div className={classnames(styles.submit_btn)}>
                            <input type="submit" value="Submit" />
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default ForgotpwdForm
