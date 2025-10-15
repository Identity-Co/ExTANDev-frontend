'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

import AccountSidebar from './../AccountSidebar'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
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

import { updateUser } from '@/app/server/users'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
    first_name: pipe(string(), minLength(1, 'This field is required')),
    last_name: pipe(string(), minLength(1, 'This field is required')),
    phone: pipe(string(), minLength(1, 'This field is required')),
    instagram_url: optional(string()),
    facebook_url: optional(string()),
    pinterest_url: optional(string()),
    twitterx_url: optional(string()),
    whatsapp_url: optional(string()),
    tiktok_url: optional(string()),
})


// Styles Imports
import styles from './../styles.module.css'

const EditProfile = ({ user }: {user?:{}}) => {
    const [errorState, setErrorState] = useState<ErrorType | null>(null)
    const [isSubmitting , setIsSubmitting ] = useState(false)

    console.log(user)

    const {
      control,
      handleSubmit,
      formState: { errors }
    } = useForm<FormData>({
      resolver: valibotResolver(schema),
      defaultValues: {
        membership_level: user?.membership_level??0,
        first_name: user?.first_name??'',
        last_name: user?.last_name??'',
        phone: user?.phone?.number??'',
        instagram_url: user?.socialmedia_urls?.instagram_url??'',
        facebook_url: user?.socialmedia_urls?.facebook_url??'',
        pinterest_url: user?.socialmedia_urls?.pinterest_url??'',
        twitterx_url: user?.socialmedia_urls?.twitterx_url??'',
        whatsapp_url: user?.socialmedia_urls?.whatsapp_url??'',
        tiktok_url: user?.socialmedia_urls?.tiktok_url??'',
      }
    })

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
      console.log(data);
      setIsSubmitting(true)

      const res = await updateUser(user?._id, data);
      
      if(res.success || res._id) {
        setIsSubmitting(false)
        toast.success('Profile updated successfully.')
        setTimeout(() => {
            messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 200)
      } else {
        setFormError(user?.errors?.message || "Something went wrong. Please try again.")
      }
    };
  
    return (
      <div className={classnames(styles.grid_box)}>
        <form
          noValidate
          action={() => {}}
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-5'
        >
          <div>
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

          <div>
            <Controller
              name='last_name'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
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

          <div>
            <Controller
              name='phone'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  type='phone'
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
            <Typography className='font-small center'>Social Media links (at least one)</Typography>
          </div>

          <div>
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

          <div className={classnames(styles.input_full_box, styles.submit_btn)}>
              <button type="submit" disabled={isSubmitting}> Save </button>
              {isSubmitting ? <CircularProgress style={{marginLeft: '8px', color: 'white'}} size={20} thickness={6} /> : ''}
          </div>
        </form>
      </div>
    )
}

export default EditProfile
