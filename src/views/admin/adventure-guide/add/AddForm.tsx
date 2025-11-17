'use client'

// React Imports useRef
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
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from "@mui/material/Autocomplete";
import Tooltip from '@mui/material/Tooltip';

// import type { Editor } from '@tiptap/react'

const TipTapEditor = dynamic(() => import('@/components/TipTap'), { ssr: false })

import { toast } from 'react-toastify';

import { Controller, useForm, useFieldArray } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, optional, custom } from 'valibot'

//import type { InferInput } from 'valibot'

import CustomIconButton from '@core/components/mui/IconButton'

import { useNavigationStore } from '@/libs/navigation-store'

import * as AdventureGuide from '@/app/server/adventure_guide'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

import 'react-quill-new/dist/quill.snow.css';

type ReactQuillRef = {
  getEditor: () => any;
  focus?: () => void;
  blur?: () => void;
};


interface ContentField {
  type: string;
  value: string;
  caption?: string;
  image?: File | string | null;
  _preview?: string | null; // UI-only preview field
  resort_title: string | null;
  resorts_list: string | null;
  reviews_list: string | null;
}

interface ContentSection {
  fields: ContentField[];
}

type FormData = {
  title: string;
  feature_image: File | null | string;
  banner_image: File | null | string;
  banner_description?: string;
  content_sections: ContentSection[];
  author_name?: string;
  author_testimonial?: string;
  author_image?: File | null | string;
  excerpt?: string;
  site_url?: string;
  site_logo?: File | null | string;
  page_url?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  robots?: string;
  author?: string;
  publisher?: string;
  copyright?: string;
  revisit_after?: string;
  classification?: string;
  rating?: string;
  post_date?: string;

  banner_preview?: string | null;
  author_image_preview?: string | null;
  feature_image_preview?: string | null;
  site_logo_preview?: string | null;
}

type ErrorType = {
  message: string[]
}

const schema = object({
  title: pipe(string(), nonEmpty('This field is required')),
  feature_image: optional(
    custom<File | null>((value) => {
      if (!value) return true;
      if (typeof value === 'string') return true; // Allow strings (existing images)
      
      const allowed = ["image/png", "image/jpeg", "image/gif"];
      if (!allowed.includes(value.type)) return false;
      
      const maxMB = 5;
      
      return value.size <= maxMB * 1024 * 1024;
    }, "Only PNG/JPG/GIF allowed and max file size is 5 MB")
  ),
  banner_image: optional(
    custom<File | null>((value) => {
      if (!value) return true;
      if (typeof value === 'string') return true; // Allow strings (existing images)
      
      const allowed = ["image/png", "image/jpeg", "image/gif"];
      if (!allowed.includes(value.type)) return false;
      
      const maxMB = 5;
      return value.size <= maxMB * 1024 * 1024;
    }, "Only PNG/JPG/GIF allowed and max file size is 5 MB")
  ),
  banner_description: optional(string()),
  content_sections: optional(
    custom<any[]>((value) => {
      if (!Array.isArray(value)) return false;
      
      return value.every(section => {
        return section && typeof section === 'object' && Array.isArray(section.fields);
      });
    }, "content_sections must be an array of sections with fields")
  ),
  author_name: optional(string()),
  author_testimonial: optional(string()),
  author_image: optional(
    custom<File | null>((value) => {
      if (!value) return true;
      if (typeof value === 'string') return true; // Allow strings (existing images)
      
      const allowed = ["image/png", "image/jpeg", "image/gif"];
      if (!allowed.includes(value.type)) return false;
      
      const maxMB = 5;
      
      return value.size <= maxMB * 1024 * 1024;
    }, "Only PNG/JPG/GIF allowed and max file size is 5 MB")
  ),
  excerpt: optional(string()),
  site_url: optional(string()),
  site_logo: optional(
    custom<File | null>((value) => {
      if (!value) return true;
      if (typeof value === 'string') return true; // Allow strings (existing images)
      
      const allowed = ["image/png", "image/jpeg", "image/gif", "image/svg+xml"];
      if (!allowed.includes(value.type)) return false;
      
      const maxMB = 5;
      
      return value.size <= maxMB * 1024 * 1024;
    }, "Only PNG/JPG/GIF allowed and max file size is 5 MB")
  ),
  page_url: pipe(string(), nonEmpty('This field is required')),
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
  post_date: optional(string()),
});

