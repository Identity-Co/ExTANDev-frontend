'use client'

// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress';

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, optional, email, custom } from 'valibot'
import type { InferInput } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'

import { useSession } from 'next-auth/react'

import * as GeneralSettings from '@/app/server/general_settings'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  header_logo: optional(custom<File | null>((value) => {
    if (!value) return true; 
    
    const allowed = ["image/png", "image/jpeg", "image/gif", "image/svg+xml"];

    if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF/SVG allowed";

    const maxMB = 1;

    if (value.size > maxMB * 1024 * 1024)

      return `Max file size is ${maxMB} MB`;

    return true;
  })),

  footer_logo: optional(custom<File | null>((value) => {
    if (!value) return true; 
    
    const allowed = ["image/png", "image/jpeg", "image/gif", "image/svg+xml"];

    if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF/SVG allowed";

    const maxMB = 1;

    if (value.size > maxMB * 1024 * 1024)

      return `Max file size is ${maxMB} MB`;

    return true;
  })),

  admin_email: optional(
    pipe(
      email('Please enter a valid email address'),
      string()
    )
  ),
  sendgrid_from_email: optional(string()),
  sendgrid_api_key: optional(string()),
  instagram_url: optional(string()),
  facebook_url: optional(string()),
  youtube_url: optional(string()),
  twitter_url: optional(string()),
  ambassadors_product_commission_rate: optional(string()),
})

type EditProps = {
  gSettings: any
}

