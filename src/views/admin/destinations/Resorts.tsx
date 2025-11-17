'use client'

import { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import CircularProgress from '@mui/material/CircularProgress';
import { Autocomplete } from "@mui/material";

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

import 'react-quill-new/dist/quill.snow.css';

type FileProp = {
  name: string
  type: string
  size: number
}

/*import type { Editor } from '@tiptap/react'

const TipTapEditor = dynamic(() => import('@/components/TipTap'), { ssr: false })*/

import { toast } from 'react-toastify';

import { Controller, useForm, useFieldArray } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, custom, string, pipe, nonEmpty, array, optional } from 'valibot'
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

type ResortProps = {
	pgData: []
	destinations: []
	setFormId: () => void
	getFormId: () => void
	adventurePosts: []
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
  resort_title: pipe(string()),
  resorts: array(
    object({
    	title: pipe(string(), nonEmpty('This field is required')),
    	content: pipe(custom<string | null>((value) => {
    		if (!value || value == "<p><br></p>") return false;

    		return true;
    	}, 'This field is required')),
    	location: pipe(string(), nonEmpty('This field is required')),
      image: pipe(custom<File | null>((value) => {
      	if (!value) return 'This field is required'; // allow empty

        const allowed = ["image/png", "image/jpeg", "image/gif"];

        if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF allowed";

        const maxMB = 5;

        if (value.size > maxMB * 1024 * 1024)

          return `Max file size is ${maxMB} MB`;

        return true;
      })),
      idtxt: optional(string()),
      _preview: optional(string()),
    })
  ),
  adventure_posts: array(
    optional(string()),
  ),
  feature_destination_title: pipe(string(), nonEmpty('This field is required')),
  feature_destinations: array(
    optional(string()),
  )
})