const TooltipIfEnabled = ({ title, disabled, children }) =>
  disabled ? children : (
    <Tooltip title={title}>
      <span style={{ display: 'inline-block' }}>{children}</span>
    </Tooltip>
  );

const PageSection = ({ pgData }: { pgData?: [] }) => {  
  const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting , setIsSubmitting ] = useState(false)
  const [editor, setEditor] = useState<any>(null);
  const [message, setMessage] = useState(null);

  const resortsLists = { r1: 'Resort 1', r2: 'Resort 2', r3: 'Resort 3', r4: 'Resort 4', r5: 'Resort 5', r6: 'Resort 6'};
  const [resortsOptions, setResortsOptions] = useState(() => {
    return Object.entries(resortsLists).map(([key, value]) => ({
      label: key,
      value: value
    }));
  });

  const reviewsLists = { r1: 'Review 1', r2: 'Review 2', r3: 'Review 3' };
  const [reviewsOptions, setreviewsOptions] = useState(() => {
    return Object.entries(reviewsLists).map(([key, value]) => ({
      label: key,
      value: value
    }));
  });

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
    watch, setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      title: '',
      feature_image: null,
      banner_image: null,
      banner_description: '',
      content_sections:[
        {
          fields: [
            { type: "content", value: "" }
          ]
        }
      ],
      author_name: '',
      author_testimonial: '',
      author_image: null,
      excerpt: '',
      site_url: '',
      site_logo: null,
      page_url: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      robots: '',
      author: '',
      publisher: '',
      copyright: '',
      revisit_after: '',
      classification: '',
      rating: '',
      banner_preview: null,
      author_image_preview: null,
      feature_image_preview: null,
      site_logo_preview: null,
      post_date: formatDate(new Date()),
    }
  })

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name: "content_sections",
  });
  
  const addFieldToSection = (sectionIndex: number, field: ContentField) => {
    const currentSections = [...(watch('content_sections') || [])]
    
    if (!currentSections[sectionIndex]) {
      currentSections[sectionIndex] = { fields: [] }
    }
    
    currentSections[sectionIndex].fields.push(field)
    setValue('content_sections', currentSections)
  }

  const removeFieldFromSection = (sectionIndex: number, fieldIndex: number) => {
    const currentSections = [...(watch('content_sections') || [])]
    
    if (currentSections[sectionIndex] && currentSections[sectionIndex].fields) {
      currentSections[sectionIndex].fields.splice(fieldIndex, 1)
      setValue('content_sections', currentSections)
    }
  }

  const moveSection = (currentIndex: number, newIndex: number) => {
    if (newIndex < 0 || newIndex >= sectionFields.length) return;

    // Get current sections from form state
    const currentSections = [...(watch('content_sections') || [])];
    
    // Remove from current position and insert at new position
    const [movedSection] = currentSections.splice(currentIndex, 1);
    currentSections.splice(newIndex, 0, movedSection);

    // Update form state
    setValue('content_sections', currentSections, { shouldDirty: true });
  };

  const generateSlug = text => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')   // remove invalid chars
      .replace(/\s+/g, '-')           // replace spaces with -
      .replace(/-+/g, '-')            // remove multiple -
  }

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      //setIsSubmitting(true)

      const fd = new FormData()

      // Append text fields
      fd.append('title', data.title)
      if (data.banner_description) fd.append('banner_description', data.banner_description)
      if (data.author_name) fd.append('author_name', data.author_name)
      if (data.author_testimonial) fd.append('author_testimonial', data.author_testimonial)
      if (data.excerpt) fd.append('excerpt', data.excerpt)
      if (data.site_url) fd.append('site_url', data.site_url)
      if (data.page_url) fd.append('page_url', data.page_url)
      if (data.meta_title) fd.append('meta_title', data.meta_title)
      if (data.meta_description) fd.append('meta_description', data.meta_description)
      if (data.meta_keywords) fd.append('meta_keywords', data.meta_keywords)
      if (data.robots) fd.append('robots', data.robots)
      if (data.author) fd.append('author', data.author)
      if (data.publisher) fd.append('publisher', data.publisher)
      if (data.copyright) fd.append('copyright', data.copyright)
      if (data.revisit_after) fd.append('revisit_after', data.revisit_after)
      if (data.classification) fd.append('classification', data.classification)
      if (data.rating) fd.append('rating', data.rating)
      if (data.post_date) fd.append('post_date', data.post_date)

      // === Append images (single) ===
      if (data.feature_image instanceof File) fd.append('feature_image', data.feature_image)
      if (data.banner_image instanceof File) fd.append('banner_image', data.banner_image)
      if (data.author_image instanceof File) fd.append('author_image', data.author_image)
      if (data.site_logo instanceof File) fd.append('site_logo', data.site_logo)

      // === Append repeater sections ===
      // send content_sections JSON without File objects
      const cleanedSections = data.content_sections.map((s, i) => {
        return {
          fields: s.fields.map((f, fi) => {
            if (f.type === 'image' && f.image instanceof File) {
              // append separately
              fd.append('section_images', f.image)
              fd.append('section_refs', `${i}.${fi}`)
              
              return { ...f, image: '' }
            }

            return f
          }),
        }
      })
      
      fd.append('content_sections', JSON.stringify(cleanedSections))

      const log = await AdventureGuide.createAdventureGuide(fd);
   
      if (log && log._id) {

        toast.success('Adventure Guide added successfully.')
        router.replace(`/admin/adventure-guide/edit/${log._id}`)
      } else {
        if(log.errors) {
          toast.error(log.errors.message)
        }
      }

      setIsSubmitting(false)
    }catch(err: any){
      console.error(err)
      toast.error(err.message || 'Error saving Adventure Guide')
    }
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
              <CardHeader title='Adventure Guide Management' />
              <Divider />

              <CardContent className='mbe-5'>
                  <Grid container spacing={5} className="my-5">  
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
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

                              const slug = generateSlug(e.target.value)
                              setValue('page_url', slug)

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
                  </Grid>
                  <Divider />

                  {/* Banner Sections */}
                  <Grid container spacing={5} className="my-5">  
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <h2>Banner Sections</h2>
                    </Grid>

                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Grid container spacing={6}>
                        <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <div className='flex max-sm:flex-col items-center gap-6'>
                            {watch('banner_preview') ? (
                              <img height={100} width={100} className='rounded' src={watch('banner_preview')} alt='Banner Image' />
                            ) : null}
                            <div className='flex flex-grow flex-col gap-4'>
                              <div className='flex flex-col sm:flex-row gap-4'>
                                <Button component='label' size='small' variant='contained' htmlFor='banner_image'>
                                  Upload New Photo
                                  <input
                                    hidden
                                    required
                                    type='file'
                                    accept='image/png, image/jpeg'
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] ?? null;

                                      const maxSize = 800 * 1024; // 800 KB

                                      if (file.size > maxSize) {
                                        toast.error("File is too large. Maximum allowed size is 800KB.")

                                        return;
                                      }

                                      // set preview url for UI only
                                      const url = file ? URL.createObjectURL(file) : null;
                                      
                                      // revoke previous
                                      const prev = (watch('banner_preview') as string | null) || null;
                                      
                                      if (prev) URL.revokeObjectURL(prev);
                                      setValue('banner_preview', url, { shouldDirty: true });
                                      setValue('banner_image', file, { shouldDirty: true });
                                    }}
                                    id='banner_image'
                                  />
                                </Button>
                                <Button size='small' variant='outlined' color='error' onClick={(e) => {
                                    setValue('banner_preview', null, { shouldDirty: true });
                                    setValue('banner_image', null, { shouldDirty: true });
                                  }}>
                                    Reset
                                </Button>
                              </div>
                              <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                              {errors.banner_image && (
                                <Typography color="error.main">
                                  {String(errors.banner_image.message)}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </Grid>

                        <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <Controller
                            name='banner_description'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                rows={3}
                                multiline
                                type='text'
                                label='Description'
                                variant='outlined'
                                placeholder='Enter Description'
                                className='mbe-0'
                                id='banner_description'
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errors.banner_description || errorState !== null) && {
                                  error: true,
                                  helperText: errors?.banner_description?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider />

                  {/* Content Sections */}
                  {sectionFields.map((section, index) => (
                    <Grid key={section.id} container spacing={5} className="my-5">  
                      <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                       <div className="flex items-center justify-between">
                          <h2>Content Section {index + 1}</h2>
                          
                          {/* Move Controls - Only show for sections after the first one */}
                          {index > 0 && (
                            <div className="flex gap-2">
                              <TooltipIfEnabled title="Move Up" disabled={index === 1}>
                                <CustomIconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => moveSection(index, index - 1)}
                                  disabled={index === 1} // Can't move section 0
                                >
                                  <i className="ri-arrow-up-line"></i>
                                </CustomIconButton>
                              </TooltipIfEnabled>
                              
                              <TooltipIfEnabled title="Move Down" disabled={index === sectionFields.length - 1}>
                                <CustomIconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => moveSection(index, index + 1)}
                                  disabled={index === sectionFields.length - 1}
                                >
                                  <i className="ri-arrow-down-line"></i>
                                </CustomIconButton>
                              </TooltipIfEnabled>
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                        <Grid spacing={5}>
                            {section.fields.map((field, fieldIndex) => (
                              <Grid key={fieldIndex} container spacing={6} className="mb-2">
                                {field.type === "image" ? (
                                  <>
                                    <Grid size={{ md: 5, xs: 12, lg: 5 }} className="mb-4">
                                      <div className='flex max-sm:flex-col items-center gap-6'>
                                        {watch(
                                          `content_sections.${index}.fields.${fieldIndex}._preview`
                                        ) ? (
                                          <img
                                            height={100}
                                            width={100}
                                            className="rounded"
                                            src={
                                              watch(
                                                `content_sections.${index}.fields.${fieldIndex}._preview`
                                              ) as string
                                            }
                                            alt="Content Image"
                                          />
                                        ) : null}

                                        <div className='flex flex-grow flex-col gap-4'>
                                          <div className='flex flex-col sm:flex-row gap-4'>
                                            <Button component='label' size='small' variant='contained' htmlFor={`content_sections.${index}.fields.${fieldIndex}`} key={fieldIndex}>
                                              Upload New Photo
                                              <input
                                                hidden
                                                type='file'
                                                accept='image/png, image/jpeg'
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0] ?? null;

                                                  if (!file) return;

                                                  const url = URL.createObjectURL(file);

                                                  const prev =
                                                    (watch(
                                                      `content_sections.${index}.fields.${fieldIndex}._preview`
                                                    ) as string | null) || null;

                                                  if (prev) URL.revokeObjectURL(prev);

                                                  setValue(
                                                    `content_sections.${index}.fields.${fieldIndex}._preview`,
                                                    url,
                                                    { shouldDirty: true }
                                                  );
                                                  setValue(
                                                    `content_sections.${index}.fields.${fieldIndex}.image`,
                                                    file,
                                                    { shouldDirty: true }
                                                  );
                                                }}
                                                id={`content_sections.${index}.fields.${fieldIndex}`}
                                              />
                                            </Button>
                                            <Button size='small' variant='outlined' color='error' onClick={() => {
                                                setValue(
                                                  `content_sections.${index}.fields.${fieldIndex}.image`,
                                                  null,
                                                  { shouldDirty: true }
                                                );
                                                setValue(
                                                  `content_sections.${index}.fields.${fieldIndex}._preview`,
                                                  null,
                                                  { shouldDirty: true }
                                                );
                                              }} >
                                              Reset
                                            </Button>
                                          </div>
                                          <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                                          {errors.content_sections?.[index]?.fields?.[fieldIndex]?.image && (
                                            <Typography color='error.main'>
                                              {String((errors.content_sections[index] as any)?.fields?.[fieldIndex]?.image?.message || '')}
                                            </Typography>
                                          )}
                                        </div>
                                      </div>
                                    </Grid>
                                    <Grid size={{ md: 5, xs: 12, lg: 5 }} className="mb-4">
                                      <Controller
                                        name={`content_sections.${index}.fields.${fieldIndex}.caption`}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                          <TextField
                                            {...field}
                                            fullWidth
                                            type='text'
                                            label='Caption'
                                            variant='outlined'
                                            placeholder='Enter Caption'
                                            className='mbe-1'
                                            onChange={e => {
                                              field.onChange(e.target.value)
                                              errorState !== null && setErrorState(null)
                                            }}
                                            {...((errors.content_sections?.[index]?.fields?.[fieldIndex]?.caption || errorState !== null) && {
                                              error: true,
                                              helperText: String((errors.content_sections?.[index] as any)?.fields?.[fieldIndex]?.caption?.message || errorState?.message[0])
                                            })}
                                          />
                                        )}
                                      />
                                    </Grid>
                                  </>
                                ) : field.type === "content" ? (
                                  <Grid size={{ md: 10, xs: 12, lg: 10 }} className="mb-4">
                                    <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                                      <Controller
                                        key={fieldIndex}
                                        name={`content_sections.${index}.fields.${fieldIndex}.value`}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <ReactQuill
                                              theme="snow"
                                              value={field.value ?? ""}
                                              onChange={field.onChange}
                                              modules={modules}
                                              placeholder="Write something amazing..."
                                              style={{ height: "300px", marginBottom: "60px" }}
                                            />
                                          )
                                        }
                                      />
                                      {errors.content_sections?.[index]?.fields?.[fieldIndex]?.content && (
                                        <p className='text-red-500 text-sm mt-1'>
                                          {String((errors.content_sections[index] as any)?.fields?.[fieldIndex]?.content?.message)}
                                        </p>
                                      )}
                                  </Grid>
                                ) : (
                                  <>
                                    <Grid size={{ xs: 10 }}>
                                      <Controller
                                        name={`content_sections.${index}.fields.${fieldIndex}.resort_title`}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                          <TextField
                                            {...field}
                                            fullWidth
                                            type='text'
                                            label='Resort Section Title'
                                            variant='outlined'
                                            placeholder='Enter Title'
                                            className='mbe-1'
                                            onChange={e => {
                                              field.onChange(e.target.value)
                                              errorState !== null && setErrorState(null)
                                            }}
                                            {...((errors.content_sections?.[index]?.fields?.[fieldIndex]?.resort_title || errorState !== null) && {
                                              error: true,
                                              helperText: String((errors.content_sections?.[index] as any)?.fields?.[fieldIndex]?.resort_title?.message || errorState?.message[0])
                                            })}
                                          />
                                        )}
                                      />
                                    </Grid>
                                    <Grid size={{ xs: 10 }}>
                                      <input type="hidden" {...register(`content_sections.${index}.fields.${fieldIndex}.resorts_list`)} />
                                      <Autocomplete
                                        multiple
                                        options={resortsOptions}
                                        getOptionLabel={(option) => option.value} 
                                        /*value={destOptions.filter(opt =>
                                          (watch("resorts_list") || []).includes(opt.label)
                                        )}*/
                                        renderOption={(props, option) => (
                                          <li {...props} key={option.label}> 
                                            {option.value}
                                          </li>
                                        )}
                                        renderInput={(params) => (
                                          <TextField {...params} label="Search Resorts" variant="outlined" />
                                        )}
                                        onChange={(event, newValue) => {
                                          setValue(
                                            `content_sections.${index}.fields.${fieldIndex}.resorts_list`,
                                            newValue.map((item) => item.label), // array of values
                                            { shouldValidate: true }
                                          );
                                        }}
                                      />
                                    </Grid>
                                    <Grid size={{ xs: 10 }} className="mb-3">
                                      <input type="hidden" {...register(`content_sections.${index}.fields.${fieldIndex}.reviews_list`)} />
                                      <Autocomplete
                                        multiple
                                        options={reviewsOptions}
                                        getOptionLabel={(option) => option.value} 
                                        /*value={destOptions.filter(opt =>
                                          (watch("reviews_lists") || []).includes(opt.label)
                                        )}*/
                                        renderOption={(props, option) => (
                                          <li {...props} key={option.label}> 
                                            {option.value}
                                          </li>
                                        )}
                                        renderInput={(params) => (
                                          <TextField {...params} label="Search Reviews" variant="outlined" />
                                        )}
                                        onChange={(event, newValue) => {
                                          setValue(
                                            `content_sections.${index}.fields.${fieldIndex}.reviews_list`,
                                            newValue.map((item) => item.label), // array of values
                                            { shouldValidate: true }
                                          );
                                        }}
                                      />
                                    </Grid>
                                  </>
                                )}
                                {index > 0 && fieldIndex >= 0 ? 
                                  (<Grid size={{ md: 2, xs: 12, lg: 2 }}><CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => removeFieldFromSection(index, fieldIndex)}>
                                  <i className="ri-delete-bin-7-line"></i>
                                </CustomIconButton></Grid>) 
                                : null }
                              </Grid>
                            ))}
                            
                            {index > 0 && (
                              <>
                                <Button
                                  size='small'
                                  variant="contained"
                                  onClick={() => addFieldToSection(index, { type: "content", value: "" })}
                                  sx={{ mr: 2 }}
                                  disabled={section.fields?.some(field => field.type === "resort" )}
                                >
                                  + Add Content
                                </Button>

                                <Button
                                  size='small'
                                  variant="contained"
                                  onClick={() => addFieldToSection(index, { type: "image", value: "", caption: "" })}
                                  sx={{ mr: 2 }}
                                  disabled={section.fields?.some(field => field.type === "resort" )}
                                >
                                  + Add Image
                                </Button>
                                <Button
                                  size='small'
                                  variant="contained"
                                  onClick={() => addFieldToSection(index, { type: "resort", resort_title: "", resorts_list: "", reviews_list: "" })}
                                  disabled={section.fields?.some(field => field.type === "image" || field.type === "content" || field.type === 'resort' )}
                                >
                                  + Add Resort Section
                                </Button>
                                </>
                            )}
                            <Grid container spacing={6} className="my-5">
                              <Grid size={{ md: 6, xs: 2, sm: 2 }}>
                                { sectionFields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => appendSection({ fields: [] })} color='secondary' size='small' variant="contained" startIcon={<i className='ri-add-line' />} >
                                  Add Section
                                </Button>) : null }

                                {index > 0 ? 
                                  (<CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => removeSection(index)}>
                                  <i className="ri-delete-bin-7-line"></i>
                                </CustomIconButton>) 
                                : null }                  
                              </Grid>
                            </Grid>
                        </Grid>
                        <Divider />
                      </Grid>
                      <Divider />
                    </Grid>
                  ))}

                  {/* Author Sections */}
                  <Grid container spacing={5} className="my-5">  
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <h2>Author Sections</h2>
                    </Grid>

                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <Grid container spacing={6}>
                        <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <div className='flex max-sm:flex-col items-center gap-6'>
                            {watch('author_image_preview') ? (
                              <img height={100} width={100} className='rounded' src={watch('author_image_preview')} alt='Banner Image' />
                            ) : null}
                            <div className='flex flex-grow flex-col gap-4'>
                              <div className='flex flex-col sm:flex-row gap-4'>
                                <Button component='label' size='small' variant='contained' htmlFor='author_image'>
                                  Upload New Photo
                                  <input
                                    hidden
                                    required
                                    type='file'
                                    accept='image/png, image/jpeg'
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] ?? null;

                                      const maxSize = 800 * 1024; // 800 KB

                                      if (file.size > maxSize) {
                                        toast.error("File is too large. Maximum allowed size is 800KB.")

                                        return;
                                      }

                                      // set preview url for UI only
                                      const url = file ? URL.createObjectURL(file) : null;
                                      
                                      // revoke previous
                                      const prev = (watch('author_image_preview') as string | null) || null;
                                      
                                      if (prev) URL.revokeObjectURL(prev);
                                      setValue('author_image_preview', url, { shouldDirty: true });
                                      setValue('author_image', file, { shouldDirty: true });
                                    }}
                                    id='author_image'
                                  />
                                </Button>
                                <Button size='small' variant='outlined' color='error' onClick={(e) => {
                                    setValue('author_image_preview', null, { shouldDirty: true });
                                    setValue('author_image', null, { shouldDirty: true });
                                  }}>
                                    Reset
                                </Button>
                              </div>
                              <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                              {errors.author_image && (
                                <Typography color="error.main">
                                  {String(errors.author_image.message)}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </Grid>

                        <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <Controller
                            name='author_name'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='text'
                                label='Author Name'
                                variant='outlined'
                                placeholder='Enter Author Name'
                                className='mbe-1'
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errors.author_name || errorState !== null) && {
                                  error: true,
                                  helperText: errors?.author_name?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Controller
                            name='author_testimonial'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                rows={3}
                                multiline
                                type='text'
                                label='Testimonial'
                                variant='outlined'
                                placeholder='Enter Testimonial'
                                className='mbe-0'
                                id='author_testimonial'
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errors.author_testimonial || errorState !== null) && {
                                  error: true,
                                  helperText: errors?.author_testimonial?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>
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
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 12, lg: 3, }}>
            <Card>
              <CardHeader title='Adventure Guide Meta' />
              <Divider />

              <CardContent className='mbe-5'>
                <Grid container spacing={5}>  
                  <Grid size={{ xs: 12 }} className='flex gap-4 mt-5 flex-wrap' justifyContent="space-between" container>
                    <Grid size={{ xs:12 }}>
                      <Grid container spacing={5}>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <Controller
                            name='post_date'
                            control={control}
                            render={({ field }) => (
                              <TextField 
                                {...field}
                                fullWidth
                                type='date'
                                label='Post Date'
                                variant='outlined'
                                placeholder='Select Date'
                                className='mbe-0'
                                InputLabelProps={{
                                  shrink: true,
                                }}
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
                          <Typography variant="h6" component="h6" color="primary" className="mb-2">Feature Image</Typography>
                          <div className='flex max-sm:flex-col items-center gap-6 flex-wrap'>
                            {watch('feature_image_preview') ? (
                              <img height={100} width={100} className='rounded' src={watch('feature_image_preview')} alt='Feature Image' />
                            ) : null}
                            <div className='flex flex-grow flex-col gap-4'>
                              <div className='flex flex-col sm:flex-row gap-4'>
                                <Button component='label' size='small' variant='contained' htmlFor='feature_image'>
                                  Upload Feature Image
                                  <input
                                    hidden
                                    required
                                    type='file'
                                    accept='image/png, image/jpeg, image/svg+xml'
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] ?? null;

                                      const maxSize = 800 * 1024; // 800 KB

                                      if (file.size > maxSize) {
                                        toast.error("File is too large. Maximum allowed size is 800KB.")

                                        return;
                                      }

                                      // set preview url for UI only
                                      const url = file ? URL.createObjectURL(file) : null;
                                      
                                      // revoke previous
                                      const prev = (watch('feature_image_preview') as string | null) || null;
                                      
                                      if (prev) URL.revokeObjectURL(prev);
                                      setValue('feature_image_preview', url, { shouldDirty: true });
                                      setValue('feature_image', file, { shouldDirty: true });
                                    }}
                                    id='feature_image'
                                  />
                                </Button>
                                <Button size='small' variant='outlined' color='error' onClick={(e) => {
                                    setValue('feature_image_preview', null, { shouldDirty: true });
                                    setValue('feature_image', null, { shouldDirty: true });
                                  }}>
                                    Reset
                                </Button>
                              </div>
                              <Typography>Allowed JPG, GIF, SVG or PNG. Max size of 800K</Typography>
                              {errors.feature_image && (
                                <Typography color="error.main">
                                  {String(errors.feature_image.message)}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </Grid>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <Controller
                            name='excerpt'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                rows={3}
                                multiline
                                type='text'
                                label='Excerpt'
                                variant='outlined'
                                placeholder='Enter Excerpt'
                                className='mbe-0'
                                id='excerpt'
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errors.excerpt || errorState !== null) && {
                                  error: true,
                                  helperText: errors?.excerpt?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <Controller
                            name='site_url'
                            control={control}
                            rules={{ required: false }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='text'
                                label='Referance Site URL'
                                variant='outlined'
                                placeholder='Enter Site URL'
                                className='mbe-1'
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errors.site_url || errorState !== null) && {
                                  error: true,
                                  helperText: errors?.site_url?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }} className="mb-5">
                          <Typography variant="h6" component="h6" color="primary" className="mb-2">Referance/Banner Logo</Typography>
                          <div className='flex max-sm:flex-col items-center gap-6 flex-wrap'>
                            {watch('site_logo_preview') ? (
                              <img height={100} width={100} className='rounded' src={watch('site_logo_preview')} alt='Site Logo Image' style={{backgroundColor: '#F6F6F6'}} />
                            ) : null}
                            <div className='flex flex-grow flex-col gap-4'>
                              <div className='flex flex-col sm:flex-row gap-4'>
                                <Button component='label' size='small' variant='contained' htmlFor='site_logo'>
                                  Upload Site Logo
                                  <input
                                    hidden
                                    required
                                    type='file'
                                    accept='image/png, image/jpeg, image/svg+xml'
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] ?? null;

                                      const maxSize = 800 * 1024; // 800 KB

                                      if (file.size > maxSize) {
                                        toast.error("File is too large. Maximum allowed size is 800KB.")

                                        return;
                                      }

                                      // set preview url for UI only
                                      const url = file ? URL.createObjectURL(file) : null;
                                      
                                      // revoke previous
                                      const prev = (watch('site_logo_preview') as string | null) || null;
                                      
                                      if (prev) URL.revokeObjectURL(prev);
                                      setValue('site_logo_preview', url, { shouldDirty: true });
                                      setValue('site_logo', file, { shouldDirty: true });
                                    }}
                                    id='site_logo'
                                  />
                                </Button>
                                <Button size='small' variant='outlined' color='error' onClick={(e) => {
                                    setValue('site_logo_preview', null, { shouldDirty: true });
                                    setValue('site_logo', null, { shouldDirty: true });
                                  }}>
                                    Reset
                                </Button>
                              </div>
                              <Typography>Allowed JPG, GIF, SVG or PNG. Max size of 800K</Typography>
                              {errors.site_logo && (
                                <Typography color="error.main">
                                  {String(errors.site_logo.message)}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                      <Divider />
                    </Grid>
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

export default PageSection
