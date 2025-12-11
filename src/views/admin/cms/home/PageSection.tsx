'use client'

// React Imports
import React, { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

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
import { Autocomplete } from "@mui/material";

import type { Editor } from '@tiptap/react'

const TipTapEditor = dynamic(() => import('@/components/TipTap'), { ssr: false })

import { toast } from 'react-toastify';

import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, array, optional } from 'valibot'
import type { InferInput } from 'valibot'

import { useNavigationStore } from '@/libs/navigation-store'

import { updateSection, updateSectionImage } from '@/app/server/home_page'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

import 'react-quill-new/dist/quill.snow.css';

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
  about_sub_title: pipe(string()),
  about_content: pipe(string(), nonEmpty('This field is required')),
  about_button_text: optional(string()),
  about_button_link: pipe(string()),
  about_location: optional(string()),
  username: optional(string()),
  description: optional(string()),
  destinations: array(
    optional(string()),
  ),
  adventure_slider_title: pipe(string(), nonEmpty('This field is required')),
  adventure_slider_description: optional(string()),
  adventure_slides: array(
    optional(string()),
  ),
  adventure_title: pipe(string(), nonEmpty('This field is required')),
  adventure_content: pipe(string(), nonEmpty('This field is required')),
  adventure_button_text: optional(string()),
  adventure_button_link: pipe(string()),
  adventure_location: optional(string()),
  subscribe_title: pipe(string(), nonEmpty('This field is required')),
  subscribe_sub_title: pipe(string()),
  subscribe_button_text: optional(string()),
  subscribe_button_link: pipe(string()),
  share_title: pipe(string(), nonEmpty('This field is required')),
  share_sub_title: pipe(string()),
  share_button_text: optional(string()),
  share_button_link: pipe(string()),
  adventure_posts: array(
    optional(string()),
  ),
  field_note_title: pipe(string(), nonEmpty('This field is required')),
  field_notes: array(
    optional(string()),
  ),
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

