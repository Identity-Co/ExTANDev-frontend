'use client'

// React Imports
import { useEffect, useState } from 'react'

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
import Autocomplete from "@mui/material/Autocomplete";

import type { Editor } from '@tiptap/react'

const TipTapEditor = dynamic(() => import('@/components/TipTap'), { ssr: false })

import { toast } from 'react-toastify';

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, array, optional } from 'valibot'

import type { InferInput } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'

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
  about_title: pipe(string(), nonEmpty('This field is required')),
  about_content: pipe(string(), nonEmpty('This field is required')),
  about_button_text: optional(string()),
  about_button_link: pipe(string()),
  feature_adventure_title: pipe(string(), nonEmpty('This field is required')),
  feature_adventures: array(
    optional(string()),
  ),
  subscribe_title: pipe(string(), nonEmpty('This field is required')),
  subscribe_sub_title: pipe(string()),
  subscribe_button_text: optional(string()),
  subscribe_button_link: pipe(string()),
  share_title: pipe(string(), nonEmpty('This field is required')),
  share_sub_title: pipe(string()),
  share_button_text: optional(string()),
  share_button_link: pipe(string()),
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

const PageSection = ({ pgData, destinations }: { pgData?: []; destinations?: []; }) => {  
  const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting , setIsSubmitting ] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [message, setMessage] = useState(null);

  const [destOptions, setdestOptions] = useState<string[]>([])
  const [resortOptions, setresortOptions] = useState<string[]>([])

  const fData = new FormData();

  useEffect(() => {
    const obj = destinations.map(item => ({
      label: item._id,
      value: item.title
    }));

    setdestOptions(obj);
  }, [destinations]);

  const {
    control,
    register,
    handleSubmit,
    watch,trigger, setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      about_title: pgData?.about_title??'',
      about_content: pgData?.about_content??'',
      about_button_text: pgData?.about_button_text??'',
      about_button_link: pgData?.about_button_link??'',
      feature_adventure_title: pgData?.feature_adventure_title??'',
      feature_adventures: pgData?.feature_adventures??[],
      subscribe_title: pgData?.subscribe_title??'',
      subscribe_sub_title: pgData?.subscribe_sub_title??'',
      subscribe_button_text: pgData?.subscribe_button_text??'',
      subscribe_button_link: pgData?.subscribe_button_link??'',
      share_title: pgData?.share_title??'',
      share_sub_title: pgData?.share_sub_title??'',
      share_button_text: pgData?.share_button_text??'',
      share_button_link: pgData?.share_button_link??'',
      field_note_title: pgData?.field_note_title??'',
      field_notes: pgData?.field_notes??[],
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

    const log = await updatePageInfo('Our Adventure', { 'name': 'Our Adventure', ...data });
 
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
          <CardHeader title='Page Management - Our Adventure' />
          <Divider />

          <CardContent className='mbe-5'>
            <form
              noValidate
              action={() => {}}
              autoComplete='off'
              onSubmit={handleSubmit(onUpdate)}
            >
              {/* About Us fields*/}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>About Section</h2>
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='about_title'
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
                        {...((errors.about_title || errorState !== null) && {
                          error: true,
                          helperText: errors?.about_title?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                  <Controller
                    name='about_content'
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
                  {errors.about_content && (
                    <p className="text-red-500 text-sm mt-1">{errors.about_content.message}</p>
                  )}
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='about_button_text'
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
                        {...((errors.about_button_text || errorState !== null) && {
                          error: true,
                          helperText: errors?.about_button_text?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='about_button_link'
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
                        {...((errors.about_button_link || errorState !== null) && {
                          error: true,
                          helperText: errors?.about_button_link?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>                
                <Divider />
              </Grid>
              <Divider />

              {/* Feature Adventure */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Feature Adventure</h2>
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='feature_adventure_title'
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
                        {...((errors.feature_adventure_title || errorState !== null) && {
                          error: true,
                          helperText: errors?.feature_adventure_title?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <input type="hidden" {...register("feature_adventures")} />
                  <Autocomplete
                    multiple
                    options={destOptions}
                    getOptionLabel={(option) => option.value} 
                    value={destOptions.filter(opt =>
                      (watch("feature_adventures") || []).includes(opt.label)
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.label}> 
                        {option.value}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Adventure" variant="outlined" />
                    )}
                    onChange={(event, newValue) => {
                      setValue(
                        "feature_adventures",
                        newValue.map((item) => item.label), // array of values
                        { shouldValidate: true }
                      );
                    }}
                  />
                </Grid>
              </Grid>
              <Divider />

              {/* Adventure Posts Section */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Adventure Posts</h2>
                </Grid>

                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <br />
                </Grid>
              </Grid>
              <Divider />

              {/* Insta Feeds Section */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Insta Feeds</h2>
                </Grid>

                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <br />
                </Grid>
              </Grid>
              <Divider />

              {/* Subscribe OR Share */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Subscribe</h2>
                </Grid>

                <Grid container spacing={5}>  
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
                          rows={2}
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
                    <h2>Share</h2>
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
                          rows={2}
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
                  
                </Grid>
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
              {/*<LargeImageWithText />*/}
              {/*<SubscribeShare />*/}
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PageSection
