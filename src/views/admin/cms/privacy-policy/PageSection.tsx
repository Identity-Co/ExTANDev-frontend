'use client'

// React Imports
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress';

import type { Editor } from '@tiptap/react'

const TipTapEditor = dynamic(() => import('@/components/TipTap'), { ssr: false })

import { toast } from 'react-toastify';

import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, optional } from 'valibot'
import type { InferInput } from 'valibot'

import { useNavigationStore } from '@/libs/navigation-store'

import { updatePageInfo } from '@/app/server/pages'

type FileProp = {
  name: string
  type: string
  size: number
}
type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  main_content_title: pipe(string(), nonEmpty('This field is required')),
  main_content: pipe(string(), nonEmpty('This field is required')),
  page_url: optional(string()),
  meta_title: optional(string()),
  meta_description: optional(string()),
  meta_keywords: optional(string()),
  robots: optional(string()),
  author: optional(string()),
  publisher: optional(string()),
  copyright: optional(string()),
  revisit_after: optional(string()),
  classification: optional(string()),
  rating: optional(string()),
})

const PageSection = ({ pgData }: { pgData?: []; }) => {  
  const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting , setIsSubmitting ] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [message, setMessage] = useState(null);

  const [destOptions, setdestOptions] = useState<string[]>([])
  const [resortOptions, setresortOptions] = useState<string[]>([])

  const fData = new FormData();

  const {
    control,
    register,
    handleSubmit,
    watch,trigger, setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      main_content_title: pgData?.main_content_title??'',
      main_content: pgData?.main_content??'',
      page_url: pgData?.page_url??'',
      meta_title: pgData?.meta_title??'',
      meta_description: pgData?.meta_description??'',
      meta_keywords: pgData?.meta_keywords??'',
      robots: pgData?.robots??'',
      author: pgData?.author??'',
      publisher: pgData?.publisher??'',
      copyright: pgData?.copyright??'',
      revisit_after: pgData?.revisit_after??'',
      classification: pgData?.classification??'',
      rating: pgData?.rating??'',
    }
  })

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)

    const log = await updatePageInfo('Privacy Policy', { 'name': 'Privacy Policy', ...data });
 
    if (log && log._id) {
      toast.success('Page updated successfully.')
      setIsSubmitting(false)
    } else {
      if(log.errors) {
        toast.error(log.errors.message)
      }
      
      setIsSubmitting(false)
    }
  }

  return (
    <Grid container spacing={6} sx={{ rowGap: 4 }}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Page Management - Privacy Policy' />
          <Divider />

          <CardContent className='mbe-5'>
            <form
              noValidate
              action={() => {}}
              autoComplete='off'
              onSubmit={handleSubmit(onUpdate)}
            >
              {/* Main Content fields*/}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Main Content</h2>
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='main_content_title'
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
                        {...((errors.main_content_title || errorState !== null) && {
                          error: true,
                          helperText: errors?.main_content_title?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                  <Controller
                    name='main_content'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TipTapEditor
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        onReady={(editorInstance) => setEditor(editorInstance)}
                      />
                    )}
                  />
                  {errors.main_content && (
                    <p className="text-red-500 text-sm mt-1">{errors.main_content.message}</p>
                  )}
                </Grid>          
                <Divider />
              </Grid>
              <Divider />

              {/* SEO Section */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>SEO</h2>
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Grid container spacing={5}>  
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Controller
                        name='page_url'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type='text'
                            label='URL'
                            variant='outlined'
                            placeholder='Enter URL'
                            className='mbe-1'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...((errors.page_url || errorState !== null) && {
                              error: true,
                              helperText: errors?.page_url?.message || errorState?.message[0]
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Controller
                        name='meta_title'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type='text'
                            label='Meta Title'
                            variant='outlined'
                            placeholder='Enter Meta Title'
                            className='mbe-1'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...((errors.meta_title || errorState !== null) && {
                              error: true,
                              helperText: errors?.meta_title?.message || errorState?.message[0]
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Controller
                        name='meta_description'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={4}
                            type='text'
                            label='Meta Description'
                            variant='outlined'
                            placeholder='Enter Meta Description'
                            className='mbe-1'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...((errors.meta_description || errorState !== null) && {
                              error: true,
                              helperText: errors?.meta_description?.message || errorState?.message[0]
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Controller
                        name='meta_keywords'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type='text'
                            label='Meta Keywords'
                            variant='outlined'
                            placeholder='Enter Meta Keywords'
                            className='mbe-1'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...((errors.meta_keywords || errorState !== null) && {
                              error: true,
                              helperText: errors?.meta_keywords?.message || errorState?.message[0]
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Controller
                        name='robots'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type='text'
                            label='ROBOTS'
                            variant='outlined'
                            placeholder='Robots'
                            className='mbe-1'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...((errors.robots || errorState !== null) && {
                              error: true,
                              helperText: errors?.robots?.message || errorState?.message[0]
                            })}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Grid container spacing={5}>
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Controller
                        name='author'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type='text'
                            label='Author'
                            variant='outlined'
                            placeholder='Enter Author'
                            className='mbe-1'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...((errors.author || errorState !== null) && {
                              error: true,
                              helperText: errors?.author?.message || errorState?.message[0]
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Controller
                        name='publisher'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type='text'
                            label='Publisher'
                            variant='outlined'
                            placeholder='Enter Publisher'
                            className='mbe-1'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...((errors.publisher || errorState !== null) && {
                              error: true,
                              helperText: errors?.publisher?.message || errorState?.message[0]
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Controller
                        name='copyright'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type='text'
                            label='Copyright'
                            variant='outlined'
                            placeholder='Enter Copyright'
                            className='mbe-1'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...((errors.copyright || errorState !== null) && {
                              error: true,
                              helperText: errors?.copyright?.message || errorState?.message[0]
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Controller
                        name='revisit_after'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type='text'
                            label='Revisit-After'
                            variant='outlined'
                            placeholder='Enter Revisit-After'
                            className='mbe-1'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...((errors.revisit_after || errorState !== null) && {
                              error: true,
                              helperText: errors?.revisit_after?.message || errorState?.message[0]
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Controller
                        name='classification'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type='text'
                            label='Classification'
                            variant='outlined'
                            placeholder='Enter Classification'
                            className='mbe-1'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...((errors.classification || errorState !== null) && {
                              error: true,
                              helperText: errors?.classification?.message || errorState?.message[0]
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Controller
                        name='rating'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type='text'
                            label='Rating'
                            variant='outlined'
                            placeholder='Enter Rating'
                            className='mbe-1'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...((errors.rating || errorState !== null) && {
                              error: true,
                              helperText: errors?.rating?.message || errorState?.message[0]
                            })}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container spacing={5}>  
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
      </Grid>
    </Grid>
  )
}

export default PageSection
