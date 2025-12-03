'use client'

import { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

import 'react-quill-new/dist/quill.snow.css';

type FileProp = {
  name: string
  type: string
  size: number
}

import { toast } from 'react-toastify';

/*import type { Editor } from '@tiptap/react'

const TipTapEditor = dynamic(() => import('@/components/TipTap'), { ssr: false })*/

import { Controller, useForm, useFieldArray } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, custom, string, pipe, nonEmpty, optional, array } from 'valibot'
import type { InferInput } from 'valibot'

import CustomIconButton from '@core/components/mui/IconButton'

import { useNavigationStore } from '@/libs/navigation-store'

import { updateResort } from '@/app/server/resorts'

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
  stories: array(
  	object({
  		userprofile: pipe(custom<File | null>((value) => {
      	if (!value) return 'This field is required'; // allow empty

        const allowed = ["image/png", "image/jpeg", "image/gif"];

        if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF allowed";

        const maxMB = 5;

        if (value.size > maxMB * 1024 * 1024)

          return `Max file size is ${maxMB} MB`;

        return true;
      })),
      name: pipe(string(), nonEmpty('This field is required')),
      date: pipe(string(), nonEmpty('This field is required')),
    	username: pipe(string(), nonEmpty('This field is required')),
    	location: optional(string()),
    	content: pipe(string(), nonEmpty('This field is required')),
      _preview: optional(string()),
      gallery: pipe(
	      array(
	        custom<File>((file) => {
	          
	          // Ensure file size is <= 5MB (5MB = 5 * 1024 * 1024 bytes)
	          const maxFileSize = 5 * 1024 * 1024; 
	          if (file.size > maxFileSize) {
	            return 'File must be 5MB or smaller';
	          }

	          return true;
	        })
	      ),
	      // Optional: custom validation to check if there's at least one file in the gallery
	      // custom<File[]>((files) => files.length > 0, "At least one file required")
	    ),
      _gpreview: array(optional(string())),
    })
  )
})

