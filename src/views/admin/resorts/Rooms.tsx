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
  room_lists: array(
    object({
      title: pipe(string(), nonEmpty('This field is required')),
      description: optional(string()),
      gallery: pipe(
        array(
          custom<File>((file) => {
            const maxFileSize = 5 * 1024 * 1024; 
            if ((file as File).size > maxFileSize) {
              return 'File must be 5MB or smaller';
            }
            return true;
          })
        ),
      ),
      _gpreview: array(optional(string())),
      feature_description: optional(string()),
      features_lists: array(optional(string())),
    })
  ),
  review_background: optional(custom<File | null>((value) => {
    if (!value) return 'This field is required';
    const allowed = ["image/png", "image/jpeg", "image/gif"];
    if (!allowed.includes((value as File).type)) return "Only PNG/JPG/GIF allowed";
    const maxMB = 2;
    if ((value as File).size > maxMB * 1024 * 1024)
      return `Max file size is ${maxMB} MB`;
    return true;
  })),
  selected_review: optional(string()),
})

const AddResorts = ({ pgData, adventurePosts, getFormId, reviews }: { pgData?: any; adventurePosts?: []; getFormId?: any; reviews?: [] }) => {  
  const router = useRouter()

  let form_id = getFormId?.();

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewsOptions, setReviewsOptions] = useState<{label: string, value: string}[]>([])

  useEffect(() => {
    const obj = reviews?.map(item => ({
      label: item._id,
      value: `${item.user_first_name} ${item.user_last_name} (${item.user_email})`
    }));

    setReviewsOptions(obj);
  }, [reviews]);

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
      banners: (pgData?.rooms?.banners && Array.isArray(pgData.rooms.banners) && pgData.rooms.banners.length > 0) 
        ? pgData.rooms.banners.map((section: any) => ({
            content: section.content || '',
            image: section.image || null,
            _preview: section.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${section.image}` : '',
          }))
        : [{ title: '', image: null, _preview: '' }],
      about_button_text: pgData?.rooms?.about_button_text ?? '',
      about_button_link: pgData?.rooms?.about_button_link ?? '',

      room_lists: (pgData?.rooms?.room_lists && Array.isArray(pgData.rooms.room_lists) && pgData.rooms.room_lists.length > 0) 
        ? pgData.rooms.room_lists.map((section: any) => ({
            title: section.title ?? '',
            description: section.description ?? '',
            gallery: section.gallery ?? [],
            _gpreview: (section.gallery ?? []).map((img: string) => `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${img}`),
            feature_description: section.feature_description ?? '',
            features_lists: section.features_lists ?? [],
        })) 
      : [{title: '', description: '', gallery: [], _gpreview: [], feature_description: '', features_lists: [] }],

      review_background: pgData?.rooms?.review_background?? '',
      review_background_preview: pgData?.rooms?.review_background ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${pgData?.rooms?.review_background}` : '',
      selected_review: pgData?.rooms?.selected_review?? ''
    }
  })

  const { fields: bannersFields, append: appendBannersFields, remove: removeBannersFields } = useFieldArray({
    control,
    name: "banners",
  });

  const { fields: roomsListsFields, append: appendRoomsListsFields, remove: removeRoomsListsFields } = useFieldArray({
    control,
    name: "room_lists",
  });

  // Fix: Add setEditor function
  const setEditor = (editorInstance: any) => {
    // You can store the editor instance if needed
  };

  const handleDragStart = (roomIndex: number, imageIndex: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ roomIndex, imageIndex }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (roomIndex: number, targetImageIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { roomIndex: sourceroomIndex, imageIndex: sourceImageIndex } = draggedData;
      
      if (sourceroomIndex !== roomIndex) return;
      
      // Fix: Use correct field name 'room_lists' instead of 'room_listss'
      const currentPreviews = watch(`room_lists.${roomIndex}._gpreview`) || [];
      const currentFiles = watch(`room_lists.${roomIndex}.gallery`) || [];
      
      const moveItem = (arr: any[]) => {
        const newArr = [...arr];
        const [movedItem] = newArr.splice(sourceImageIndex, 1);
        newArr.splice(targetImageIndex, 0, movedItem);
        return newArr;
      };
      
      setValue(`room_lists.${roomIndex}._gpreview`, moveItem(currentPreviews), { shouldDirty: true });
      setValue(`room_lists.${roomIndex}.gallery`, moveItem(currentFiles), { shouldDirty: true });
    } catch (error) {
      console.error('Drag and drop error:', error);
    }
  };

  const handleRemoveImage = (roomIndex: number, imageIndex: number) => {
    // Fix: Use correct field name 'room_lists' instead of 'room_listss'
    const currentPreviews = watch(`room_lists.${roomIndex}._gpreview`) || [];
    const currentFiles = watch(`room_lists.${roomIndex}.gallery`) || [];

    if (currentPreviews[imageIndex] && currentPreviews[imageIndex].startsWith('blob:')) {
      URL.revokeObjectURL(currentPreviews[imageIndex]);
    }
    
    const newPreviews = currentPreviews.filter((_, i) => i !== imageIndex);
    const newFiles = currentFiles.filter((_, i) => i !== imageIndex);
    
    setValue(`room_lists.${roomIndex}._gpreview`, newPreviews, { shouldDirty: true });
    setValue(`room_lists.${roomIndex}.gallery`, newFiles, { shouldDirty: true });
  };

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)

    const formData = new FormData();

    // Basic fields
    formData.append('rooms_tab', 'yes');
    formData.append("rooms[about_button_text]", data.about_button_text || '');
    formData.append("rooms[about_button_link]", data.about_button_link);
    formData.append("rooms[selected_review]", data.selected_review || '');

    // Banners data
    data.banners.forEach((section, i) => {
      formData.append(`rooms_banners[${i}][content]`, section.content)
      if (section.image && section.image instanceof File) {
        formData.append(`rooms_banners[${i}][image]`, section.image)
      } else if (typeof section.image === 'string') {
        formData.append(`rooms_banners[${i}][image]`, section.image)
      }
    });

    // Rooms list data
    data.room_lists.forEach((section, i) => {
      formData.append(`rooms_room_lists[${i}][title]`, section.title)
      formData.append(`rooms_room_lists[${i}][description]`, section.description || '')
      formData.append(`rooms_room_lists[${i}][feature_description]`, section.feature_description || '')
      if(section.features_lists){
        section.features_lists.forEach((feature, j) => {
          formData.append(`rooms_room_lists[${i}][features_lists][${j}]`, feature)
        });
      }
      if(section.gallery){
        section.gallery.forEach((gal, j) => {
          if (gal instanceof File) {
            formData.append(`rooms_room_lists[${i}][gallery][${j}]`, gal)
          } else {
            formData.append(`rooms_room_lists[${i}][gallery][${j}]`, gal)
          }
        });
      }
    })

    if (data.review_background instanceof File){
      formData.append("rooms_review_background", data.review_background);
    }else if(data.review_background){
      formData.append("review_background", data.review_background);
    }

    let log = null;
    if(form_id === null) {
     //
    } else {
      log = await updateResort(form_id, formData);
    }

    if (log && log._id) {
      toast.success('Rooms tab updated successfully.')
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
            <CardHeader title='Rooms Tab' />
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
                                onClick={() => appendBannersFields({content: '', image: null, _preview: ''})} 
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
                        id='overview_about_button_text'
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
                        id='overview_about_button_url'
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

              {/* Rooms Lists*/}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Rooms Lists</h3>
              </Grid>
              <Grid container spacing={5}>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  {roomsListsFields.map((field, index) => (
                    <div key={field.id} spacing={5} className="border rounded p-4 mb-2">
                      <div className="flex justify-between items-center mb-4">
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>Room {index + 1}</Typography>
                        {index > 0 ? 
                          (<CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => removeRoomsListsFields(index)}>
                          <i className="ri-delete-bin-7-line"></i>
                        </CustomIconButton>) 
                        : null }       
                      </div>
                      <Grid container spacing={6}>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <Controller
                            name={`room_lists.${index}.title`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='text'
                                label='Title'
                                variant='outlined'
                                placeholder='Enter Name'
                                className='mbe-1'
                                id={`room_lists.${index}.title`}
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errorState !== null) && {
                                  error: true,
                                  helperText: errors?.room_lists[index]?.title?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <div className='flex max-sm:flex-col items-center gap-6'>
                            <div className='flex flex-grow flex-col gap-4'>
                              <div className='flex flex-col sm:flex-row gap-4'>
                                <Button component='label' size='small' variant='contained' htmlFor={`gallery_${index}`}>
                                  Upload Gallery Images
                                  <input
                                    hidden
                                    multiple
                                    type='file'
                                    accept='image/png, image/jpeg'
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files) ?? [];
                                      const maxSize = 800 * 1024;
                                      
                                      const validFiles = files.filter(file => {
                                        if (file.size > maxSize) {
                                          toast.error(`File "${file.name}" is too large. Maximum allowed size is 800KB.`);
                                          return false;
                                        }
                                        return true;
                                      });

                                      if (validFiles.length === 0) return;

                                      const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
                                      const existingUrls = watch(`room_lists.${index}._gpreview`) || [];
                                      
                                      setValue(`room_lists.${index}._gpreview`, [...existingUrls, ...newPreviewUrls], { shouldDirty: true });
                                      
                                      const existingFiles = watch(`room_lists.${index}.gallery`) || [];
                                      setValue(`room_lists.${index}.gallery`, [...existingFiles, ...validFiles], { shouldDirty: true });
                                    }}
                                    id={`gallery_${index}`}
                                  />
                                </Button>
                                <Button size='small' variant='outlined' color='error' onClick={(e) => {
                                  // Revoke ALL preview URLs when resetting
                                  const previews = watch(`room_lists.${index}._gpreview`) || [];
                                  previews.forEach((url) => URL.revokeObjectURL(url));
                                  
                                  setValue(`room_lists.${index}.gallery`, [], { shouldDirty: true });
                                  setValue(`room_lists.${index}._gpreview`, [], { shouldDirty: true });
                                }}>
                                  Reset All
                                </Button>
                              </div>
                              <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                              
                              {/* Image Preview Grid with Remove and Reorder Functionality */}
                              <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                                <div className='flex max-sm:flex-col items-center gap-6 flex-wrap'>
                                  {watch(`room_lists.${index}._gpreview`)?.map((previewUrl, imageIndex) => (
                                    <div key={imageIndex} 
                                         className="relative group"
                                         draggable onDragStart={handleDragStart(index, imageIndex)}
                                         onDragOver={handleDragOver}
                                         onDrop={handleDrop(index, imageIndex)}>
                                      {/* Image */}
                                      <img 
                                      height={100} width={100}  
                                        src={previewUrl}
                                        alt={`Preview ${imageIndex + 1}`}
                                        className="h-30 w-40 object-cover rounded border-2 border-gray-200"
                                      />
                                      
                                      {/* Remove Button */}
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index, imageIndex)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove image"
                                      >
                                        ×
                                      </button>
                                      
                                      {/* Drag Handle for Reordering */}
                                      <div 
                                        className="absolute top-2 left-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-80"
                                        title="Drag to reorder"
                                      >
                                        ⋮⋮
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <Divider />
                              </Grid>
                              
                              {errors.room_lists?.[index]?.userprofile && (
                                <Typography color='error.main'>{String(errors.room_lists[index]?.userprofile?.message)}</Typography>
                              )}
                            </div>
                          </div>
                        </Grid>
                        <Grid size={{ md: 21, xs: 12, lg: 12 }} style={{ marginBottom: "0" }}>
                          <Typography variant='h6' color='#a3a3a3'>Description</Typography>
                          <Controller
                            name={`room_lists.${index}.description`}
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
                          {errors.room_lists?.[index]?.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.room_lists?.[index]?.description.message}</p>
                          )}
                        </Grid>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }} style={{ marginBottom: "0" }}>
                          <Typography variant='h6' color='#a3a3a3'>Feature Description</Typography>
                          <Controller
                            name={`room_lists.${index}.feature_description`}
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
                                style={{ height: "100px", marginBottom: "40px" }}
                              />
                            )}
                          />
                          {errors.room_lists?.[index]?.feature_description && (
                            <p className="text-red-500 text-sm mt-1">{errors.room_lists?.[index]?.feature_description.message}</p>
                          )}
                        </Grid>
                        {/* Feature List Repeater Section - ADD THIS */}
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <Typography variant='h6' sx={{ mb: 2, color: 'text.primary' }}>Features List</Typography>
                          <div className="border rounded p-4 mb-4 bg-gray-50">
                            {(watch(`room_lists.${index}.features_lists`) || []).map((_, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2 mb-3">
                                <Controller
                                  name={`room_lists.${index}.features_lists.${featureIndex}`}
                                  control={control}
                                  rules={{ required: true }}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      fullWidth
                                      type='text'
                                      label={`Feature ${featureIndex + 1}`}
                                      variant='outlined'
                                      placeholder='Enter feature'
                                      size='small'
                                      value={field.value || ''}
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        errorState !== null && setErrorState(null);
                                      }}
                                      {...((errors.room_lists?.[index]?.features_lists?.[featureIndex] || errorState !== null) && {
                                        error: true,
                                        helperText: errors.room_lists?.[index]?.features_lists?.[featureIndex]?.message || errorState?.message[0]
                                      })}
                                    />
                                  )}
                                />
                                <CustomIconButton 
                                  aria-label='remove feature' 
                                  color='error' 
                                  size='small' 
                                  onClick={() => {
                                    // Remove feature from the features_lists array
                                    const currentFeatures = watch(`room_lists.${index}.features_lists`) || [];
                                    const updatedFeatures = currentFeatures.filter((_, i) => i !== featureIndex);
                                    setValue(`room_lists.${index}.features_lists`, updatedFeatures, { shouldDirty: true });
                                  }}
                                >
                                  <i className="ri-delete-bin-7-line"></i>
                                </CustomIconButton>
                              </div>
                            ))}
                            
                            <Button 
                              size='small' 
                              variant='outlined' 
                              onClick={() => {
                                // Add new feature field
                                const currentFeatures = watch(`room_lists.${index}.features_lists`) || [];
                                setValue(`room_lists.${index}.features_lists`, [...currentFeatures, ''], { shouldDirty: true });
                              }}
                              startIcon={<i className='ri-add-line' />}
                            >
                              Add Feature
                            </Button>
                          </div>
                        </Grid>

                        <Grid size={{ md: 6, xs: 2, sm: 2 }}>
                          { roomsListsFields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => appendRoomsListsFields({title: '', description: '', feature_description: '', features_lists: [] })} color='secondary' size='small' variant="contained" startIcon={<i className='ri-add-line' />} >
                            Add Room
                          </Button>) : null }              
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                </Grid>
              </Grid>

              {/* Review Section */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Review Section</h3>
              </Grid>
              <Grid container spacing={5}>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <div className='flex max-sm:flex-col items-center gap-6 flex-wrap'>
                    {watch('review_background_preview') ? (
                      <img height={100} width={100} className='rounded' src={watch('review_background_preview')} alt='Review Background Image' />
                    ) : null}
                    <div className='flex flex-grow flex-col gap-4'>
                      <div className='flex flex-col sm:flex-row gap-4'>
                        <Button component='label' size='small' variant='contained' htmlFor='review_background'>
                          Upload Background Image
                          <input
                            hidden
                            required
                            type='file'
                            accept='image/png, image/jpeg, image/svg+xml'
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;

                              const maxSize = (1024 * 2) * 1024;

                              if (file.size > maxSize) {
                                toast.error("File is too large. Maximum allowed size is 2MB.")

                                return;
                              }

                              const url = file ? URL.createObjectURL(file) : null;
                              const prev = (watch('review_background_preview') as string | null) || null;
                              
                              if (prev) URL.revokeObjectURL(prev);
                              setValue('review_background_preview', url, { shouldDirty: true });
                              setValue('review_background', file, { shouldDirty: true });
                            }}
                            id='review_background'
                          />
                        </Button>
                        <Button size='small' variant='outlined' color='error' onClick={(e) => {
                            setValue('review_background_preview', null, { shouldDirty: true });
                            setValue('review_background', null, { shouldDirty: true });
                          }}>
                            Reset
                        </Button>
                      </div>
                      <Typography>Allowed JPG, GIF, SVG or PNG. Max size of 800K</Typography>
                      {errors.review_background && (
                        <Typography color="error.main">
                          {String(errors.review_background.message)}
                        </Typography>
                      )}
                    </div>
                  </div>
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <input
                    type="hidden"
                    {...register(`selected_review`)}
                  />

                  <Autocomplete
                    options={reviewsOptions?? []}
                    getOptionLabel={(option) => option.value}
                    value={
                      reviewsOptions?.find(
                        (opt) => opt.label === watch(`selected_review`)
                      ) || null
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.label}>
                        {option.value}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Review" variant="outlined" />
                    )}
                    onChange={(event, newValue) => {
                      setValue(
                        `selected_review`,
                        newValue ? newValue.label : null,
                        { shouldValidate: true }
                      );
                    }}
                  />
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