const SettingsForm = ({ gSettings }: EditProps) => {
  const router = useRouter()

  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [message, setMessage] = useState('');
  const [isSubmitting , setIsSubmitting ] = useState(false)

  const { data: session } = useSession()

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      header_logo: ((gSettings?.header_logo) ? `${gSettings?.header_logo}` : null),
      header_logo_preview: ((gSettings?.header_logo) ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${gSettings?.header_logo}` : null),
      footer_logo: ((gSettings?.footer_logo) ? `${gSettings?.footer_logo}` : null),
      footer_logo_preview: ((gSettings?.footer_logo) ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${gSettings?.footer_logo}` : null),
      admin_email: gSettings?.admin_email?? '',
      sendgrid_from_email: gSettings?.sendgrid_from_email?? '',
      sendgrid_api_key: gSettings?.sendgrid_api_key?? '',
      instagram_url: gSettings?.instagram_url?? '',
      facebook_url: gSettings?.facebook_url?? '',
      youtube_url: gSettings?.youtube_url?? '',
      twitter_url: gSettings?.twitter_url?? '',
      ambassadors_product_commission_rate: gSettings?.ambassadors_product_commission_rate?? '',
    }
  })

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true);

    const formData = {
      'admin_email': data.admin_email,
      'sendgrid_from_email': data.sendgrid_from_email,
      'sendgrid_api_key': data.sendgrid_api_key,
      'instagram_url': data.instagram_url,
      'facebook_url': data.facebook_url,
      'youtube_url': data.youtube_url,
      'twitter_url': data.twitter_url,
      'ambassadors_product_commission_rate': data.ambassadors_product_commission_rate,
    }

    if (data.header_logo instanceof File){
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(data.header_logo);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });
      formData.header_logo = base64;
      formData.header_logo_file = data.header_logo.name;

    } else {
      if(data.header_logo){
        formData.header_logo = data.header_logo;
      }
    }

    if (data.footer_logo instanceof File){
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(data.footer_logo);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });
      formData.footer_logo = base64;
      formData.footer_logo_file = data.footer_logo.name;

    } else {
      if(data.footer_logo){
        formData.footer_logo = data.footer_logo;
      }
    }

    const res = await GeneralSettings.updateGeneralSettings(formData)

    if(res && res?._id) {
      toast.success('General Settings updated successfully.')
    }else{
      toast.error('Something went wrong, Please try again')
    }
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardContent sx={{padding: '0'}}>
        <form
          noValidate
          action={() => {}}
          autoComplete='off'
          onSubmit={handleSubmit(onUpdate)}
        >
          
          <Grid size={{ md: 12, xs: 12, lg: 12 }} className="mb-5">
            <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px;'}}>
              <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>General</h3>
            </Grid>
            <Grid container spacing={5} sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <div className='flex max-sm:flex-col items-center gap-6'>
                    {watch('header_logo_preview') ? (
                      <img height={100} width={100} className='rounded' src={watch('header_logo_preview')} alt='Header Logo' style={{backgroundColor: '#D3D3D3'}} />
                    ) : null}
                    <div className='flex flex-grow flex-col gap-4'>
                      <div className='flex flex-col sm:flex-row gap-4'>
                        <Button component='label' size='small' variant='contained' htmlFor='header-logo'>
                          Upload Header Logo
                          <input
                            hidden
                            required
                            type='file'
                            accept='image/png, image/jpeg'
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;

                              const maxSize = 1024 * 1024; // 800 KB

                              if (file.size > maxSize) {
                                toast.error("File is too large. Maximum allowed size is 1MB.")

                                return;
                              }

                              const url = file ? URL.createObjectURL(file) : null;
                              
                              const prev = (watch('header_logo_preview') as string | null) || null;
                              
                              if (prev) URL.revokeObjectURL(prev);
                              setValue('header_logo_preview', url, { shouldDirty: true });
                              setValue('header_logo', file, { shouldDirty: true });
                            }}
                            id='header-logo'
                          />
                        </Button>
                        <Button size='small' variant='outlined' color='error' onClick={(e) => {
                            setValue('header_logo_preview', null, { shouldDirty: true });
                            setValue('header_logo', null, { shouldDirty: true });
                          }}>
                            Reset
                        </Button>
                      </div>
                      <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                      {errors.header_logo && (
                        <Typography color="error.main">
                          {String(errors.header_logo.message)}
                        </Typography>
                      )}
                    </div>
                  </div>
              </Grid>
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <div className='flex max-sm:flex-col items-center gap-6'>
                    {watch('footer_logo_preview') ? (
                      <img height={100} width={100} className='rounded' src={watch('footer_logo_preview')} alt='Footer Logo' style={{backgroundColor: '#D3D3D3'}} />
                    ) : null}
                    <div className='flex flex-grow flex-col gap-4'>
                      <div className='flex flex-col sm:flex-row gap-4'>
                        <Button component='label' size='small' variant='contained' htmlFor='footer-logo'>
                          Upload Footer Logo (Optional)
                          <input
                            hidden
                            required
                            type='file'
                            accept='image/png, image/jpeg'
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;

                              const maxSize = 1024 * 1024; // 800 KB

                              if (file.size > maxSize) {
                                toast.error("File is too large. Maximum allowed size is 1MB.")

                                return;
                              }

                              const url = file ? URL.createObjectURL(file) : null;
                              
                              const prev = (watch('footer_logo_preview') as string | null) || null;
                              
                              if (prev) URL.revokeObjectURL(prev);
                              setValue('footer_logo_preview', url, { shouldDirty: true });
                              setValue('footer_logo', file, { shouldDirty: true });
                            }}
                            id='footer-logo'
                          />
                        </Button>
                        <Button size='small' variant='outlined' color='error' onClick={(e) => {
                            setValue('footer_logo_preview', null, { shouldDirty: true });
                            setValue('footer_logo', null, { shouldDirty: true });
                          }}>
                            Reset
                        </Button>
                      </div>
                      <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                      {errors.footer_logo && (
                        <Typography color="error.main">
                          {String(errors.footer_logo.message)}
                        </Typography>
                      )}
                    </div>
                  </div>
              </Grid>
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <Controller
                  name='admin_email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type='email'
                      label='Admin Email'
                      variant='outlined'
                      placeholder='Enter Admin Email'
                      className='mbe-1'
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.admin_email || errorState !== null) && {
                        error: true,
                        helperText: errors?.admin_email?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ md: 12, xs: 12, lg: 12 }} className="mb-5">
            <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px;'}}>
              <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>SMTP</h3>
            </Grid>
            <Grid container spacing={5} sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <Controller
                  name='sendgrid_from_email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type='email'
                      label='Sendgrid From Email'
                      variant='outlined'
                      placeholder='Enter Sendgrid From Email'
                      className='mbe-1'
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.sendgrid_from_email || errorState !== null) && {
                        error: true,
                        helperText: errors?.sendgrid_from_email?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <Controller
                  name='sendgrid_api_key'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type='text'
                      label='Sendgrid API Key'
                      variant='outlined'
                      placeholder='Enter Sendgrid API Key'
                      className='mbe-1'
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.sendgrid_api_key || errorState !== null) && {
                        error: true,
                        helperText: errors?.sendgrid_api_key?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ md: 12, xs: 12, lg: 12 }} className="mb-5">
            <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px;'}}>
              <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Social Profiles</h3>
            </Grid>
            <Grid container spacing={5} sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <Controller
                  name='instagram_url'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type='text'
                      label='Instagram URL'
                      variant='outlined'
                      placeholder='Enter Instagram URL'
                      className='mbe-1'
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.instagram_url || errorState !== null) && {
                        error: true,
                        helperText: errors?.instagram_url?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <Controller
                  name='facebook_url'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type='text'
                      label='Facebook URL'
                      variant='outlined'
                      placeholder='Enter Facebook URL'
                      className='mbe-1'
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.facebook_url || errorState !== null) && {
                        error: true,
                        helperText: errors?.facebook_url?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <Controller
                  name='youtube_url'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type='text'
                      label='YouTube URL'
                      variant='outlined'
                      placeholder='Enter YouTube URL'
                      className='mbe-1'
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.youtube_url || errorState !== null) && {
                        error: true,
                        helperText: errors?.youtube_url?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <Controller
                  name='twitter_url'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type='text'
                      label='X(Twitter) URL'
                      variant='outlined'
                      placeholder='Enter X(Twitter) URL'
                      className='mbe-1'
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.twitter_url || errorState !== null) && {
                        error: true,
                        helperText: errors?.twitter_url?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ md: 12, xs: 12, lg: 12 }} className="mb-5">
            <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px;'}}>
              <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Others</h3>
            </Grid>
            <Grid container spacing={5} sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <Controller
                  name='ambassadors_product_commission_rate'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type='text'
                      label='Ambassadors product commission rate (%)'
                      variant='outlined'
                      placeholder='Enter Ambassadors product commission rate (%)'
                      className='mbe-1'
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.ambassadors_product_commission_rate || errorState !== null) && {
                        error: true,
                        helperText: errors?.ambassadors_product_commission_rate?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Divider />

          <Grid size={{ xs: 12 }} className='flex gap-4 mt-5 flex-wrap' justifyContent="space-between" container sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>
            <Grid>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant='contained' type='submit' disabled={isSubmitting}>
                  Update
                </Button>
                {isSubmitting ? <CircularProgress style={{marginLeft: '8px'}} size={24} thickness={6} /> : ''}
              </div>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default SettingsForm
