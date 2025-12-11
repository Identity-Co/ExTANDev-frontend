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
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from "@mui/material/Autocomplete";

import CustomIconButton from '@core/components/mui/IconButton'

import { toast } from 'react-toastify';

import { Controller, useForm, useFieldArray } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, optional, custom, array, any } from 'valibot'
import type { InferInput } from 'valibot'

import { useNavigationStore } from '@/libs/navigation-store'

import { updateResort } from '@/app/server/resorts'

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
  banners: array(
    object({
      content: optional(string()),
      image: pipe(custom<File | null>((value) => {
        if (!value) return 'This field is required';
        const allowed = ["image/png", "image/jpeg", "image/gif"];
        if (!allowed.includes((value as File).type)) return "Only PNG/JPG/GIF allowed";
        const maxMB = 2;
        if ((value as File).size > maxMB * 1024 * 1024)
          return `Max file size is ${maxMB} MB`;
        return true;
      })),
      _preview: optional(string()),
    })
  ),
  about_button_text: optional(string()),
  about_button_link: pipe(string()),
  offers_lists: array(
    object({
      title: pipe(string(), nonEmpty('This field is required')),
      content: optional(string()),
      from_date: pipe(string(), nonEmpty('This field is required')),
      to_date: pipe(string(), nonEmpty('This field is required')),
      image: pipe(custom<File | null>((value) => {
        if (!value) return 'This field is required';
        const allowed = ["image/png", "image/jpeg", "image/gif"];
        if (!allowed.includes((value as File).type)) return "Only PNG/JPG/GIF allowed";
        const maxMB = 5;
        if ((value as File).size > maxMB * 1024 * 1024)
          return `Max file size is ${maxMB} MB`;
        return true;
      })),
      image_preview: optional(string()),
      button_text: optional(string()),
      button_url: optional(string()),
    })
  ),
  bottom_image: optional(custom<File | null>((value) => {
    if (!value) return 'This field is required';
    const allowed = ["image/png", "image/jpeg", "image/gif"];
    if (!allowed.includes((value as File).type)) return "Only PNG/JPG/GIF allowed";
    const maxMB = 5;
    if ((value as File).size > maxMB * 1024 * 1024)
      return `Max file size is ${maxMB} MB`;
    return true;
  })),
})