const PageSection = ({ pgData, fnotes, destinations, adventurePosts }: { pgData?: []; fnotes?: []; destinations?: []; adventurePosts?: []; }) => {  
  const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting , setIsSubmitting ] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  
  const [message, setMessage] = useState({
    about_image: null,
    adventure_image: null,
  });
  
  const [quillVal, setquillVal] = useState('')

  const [noteOptions, setnoteOptions] = useState<string[]>([])
  const [destOptions, setdestOptions] = useState<string[]>([])
  const [advPostsOptions, setadvPostsOptions] = useState<string[]>([])

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['blockquote', 'code-block'],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }

  const fData = new FormData();

  useEffect(() => {
    const obj = fnotes.map(item => ({
      label: item._id,
      value: item.title
    }));

    setnoteOptions(obj);
  }, [fnotes]);

  useEffect(() => {
    const obj = destinations.map(item => ({
      label: item._id,
      value: item.title
    }));

    setdestOptions(obj);
  }, [destinations]);

  useEffect(() => {
    const obj = adventurePosts.map(item => ({
      label: item._id,
      value: item.name
    }));

    setadvPostsOptions(obj);
  }, [adventurePosts]);
  
  const [aboutfileInput, setaboutFileInput] = useState('')
  const [aboutimgSrc, setaboutImgSrc] = useState<string>(pgData?.about_image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${pgData?.about_image}` : '/images/avatars/1.png')
  const [aboutimageInput, setaboutImageInput] = useState<File | null>(null)

  const handleAboutFileInputChange = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement

    const file2 = files?.[0];

    if (!file2) return;

    const maxSize = 800 * 1024; // 800 KB

    if (file2.size > maxSize) {
      toast.error("File is too large. Maximum allowed size is 800KB.")

      return;
    }

    const reader = new FileReader()

    setaboutImageInput(file2); 
    setMessage((prev) => ({
      ...prev,
      about_image: null
    }));

    if (files && files.length !== 0) {
      reader.onload = () => setaboutImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setaboutFileInput(reader.result as string)
      }
    }
  }

  const handleAboutFileInputReset = () => {
    setaboutFileInput('')
    setaboutImgSrc('/images/avatars/1.png')
  }

  const [adventurefileInput, setadventureFileInput] = useState('')
  const [adventureimgSrc, setadventureImgSrc] = useState<string>(pgData?.adventure_image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${pgData?.adventure_image}` : '/images/avatars/1.png')
  const [adventureimageInput, setadventureImageInput] = useState<File | null>(null)

  const handleAdventureFileInputChange = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement

    const file2 = files?.[0];

    if (!file2) return;

    const maxSize = 800 * 1024; // 800 KB

    if (file2.size > maxSize) {
      toast.error("File is too large. Maximum allowed size is 800KB.")

      return;
    }

    const reader = new FileReader()

    setadventureImageInput(file2); 
    setMessage((prev) => ({
      ...prev,
      adventure_image: null
    }));

    if (files && files.length !== 0) {
      reader.onload = () => setadventureImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setadventureFileInput(reader.result as string)
      }
    }
  }

  const handleAdventureFileInputReset = () => {
    setadventureFileInput('')
    setadventureImgSrc('/images/avatars/1.png')
  }

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
      about_sub_title: pgData?.about_sub_title??'',
      about_content: pgData?.about_content??'',
      about_button_text: pgData?.about_button_text??'',
      about_button_link: pgData?.about_button_link??'',
      about_location: pgData?.about_location??'',
      username: pgData?.username??'',
      description: pgData?.description??'',
      destinations: pgData?.destinations??[],
      adventure_slider_title: pgData?.adventure_slider_title??'',
      adventure_slider_description: pgData?.adventure_slider_description??'',
      adventure_slides: pgData?.adventure_slides??[],
      adventure_title: pgData?.adventure_title??'',
      adventure_content: pgData?.adventure_content??'',
      adventure_button_text: pgData?.adventure_button_text??'',
      adventure_button_link: pgData?.adventure_button_link??'',
      subscribe_title: pgData?.subscribe_title??'',
      subscribe_sub_title: pgData?.subscribe_sub_title??'',
      subscribe_button_text: pgData?.subscribe_button_text??'',
      subscribe_button_link: pgData?.subscribe_button_link??'',
      share_title: pgData?.share_title??'',
      share_sub_title: pgData?.share_sub_title??'',
      share_button_text: pgData?.share_button_text??'',
      share_button_link: pgData?.share_button_link??'',
      adventure_posts: pgData?.adventure_posts??[],
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
    
    if (!aboutimageInput && (pgData?.about_image == '' || pgData?.about_image === undefined)) {
      setMessage((prev) => ({
        ...prev,
        about_image: 'This field is required.'
      }));
      
      return;
    }

    if (!adventureimageInput && (pgData?.adventure_image == '' || pgData?.adventure_image === undefined)) {
      setMessage((prev) => ({
        ...prev,
        adventure_image: 'This field is required.'
      }));
      
      return;
    }

    setIsSubmitting(true)
    
    if (aboutimageInput) { 
      fData.append('about_file', aboutimageInput);
    }

    if (adventureimageInput) { 
      fData.append('adventure_file', adventureimageInput);
    }

    const log = await updateSection(data);

    if (log && log._id) {
      if(adventureimageInput || aboutimageInput) {
        const image = await updateSectionImage(log._id, fData)
      }
      
      toast.success('Section updated successfully.')
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
          <CardHeader title='Home Page Management' />
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

                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <div className='flex max-sm:flex-col items-center gap-6'>
                    <img height={100} width={100} className='rounded' src={aboutimgSrc} alt='Profile' />
                    <div className='flex flex-grow flex-col gap-4'>
                      <div className='flex flex-col sm:flex-row gap-4'>
                        <Button component='label' size='small' variant='contained' htmlFor='about-image'>
                          Upload New Photo
                          <input
                            hidden
                            type='file'
                            value={aboutfileInput}
                            accept='image/png, image/jpeg'
                            onChange={handleAboutFileInputChange}
                            id='about-image'
                          />
                        </Button>
                        <Button size='small' variant='outlined' color='error' onClick={handleAboutFileInputReset}>
                          Reset
                        </Button>
                      </div>
                      <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                      <Typography color='error.main'>{message.about_image}</Typography>
                    </div>
                  </div>
                </Grid>

                {/*<Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <div className='flex max-sm:flex-col items-center gap-6'>
                    <ReactQuill
                      theme="snow"
                      value={quillVal}
                      onChange={setquillVal}
                      modules={modules}
                      placeholder="Write something amazing..."
                      style={{ height: "300px" }}
                    />
                  </div>
                </Grid>*/}

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
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='about_sub_title'
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
                        {...((errors.about_sub_title || errorState !== null) && {
                          error: true,
                          helperText: errors?.about_sub_title?.message || errorState?.message[0]
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
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='about_location'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Location'
                        variant='outlined'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Divider />
              </Grid>
              <Divider />

              {/* Testimonial */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Testimonial</h2>
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='username'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Name'
                        variant='outlined'
                        placeholder='Enter Name'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.username || errorState !== null) && {
                          error: true,
                          helperText: errors?.username?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='description'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={2}
                        type='text'
                        label='Description'
                        variant='outlined'
                        placeholder='Enter Description'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.description || errorState !== null) && {
                          error: true,
                          helperText: errors?.description?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Destinations Slider Section */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Destinations Slider</h2>
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <input type="hidden" {...register("destinations")} />
                  <Autocomplete
                    multiple
                    options={destOptions}
                    getOptionLabel={(option) => option.value} 
                    value={destOptions.filter(opt =>
                      (watch("destinations") || []).includes(opt.label)
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.label}> 
                        {option.value}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Destination" variant="outlined" />
                    )}
                    onChange={(event, newValue) => {
                      setValue(
                        "destinations",
                        newValue.map((item) => item.label), // array of values
                        { shouldValidate: true }
                      );
                    }}
                  />
                </Grid>
              </Grid>
              <Divider />

              {/* Adventure Slider Section */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Adventure Slider</h2>
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='adventure_slider_title'
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
                        {...((errors.adventure_slider_title || errorState !== null) && {
                          error: true,
                          helperText: errors?.adventure_slider_title?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Grid container spacing={5}> 
                    <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                      <Typography variant="h6" color="#a3a3a3">
                        Description
                      </Typography>
                      <Controller
                        name='adventure_slider_description'
                        control={control}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            modules={modules}
                            placeholder="Enter adventure slider description..."
                            style={{ height: "100px", marginBottom: "60px" }}
                          />
                        )}
                      />
                    </Grid> 
                    <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                      <input type="hidden" {...register("adventure_slides")} />
                      <Autocomplete
                        multiple
                        options={advPostsOptions}
                        getOptionLabel={(option) => option.value} 
                        value={advPostsOptions.filter(opt =>
                          (watch("adventure_slides") || []).includes(opt.label)
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.label}> 
                            {option.value}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label="Search Adventues" variant="outlined" />
                        )}
                        onChange={(event, newValue) => {
                          setValue(
                            "adventure_slides",
                            newValue.map((item) => item.label), // array of values
                            { shouldValidate: true }
                          );
                        }}
                      />
                    </Grid> 
                  </Grid>
                </Grid>
              </Grid>
              <Divider />

              {/* Adventure Section */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Adventure Section</h2>
                </Grid>

                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <div className='flex max-sm:flex-col items-center gap-6'>
                    <img height={100} width={100} className='rounded' src={adventureimgSrc} alt='Profile' />
                    <div className='flex flex-grow flex-col gap-4'>
                      <div className='flex flex-col sm:flex-row gap-4'>
                        <Button component='label' size='small' variant='contained' htmlFor='adventure-image'>
                          Upload New Photo
                          <input
                            hidden
                            type='file'
                            value={adventurefileInput}
                            accept='image/png, image/jpeg'
                            onChange={handleAdventureFileInputChange}
                            id='adventure-image'
                          />
                        </Button>
                        <Button size='small' variant='outlined' color='error' onClick={handleAdventureFileInputReset}>
                          Reset
                        </Button>
                      </div>
                      <Typography>Allowed JPG, GIF or PNG. Max size of 2048K</Typography>
                      <Typography color='error.main'>{message.adventure_image}</Typography>
                    </div>
                  </div>
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='adventure_title'
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
                        {...((errors.adventure_title || errorState !== null) && {
                          error: true,
                          helperText: errors?.adventure_title?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                  <Controller
                    name='adventure_content'
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
                  {errors.adventure_content && (
                    <p className="text-red-500 text-sm mt-1">{errors.adventure_content.message}</p>
                  )}
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='adventure_button_text'
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
                        {...((errors.adventure_button_text || errorState !== null) && {
                          error: true,
                          helperText: errors?.adventure_button_text?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='adventure_button_link'
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
                        {...((errors.adventure_button_link || errorState !== null) && {
                          error: true,
                          helperText: errors?.adventure_button_link?.message || errorState?.message[0]
                        })}
                      />
                    )}
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
                  <input type="hidden" {...register("adventure_posts")} />
                  <Autocomplete
                    multiple
                    options={advPostsOptions}
                    getOptionLabel={(option) => option.value} 
                    value={advPostsOptions.filter(opt =>
                      (watch("adventure_posts") || []).includes(opt.label)
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.label}> 
                        {option.value}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Adventue Posts" variant="outlined" />
                    )}
                    onChange={(event, newValue) => {
                      setValue(
                        "adventure_posts",
                        newValue.map((item) => item.label), // array of values
                        { shouldValidate: true }
                      );
                    }}
                  />
                </Grid>
              </Grid>
              <Divider />

              {/* Fields Notes */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Fields Notes</h2>
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='field_note_title'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Field Note Title'
                        variant='outlined'
                        placeholder='Enter Field Note Title'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.field_note_title || errorState !== null) && {
                          error: true,
                          helperText: errors?.field_note_title?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <input type="hidden" {...register("field_notes")} />
                  <Autocomplete
                    multiple
                    options={noteOptions}
                    getOptionLabel={(option) => option.value} 
                    value={noteOptions.filter(opt =>
                      (watch("field_notes") || []).includes(opt.label)
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.label}> 
                        {option.value}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Field Notes" variant="outlined" />
                    )}
                    onChange={(event, newValue) => {
                      setValue(
                        "field_notes",
                        newValue.map((item) => item.label), // array of values
                        { shouldValidate: true }
                      );
                    }}
                  />
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