const Stories = ({ pgData, getFormId }: { pgData?: any; getFormId?: any }) => {  
	const router = useRouter()

	let form_id = getFormId?.();

  const setLoading = useNavigationStore((s) => s.setLoading)

	const [errorState, setErrorState] = useState<ErrorType | null>(null)
	const [isSubmitting , setIsSubmitting ] = useState(false)
	const [editor, setEditor] = useState<Editor | null>(null)
	const [message, setMessage] = useState(null);

	const [destID, setdestID] = useState(getFormId());

	// States
  const [files, setFiles] = useState<File[]>([])

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
			banners: (pgData?.stories?.banners && Array.isArray(pgData.stories.banners) && pgData.stories.banners.length > 0) 
        ? pgData.stories.banners.map((section: any) => ({
            title: section.title || '',
            image: section.image || null,
            _preview: section.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${section.image}` : '',
          }))
        : [{ title: '', image: null, _preview: '' }],
		  about_title: pgData?.stories?.about_title??'',
		  stories: (pgData?.stories?.stories_lists && Array.isArray(pgData.stories.stories_lists) && pgData.stories.stories_lists.length > 0) 
        ? pgData.stories.stories_lists.map((section: any) => ({
        userprofile: section.userprofile ?? null,
        name: section.name ?? '',
        date: section.date ?? '',
        username: section.username ?? '',
        location: section.location ?? '',
        _preview: section._preview ?? '',
        content: section.content ?? '',
        gallery: section.gallery ?? [],
        _gpreview: (section.gallery ?? []).map((img: string) => `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${img}`),
      })) : [{name: '', date: '', username: '', userprofile: null, location: '', _preview : '', content: '', gallery: [] }],
		}
	})

	/*useEffect(() => {
    if (pgData?.stories?.stories) {
      pgData.stories?.stories.forEach((story, index) => {
        if (story.gallery && story.gallery.length > 0) {
          // Use the existing image URLs
          let previewUrls = [];
          story.gallery.forEach((gal, gal_i) =>{
          	previewUrls[gal_i] = process.env.NEXT_PUBLIC_UPLOAD_URL+'/'+gal;
          })
          setValue(`stories.${index}.gallery`, story.gallery, { shouldDirty: false });
          setValue(`stories.${index}._gpreview`, previewUrls, { shouldDirty: false });
        }
      });
    }
  }, [pgData, setValue]);*/

	// Handler to remove specific image
	const handleRemoveImage = (storyIndex: number, imageIndex: number) => {
	  const currentPreviews = watch(`stories.${storyIndex}._gpreview`) || [];
	  const currentFiles = watch(`stories.${storyIndex}.gallery`) || [];
	  
	  // Only revoke the specific URL being removed
	  URL.revokeObjectURL(currentPreviews[imageIndex]);
	  
	  const newPreviews = currentPreviews.filter((_, i) => i !== imageIndex);
	  const newFiles = currentFiles.filter((_, i) => i !== imageIndex);
	  
	  setValue(`stories.${storyIndex}._gpreview`, newPreviews, { shouldDirty: true });
	  setValue(`stories.${storyIndex}.gallery`, newFiles, { shouldDirty: true });
	};

	// Handler to move images up/down
	const handleMoveImage = (storyIndex: number, imageIndex: number, direction: 'up' | 'down') => {
	  const currentPreviews = watch(`stories.${storyIndex}._gpreview`) || [];
	  const currentFiles = watch(`stories.${storyIndex}.gallery`) || [];
	  
	  if (
	    (direction === 'up' && imageIndex === 0) ||
	    (direction === 'down' && imageIndex === currentPreviews.length - 1)
	  ) {
	    return; // Can't move beyond boundaries
	  }
	  
	  const newIndex = direction === 'up' ? imageIndex - 1 : imageIndex + 1;
	  
	  // Swap positions in both arrays
	  const swapArrayElements = (arr: any[]) => {
	    const newArr = [...arr];
	    [newArr[imageIndex], newArr[newIndex]] = [newArr[newIndex], newArr[imageIndex]];
	    return newArr;
	  };
	  
	  setValue(`stories.${storyIndex}._gpreview`, swapArrayElements(currentPreviews), { shouldDirty: true });
	  setValue(`stories.${storyIndex}.gallery`, swapArrayElements(currentFiles), { shouldDirty: true });
	};

	// Optional: Drag and drop reordering handler
	const handleDragStart = (storyIndex: number, imageIndex: number) => (e: React.DragEvent) => {
	  e.dataTransfer.setData('text/plain', JSON.stringify({ storyIndex, imageIndex }));
	};

	const handleDragOver = (e: React.DragEvent) => {
	  e.preventDefault();
	};

	const handleDrop = (storyIndex: number, targetImageIndex: number) => (e: React.DragEvent) => {
	  e.preventDefault();
	  
	  try {
	    const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
	    const { storyIndex: sourceStoryIndex, imageIndex: sourceImageIndex } = draggedData;
	    
	    if (sourceStoryIndex !== storyIndex) return; // Only reorder within same story
	    
	    const currentPreviews = watch(`stories.${storyIndex}._gpreview`) || [];
	    const currentFiles = watch(`stories.${storyIndex}.gallery`) || [];
	    
	    // Move item from source to target position
	    const moveItem = (arr: any[]) => {
	      const newArr = [...arr];
	      const [movedItem] = newArr.splice(sourceImageIndex, 1);
	      newArr.splice(targetImageIndex, 0, movedItem);
	      return newArr;
	    };
	    
	    setValue(`stories.${storyIndex}._gpreview`, moveItem(currentPreviews), { shouldDirty: true });
	    setValue(`stories.${storyIndex}.gallery`, moveItem(currentFiles), { shouldDirty: true });
	  } catch (error) {
	    console.error('Drag and drop error:', error);
	  }
	};

	const { fields, append, remove } = useFieldArray({
    control,
    name: "stories",
  });

  const { fields: bannersFields, append: appendBannersFields, remove: removeBannersFields } = useFieldArray({
    control,
    name: "banners",
  });

	const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
		const isOnlyPBr = /^<p><br><\/p>$/;
		const id = getFormId();

		const formData = new FormData();

		// Basic fields
    formData.append('stories_tab', 'yes');
    formData.append("stories[about_title]", data.about_title || '');

    // Banners data
    data.banners.forEach((section, i) => {
      formData.append(`stories_banners[${i}][title]`, section.title)
      if (section.image && section.image instanceof File) {
        formData.append(`stories_banners[${i}][image]`, section.image)
      } else if (typeof section.image === 'string') {
        formData.append(`stories_banners[${i}][image]`, section.image)
      }
    });

    data.stories.forEach((section, i) => {
    	if(section.userprofile){
		  	formData.append(`story_sections[${i}][userprofile]`, section.userprofile)
		  }
		  formData.append(`story_sections[${i}][name]`, section.name)
		  formData.append(`story_sections[${i}][date]`, section.date)
		  formData.append(`story_sections[${i}][username]`, section.username)
    	formData.append(`story_sections[${i}][content]`, section.content)
		  formData.append(`story_sections[${i}][location]`, section.location)
		  if(section.gallery){
			  section.gallery.forEach((gal, j) => {
			  	if (gal instanceof File) {
			  		formData.append(`story_sections[${i}][gallery][${j}]`, gal)
			  	}else{
			  		formData.append(`story_sections[${i}][gallery][${j}]`, gal)
			  	}
			  });
			}
    })

    setIsSubmitting(true)

    let log = null;
    if(form_id === null) {
     //
    } else {
      log = await updateResort(form_id, formData);
    }

    if (log && log._id) {
      toast.success('Stories tab updated successfully.')
    } else {
      toast.error('Something went wrong, Please try again')
    }
    setIsSubmitting(false)
	}

	return (
	  <form noValidate autoComplete="off" onSubmit={handleSubmit(onUpdate, (errors) => { })}>
	  	<Grid container spacing={6} sx={{ rowGap: 4 }}>
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <Card className="mt-2">
            <CardHeader title='Stories Tab' />
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
	                                      id={`rooms_banners.${index}.title`}
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
	                        id='stories_about_title'
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
              </Grid>

						    {/* Stories Management */}
              	<Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px;', marginTop: '20px'}}>
	                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Stories List</h3>
	              </Grid>
						    <Grid container spacing={5}>
						      <Grid size={{ md: 12, xs: 12, lg: 12 }}>
						        {fields.map((field, index) => {
						        	const previews = (watch(`stories.${index}._gpreview`) as string[]) || [];

					        		return (
							          <div key={field.id} spacing={5} className="border rounded p-4 mb-2">
							          	<div className="flex justify-between items-center mb-4">
		                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>Story {index + 1}</Typography>
		                        {index > 0 ? 
		                          (<CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => remove(index)}>
		                          <i className="ri-delete-bin-7-line"></i>
		                        </CustomIconButton>) 
		                        : null }       
		                      </div>
							          	<Grid container spacing={6}>
							            	<Grid size={{ md: 12, xs: 12, lg: 12 }}>
							                <div className='flex max-sm:flex-col items-center gap-6'>
							                  {watch(`stories.${index}._preview`) ? (
							                    <img height={100} width={100} className='rounded' src={watch(`stories.${index}._preview`) as string} alt='Section Image' />
							                    ) : null}

							                  {destID && field.userprofile && (
							                  	<img height={100} width={100} className='rounded' src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${field.userprofile}`} alt='Section Image' />
							                  	) }
							                  <div className='flex flex-grow flex-col gap-4'>
							                    <div className='flex flex-col sm:flex-row gap-4'>
							                      <Button component='label' size='small' variant='contained' htmlFor={`userprofile_${index}`}>
							                        Upload Profile Image
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
							                            const prev = (watch(`stories.${index}._preview`) as string | null) || null;
							                            
							                            if (prev) URL.revokeObjectURL(prev);
							                            setValue(`stories.${index}._preview`, url, { shouldDirty: true });
							                            setValue(`stories.${index}.userprofile`, file, { shouldDirty: true });
							                          }}
							                          id={`userprofile_${index}`}
							                        />
							                      </Button>
							                      <Button size='small' variant='outlined' color='error' onClick={(e) => {
							                        setValue(`stories.${index}.userprofile`, null, { shouldDirty: true });
							                        setValue(`stories.${index}._preview`, null, { shouldDirty: true });
							                      }}>
							                        Reset
							                      </Button>
							                    </div>
							                    <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
							                    {errors.stories?.[index]?.userprofile && (<Typography color='error.main'>{String(errors.stories[index]?.userprofile?.message)}</Typography>)}
							                  </div>
							                </div>
							              </Grid>
							              <Grid size={{ md: 6, xs: 12, sm: 12, lg: 6 }}>
							                <FormControl fullWidth>
							                  <Controller
							                    name={`stories.${index}.name`}
							                    control={control}
							                    render={({ field }) => (
							                    	<TextField
															        {...field}
															        fullWidth
															        label='Name'
															        variant='outlined'
															        placeholder='Name'
															        className='mbe-1'
															        onChange={e => {
															          field.onChange(e.target.value)
															          errorState !== null && setErrorState(null)
															        }}
															        {...((errors.stories?.[index]?.name || errorState !== null) && {
															          error: true,
															          helperText: errors?.stories?.[index]?.name?.message || errorState?.message[0]
															        })}
															      />
							                    )}
							                  />
							                </FormControl>
							              </Grid>
							              <Grid size={{ md: 6, xs: 12, sm: 12, lg: 6 }}>
							                <FormControl fullWidth>
							                  <Controller
							                    name={`stories.${index}.date`}
							                    control={control}
							                    render={({ field }) => (
							                    	<TextField
															        {...field}
															        fullWidth
															        type="date"
															        label='Story Date'
															        variant='outlined'
															        placeholder='Select Date'
															        className='mbe-1'
															        InputLabelProps={{
					                              shrink: true,
					                            }}
															        onChange={e => {
															          field.onChange(e.target.value)
															          errorState !== null && setErrorState(null)
															        }}
															        {...((errors.stories?.[index]?.date || errorState !== null) && {
															          error: true,
															          helperText: errors?.stories?.[index]?.date?.message || errorState?.message[0]
															        })}
															      />
							                    )}
							                  />
							                </FormControl>
							              </Grid>
							              <Grid size={{ md: 6, xs: 12, sm: 12, lg: 6 }}>
							                <FormControl fullWidth>
							                  <Controller
							                    name={`stories.${index}.username`}
							                    control={control}
							                    render={({ field }) => (
							                    	<TextField
															        {...field}
															        fullWidth
															        label='Username'
															        variant='outlined'
															        placeholder='Username'
															        className='mbe-1'
															        onChange={e => {
															          field.onChange(e.target.value)
															          errorState !== null && setErrorState(null)
															        }}
															        {...((errors.stories?.[index]?.username || errorState !== null) && {
															          error: true,
															          helperText: errors?.stories?.[index]?.username?.message || errorState?.message[0]
															        })}
															      />
							                    )}
							                  />
							                </FormControl>
							              </Grid>

							              <Grid size={{ md: 6, xs: 12, sm: 12, lg: 6 }}>
							                <FormControl fullWidth>
							                  <Controller
							                    name={`stories.${index}.location`}
							                    control={control}
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
															        {...((errors.stories?.[index]?.location || errorState !== null) && {
															          error: true,
															          helperText: errors?.stories?.[index]?.location?.message || errorState?.message[0]
															        })}
															      />
							                    )}
							                  />
							                </FormControl>
							              </Grid>

							              <Grid size={{ md: 12, xs: 12, lg: 12 }} style={{ marginBottom: "30px" }}>
														  <Typography variant='h6' color='#a3a3a3'>Content</Typography>
														  <Controller
														    name={`stories.${index}.content`}
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
											              style={{ height: "300px" }}
											            />
														    )}
														  />
														  {errors.about_content && (
														    <p className="text-red-500 text-sm mt-1">{errors.about_content.message}</p>
														  )}
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

																				  // DON'T revoke previous URLs here - only revoke when removing specific images
																				  // Create new preview URLs for the new files only
																				  const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
																				  const existingUrls = watch(`stories.${index}._gpreview`) || [];
																				  
																				  setValue(`stories.${index}._gpreview`, [...existingUrls, ...newPreviewUrls], { shouldDirty: true });
																				  
																				  const existingFiles = watch(`stories.${index}.gallery`) || [];
																				  setValue(`stories.${index}.gallery`, [...existingFiles, ...validFiles], { shouldDirty: true });
																				}}
																				id={`gallery_${index}`}
														          />
														        </Button>
														        <Button size='small' variant='outlined' color='error' onClick={(e) => {
																		  // Revoke ALL preview URLs when resetting
																		  const previews = watch(`stories.${index}._gpreview`) || [];
																		  previews.forEach((url) => URL.revokeObjectURL(url));
																		  
																		  setValue(`stories.${index}.gallery`, [], { shouldDirty: true });
																		  setValue(`stories.${index}._gpreview`, [], { shouldDirty: true });
																		}}>
																		  Reset All
																		</Button>
														      </div>
														      <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
														      
														      {/* Image Preview Grid with Remove and Reorder Functionality */}
														      <Grid size={{ md: 12, xs: 12, lg: 12 }}>
															      <div className='flex max-sm:flex-col items-center gap-6'>
															        {watch(`stories.${index}._gpreview`)?.map((previewUrl, imageIndex) => (
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
															            
															            {/* Reorder Buttons */}
															            <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
															              <button
															                type="button"
															                onClick={() => handleMoveImage(index, imageIndex, 'up')}
															                disabled={imageIndex === 0}
															                className="bg-white bg-opacity-80 rounded p-1 disabled:opacity-50"
															                title="Move up"
															              >
															                ↑
															              </button>
															              <button
															                type="button"
															                onClick={() => handleMoveImage(index, imageIndex, 'down')}
															                disabled={imageIndex === (watch(`stories.${index}._gpreview`)?.length || 0) - 1}
															                className="bg-white bg-opacity-80 rounded p-1 disabled:opacity-50"
															                title="Move down"
															              >
															                ↓
															              </button>
															            </div>
															            
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
														      
														      {errors.stories?.[index]?.userprofile && (
														        <Typography color='error.main'>{String(errors.stories[index]?.userprofile?.message)}</Typography>
														      )}
														    </div>
														  </div>
														</Grid>

							              <Grid size={{ md: 6, xs: 2, lg: 2 }}>
							                { fields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => append({name: '', date: '', username: '', userprofile: null, location: '', _preview : '', content: '' })} color='secondary' size='small' variant="contained" startIcon={<i className='ri-add-line' />} >
							                  Add Story
							                </Button>) : null }     
							              </Grid>
							            </Grid>
							          </div>
							        )
						       })}
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
	);
}

export default Stories