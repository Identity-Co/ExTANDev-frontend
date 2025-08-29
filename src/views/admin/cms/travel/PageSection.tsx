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
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress';


import type { Editor } from '@tiptap/react'

const TipTapEditor = dynamic(() => import('@/components/TipTap'), { ssr: false })


import { toast } from 'react-toastify';

import { Controller, useForm, useFieldArray } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, array, optional, custom } from 'valibot'
import type { InferInput } from 'valibot'

import { useNavigationStore } from '@/libs/navigation-store'

import CustomIconButton from '@core/components/mui/IconButton'

import { updatePageInfo, updateSectionImage } from '@/app/server/pages'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  about_title: pipe(string(), nonEmpty('This field is required')),
  about_content: pipe(string(), nonEmpty('This field is required')),
  travel_sections: array(
    object({
      title: pipe(string(), nonEmpty('This field is required')),
      direction: pipe(string(), nonEmpty('This field is required')),
      content: pipe(string(), nonEmpty('This field is required')),
       image: optional(custom<File | null>((value) => {

        if (!value) return true; // allow empty

        const allowed = ["image/png", "image/jpeg", "image/gif"];

        if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF allowed";

        const maxMB = 5;

        if (value.size > maxMB * 1024 * 1024)

          return `Max file size is ${maxMB} MB`;

        return true;

      })),
      _preview: optional(string()),
    })
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

const PageSection = ({ pgData }: { pgData?: [] }) => {  
  console.log(pgData)
  const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting , setIsSubmitting ] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [message, setMessage] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    watch, setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      about_title: pgData?.about_title??'',
      about_content: pgData?.about_content??'',
      travel_sections: pgData?.travel_sections?.map(section => ({
        title: section.title ?? '',
        direction: section.direction ?? '',
        content: section.content ?? '',
        image: section.image ?? null,
        _preview: section._preview ?? '',
      })) ?? [{title: '', direction: '', content: '', image: null, _preview: ''}],
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "travel_sections",
  });

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)

    const sections = [];
    const fd = new FormData(); 
    
    data.travel_sections.forEach((s, i) => {
      if (s.image) fd.append(`image[${i}][image]`, s.image);

      sections.push({'title': s.title, 'content': s.content, 'direction': s.direction});
    });

    const fdata = {
      'about_content': data.about_content,
      'about_title': data.about_title,
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
      'travel_sections': sections,
    }

    const log = await updatePageInfo('Total Travel', { 'name': 'Total Travel', ...fdata });
 
    if (log && log._id) {
      fd.append('img_update', true)
      const _log = await updateSectionImage('Total Travel', fd);

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
          <CardHeader title='Page Management - Total Travel' />
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
                <Divider />
              </Grid>
              <Divider />

              {/* Travel Sections */}
              <Grid container spacing={5} className="my-5">  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <h2>Travel Sections</h2>
                </Grid>

                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                {fields.map((field, index) => (
                  <div key={field.id} spacing={5}>
                    <Grid container spacing={6}>
                      <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                        <div className='flex max-sm:flex-col items-center gap-6'>
                          {watch(`travel_sections.${index}._preview`) ? (
                            <img height={100} width={100} className='rounded' src={watch(`travel_sections.${index}._preview`) as string} alt='Section Image' />
                            ) : null}

                          {!watch(`travel_sections.${index}._preview`) && field.image && (<img height={100} width={100} className='rounded' src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${field.image}`} alt='Section Image' />)}

                          <div className='flex flex-grow flex-col gap-4'>
                            <div className='flex flex-col sm:flex-row gap-4'>
                              <Button component='label' size='small' variant='contained' htmlFor={`section_image_${index}`}>
                                Upload New Photo
                                <input
                                  hidden
                                  type='file'
                                  accept='image/png, image/jpeg'
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;

                                    const maxSize = 800 * 1024; // 800 KB

                                    if (file && file.size > maxSize) {
                                      toast.error("File is too large. Maximum allowed size is 800KB.")

                                      return;
                                    }

                                    // set preview url for UI only
                                    const url = file ? URL.createObjectURL(file) : null;
                                    
                                    // revoke previous
                                    const prev = (watch(`travel_sections.${index}._preview`) as string | null) || null;
                                    
                                    if (prev) URL.revokeObjectURL(prev);
                                    setValue(`travel_sections.${index}._preview`, url, { shouldDirty: true });
                                    setValue(`travel_sections.${index}.image`, file, { shouldDirty: true });
                                  }}
                                  id={`section_image_${index}`}
                                />
                              </Button>
                              <Button size='small' variant='outlined' color='error' onClick={(e) => {
                                setValue(`travel_sections.${index}.image`, null, { shouldDirty: true });
                                setValue(`travel_sections.${index}._preview`, null, { shouldDirty: true });
                              }}>
                                Reset
                              </Button>
                            </div>
                            <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                            {errors.travel_sections?.[index]?.image && (<Typography color='error.main'>{String(errors.travel_sections[index]?.image?.message)}</Typography>)}
                          </div>
                        </div>
                      </Grid>

                      <Grid size={{ md: 6, xs: 12, sm: 12, lg: 6 }}>
                        <Controller
                            name={`travel_sections.${index}.title`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Title'
                                placeholder='Enter Title'
                                error={!!errors.travel_sections?.[index]?.title}
                                helperText={errors.travel_sections?.[index]?.title?.message}
                              />
                            )}
                          />
                      </Grid>
                      <Grid size={{ md: 6, xs: 12, sm: 12, lg: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel id={`section_direction_${index}`} error={!!errors.travel_sections?.[index]?.direction}>
                            Direction
                          </InputLabel>
                          <Controller
                            name={`travel_sections.${index}.direction`}
                            control={control}
                            render={({ field }) => (
                              <Select {...field} label='Direction' error={!!errors.travel_sections?.[index]?.direction}>
                                <MenuItem value=''>- Direction -</MenuItem>
                                <MenuItem value='image_first'>Image First</MenuItem>
                                <MenuItem value='content_first'>Content First</MenuItem>
                              </Select>
                            )}
                          />
                          {errors.travel_sections?.[index]?.direction && (
                            <FormHelperText error>
                              {errors.travel_sections[index]?.direction?.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                        <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                          <Controller
                            name={`travel_sections.${index}.content`}
                            control={control}
                            render={({ field }) => (
                              <TipTapEditor
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                onReady={(editorInstance) => setEditor(editorInstance)}
                              />
                            )}
                          />
                          {errors.travel_sections?.[index]?.content && (
                            <p className='text-red-500 text-sm mt-1'>
                              {errors.travel_sections[index]?.content?.message}
                            </p>
                          )}
                      </Grid>

                      <Grid size={{ md: 6, xs: 2, sm: 2 }}>
                        { fields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => append({title: '', direction: '', content: '', image: '', _preview: ''})} color='secondary' size='large' variant="contained" startIcon={<i className='ri-add-line' />} >
                          Add More
                        </Button>) : null }

                        {index > 0 ? 
                          (<CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => remove(index)}>
                          <i className="ri-delete-bin-7-line"></i>
                        </CustomIconButton>) 
                        : null }                  
                      </Grid>
                    </Grid>
                  </div>
                ))}
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
