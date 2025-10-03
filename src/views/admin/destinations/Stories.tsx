'use client'

import { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
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

import { updateDestination } from '@/app/server/destinations'

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
	banner_image: pipe(custom<File | null>((value) => {
  	if (!value) return 'This field is required'; // allow empty

    const allowed = ["image/png", "image/jpeg", "image/gif"];

    if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF allowed";

    const maxMB = 5;

    if (value.size > maxMB * 1024 * 1024)

      return `Max file size is ${maxMB} MB`;

    return true;
  })),
  about_title: pipe(string(), nonEmpty('This field is required')),
  about_content: optional(string()),
  about_button_text: optional(string()),
  about_button_link: pipe(string()),
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

type StoryProps = {
	pgData: []
	destinations: []
	setFormId: () => void
	getFormId: () => void
}

const Stories = ({ pgData, destinations, setFormId, getFormId }: StoryProps) => {
	const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

	const [errorState, setErrorState] = useState<ErrorType | null>(null)
	const [isSubmitting , setIsSubmitting ] = useState(false)
	const [editor, setEditor] = useState<Editor | null>(null)
	const [message, setMessage] = useState(null);

	const [destID, setdestID] = useState(getFormId());

	// States
  const [files, setFiles] = useState<File[]>([])

	const fData = new FormData();

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
			banner_image: pgData?.stories?.banner_image??'',
			banner_image_preview: (pgData?.stories?.banner_image) ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${pgData?.stories?.banner_image}` : '',
		  about_title: pgData?.stories?.about_title??'',
		  about_content: pgData?.stories?.about_content??'',
		  about_button_text: pgData?.stories?.button_text??'',
		  about_button_link: pgData?.stories?.button_link??'',
		  stories: pgData?.stories?.stories?.map(story => ({
        userprofile: story.userprofile ?? null,
        name: story.name ?? '',
        date: story.date ?? '',
        username: story.username ?? '',
        location: story.location ?? '',
        _preview: story._preview ?? '',
        content: story.content ?? '',
        gallery: story.gallery ?? [],
      })) ?? [{username: '', userprofile: null, location: '', _preview : '', content: '', gallery: [] }],
		}
	})

	useEffect(() => {
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
  }, [pgData, setValue]);

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

	const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
		const isOnlyPBr = /^<p><br><\/p>$/;
		const id = getFormId();

		if (data.banner_image instanceof File) {
    	fData.append('banner_image_file', data.banner_image);
    }else{
    	fData.append('stories[banner_image]', pgData?.resorts?.banner_image);
    }
		fData.append('stories[about_title]', data.about_title);
    if (isOnlyPBr.test(data.about_content.trim())) {
		  fData.append('stories[about_content]', '');
		} else {
		  fData.append('stories[about_content]', data.about_content);
		}
    fData.append('stories[button_text]', data.about_button_text);
    fData.append('stories[button_link]', data.about_button_link);

    data.stories.forEach((section, i) => {
    	if(section.userprofile){
		  	fData.append(`story_sections[${i}][userprofile]`, section.userprofile)
		  }
		  fData.append(`story_sections[${i}][name]`, section.name)
		  fData.append(`story_sections[${i}][date]`, section.date)
		  fData.append(`story_sections[${i}][username]`, section.username)
    	fData.append(`story_sections[${i}][content]`, section.content)
		  fData.append(`story_sections[${i}][location]`, section.location)
		  if(section.gallery){
			  section.gallery.forEach((gal, j) => {
			  	if (gal instanceof File) {
			  		fData.append(`story_sections[${i}][gallery][${j}]`, gal)
			  	}else{
			  		fData.append(`story_sections[${i}][gallery][${j}]`, gal)
			  	}
			  });
			}
    })

    setIsSubmitting(true)

    const log = await updateDestination(id, fData);
 
    if (log && log._id) {
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
	  <form noValidate autoComplete="off" onSubmit={handleSubmit(onUpdate, (errors) => {
  })}>

	  <Grid container spacing={5} className="my-5">
	  	{/* Banner Section */}
    	<Grid size={{ md: 12, xs: 12, lg: 12 }}>
			  <h2>Banner Section</h2>
			</Grid>
    	<Grid size={{ md: 12, xs: 12, lg: 12 }}>
        <div className='flex max-sm:flex-col items-center gap-6'>
          {watch('banner_image_preview') ? (
            <img height={100} width={100} className='rounded' src={watch('banner_image_preview') as string} alt='Section Image' />
            ) : null}

          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button component='label' size='small' variant='contained' htmlFor='banner_image'>
                Upload New Photo
                <input
                  hidden
                  type='file'
                  accept='image/png, image/jpeg'
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    const maxSize = 5 * (1024 * 1024); // 800 KB

                    if (file && file.size > maxSize) {
                      toast.error("File is too large. Maximum allowed size is 5MB.")

                      return;
                    }

                    const url = file ? URL.createObjectURL(file) : null;
                    const prev = (watch('banner_image_preview') as string | null) || null;
                    
                    if (prev) URL.revokeObjectURL(prev);
                    setValue('banner_image_preview', url, { shouldDirty: true });
                    setValue('banner_image', file, { shouldDirty: true });
                  }}
                  id='banner_image'
                />
              </Button>
              <Button size='small' variant='outlined' color='error' onClick={(e) => {
                setValue('banner_image', null, { shouldDirty: true });
                setValue('banner_image_preview', null, { shouldDirty: true });
              }}>
                Reset
              </Button>
            </div>
            <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
            {errors.banner_image && (<Typography color='error.main'>{String(errors.banner_image.message)}</Typography>)}
          </div>
        </div>
      </Grid>

	    {/* About Us fields*/}
      <Grid size={{ md: 12, xs: 12, lg: 12 }}>
        <h2>About Section</h2>
      </Grid>

      {/* About Title */}
      <Grid size={{ md: 6, xs: 12, lg: 6 }}>
        <Controller
          name="about_title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type="text"
              label="Title"
              variant="outlined"
              placeholder="Enter Title"
              error={!!errors.about_title}
              helperText={errors.about_title?.message}
            />
          )}
        />
	      </Grid>

	      {/* About Content */}
	      <Grid size={{ md: 12, xs: 12, lg: 12 }} style={{ marginBottom: "30px" }}>
	        <Typography variant="h6" color="#a3a3a3">
	          Content
	        </Typography>
	        <Controller
	          name="about_content"
	          control={control}
	          render={({ field }) => (
	            <ReactQuill
	              theme="snow"
	              value={field.value ?? ""}
	              onChange={field.onChange}
	              modules={modules}
	              placeholder="Write something amazing..."
	              style={{ height: "300px" }}
	            />
	          )}
	        />
	        {errors.about_content && (
	          <p className="text-red-500 text-sm mt-10">
	            {errors.about_content.message}
	          </p>
	        )}
	      </Grid>

	      {/* About Button Text */}
	      <Grid size={{ md: 6, xs: 12, lg: 6 }}>
	        <Controller
	          name="about_button_text"
	          control={control}
	          rules={{ required: "Button text is required" }}
	          render={({ field }) => (
	            <TextField
	              {...field}
	              fullWidth
	              type="text"
	              label="Button Text"
	              variant="outlined"
	              placeholder="Enter Button Text"
	              error={!!errors.about_button_text}
	              helperText={errors.about_button_text?.message}
	            />
	          )}
	        />
	      </Grid>

	      {/* About Button Link */}
	      <Grid size={{ md: 6, xs: 12, lg: 6 }}>
	        <Controller
	          name="about_button_link"
	          control={control}
	          rules={{
	            required: "URL is required",
	            pattern: {
	              value: /^https?:\/\/[^\s$.?#].[^\s]*$/i,
	              message: "Invalid URL format (must start with http or https)",
	            },
	          }}
	          render={({ field }) => (
	            <TextField
	              {...field}
	              fullWidth
	              type="url"
	              label="Button Link"
	              variant="outlined"
	              placeholder="https://example.com"
	              error={!!errors.about_button_link}
	              helperText={errors.about_button_link?.message}
	            />
	          )}
	        />
	      </Grid>

	      <Divider />
	    </Grid>

	    {/* Stories Management */}
	    <Grid container spacing={5} className="my-5">
	    	<Grid size={{ md: 12, xs: 12, lg: 12 }}>
	        <h2>Stories</h2>
	      </Grid>

	      <Grid size={{ md: 12, xs: 12, lg: 12 }}>
	        {fields.map((field, index) => {
	        	const previews = (watch(`stories.${index}._gpreview`) as string[]) || [];

        		return (
		          <div key={field.id} spacing={5}>
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
		                { fields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => append({username: '', userprofile: null, location: '', _preview : '', content: '' })} color='secondary' size='large' variant="contained" startIcon={<i className='ri-add-line' />} >
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
		        )
	       })}
	    	</Grid>
	    </Grid>

	    {/* Submit */}
	    <Grid container spacing={5}>
	      <Grid
	        item
	        xs={12}
	        className="flex gap-4 mt-5 flex-wrap"
	        justifyContent="space-between"
	        container
	      >
	        <Grid>
	          <div style={{ display: "flex", alignItems: "center" }}>
	            <Button variant="contained" type="submit" disabled={isSubmitting}>
	              Submit
	            </Button>
	            {isSubmitting && (
	              <CircularProgress
	                style={{ marginLeft: "8px" }}
	                size={24}
	                thickness={6}
	              />
	            )}
	          </div>
	        </Grid>
	      </Grid>
	    </Grid>
	  </form>
	);
}

export default Stories