const Resorts = ({ pgData, destinations, setFormId, getFormId, adventurePosts }: ResortProps) => {
	const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

	const [errorState, setErrorState] = useState<ErrorType | null>(null)
	const [isSubmitting , setIsSubmitting ] = useState(false)
	const [editor, setEditor] = useState<Editor | null>(null)
	const [message, setMessage] = useState(null);
	const [fileInput, setFileInput] = useState('');

	const [adventurePostslist, setadventurePostslist] = useState(adventurePosts??[])
  const [adventurePostslistOptions, setadventurePostslistOptions] = useState<string[]>([])

	const [destOptions, setdestOptions] = useState<string[]>([])

	const [destID, setdestID] = useState(getFormId());

  useEffect(() => {
    const obj = destinations?.map(item => ({
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

    setadventurePostslistOptions(obj);
  }, [adventurePosts]);

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
		  banner_image: pgData?.resorts?.banner_image??'',
		  banner_image_preview: (pgData?.resorts?.banner_image) ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${pgData?.resorts?.banner_image}` : '',
		  about_title: pgData?.resorts?.about_title??'',
		  about_content: pgData?.resorts?.about_content??'',
		  about_button_text: pgData?.resorts?.button_text??'',
		  about_button_link: pgData?.resorts?.button_link??'',
		  resort_title: pgData?.resort_title??'',
		  resorts: pgData?.resorts?.resorts?.map(section => ({
        title: section.title ?? '',
        content: section.content ?? '',
        image: section.image ?? null,
        location: section.location ?? '',
        _preview: section._preview ?? '',
        idtxt: section._id ?? '',
      })) ?? [{title: '', content: '', image: null, location: '', _preview : '', idtxt : ''}],
		  adventure_posts: pgData?.resorts?.adventure_posts??[],
		  feature_destination_title: pgData?.resorts?.feature_destinations_title??'',
		  feature_destinations: pgData?.resorts?.feature_destinations??[],
		}
	})

	const { fields, append, remove } = useFieldArray({
    control,
    name: "resorts",
  });

	const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
		const isOnlyPBr = /^<p><br><\/p>$/;
		const id = getFormId();

		// Overview tab content
    if (data.banner_image instanceof File) {
    	fData.append('banner_image_file', data.banner_image);
    }else{
    	fData.append('resorts[banner_image]', pgData?.resorts?.banner_image);
    }
    fData.append('resorts[about_title]', data.about_title);
    fData.append('adventures[about_title]', data.about_title);
    if (isOnlyPBr.test(data.about_content.trim())) {
		  fData.append('resorts[about_content]', '');
		} else {
		  fData.append('resorts[about_content]', data.about_content);
		}
    fData.append('resorts[button_text]', data.about_button_text);
    fData.append('resorts[button_link]', data.about_button_link);
    fData.append('resorts[feature_destinations_title]', data.feature_destination_title);
    data.feature_destinations.forEach((dest_id, i) => {
			fData.append(`resorts[feature_destinations][${i}]`, dest_id);
		})

    fData.append('resorts[resort_title]', data.resort_title);
    data.resorts.forEach((section, i) => {
		  fData.append(`resorts_sections[${i}][title]`, section.title)
		  fData.append(`resorts_sections[${i}][content]`, section.content)
		  fData.append(`resorts_sections[${i}][location]`, section.location)
		  fData.append(`resorts_sections[${i}][idtxt]`, section.idtxt)
		  if (section.image) {
		    fData.append(`resorts_sections[${i}][image]`, section.image)
		  }
		});

		data.adventure_posts.forEach((resortId, i) => {
      fData.append(`resorts[adventure_posts][${i}]`, resortId);
    })

		setIsSubmitting(true)

    const log = await updateDestination(id, fData);
    if (log && log._id) {
      toast.success('Resort tab data updated successfully.')
      setIsSubmitting(false)
    } else {
      if(log.errors) {
        toast.error(log.errors.message)
      }
      
      setIsSubmitting(false)
    }
	}

	return (
		<form
      noValidate
      action={() => {}}
      autoComplete='off'
      onSubmit={handleSubmit(onUpdate)}
    >
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
			<Grid size={{ md: 12, xs: 12, lg: 12 }} style={{ marginBottom: "30px" }}>
			  <Typography variant='h6' color='#a3a3a3'>Content</Typography>
			  <Controller
			    name='about_content'
			    control={control}
			    render={({ field }) => (
			      <ReactQuill
              theme="snow"
              value={field.value ?? ''}
          		onChange={field.onChange}
          		onReady={(editorInstance) => setEditor(editorInstance)}
              modules={modules}
              placeholder="Write something amazing..."
              style={{ height: "300px" }}
            />
			    )}
			  />
			  {errors.about_content && (
			    <p className="text-red-500 text-sm mt-10">{errors.about_content.message}</p>
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
			<Divider />

			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
			  <h2>Resorts</h2>
			</Grid>

			<Grid size={{ md: 6, xs: 12, lg: 6 }}>
			  <Controller
			    name='resort_title'
			    control={control}
			    rules={{ required: true }}
			    render={({ field }) => (
			      <TextField
			        {...field}
			        fullWidth
			        label='Heading'
			        variant='outlined'
			        placeholder='Heading'
			        className='mbe-1'
			        onChange={e => {
			          field.onChange(e.target.value)
			          errorState !== null && setErrorState(null)
			        }}
			        {...((errors.resort_title || errorState !== null) && {
			          error: true,
			          helperText: errors?.resort_title?.message || errorState?.message[0]
			        })}
			      />
			    )}
			  />
			</Grid>
			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
        {fields.map((field, index) => (
          <div key={field.id} spacing={5}>
            <Grid container spacing={6}>
              <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                <div className='flex max-sm:flex-col items-center gap-6'>
                  {watch(`resorts.${index}._preview`) ? (
                    <img height={100} width={100} className='rounded' src={watch(`resorts.${index}._preview`) as string} alt='Section Image' />
                    ) : null}

                  {destID && field.image && (
                  	<img height={100} width={100} className='rounded' src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${field.image}`} alt='Section Image' />
                  	) }
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
                            const prev = (watch(`resorts.${index}._preview`) as string | null) || null;
                            
                            if (prev) URL.revokeObjectURL(prev);
                            setValue(`resorts.${index}._preview`, url, { shouldDirty: true });
                            setValue(`resorts.${index}.image`, file, { shouldDirty: true });
                          }}
                          id={`section_image_${index}`}
                        />
                      </Button>
                      <Button size='small' variant='outlined' color='error' onClick={(e) => {
                        setValue(`resorts.${index}.image`, null, { shouldDirty: true });
                        setValue(`resorts.${index}._preview`, null, { shouldDirty: true });
                      }}>
                        Reset
                      </Button>
                    </div>
                    <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                    {errors.resorts?.[index]?.image && (<Typography color='error.main'>{String(errors.resorts[index]?.image?.message)}</Typography>)}
                  </div>
                </div>
              </Grid>

              <Grid size={{ md: 6, xs: 12, sm: 12, lg: 6 }}>
                <FormControl fullWidth>
                  <Controller
                    name={`resorts.${index}.title`}
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
								        onChange={e => {
								          field.onChange(e.target.value)
								          errorState !== null && setErrorState(null)
								        }}
								        {...((errors.resorts?.[index]?.title || errorState !== null) && {
								          error: true,
								          helperText: errors.resorts?.[index]?.title?.message || errorState?.message[0]
								        })}
								      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ md: 6, xs: 12, sm: 12, lg: 6 }}>
                <FormControl fullWidth>
                  <Controller
                    name={`resorts.${index}.location`}
                    control={control}
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
								        {...((errors.resorts?.[index]?.location || errorState !== null) && {
								          error: true,
								          helperText: errors.resorts?.[index]?.location?.message || errorState?.message[0]
								        })}
								      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ md: 12, xs: 12, lg: 12 }} style={{ marginBottom: "30px" }}>
                <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                <Controller
                  name={`resorts.${index}.content`}
                  control={control}
                  rules={{ 
                  	validate: (value) =>
            					value && value !== "<p><br></p>" || "This field is required" 
            			}}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value ?? ''}
                  		onChange={field.onChange}
                  		onReady={(editorInstance) => setEditor(editorInstance)}
                      modules={modules}
                      placeholder="Write something amazing..."
                      style={{ height: "300px" }}
                    />
                  )}
                />
                {errors.resorts?.[index]?.content && (
                  <p className='text-red-500 text-sm mt-10'>
                    {errors.resorts[index]?.content?.message}
                  </p>
                )}
              </Grid>
                <Controller
                  name={`resorts.${index}.idtxt`}
                  control={control}
                  render={({ field }) => (
                    <input
							        {...field}
							        type='hidden'
							      />
                  )}
                />
              <Divider />

              <Grid size={{ md: 6, xs: 2, sm: 2 }}>
                { fields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => append({content: '', image: null})} color='secondary' size='large' variant="contained" startIcon={<i className='ri-add-line' />} >
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

			<Grid container spacing={5} className="my-5">  
  			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
  			  <h2>Adventure Posts</h2>
  			</Grid>

  			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
          <input type="hidden" {...register("adventure_posts")} />
            <Autocomplete
              multiple
              options={adventurePostslistOptions}
              getOptionLabel={(option) => option.value} 
              value={adventurePostslistOptions.filter(opt =>
                (watch("adventure_posts") || []).includes(opt.label)
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.label}> 
                  {option.value}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Search Adventure Post" variant="outlined" />
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

			{/* Feature Destinations */}
			<Grid container spacing={5} className="my-5">  
			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
			  <h2>Feature Destinations</h2>
			</Grid>

			<Grid size={{ md: 6, xs: 12, lg: 6 }}>
			  <Controller
			    name='feature_destination_title'
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
			        {...((errors.feature_destination_title || errorState !== null) && {
			          error: true,
			          helperText: errors?.feature_destination_title?.message || errorState?.message[0]
			        })}
			      />
			    )}
			  />
			</Grid>
			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
			  <input type="hidden" {...register("feature_destinations")} />
			  <Autocomplete
			    multiple
			    options={destOptions}
			    getOptionLabel={(option) => option.value} 
			    value={destOptions.filter(opt =>
			      (watch("feature_destinations") || []).includes(opt.label)
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
			        "feature_destinations",
			        newValue.map((item) => item.label), // array of values
			        { shouldValidate: true }
			      );
			    }}
			  />
			</Grid>
			</Grid>
			<Divider />

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
	)
}

export default Resorts