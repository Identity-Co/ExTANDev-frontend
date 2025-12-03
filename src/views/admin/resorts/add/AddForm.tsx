'use client'

// React Imports
import { useState, useEffect } from 'react'

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
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress';

import { toast } from 'react-toastify';

import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, optional, custom, array } from 'valibot'
import type { InferInput } from 'valibot'

import { useNavigationStore } from '@/libs/navigation-store'

import { createResort } from '@/app/server/resorts'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

import 'react-quill-new/dist/quill.snow.css';


type ErrorType = {
  message: string[]
}

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

type FormData = InferInput<typeof schema>

const schema = object({
  name: pipe(string(), nonEmpty('This field is required')),
  resort_image: optional(custom<File | null>((value) => {
    if (!value) return true; 
    
    const allowed = ["image/png", "image/jpeg", "image/gif"];
    const maxMB = 5;

    return allowed.includes(value.type) && value.size <= maxMB * 1024 * 1024;
  }, "Only PNG/JPG/GIF allowed and max file size is 5 MB")),
  resort_image_preview: optional(string()),
  location: optional(string()),
  content: optional(string()),
  tags: array(string()),
})

const AddResorts = () => {  
  const router = useRouter()

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting , setIsSubmitting ] = useState(false)

  // Editor Toolbar
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

  const {
    control,
    register,
    handleSubmit,
    watch,trigger, setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      name: '',
      resort_image: '',
      resort_image_preview: '',
      content: '',
      location: '',
      tags: [],
    }
  })

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)

    const fdata = {
      'name': data.name,
      'content': data.content,
      'location': data.location,
      //'image': data.resort_image,
      'tags': data.tags
    }

    if (data.resort_image instanceof File){
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(data.resort_image);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });
      fdata.resort_image = base64;
      fdata.resort_image_file = data.resort_image.name;

    } else {
      if(pgData.resort_image){
        fdata.resort_image = pgData.resort_image;
      }
    }
    const log = await createResort(fdata);

    console.log(log)

    if (log && log._id) {
      toast.success('Resort created successfully.')
    } else {
      toast.error('Something went wrong, Please try again')
    }
    setIsSubmitting(false)
  }

  const TagsInput = ({ value, onChange }: TagsInputProps) => {
    const [inputValue, setInputValue] = useState('')

    const handleAddTag = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && inputValue.trim()) {
        event.preventDefault()
        const newTag = inputValue.trim()
        if (newTag && !value.includes(newTag)) {
          onChange([...value, newTag])
        }
        setInputValue('')
      }
    }

    const handleDeleteTag = (tagToDelete: string) => {
      onChange(value.filter(tag => tag !== tagToDelete))
    }

    return (
      <Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add tags and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddTag}
          size="small"
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {value.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
              size="small"
              color="primary"
              variant="outlined"
              style={{marginBottom: "5px"}}
            />
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <form
        noValidate
        action={() => {}}
        autoComplete='off'
        onSubmit={handleSubmit(onUpdate)}
      >
      <Grid container spacing={6} sx={{ rowGap: 4 }}>
        <Grid size={{ xs: 12, md: 12, lg: 9, }}>
          <Card>
            <CardHeader title="Resort Data" />
            <Divider />

            <CardContent className='mbe-5'>
              <Grid container spacing={5} className="my-5">
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Controller
                    name='name'
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
                        {...((errors.name || errorState !== null) && {
                          error: true,
                          helperText: errors?.name?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <div className='flex max-sm:flex-col items-center gap-6 flex-wrap'>
                    {watch('resort_image_preview') ? (
                      <img height={100} width={100} className='rounded' src={watch('resort_image_preview')} alt='Resort Image' />
                    ) : null}
                    <div className='flex flex-grow flex-col gap-4'>
                      <div className='flex flex-col sm:flex-row gap-4'>
                        <Button component='label' size='small' variant='contained' htmlFor='resort_image'>
                          Upload Resort Image
                          <input
                            hidden
                            required
                            type='file'
                            accept='image/png, image/jpeg, image/svg+xml'
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;

                              const maxSize = 800 * 1024;

                              if (file.size > maxSize) {
                                toast.error("File is too large. Maximum allowed size is 800KB.")

                                return;
                              }

                              const url = file ? URL.createObjectURL(file) : null;
                              const prev = (watch('resort_image_preview') as string | null) || null;
                              
                              if (prev) URL.revokeObjectURL(prev);
                              setValue('resort_image_preview', url, { shouldDirty: true });
                              setValue('resort_image', file, { shouldDirty: true });
                            }}
                            id='resort_image'
                          />
                        </Button>
                        <Button size='small' variant='outlined' color='error' onClick={(e) => {
                            setValue('resort_image_preview', null, { shouldDirty: true });
                            setValue('resort_image', null, { shouldDirty: true });
                          }}>
                            Reset
                        </Button>
                      </div>
                      <Typography>Allowed JPG, GIF, SVG or PNG. Max size of 800K</Typography>
                      {errors.resort_image && (
                        <Typography color="error.main">
                          {String(errors.resort_image.message)}
                        </Typography>
                      )}
                    </div>
                  </div>
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='location'
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Location'
                        variant='outlined'
                        placeholder='Enter Location'
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
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                  <Controller
                    name='content'
                    control={control}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        modules={modules}
                        placeholder="Write something amazing..."
                        style={{ height: "300px", marginBottom: "60px" }}
                      />
                    )}
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                  )}
                </Grid>   
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 12, lg: 3, }}>
          <Card>
            <CardHeader title='Resort Guide Meta' />
            <Divider />

            <CardContent className='mbe-5'>
              <Grid container spacing={5}>  
                <Grid size={{ xs: 12 }} className='flex gap-4 mt-5 flex-wrap' justifyContent="space-between" container>
                  <Grid size={{ xs:12 }}>
                    <Grid container spacing={5}>
                      <Grid size={{ md: 12, xs: 12, lg: 12 }} className="mb-5">
                        <Typography variant="h6" component="h6" color="primary" className="mb-2">Tags</Typography>
                        <Controller
                          name="tags"
                          control={control}
                          render={({ field }) => (
                            <TagsInput
                              value={field.value || []}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        {errors.tags && (
                          <Typography color="error.main" variant="caption">
                            {errors.tags.message}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                    <Divider />
                  </Grid>
                  <Grid size={{ xs: 12 }} className='flex gap-4 mt-2 flex-wrap' justifyContent="space-between" container>
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}

export default AddResorts