const AddResorts = ({ pgData, adventurePosts, getFormId }: { pgData?: any; adventurePosts?: []; getFormId?: any }) => {  
  const router = useRouter()

  let form_id = getFormId?.();

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewsOptions, setReviewsOptions] = useState<{label: string, value: string}[]>([])

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
    watch,
    trigger, 
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      banners: (pgData?.offers?.banners && Array.isArray(pgData.offers.banners) && pgData.offers.banners.length > 0) 
        ? pgData.offers.banners.map((section: any) => ({
            content: section.content || '',
            image: section.image || null,
            _preview: section.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${section.image}` : '',
          }))
        : [{ title: '', image: null, _preview: '' }],
      about_button_text: pgData?.offers?.about_button_text ?? '',
      about_button_link: pgData?.offers?.about_button_link ?? '',

      offers_lists: (pgData?.offers?.offers_lists && Array.isArray(pgData.offers.offers_lists) && pgData.offers.offers_lists.length > 0) 
        ? pgData.offers.offers_lists.map((section: any) => ({
            title: section.title ?? '',
            content: section.content ?? '',
            from_date: section.from_date ?? '',
            to_date: section.to_date ?? '',
            image: section.image ?? null,
            _preview: section?.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${section.image}` : '',
            button_text: section.button_text ?? '',
            button_url: section.button_url ?? '',
        })) 
      : [{title: '', content: '', from_date: '', to_date: '', image: '', image_preview: '', button_text: '', button_url: '' }],
      bottom_image: pgData?.offers?.bottom_image,
      bottom_image_preview: pgData?.offers?.bottom_image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${pgData.offers.bottom_image}` : '',
    }
  })

  const { fields: bannersFields, append: appendBannersFields, remove: removeBannersFields } = useFieldArray({
    control,
    name: "banners",
  });

  const { fields: offersListsFields, append: appendOffersListsFields, remove: removeOffersListsFields } = useFieldArray({
    control,
    name: "offers_lists",
  });

  // Fix: Add setEditor function
  const setEditor = (editorInstance: any) => {
    // You can store the editor instance if needed
  };

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)

    const formData = new FormData();

    // Basic fields
    formData.append('offers_tab', 'yes');
    formData.append("offers[about_button_text]", data.about_button_text || '');
    formData.append("offers[about_button_link]", data.about_button_link);

    // Banners data
    data.banners.forEach((section, i) => {
      formData.append(`offers_banners[${i}][content]`, section.content)
      if (section.image && section.image instanceof File) {
        formData.append(`offers_banners[${i}][image]`, section.image)
      } else if (typeof section.image === 'string') {
        formData.append(`offers_banners[${i}][image]`, section.image)
      }
    });

    // Offers list data
    data.offers_lists.forEach((section, i) => {
      formData.append(`offers_offers_lists[${i}][title]`, section.title)
      formData.append(`offers_offers_lists[${i}][content]`, section.content || '')
      formData.append(`offers_offers_lists[${i}][from_date]`, section.from_date || '')
      formData.append(`offers_offers_lists[${i}][to_date]`, section.to_date || '')
      formData.append(`offers_offers_lists[${i}][button_text]`, section.button_text || '')
      formData.append(`offers_offers_lists[${i}][button_url]`, section.button_url || '')
      formData.append(`offers_offers_lists[${i}][image]`, section.image || '')
    })

    if (data.bottom_image instanceof File){
      formData.append("offers_bottom_image", data.bottom_image);
    }else if(data.bottom_image){
      formData.append("bottom_image", data.bottom_image);
    }

    let log = null;
    if(form_id === null) {
     //
    } else {
      log = await updateResort(form_id, formData);
    }

    if (log && log._id) {
      toast.success('Offers tab updated successfully.')
    } else {
      toast.error('Something went wrong, Please try again')
    }
    setIsSubmitting(false)
  }

  return (
    <form
        noValidate
        action={() => {}}
        autoComplete='off'
        onSubmit={handleSubmit(onUpdate)}
      >
      <Grid container spacing={6} sx={{ rowGap: 4 }}>
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <Card className="mt-2">
            <CardHeader title='Offers Tab' />
            <Divider />

            <CardContent className='mbe-5'>
              {/* Banner Section */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px'}}>
                <h3 style={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Banners</h3>
              </Grid>
              <Grid container spacing={5}>  
                <Grid size={{ xs: 12 }} className='flex gap-4 mt-5 flex-wrap' justifyContent="space-between" container>
                  <Grid size={{ xs:12 }}>
                    <Grid container spacing={5}>
                      {bannersFields.map((field, index) => (
                        <div key={field.id} className="border rounded p-4 mb-2" style={{width: '100%'}}>
                          <div className="flex justify-between items-center mb-4">
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>Banner Slide {index + 1}</Typography>
                            {index > 0 ? 
                              (<CustomIconButton aria-label='capture screenshot' color='error' size='medium' onClick={() => removeBannersFields(index)}>
                              <i className="ri-delete-bin-7-line"></i>
                            </CustomIconButton>) 
                            : null }   
                          </div>
                          <Grid container spacing={3}>
                            <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                              <div className='flex max-sm:flex-col items-center gap-6'>
                                {watch(`banners.${index}._preview`) ? (
                                  <img height={100} width={100} className='rounded' src={watch(`banners.${index}._preview`) as string} alt='Banner Image' />
                                  ) : null}
                                <div className='flex flex-grow flex-col gap-4'>
                                  <div className='flex flex-col sm:flex-row gap-4'>
                                    <Button component='label' size='small' variant='contained' htmlFor={`banner_image_${index}`}>
                                      Upload New Photo
                                      <input
                                        hidden
                                        type='file'
                                        accept='image/png, image/jpeg'
                                        onChange={(e) => {
                                          const file = e.target.files?.[0] ?? null;
                                          const maxSize = (1024 * 2) * 1024;

                                          if (file && file.size > maxSize) {
                                            toast.error("File is too large. Maximum allowed size is 2MB.")
                                            return;
                                          }

                                          const url = file ? URL.createObjectURL(file) : null;
                                          const prev = (watch(`banners.${index}._preview`) as string | null) || null;
                                          
                                          if (prev) URL.revokeObjectURL(prev);
                                          setValue(`banners.${index}._preview`, url, { shouldDirty: true });
                                          setValue(`banners.${index}.image`, file, { shouldDirty: true });
                                        }}
                                        id={`banner_image_${index}`}
                                      />
                                    </Button>
                                    <Button size='small' variant='outlined' color='error' onClick={(e) => {
                                      setValue(`banners.${index}.image`, null, { shouldDirty: true });
                                      setValue(`banners.${index}._preview`, null, { shouldDirty: true });
                                    }}>
                                      Reset
                                    </Button>
                                  </div>
                                  <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                                  {errors.banners?.[index]?.image && (<Typography color='error.main'>{String(errors.banners[index]?.image?.message)}</Typography>)}
                                </div>
                              </div>
                            </Grid>
                            <Grid size={{ md: 6, xs: 12, lg: 6 }} style={{ marginBottom: "0" }}>
                              <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                              <Controller
                                name={`banners.${index}.content`}
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <ReactQuill
                                    theme="snow"
                                    value={field.value ?? ''}
                                    onChange={field.onChange}
                                    onInit={(editorInstance) => setEditor(editorInstance)}
                                    modules={modules}
                                    placeholder="Write something amazing..."
                                    style={{ height: "100px", marginBottom: "60px" }}
                                  />
                                )}
                              />
                              {errors.banners?.[index]?.content && (
                                <p className="text-red-500 text-sm mt-1">{errors.banners?.[index]?.content.message}</p>
                              )}
                            </Grid>
                            <Divider />
                          </Grid>
                          <Grid size={{ md: 6, xs: 2, sm: 2 }}>
                            { bannersFields.length === index+1 ? (
                              <Button 
                                aria-label='capture screenshot' 
                                onClick={() => appendBannersFields({title: '', image: null, _preview: ''})} 
                                color='secondary' 
                                size='small' 
                                variant="contained" 
                                startIcon={<i className='ri-add-line' />}
                              >
                                Add Banner
                              </Button>
                            ) : null }               
                          </Grid>
                        </div>
                      ))}
                    </Grid>
                  </Grid>                  
                </Grid>
              </Grid>

              {/* About Us fields*/}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px;', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>About Section</h3>
              </Grid>
              <Grid container spacing={5}>
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
                        id='offers_about_button_text'
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
                        id='offers_about_button_url'
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
              </Grid>

              {/* Offers Lists*/}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Offers Lists</h3>
              </Grid>
              <Grid container spacing={5}>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  {offersListsFields.map((field, index) => (
                    <div key={field.id} spacing={5} className="border rounded p-4 mb-2">
                      <div className="flex justify-between items-center mb-4">
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>Offer {index + 1}</Typography>
                        {index > 0 ? 
                          (<CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => removeOffersListsFields(index)}>
                          <i className="ri-delete-bin-7-line"></i>
                        </CustomIconButton>) 
                        : null }       
                      </div>
                      <Grid container spacing={6}>
                        <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <Controller
                            name={`offers_lists.${index}.title`}
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
                                id={`offers_lists.${index}.title`}
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errorState !== null) && {
                                  error: true,
                                  helperText: errors?.offers_lists[index]?.title?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <div className='flex max-sm:flex-col items-center gap-6'>
                            {watch(`offers_lists.${index}._preview`) ? (
                              <img height={100} width={100} className='rounded' src={watch(`offers_lists.${index}._preview`) as string} alt='Banner Image' />
                              ) : null}
                            <div className='flex flex-grow flex-col gap-4'>
                              <div className='flex flex-col sm:flex-row gap-4'>
                                <Button component='label' size='small' variant='contained' htmlFor={`offer_image_${index}`}>
                                  Upload New Photo
                                  <input
                                    hidden
                                    type='file'
                                    accept='image/png, image/jpeg'
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] ?? null;
                                      const maxSize = 800 * 1024;

                                      if (file && file.size > maxSize) {
                                        toast.error("File is too large. Maximum allowed size is 800KB.")
                                        return;
                                      }

                                      const url = file ? URL.createObjectURL(file) : null;
                                      const prev = (watch(`offers_lists.${index}._preview`) as string | null) || null;
                                      
                                      if (prev) URL.revokeObjectURL(prev);
                                      setValue(`offers_lists.${index}._preview`, url, { shouldDirty: true });
                                      setValue(`offers_lists.${index}.image`, file, { shouldDirty: true });
                                    }}
                                    id={`offer_image_${index}`}
                                  />
                                </Button>
                                <Button size='small' variant='outlined' color='error' onClick={(e) => {
                                  setValue(`offers_lists.${index}.image`, null, { shouldDirty: true });
                                  setValue(`offers_lists.${index}._preview`, null, { shouldDirty: true });
                                }}>
                                  Reset
                                </Button>
                              </div>
                              <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                              {errors.offers_lists?.[index]?.image && (<Typography color='error.main'>{String(errors.offers_lists[index]?.image?.message)}</Typography>)}
                            </div>
                          </div>
                        </Grid>
                        <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <Controller
                            name={`offers_lists.${index}.from_date`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='date'
                                label='From Date'
                                variant='outlined'
                                placeholder='Select From Date'
                                className='mbe-1'
                                id={`offers_lists.${index}.from_date`}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errorState !== null) && {
                                  error: true,
                                  helperText: errors?.offers_lists[index]?.from_date?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <Controller
                            name={`offers_lists.${index}.to_date`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='date'
                                label='To Date'
                                variant='outlined'
                                placeholder='Select To Date'
                                className='mbe-1'
                                id={`offers_lists.${index}.to_date`}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errorState !== null) && {
                                  error: true,
                                  helperText: errors?.offers_lists[index]?.to_date?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>
                        
                        <Grid size={{ md: 21, xs: 12, lg: 12 }} style={{ marginBottom: "0" }}>
                          <Typography variant='h6' color='#a3a3a3'>Description</Typography>
                          <Controller
                            name={`offers_lists.${index}.content`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <ReactQuill
                                theme="snow"
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                onInit={(editorInstance) => setEditor(editorInstance)}
                                modules={modules}
                                placeholder="Write something amazing..."
                                style={{ height: "150px", marginBottom: "40px" }}
                              />
                            )}
                          />
                          {errors.offers_lists?.[index]?.content && (
                            <p className="text-red-500 text-sm mt-1">{errors.offers_lists?.[index]?.content.message}</p>
                          )}
                        </Grid>

                        <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <Controller
                            name={`offers_lists.${index}.button_text`}
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
                                id={`offers_offers_lists.${index}.button_text`}
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errorState !== null) && {
                                  error: true,
                                  helperText: errors?.offers_lists[index]?.button_text?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <Controller
                            name={`offers_lists.${index}.button_url`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='text'
                                label='Button Link'
                                variant='outlined'
                                placeholder='https://example.com'
                                className='mbe-1'
                                id={`offers_offers_lists.${index}.button_url`}
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errorState !== null) && {
                                  error: true,
                                  helperText: errors?.offers_lists[index]?.button_url?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ md: 6, xs: 2, sm: 2 }}>
                          { offersListsFields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => appendOffersListsFields({title: '', content: '', from_date: '', to_date: '', button_text: '', button_url: '', })} color='secondary' size='small' variant="contained" startIcon={<i className='ri-add-line' />} >
                            Add Offer
                          </Button>) : null }              
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                </Grid>
              </Grid>

              {/* Bottom Section */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Bottom Section</h3>
              </Grid>
              <Grid container spacing={5}>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <div className='flex max-sm:flex-col items-center gap-6 flex-wrap'>
                    {watch('bottom_image_preview') ? (
                      <img height={100} width={100} className='rounded' src={watch('bottom_image_preview')} alt='Bottom Image' />
                    ) : null}
                    <div className='flex flex-grow flex-col gap-4'>
                      <div className='flex flex-col sm:flex-row gap-4'>
                        <Button component='label' size='small' variant='contained' htmlFor='bottom_image'>
                          Upload Bottom Image
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
                              const prev = (watch('bottom_image_preview') as string | null) || null;
                              
                              if (prev) URL.revokeObjectURL(prev);
                              setValue('bottom_image_preview', url, { shouldDirty: true });
                              setValue('bottom_image', file, { shouldDirty: true });
                            }}
                            id='bottom_image'
                          />
                        </Button>
                        <Button size='small' variant='outlined' color='error' onClick={(e) => {
                            setValue('bottom_image_preview', null, { shouldDirty: true });
                            setValue('bottom_image', null, { shouldDirty: true });
                          }}>
                            Reset
                        </Button>
                      </div>
                      <Typography>Allowed JPG, GIF, SVG or PNG. Max size of 800K</Typography>
                      {errors.bottom_image && (
                        <Typography color="error.main">
                          {String(errors.bottom_image.message)}
                        </Typography>
                      )}
                    </div>
                  </div>
                </Grid>
              </Grid>

              <Divider className="mb-3 mt-5" />
              {/* Submit Button*/}
              <Grid container spacing={5}>
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

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}

export default AddResorts