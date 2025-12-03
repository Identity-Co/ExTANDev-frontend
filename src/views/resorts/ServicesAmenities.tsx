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
import Tooltip from '@mui/material/Tooltip';

import CustomIconButton from '@core/components/mui/IconButton'

import { toast } from 'react-toastify';

import { Controller, useForm, useFieldArray } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, optional, custom, array, any, number, variant, literal } from 'valibot'
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

const ServiceSectionSchema = object({
  section_type: literal("Service"),

  title: nonEmpty(string(), "Title is required for service sections"),

  content: optional(string()),

  image: optional(
    custom<File | null>((file) => {
      if (!file) return "Image is required for service sections";

      const allowed = ["image/png", "image/jpeg", "image/gif"];
      if (!allowed.includes(file.type)) return "Only PNG/JPG/GIF allowed";

      if (file.size > 800 * 1024) return "Max file size is 800 KB";

      return true;
    })
  ),

  _preview: optional(string()),
});

const ReviewSectionSchema = object({
  section_type: literal("Review"),

  review_text: nonEmpty(
    string(),
    "Review text is required for review sections"
  ),

  rating: custom<number>((value) => {
    if (value < 1 || value > 5) return "Rating must be between 1 and 5";
    return true;
  }),

  reviewer_name: nonEmpty(
    string(),
    "Reviewer name is required for review sections"
  ),
});

