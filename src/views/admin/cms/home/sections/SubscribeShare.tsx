'use client'

// React Imports
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider'

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { string, pipe, nonEmpty, optional, object } from 'valibot'
import type { InferInput } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'

type FileProp = {
  name: string
  type: string
  size: number
}

import { useSession } from 'next-auth/react'

import { updateSection } from '@/app/server/home_page'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  subscribe_title: pipe(string(), nonEmpty('This field is required')),
  subscribe_sub_title: pipe(string()),
  subscribe_button_text: optional(string()),
  subscribe_button_link: pipe(string()),
  share_title: pipe(string(), nonEmpty('This field is required')),
  share_sub_title: pipe(string()),
  share_button_text: optional(string()),
  share_button_link: pipe(string()),
})

const SubscribeShare = ({ section }: { section?: [] }) => {
  const router = useRouter()

  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [message, setMessage] = useState('');
  const [isSubmitting , setIsSubmitting ] = useState(false)

  const { data: session } = useSession()

  const {
    control,
    register,
    handleSubmit,
    trigger, setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      subscribe_title: section?.subscribe_title??'',
      subscribe_sub_title: section?.subscribe_sub_title??'',
      subscribe_button_text: section?.subscribe_button_text??'',
      subscribe_button_link: section?.subscribe_button_link??'',
      share_title: section?.share_title??'',
      share_sub_title: section?.share_sub_title??'',
      share_button_text: section?.share_button_text??'',
      share_button_link: section?.share_button_link??'',
    }
  })

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {

    setIsSubmitting(true)

    const _data = {
      "subscribe_title": data.subscribe_title,
      "subscribe_sub_title": data.subscribe_sub_title,
      "subscribe_button_text": data.subscribe_button_text,
      "subscribe_button_link": data.subscribe_button_link,
      "share_title": data.share_title,
      "share_sub_title": data.share_sub_title,
      "share_button_text": data.share_button_text,
      "share_button_link": data.share_button_link,
    }

    const log = await updateSection(section?.section_key, _data);

    if (log && log._id) {      
      toast.success('Section updated successfully.')

      router.replace('/admin/cms_home/')
    } else {
      if(log.errors) {
        toast.error(log.errors.message)
      }
      
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form
          noValidate
          action={() => {}}
          autoComplete='off'
          onSubmit={handleSubmit(onUpdate)}
        >
          <Grid container spacing={5}>  
            <Grid size={{ md: 12, xs: 12, lg: 12 }}>
              <h2>Subscribe Section </h2>
            </Grid>
            <Grid size={{ md: 12, xs: 12, lg: 12 }}>
              <Controller
                name='subscribe_title'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Title'
                    variant='outlined'
                    placeholder='Enter Title'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.subscribe_title || errorState !== null) && {
                      error: true,
                      helperText: errors?.subscribe_title?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 12, xs: 12, lg: 12 }}>
              <Controller
                name='subscribe_sub_title'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    type='text'
                    label='Sub Title'
                    variant='outlined'
                    placeholder='Enter Sub Title'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.subscribe_sub_title || errorState !== null) && {
                      error: true,
                      helperText: errors?.subscribe_sub_title?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12, lg: 6 }}>
              <Controller
                name='subscribe_button_text'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Button Text'
                    variant='outlined'
                    placeholder='Enter Button Text'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.subscribe_button_text || errorState !== null) && {
                      error: true,
                      helperText: errors?.subscribe_button_text?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12, lg: 6 }}>
              <Controller
                name='subscribe_button_link'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='url'
                    label='Button Link'
                    variant='outlined'
                    placeholder='https://example.com'
                    {...register("link", {
                      required: "URL is required",
                      pattern: {
                        value: /^https?:\/\/[^\s$.?#].[^\s]*$/i,
                        message: "Invalid URL format (must start with http or https)",
                      },
                    })}
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.subscribe_button_link || errorState !== null) && {
                      error: true,
                      helperText: errors?.subscribe_button_link?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Divider />
            <Grid size={{ md: 12, xs: 12, lg: 12 }}>
              <h2>Share Section </h2>
            </Grid>
            <Grid size={{ md: 12, xs: 12, lg: 12 }}>
              <Controller
                name='share_title'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Title'
                    variant='outlined'
                    placeholder='Enter Title'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.share_title || errorState !== null) && {
                      error: true,
                      helperText: errors?.share_title?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 12, xs: 12, lg: 12 }}>
              <Controller
                name='share_sub_title'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    type='text'
                    label='Sub Title'
                    variant='outlined'
                    placeholder='Enter Sub Title'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.share_sub_title || errorState !== null) && {
                      error: true,
                      helperText: errors?.share_sub_title?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12, lg: 6 }}>
              <Controller
                name='share_button_text'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Button Text'
                    variant='outlined'
                    placeholder='Enter Button Text'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.share_button_text || errorState !== null) && {
                      error: true,
                      helperText: errors?.share_button_text?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12, lg: 6 }}>
              <Controller
                name='share_button_link'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='url'
                    label='Button Link'
                    variant='outlined'
                    placeholder='https://example.com'
                    {...register("link", {
                      required: "URL is required",
                      pattern: {
                        value: /^https?:\/\/[^\s$.?#].[^\s]*$/i,
                        message: "Invalid URL format (must start with http or https)",
                      },
                    })}
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.share_button_link || errorState !== null) && {
                      error: true,
                      helperText: errors?.share_button_link?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }} className='flex gap-4 mt-5 flex-wrap' justifyContent="space-between" container>
              <Grid>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button variant='contained' type='submit' disabled={isSubmitting}>
                    Submit
                  </Button>
                  {isSubmitting ? <CircularProgress style={{marginLeft: '8px'}} size={24} thickness={6} /> : ''}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default SubscribeShare
