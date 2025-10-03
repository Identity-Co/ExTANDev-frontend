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
import CircularProgress from '@mui/material/CircularProgress';

import type { Editor } from '@tiptap/react'

const TipTapEditor = dynamic(() => import('@/components/TipTap'), { ssr: false })

import { toast } from 'react-toastify';

import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, optional, custom } from 'valibot'
import type { InferInput } from 'valibot'

import { useNavigationStore } from '@/libs/navigation-store'

import { updatePage, savePage, updateStaticPage, createStaticPage, updateSectionImage } from '@/app/server/pages'

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
  name: pipe(string(), nonEmpty('This field is required')),
  banner_image: optional(custom<File | null>((value) => {
    if (!value) return true; 
    
    const allowed = ["image/png", "image/jpeg", "image/gif"];
    const maxMB = 5;

    return allowed.includes(value.type) && value.size <= maxMB * 1024 * 1024;
  }, "Only PNG/JPG/GIF allowed and max file size is 5 MB")),
  banner_title: optional(string()),
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

const PageSection = ({ pgData, pgDataMain }: { pgData?: []; pgDataMain?: []; }) => {  
  const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting , setIsSubmitting ] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [message, setMessage] = useState(null);

  const [destOptions, setdestOptions] = useState<string[]>([])
  const [resortOptions, setresortOptions] = useState<string[]>([])

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
      name: pgData?.name??'',
      banner_image: pgData?.banner_image??'',
      banner_preview: pgData?.banner_image??'',
      banner_title: pgData?.banner_title??'',
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

  useEffect(() => {
    if (pgData?.banner_image) {
      setValue(
        "banner_preview",
        `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${pgData.banner_image}`,
        { shouldDirty: false }
      );
      setValue("banner_image", null, { shouldDirty: false });
    }
  }, [pgData, setValue]);

  const generateSlug = text => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)

    const fdata = {
      'banner_image': '',
      'name': data.name,
      'banner_title': data.banner_title,
      'main_content': data.main_content,
      'author': data.author,
      'classification': data.classification,
      'copyright': data.copyright,
      'meta_description': data.meta_description,
      'meta_keywords': data.meta_keywords,
      'meta_title': data.meta_title,
      'page_url': data.page_url,
      'publisher': data.publisher,
      'rating': data.rating,
      'revisit_after': data.revisit_after,
      'robots': data.robots,
      'static_page' : '1',
    }

    if (data.banner_image instanceof File){
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(data.banner_image);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });
      fdata.banner_image = base64;
      fdata.banner_image_file = data.banner_image.name;

    } else {
      if(pgData.banner_image){
        fdata.banner_image = pgData.banner_image;
      }
    }

    const pgeData = {
      'name': data.name,
      'pgeData': 1,
      'is_delete': 0,
      'static_page': 1,
      'status' : 1
    }

    if(pgData && Object.keys(pgData).length > 0){
      var log = await updateStaticPage(pgData._id, fdata);
      //var log = await updatePage(pgDataMain?._id, pgeData);
    }else{
      var log = await createStaticPage(fdata);
      //var log = await savePage(pgeData);
    }

    if (log && log._id) {
      pgeData.pge_id = log._id
      if(pgData && Object.keys(pgData).length > 0){
        var log2 = await updatePage(pgDataMain?._id, pgeData);
      }else{
        var log2 = await savePage(pgeData);
      }

      if(log2 && log2._id){
        if(pgData && Object.keys(pgData).length > 0){
          toast.success('Page updated successfully.')
        }else{
          toast.success('Page created successfully.')
          router.replace(`/admin/page/edit/${log._id}`)
        }
      }else{
        toast.error(log2.errors)
      }
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
          <CardHeader title={`Page Management - ${pgData && Object.keys(pgData).length > 0 ? "Edit Page" : "Add Page"}`} />
          <Divider />

          <CardContent className='mbe-5'>
            <form
              noValidate
              action={() => {}}
              autoComplete='off'
              onSubmit={handleSubmit(onUpdate)}
            >
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
                        label='Page Name'
                        variant='outlined'
                        placeholder='Enter Page Name'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)

                          const slug = generateSlug(e.target.value)
                          setValue('page_url', slug)

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
              </Grid>
              <Divider />

              {/* Banner Sections */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Banner Sections</h2>
                </Grid>

                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                      <div className='flex max-sm:flex-col items-center gap-6'>
                        {watch('banner_preview') ? (
                          <img height={100} width={100} className='rounded' src={watch('banner_preview')} alt='Banner Image' />
                        ) : null}
                        <div className='flex flex-grow flex-col gap-4'>
                          <div className='flex flex-col sm:flex-row gap-4'>
                            <Button component='label' size='small' variant='contained' htmlFor='banner-image'>
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
                                id='banner-image'
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
                  </Grid>
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='banner_title'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Banner Title'
                        variant='outlined'
                        placeholder='Enter Title'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.banner_title || errorState !== null) && {
                          error: true,
                          helperText: errors?.banner_title?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Divider />

              {/* Content fields*/}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Content Section</h2>
                </Grid>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                  <Controller
                    name='main_content'
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
                            rows={4.2}
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
