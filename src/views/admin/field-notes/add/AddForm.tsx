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
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress';

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, optional } from 'valibot'
import type { InferInput } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'

import { useDropzone } from 'react-dropzone'

type FileProp = {
  name: string
  type: string
  size: number
}

import { useSession } from 'next-auth/react'

import * as Banner from '@/app/server/banners'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  title: pipe(string(), nonEmpty('This field is required')),
  sub_title: pipe(string()),
  content: pipe(string()),
  button_text: optional(string()),
  button_link: pipe(string()),
  page: pipe(string(), nonEmpty('This field is required')),
  location: optional(string()),
})

const AddForm = () => {
  const router = useRouter()

  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [message, setMessage] = useState('');
  const [isSubmitting , setIsSubmitting ] = useState(false)

  const { data: session } = useSession()
  const [fileInput, setFileInput] = useState('')
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [imageInput, setImageInput] = useState<File | null>(null)
  const fData = new FormData();

  const handleFileInputChange = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement

    const file2 = files?.[0];

    if (!file2) return;

    const maxSize = 800 * 1024; // 800 KB

    if (file2.size > maxSize) {
      toast.error("File is too large. Maximum allowed size is 800KB.")

      return;
    }

    const reader = new FileReader()

    setImageInput(file2); 
    setMessage('');

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setFileInput(reader.result as string)
      }
    }
  }

  const handleFileInputReset = () => {
    setFileInput('')
    setImgSrc('/images/avatars/1.png')
  }

  const [files, setFiles] = useState<File[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const img = files.map((file: FileProp) => (
    <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
  ))

  const {
    control,
    register,
    handleSubmit,
    trigger, setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      title: '',
      sub_title: '',
      content: '',
      button_text: '',
      button_link: '',
      page: '',
      location: '',
    }
  })

  const onCreate: SubmitHandler<FormData> = async (data: FormData) => {
    if (!imageInput) {
      setMessage('This field is required.');
      
      return;
    }

    setIsSubmitting(true)
    
    if (imageInput) fData.append('file', imageInput);

    const _data = {
      "title" : data.title,
      "sub_title" : data.sub_title,
      "content" : data.content,
      "button_text" : data.button_text,
      "button_link" : data.button_link,
      "page" : data.page,
      "location": data.location
    }

    const log = await Banner.saveBanner(_data);

    if (log && log._id) {
      if(imageInput) {
        const user = await Banner.updateBannerInfo(log._id, fData)
      }
      
      toast.success('Banner created successfully.')
      router.replace('/admin/banner-sliders/')
    } else {
      if(log.errors) {
        toast.error(log.errors.message)
      }
      
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className='mbe-5'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button component='label' size='small' variant='contained' htmlFor='account-settings-upload-image'>
                Upload New Photo
                <input
                  hidden
                  type='file'
                  value={fileInput}
                  accept='image/png, image/jpeg'
                  onChange={handleFileInputChange}
                  id='account-settings-upload-image'
                />
              </Button>
              <Button size='small' variant='outlined' color='error' onClick={handleFileInputReset}>
                Reset
              </Button>
            </div>
            <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
            <Typography color='error.main'>{message}</Typography>
          </div>
        </div>
      </CardContent>

      <CardContent>
        <form
          noValidate
          action={() => {}}
          autoComplete='off'
          onSubmit={handleSubmit(onCreate)}
        >
          <Grid container spacing={5}>  
            <Grid size={{ md: 12, xs: 12, lg: 12 }}>
              <FormControl fullWidth>
                <InputLabel id='page' error={Boolean(errors.page)}>
                  Select Page
                </InputLabel>
                <Controller
                  name='page'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select label='Select Page' {...field} error={Boolean(errors.page)}>
                      <MenuItem value=''> - Page - </MenuItem>
                      <MenuItem value='Homepage'>Homepage</MenuItem>
                      <MenuItem value='OurDestinations'>Our Destinations</MenuItem>
                      <MenuItem value='OurAdventures'>Our Adventures</MenuItem>
                      <MenuItem value='FieldNotes'>Field Notes</MenuItem>
                    </Select>
                  )}
                />
                {errors.page && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid size={{ md: 6, xs: 12, lg: 6 }}>
              <Controller
                name='title'
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
                    {...((errors.title || errorState !== null) && {
                      error: true,
                      helperText: errors?.title?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12, lg: 6 }}>
              <Controller
                name='sub_title'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Sub Title'
                    variant='outlined'
                    placeholder='Enter Sub Title'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.sub_title || errorState !== null) && {
                      error: true,
                      helperText: errors?.sub_title?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 12, xs: 12, lg: 12 }}>
              <Controller
                name='content'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    rows={8}
                    multiline
                    type='text'
                    label='Content'
                    variant='outlined'
                    placeholder='Enter Content'
                    className='mbe-0'
                    id='content'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.content || errorState !== null) && {
                      error: true,
                      helperText: errors?.content?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12, lg: 6 }}>
              <Controller
                name='button_text'
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
                    {...((errors.button_text || errorState !== null) && {
                      error: true,
                      helperText: errors?.button_text?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12, lg: 6 }}>
              <Controller
                name='button_link'
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
                    {...((errors.button_link || errorState !== null) && {
                      error: true,
                      helperText: errors?.button_link?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12, lg: 6 }}>
              <Controller
                name='location'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Location'
                    variant='outlined'
                    placeholder='Location'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.location || errorState !== null) && {
                      error: true,
                      helperText: errors?.location?.message || errorState?.message[0]
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

export default AddForm