const schema = object({
  banners: array(
    object({
      title: pipe(string(), nonEmpty('This field is required')),
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
  about_title: optional(string()),
  about_button_text: optional(string()),
  about_button_link: pipe(string()),
  services_sections: array(
    variant("section_type", [
      ServiceSectionSchema,
      ReviewSectionSchema,
    ])
  ),
})

const TooltipIfEnabled = ({ title, disabled, children }) =>
  disabled ? children : (
    <Tooltip title={title}>
      <span style={{ display: 'inline-block' }}>{children}</span>
    </Tooltip>
  );

const AddResorts = ({ pgData, adventurePosts, getFormId }: { pgData?: any; adventurePosts?: []; getFormId?: any }) => {  
  const router = useRouter()

  let form_id = getFormId?.();

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      banners: (pgData?.services_amenities?.banners && Array.isArray(pgData.services_amenities.banners) && pgData.services_amenities.banners.length > 0) 
        ? pgData.services_amenities.banners.map((section: any) => ({
            title: section.title || '',
            image: section.image || null,
            _preview: section.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${section.image}` : '',
          }))
        : [{ title: '', image: null, _preview: '' }],
      about_title: pgData?.services_amenities?.about_title ?? '',
      about_button_text: pgData?.services_amenities?.about_button_text ?? '',
      about_button_link: pgData?.services_amenities?.about_button_link ?? '',

      services_sections: (pgData?.services_amenities?.services_sections && Array.isArray(pgData.services_amenities.services_sections) && pgData.services_amenities.services_sections.length > 0)
        ? pgData.services_amenities.services_sections.map((section: any) => {
            if (section.section_type === "Service") {
              return {
                section_type: "Service",
                title: section.title || "",
                content: section.content || "",
                image: section.image || null,
                _preview: section.image
                  ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${section.image}`
                  : "",
              };
            } else if (section.section_type === "Review") {
              return {
                section_type: "Review",
                review_text: section.review_text || "",
                rating: section.rating || 0,
                reviewer_name: section.reviewer_name || "",
              };
            }
          })
        : [{section_type: "Service", title: "", content: "", image: null, _preview: "" }]
    }
  })

  const { fields: bannersFields, append: appendBannersFields, remove: removeBannersFields } = useFieldArray({
    control,
    name: "banners",
  });

  const { 
    fields: servicesSectionsFields, 
    append: appendServicesSectionsFields, 
    remove: removeServicesSectionsFields,
    move: moveServicesSectionsFields // Add this
  } = useFieldArray({
    control,
    name: "services_sections"
  });

  // Fix: Add setEditor function
  const setEditor = (editorInstance: any) => {
    // You can store the editor instance if needed
  };

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)

    const formData = new FormData();

    // Basic fields
    formData.append('services_amenities_tab', 'yes');
    formData.append("services_amenities[about_title]", data.about_button_text || '');
    formData.append("services_amenities[about_button_text]", data.about_button_text || '');
    formData.append("services_amenities[about_button_link]", data.about_button_link);

    // Banners data
    data.banners.forEach((section, i) => {
      formData.append(`services_amenities_banners[${i}][title]`, section.title)
      if (section.image && section.image instanceof File) {
        formData.append(`services_amenities_banners[${i}][image]`, section.image)
      } else if (typeof section.image === 'string') {
        formData.append(`services_amenities_banners[${i}][image]`, section.image)
      }
    });

    data.services_sections.forEach((section, i) => {
      formData.append(`services_amenities_sections[${i}][section_type]`, section.section_type)
      if(section.section_type == 'Service'){
        formData.append(`services_amenities_sections[${i}][title]`, section.title)
        formData.append(`services_amenities_sections[${i}][content]`, section.content)
        formData.append(`services_amenities_sections[${i}][image]`, section.image)
      }else{
        formData.append(`services_amenities_sections[${i}][review_text]`, section.review_text)
        formData.append(`services_amenities_sections[${i}][rating]`, section.rating)
        formData.append(`services_amenities_sections[${i}][reviewer_name]`, section.reviewer_name)
      }
    })

    let log = null;
    if(form_id === null) {
     //
    } else {
      log = await updateResort(form_id, formData);
    }

    if (log && log._id) {
      toast.success('Services & Amenities tab updated successfully.')
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
            <CardHeader title='Services & Amenities Tab' />
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
                            <Grid size={{ md: 6, xs: 12, sm: 12, lg: 6 }}>
                              <FormControl fullWidth>
                                <Controller
                                  name={`banners.${index}.title`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      type='text'
                                      label='Title'
                                      variant='outlined'
                                      placeholder='Enter Title'
                                      className='mbe-1'
                                      id={`services_aminities_banners.${index}.title`}
                                      onChange={e => {
                                        field.onChange(e.target.value)
                                        errorState !== null && setErrorState(null)
                                      }}
                                      {...((errors.banners?.[index]?.title || errorState !== null) && {
                                        error: true,
                                        helperText: errors.banners?.[index]?.title?.message || errorState?.message[0]
                                      })}
                                    />
                                  )}
                                />
                              </FormControl>
                            </Grid>
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
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Controller
                    name='about_title'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='About Title'
                        variant='outlined'
                        placeholder='Enter Title'
                        className='mbe-1'
                        id='servicesaminities_about_title'
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
                        id='servicesaminities_about_button_text'
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
                        id='servicesaminities_about_button_url'
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

              {/* Services Sections*/}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Services Sections</h3>
              </Grid>
              <Grid container spacing={5}>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                    {servicesSectionsFields.map((field, index) => (
                      <div key={field.id} spacing={5} className="border rounded p-4 mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>
                            {watch(`services_sections.${index}.section_type`) === 'Service' ? 'Service' : 'Review'} {index + 1}
                          </Typography>
                          
                          <div className="flex items-center gap-2">
                            {/* Move Up Button - Only show if not first section and not the very first section (index > 1) */}
                            {index > 1 && (
                              <TooltipIfEnabled title="Move Up" disabled={index === 1}>
                                <CustomIconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => moveServicesSectionsFields(index, index - 1)}
                                  disabled={index === 1}
                                >
                                  <i className="ri-arrow-up-line"></i>
                                </CustomIconButton>
                              </TooltipIfEnabled>
                            )}
                            
                            {/* Move Down Button - Only show if not last section and not first section (index > 0) */}
                            {index > 0 && (
                                <TooltipIfEnabled title="Move Down" disabled={index === servicesSectionsFields.length - 1}>
                                  <CustomIconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => moveServicesSectionsFields(index, index + 1)}
                                    disabled={index === servicesSectionsFields.length - 1}
                                  >
                                    <i className="ri-arrow-down-line"></i>
                                  </CustomIconButton>
                                </TooltipIfEnabled>
                            )}
                            
                            {/* Delete Button - Only show if not first section (index > 0) */}
                            {index > 0 && (
                              <CustomIconButton 
                                aria-label='remove section' 
                                color='error' 
                                size='medium' 
                                onClick={() => removeServicesSectionsFields(index)}
                              >
                                <i className="ri-delete-bin-7-line"></i>
                              </CustomIconButton>
                            )}
                          </div>       
                        </div>

                        <Grid container spacing={6}>
                          {/* Service Fields - First item or when section_type is Service */}
                          {(index === 0 || watch(`services_sections.${index}.section_type`) === 'Service') && (
                            <>
                              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                                <Controller
                                  name={`services_sections.${index}.title`}
                                  control={control}
                                  rules={{ required: true }}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      type='text'
                                      label='Title'
                                      variant='outlined'
                                      placeholder='Enter Service Title'
                                      className='mbe-1'
                                      onChange={e => {
                                        field.onChange(e.target.value)
                                        errorState !== null && setErrorState(null)
                                      }}
                                      {...((errorState !== null || errors.services_sections?.[index]?.title) && {
                                        error: true,
                                        helperText: errors?.services_sections[index]?.title?.message || errorState?.message[0]
                                      })}
                                    />
                                  )}
                                />
                              </Grid>

                              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                                <div className='flex max-sm:flex-col items-center gap-6'>
                                  {watch(`services_sections.${index}._preview`) ? (
                                    <img height={100} width={100} className='rounded' src={watch(`services_sections.${index}._preview`) as string} alt='Service Image' />
                                    ) : null}
                                  <div className='flex flex-grow flex-col gap-4'>
                                    <div className='flex flex-col sm:flex-row gap-4'>
                                      <Button component='label' size='small' variant='contained' htmlFor={`service_image_${index}`}>
                                        Upload Service Image
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
                                            const prev = (watch(`services_sections.${index}._preview`) as string | null) || null;
                                            
                                            if (prev) URL.revokeObjectURL(prev);
                                            setValue(`services_sections.${index}._preview`, url, { shouldDirty: true });
                                            setValue(`services_sections.${index}.image`, file, { shouldDirty: true });
                                          }}
                                          id={`service_image_${index}`}
                                        />
                                      </Button>
                                      <Button size='small' variant='outlined' color='error' onClick={(e) => {
                                        setValue(`services_sections.${index}.image`, null, { shouldDirty: true });
                                        setValue(`services_sections.${index}._preview`, null, { shouldDirty: true });
                                      }}>
                                        Reset
                                      </Button>
                                    </div>
                                    <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                                    {errors.services_sections?.[index]?.image && (<Typography color='error.main'>{String(errors.services_sections[index]?.image?.message)}</Typography>)}
                                  </div>
                                </div>
                              </Grid>

                              <Grid size={{ md: 12, xs: 12, lg: 12 }} style={{ marginBottom: "0" }}>
                                <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                                <Controller
                                  name={`services_sections.${index}.content`}
                                  control={control}
                                  render={({ field }) => (
                                    <ReactQuill
                                      theme="snow"
                                      value={field.value ?? ''}
                                      onChange={field.onChange}
                                      modules={modules}
                                      placeholder="Write service content..."
                                      style={{ height: "150px", marginBottom: "40px" }}
                                    />
                                  )}
                                />
                              </Grid>
                            </>
                          )}

                          {/* Review Fields - When section_type is Review (not first item) */}
                          {index > 0 && watch(`services_sections.${index}.section_type`) === 'Review' && (
                            <>
                              <Grid size={{ md: 12, xs: 12, lg: 12 }} style={{ marginBottom: "0" }}>
                                <Typography variant='h6' color='#a3a3a3'>Review Text *</Typography>
                                <Controller
                                  name={`services_sections.${index}.review_text`}
                                  control={control}
                                  rules={{ required: true }}
                                  render={({ field }) => (
                                    <ReactQuill
                                      theme="snow"
                                      value={field.value ?? ''}
                                      onChange={field.onChange}
                                      modules={modules}
                                      placeholder="Write review text..."
                                      style={{ height: "150px", marginBottom: "40px" }}
                                    />
                                  )}
                                />
                                {errors.services_sections?.[index]?.review_text && (
                                  <p className="text-red-500 text-sm mt-1">{errors.services_sections?.[index]?.review_text.message}</p>
                                )}
                              </Grid>

                              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                                <Controller
                                  name={`services_sections.${index}.rating`}
                                  control={control}
                                  rules={{ required: true }}
                                  render={({ field }) => (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating *
                                      </label>
                                      <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <button
                                            key={star}
                                            type="button"
                                            onClick={() => {
                                              field.onChange(star);
                                              errorState !== null && setErrorState(null);
                                            }}
                                            className={`text-2xl focus:outline-none ${
                                              star <= (field.value || 0)
                                                ? 'text-yellow-500'
                                                : 'text-gray-300'
                                            } hover:text-yellow-400 transition-colors`}
                                          >
                                            ★
                                          </button>
                                        ))}
                                        <span className="ml-2 text-sm text-gray-600">
                                          {field.value || 0}/5
                                        </span>
                                      </div>
                                      {errors.services_sections?.[index]?.rating && (
                                        <p className="text-red-500 text-sm mt-1">{errors.services_sections[index]?.rating?.message}</p>
                                      )}
                                    </div>
                                  )}
                                />
                              </Grid>

                              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                                <Controller
                                  name={`services_sections.${index}.reviewer_name`}
                                  control={control}
                                  rules={{ required: true }}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      type='text'
                                      label='Reviewer Name'
                                      variant='outlined'
                                      placeholder='Enter reviewer name'
                                      onChange={e => {
                                        field.onChange(e.target.value)
                                        errorState !== null && setErrorState(null)
                                      }}
                                      {...((errorState !== null || errors.services_sections?.[index]?.reviewer_name) && {
                                        error: true,
                                        helperText: errors?.services_sections[index]?.reviewer_name?.message || errorState?.message[0]
                                      })}
                                    />
                                  )}
                                />
                              </Grid>
                            </>
                          )}

                          {/* Add Section Buttons */}
                          <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                            {servicesSectionsFields.length === index + 1 && (
                              <div className="flex gap-2 flex-wrap">
                                <Button 
                                  aria-label='add service' 
                                  onClick={() => appendServicesSectionsFields({
                                    section_type: 'Service',
                                    title: '',
                                    content: '',
                                    image: null,
                                    _preview: ''
                                  })} 
                                  color='primary' 
                                  size='small' 
                                  variant="contained" 
                                  startIcon={<i className='ri-add-line' />}
                                >
                                  Add Service
                                </Button>
                                <Button 
                                  aria-label='add review' 
                                  onClick={() => appendServicesSectionsFields({
                                    section_type: 'Review',
                                    review_text: '',
                                    rating: 0,
                                    reviewer_name: ''
                                  })} 
                                  color='secondary' 
                                  size='small' 
                                  variant="outlined" 
                                  startIcon={<i className='ri-add-line' />}
                                >
                                  Add Review
                                </Button>
                              </div>
                            )}              
                          </Grid>
                        </Grid>
                      </div>
                    ))}
                  </Grid>
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