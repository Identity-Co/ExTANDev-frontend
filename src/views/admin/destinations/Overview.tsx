'use client'

import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress';
import { Autocomplete } from "@mui/material";
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

import 'react-quill-new/dist/quill.snow.css';

// Third-party Imports
import { useDropzone } from 'react-dropzone'

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

import IconButton from '@mui/material/IconButton'

import CustomIconButton from '@core/components/mui/IconButton'

import { useNavigationStore } from '@/libs/navigation-store'

// import { updatePageInfo } from '@/app/server/pages'

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
  title: pipe(string(), nonEmpty('This field is required')),
  sub_title: pipe(string(), nonEmpty('This field is required')),
  about_title: pipe(string(), nonEmpty('This field is required')),
  about_content: pipe(string(), nonEmpty('This field is required')),
  about_button_text: optional(string()),
  about_button_link: pipe(string()),
  about_sections: array(
    object({
    	content: pipe(string(), nonEmpty('This field is required')),
    	direction: pipe(string(), nonEmpty('This field is required')),
      image: optional(custom<File | null>((value) => {
      	if (!value) return 'This field is required'; // allow empty

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
  quick_facts: array(
  	object({
	  	label: pipe(string(), nonEmpty('This field is required')),
	  	content: pipe(string(), nonEmpty('This field is required'))
	  })
  ),
  feature_resorts_title: pipe(string(), nonEmpty('This field is required')),
  feature_resorts: array(
    optional(string()),
  ),
  faqs: array(
  	object({
	  	question: pipe(string(), nonEmpty('This field is required')),
	  	answer: pipe(string(), nonEmpty('This field is required'))
	  })
  ),
  subscribe_title: pipe(string(), nonEmpty('This field is required')),
  subscribe_sub_title: pipe(string()),
  subscribe_button_text: optional(string()),
  subscribe_button_link: pipe(string()),
  share_title: pipe(string(), nonEmpty('This field is required')),
  share_sub_title: pipe(string()),
  share_button_text: optional(string()),
  share_button_link: pipe(string()),
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

const Overview = ({ pgData }: { pgData?: []; destinations?: []; }) => {
	const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

	const [errorState, setErrorState] = useState<ErrorType | null>(null)
	const [isSubmitting , setIsSubmitting ] = useState(false)
	const [editor, setEditor] = useState<Editor | null>(null)
	const [message, setMessage] = useState(null);
	const [fileInput, setFileInput] = useState('');
	const [imgSrc, setImgSrc] = useState<string>(pgData?.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${pgData?.image}` : '/images/avatars/1.png')
	const [imageInput, setImageInput] = useState<File | null>(null)

	const [resortOptions, setresortOptions] = useState<string[]>([])

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
		  title: pgData?.title??'',
		  sub_title: pgData?.sub_title??'',
		  about_title: pgData?.about_title??'',
		  about_content: pgData?.about_content??'',
		  about_button_text: pgData?.about_button_text??'',
		  about_button_link: pgData?.about_button_link??'',
		  about_sections: pgData?.about_sections?.map(section => ({
        content: section.content ?? '',
        image: section.image ?? null,
        direction: section.direction ?? '',
        _preview: section._preview ?? '',
      })) ?? [{content: '', image: null, direction: '', _preview : ''}],
      quick_facts: pgData?.quick_facts?.map(fact => ({
        label: fact.content ?? '',
        content: fact.image ?? null,
      })) ?? [{label: '', content: ''}],
		  feature_resorts_title: pgData?.feature_resorts_title??'',
		  feature_resorts: pgData?.feature_resorts??[],
		  faqs: pgData?.faqs?.map(faq => ({
        question: faq.question ?? '',
        answer: faq.answer ?? null,
      })) ?? [{question: '', answer: ''}],
		  subscribe_title: pgData?.subscribe_title??'',
		  subscribe_sub_title: pgData?.subscribe_sub_title??'',
		  subscribe_button_text: pgData?.subscribe_button_text??'',
		  subscribe_button_link: pgData?.subscribe_button_link??'',
		  share_title: pgData?.share_title??'',
		  share_sub_title: pgData?.share_sub_title??'',
		  share_button_text: pgData?.share_button_text??'',
		  share_button_link: pgData?.share_button_link??'',
		  field_note_title: pgData?.field_note_title??'',
		  field_notes: pgData?.field_notes??[],
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

	console.log(errors)

	const { fields: secFields, append: appendSec, remove: removeSec } = useFieldArray({
    control,
    name: "about_sections",
  });

  const { fields: factFields, append: appendFact, remove: removeFact } = useFieldArray({
    control,
    name: "quick_facts",
  });

  const { fields: faqFields, append: appendFAQ, remove: removeFAQ } = useFieldArray({
    control,
    name: "faqs",
  });

	const handleFileInputChange = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement

    const file2 = files?.[0];

    if (!file2) return;

    const maxSize = 800 * 1024; // 800 KB

    if (file2.size > maxSize) {
      toast.error("File is too large. Maximum allowed size is 800KB.")

      return;
    }

    const reader = new FileReader()

    setImageInput(file2); 
    setMessage('');

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setFileInput(reader.result as string)
      }
    }
  }

  const handleFileInputReset = () => {
    setFileInput('')
    setImgSrc('/images/avatars/1.png')
  }

	const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
		console.log(data);
	    
	  // image: data.,
    /*overview: data.,
    resorts:data.,
    adventures:data.,
    stories:data.,*/

		const fdata = {
			'title': data.title,
	    'sub_title': data.sub_title,
	    'overview': {
	    	'about_title': data.about_title,
				'about_content': data.about_content,
		    'button_text': data.about_button_text,
		    'button_link': data.about_button_link,
		    'slider_images': [],
		    'facts': data.faqs,
		    'feature_resorts': {
		    	'title': '',
    			'resorts': [],
		    }
	    },
	    'meta_description': data.meta_description,
	    'meta_keywords': data.meta_keywords,
	    'meta_title': data.meta_title,
	    'page_url': data.page_url,
	    'author': data.author,
	    'publisher': data.publisher,
	    'copyright': data.copyright,
	    'rating': data.rating,
	    'revisit_after': data.revisit_after,
	    'robots': data.robots,
	    'classification': data.classification,
	    'share_button_link': data.share_button_link,
	    'share_button_text': data.share_button_text,
	    'share_sub_title':data.share_sub_title,
	    'share_title': data.share_title,
	    'subscribe_button_link': data.subscribe_button_link,
	    'subscribe_button_text': data.subscribe_button_text,
	    'subscribe_sub_title': data.subscribe_sub_title,
	    'subscribe_title': data.subscribe_title,
		}
		
		/*if (!imageInput && (pgData?.image == '' || pgData?.image === undefined)) {
      setMessage('This field is required.');
      return;
    }

    setIsSubmitting(true)

    const log = await updatePageInfo('Our Destination', { 'name': 'Our Destination', ...data });
 
    if (log && log._id) {
      toast.success('Page updated successfully.')
      setIsSubmitting(false)
    } else {
      if(log.errors) {
        toast.error(log.errors.message)
      }
      
      setIsSubmitting(false)
    }*/
	}

  	// Hooks
	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles: File[]) => {
		  setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
		}
	})

	const renderFilePreview = (file: FileProp) => {
		if (file.type.startsWith('image')) {
		  return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
		} else {
		  return <i className='ri-file-text-line' />
		}
	}

	const handleRemoveFile = (file: FileProp) => {
		const uploadedFiles = files
		const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)

		setFiles([...filtered])
	}

	const fileList = files.map((file: FileProp) => (
	    <ListItem key={file.name}>
	      <div className='file-details'>
	        <div className='file-preview'>{renderFilePreview(file)}</div>
	        <div>
	          <Typography className='file-name'>{file.name}</Typography>
	          <Typography className='file-size' variant='body2'>
	            {Math.round(file.size / 100) / 10 > 1000
	              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
	              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
	          </Typography>
	        </div>
	      </div>
	      <IconButton onClick={() => handleRemoveFile(file)}>
	        <i className='ri-close-line text-xl' />
	      </IconButton>
	    </ListItem>
	))

	const handleRemoveAllFiles = () => {
  	setFiles([])
	}

	return (
		<form
      noValidate
      action={() => {}}
      autoComplete='off'
      onSubmit={handleSubmit(onUpdate)}
    >
    	{/* Destination fields */}
			<Grid container spacing={5} className="my-5"> 
				<Grid size={{ md: 12, xs: 12, lg: 12 }}>
          <div className='flex max-sm:flex-col items-center gap-6'>
            <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
            <div className='flex flex-grow flex-col gap-4'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Button component='label' size='small' variant='contained' htmlFor='dest-image'>
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    value={fileInput}
                    accept='image/png, image/jpeg'
                    onChange={handleFileInputChange}
                    id='dest-image'
                  />
                </Button>
                <Button size='small' variant='outlined' color='error' onClick={handleFileInputReset}>
                  Reset
                </Button>
              </div>
              <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
              <Typography color='error.main'>{message}</Typography>
            </div>
          </div>
        </Grid>

				<Grid size={{ md: 6, xs: 12, lg: 6 }}>
				  <Controller
				    name='title'
				    control={control}
				    rules={{ required: true }}
				    render={({ field }) => (
				      <TextField
				        {...field}
				        fullWidth
				        type='text'
				        label='Destination Title'
				        variant='outlined'
				        placeholder='Destination Title'
				        className='mbe-1'
				        onChange={e => {
				          field.onChange(e.target.value)
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
				<Grid size={{ md: 6, xs: 12, lg: 6 }}>
				  <Controller
				    name='sub_title'
				    control={control}
				    rules={{ required: true }}
				    render={({ field }) => (
				      <TextField
				        {...field}
				        fullWidth
				        type='text'
				        label='Sub Title'
				        variant='outlined'
				        placeholder='Sub Title'
				        className='mbe-1'
				        onChange={e => {
				          field.onChange(e.target.value)
				          errorState !== null && setErrorState(null)
				        }}
				        {...((errors.sub_title || errorState !== null) && {
				          error: true,
				          helperText: errors?.sub_title?.message || errorState?.message[0]
				        })}
				      />
				    )}
				  />
				</Grid>
			</Grid>

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
			<Grid size={{ md: 12, xs: 12, lg: 12 }} style={{ marginBottom: "30px" }}>
			  <Typography variant='h6' color='#a3a3a3'>Content</Typography>
	      {/*<TipTapEditor
	        value={field.value ?? ''}
	        onChange={field.onChange}
	        onReady={(editorInstance) => setEditor(editorInstance)}
	      />*/}
			  <Controller
			    name='about_content'
			    control={control}
			    rules={{ required: true }}
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
			    <p className="text-red-500 text-sm mt-1">{errors.about_content.message}</p>
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
			  <h2>Image with content</h2>
			</Grid>
			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
        {secFields.map((field, index) => (
          <div key={field.id} spacing={5}>
            <Grid container spacing={6}>
              <Grid size={{ md: 6, xs: 6, lg: 6 }}>
                <div className='flex max-sm:flex-col items-center gap-6'>
                  {watch(`about_sections.${index}._preview`) ? (
                    <img height={100} width={100} className='rounded' src={watch(`about_sections.${index}._preview`) as string} alt='Section Image' />
                    ) : null}
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
                            const prev = (watch(`about_sections.${index}._preview`) as string | null) || null;
                            
                            if (prev) URL.revokeObjectURL(prev);
                            setValue(`about_sections.${index}._preview`, url, { shouldDirty: true });
                            setValue(`about_sections.${index}.image`, file, { shouldDirty: true });
                          }}
                          id={`section_image_${index}`}
                        />
                      </Button>
                      <Button size='small' variant='outlined' color='error' onClick={(e) => {
                        setValue(`about_sections.${index}.image`, null, { shouldDirty: true });
                        setValue(`about_sections.${index}._preview`, null, { shouldDirty: true });
                      }}>
                        Reset
                      </Button>
                    </div>
                    <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                    {errors.about_sections?.[index]?.image && (<Typography color='error.main'>{String(errors.about_sections[index]?.image?.message)}</Typography>)}
                  </div>
                </div>
              </Grid>

              <Grid size={{ md: 6, xs: 12, sm: 12, lg: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id={`section_direction_${index}`} error={!!errors.about_sections?.[index]?.direction}>
                    Direction
                  </InputLabel>
                  <Controller
                    name={`about_sections.${index}.direction`}
                    control={control}
                    render={({ field }) => (
                      <Select label='Direction' {...field} error={!!errors.about_sections?.[index]?.direction}>
                        <MenuItem value=''>- Direction -</MenuItem>
                        <MenuItem value='image_first'>Image First</MenuItem>
                        <MenuItem value='content_first'>Content First</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.about_sections?.[index]?.direction && (
                    <FormHelperText error>
                      {errors.about_sections[index]?.direction?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ md: 12, xs: 12, lg: 12 }} style={{ marginBottom: "30px" }}>
                <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                {/*<TipTapEditor
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onReady={(editorInstance) => setEditor(editorInstance)}
                />*/}
                <Controller
                  name={`about_sections.${index}.content`}
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
                {errors.about_sections?.[index]?.content && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.about_sections[index]?.content?.message}
                  </p>
                )}
              </Grid>
              <Divider />

              <Grid size={{ md: 6, xs: 2, sm: 2 }}>
                { secFields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => appendSec({content: '', image: null})} color='secondary' size='large' variant="contained" startIcon={<i className='ri-add-line' />} >
                  Add More
                </Button>) : null }

                {index > 0 ? 
                  (<CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => removeSec(index)}>
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

			{/* Slider Images */}
			<Grid container spacing={5} className="my-5">  
				<Grid size={{ md: 12, xs: 12, lg: 12 }}>
				  <h2>Slider Images</h2>
				</Grid>

				<Grid size={{ md:12, xs: 12, lg: 12}}>
					<div {...getRootProps({ className: 'dropzone' })}>
				        <input {...getInputProps()} />
				        <div className='flex items-center flex-col'>
				          <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
				            <i className='ri-upload-2-line' />
				          </Avatar>
				          <Typography variant='h4' className='mbe-2.5'>
				            Drop files here or click to upload.
				          </Typography>
				          <Typography color='text.secondary'>
				            Drop files here or click{' '}
				            <Link href={'/'} onClick={e => e.preventDefault()} className='text-textPrimary no-underline'>
				              browse
				            </Link>{' '}
				            thorough your machine
				          </Typography>
				        </div>
				      </div>
				      {files.length ? (
				        <>
				          <List>{fileList}</List>
				          <div className='buttons'>
				            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
				              Remove All
				            </Button>
				            <Button variant='contained'>Upload Files</Button>
				          </div>
				        </>
			      	) : null}
				</Grid>
			</Grid>
			<Divider />

			{/* Quick Facts */}
			<Grid container spacing={5} className="my-5">  
				<Grid size={{ md: 12, xs: 12, lg: 12 }}>
				  <h2>Quick Facts</h2>
				</Grid>

				<Grid size={{ md: 12, xs: 12, lg: 12 }}>
					{factFields.map((field, index) => (
	          <div key={`fact_${field.id}`} spacing={5}>
	            <Grid container spacing={6}>
	            	<Grid size={{ md: 5, xs: 12, lg: 5 }}>
                  <Controller
                    name={`quick_facts.${index}.label`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Label'
                        variant='outlined'
                        placeholder='Enter Label'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.quick_facts?.[index]?.label || errorState !== null) && {
                          error: true,
                          helperText: errors.quick_facts[index]?.label?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name={`quick_facts.${index}.content`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Content'
                        variant='outlined'
                        placeholder='Enter Content'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.quick_facts?.[index]?.content || errorState !== null) && {
                          error: true,
                          helperText: errors.quick_facts[index]?.content?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ md: 1, xs: 12, lg: 1 }}>
                  {index > 0 ? 
                    (<CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => removeFact(index)}>
                    <i className="ri-delete-bin-7-line"></i>
                  	</CustomIconButton>) 
                  : null }                  
                </Grid>

                <Grid size={{ md: 12, xs: 12, sm: 12 }}>
                  { factFields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => appendFact({label: '', content: ''})} color='secondary' size='large' variant="contained" startIcon={<i className='ri-add-line' />} >
                    Add More
                  </Button>) : null }
                </Grid>
	            </Grid>
	          </div>
	        ))}
	      </Grid>
			</Grid>
			<Divider />

			{/* Adventure Posts Section */}
			<Grid container spacing={5} className="my-5">  
			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
			  <h2>Adventure Posts</h2>
			</Grid>

			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
			  <br />
			</Grid>
			</Grid>
			<Divider />

			{/* Feature Resorts */}
			<Grid container spacing={5} className="my-5">  
			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
			  <h2>Feature Resorts</h2>
			</Grid>

			<Grid size={{ md: 6, xs: 12, lg: 6 }}>
			  <Controller
			    name='feature_resorts_title'
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
			        {...((errors.feature_resorts_title || errorState !== null) && {
			          error: true,
			          helperText: errors?.feature_resorts_title?.message || errorState?.message[0]
			        })}
			      />
			    )}
			  />
			</Grid>
			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
			  <input type="hidden" {...register("feature_resorts")} />
			  <Autocomplete
			    multiple
			    options={resortOptions}
			    getOptionLabel={(option) => option.value} 
			    value={resortOptions.filter(opt =>
			      (watch("feature_resorts") || []).includes(opt.label)
			    )}
			    renderOption={(props, option) => (
			      <li {...props} key={option.label}> 
			        {option.value}
			      </li>
			    )}
			    renderInput={(params) => (
			      <TextField {...params} label="Search Resort" variant="outlined" />
			    )}
			    onChange={(event, newValue) => {
			      setValue(
			        "feature_resorts",
			        newValue.map((item) => item.label), // array of values
			        { shouldValidate: true }
			      );
			    }}
			  />
			</Grid>
			</Grid>
			<Divider />

			{/* FAQ */}
			<Grid container spacing={5} className="my-5">  
				<Grid size={{ md: 12, xs: 12, lg: 12 }}>
				  <h2>FAQ</h2>
				</Grid>

				<Grid size={{ md: 12, xs: 12, lg: 12 }}>
					{faqFields.map((field, index) => (
	          <div key={`faq_${field.id}`} spacing={5}>
	            <Grid container spacing={6}>
	            	<Grid size={{ md: 11, xs: 12, lg: 11 }}>
                  <Controller
                    name={`faqs.${index}.question`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Question'
                        variant='outlined'
                        placeholder='Question'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.faqs?.[index]?.question || errorState !== null) && {
                          error: true,
                          helperText: errors.faqs[index]?.question?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ md: 1, xs: 12, lg: 1 }}>
                  {index > 0 ? 
                    (<CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => removeFAQ(index)}>
                    <i className="ri-delete-bin-7-line"></i>
                  	</CustomIconButton>) 
                  : null }                  
                </Grid>

                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Controller
                    name={`faqs.${index}.answer`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        type='text'
                        label='Answer'
                        variant='outlined'
                        placeholder='Answer'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.faqs?.[index]?.answer || errorState !== null) && {
                          error: true,
                          helperText: errors.faqs[index]?.answer?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ md: 12, xs: 12, sm: 12 }}>
                  { faqFields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => appendFAQ({question: '', answer: ''})} color='secondary' size='large' variant="contained" startIcon={<i className='ri-add-line' />} >
                    Add More
                  </Button>) : null }
                </Grid>
	            </Grid>
	          </div>
	        ))}
	      </Grid>
			</Grid>
			<Divider />

			{/* Insta Feeds Section */}
			<Grid container spacing={5} className="my-5">  
			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
			  <h2>Insta Feeds</h2>
			</Grid>

			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
			  <br />
			</Grid>
			</Grid>
			<Divider />

			{/* Subscribe OR Share */}
			<Grid container spacing={5} className="my-5">  
			<Grid size={{ md: 12, xs: 12, lg: 12 }}>
			  <h2>Subscribe</h2>
			</Grid>

			<Grid container spacing={5}>  
			  <Grid size={{ md: 12, xs: 12, lg: 12 }}>
			    <Controller
			      name='subscribe_title'
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
			          {...((errors.subscribe_title || errorState !== null) && {
			            error: true,
			            helperText: errors?.subscribe_title?.message || errorState?.message[0]
			          })}
			        />
			      )}
			    />
			  </Grid>
			  <Grid size={{ md: 12, xs: 12, lg: 12 }}>
			    <Controller
			      name='subscribe_sub_title'
			      control={control}
			      rules={{ required: true }}
			      render={({ field }) => (
			        <TextField
			          {...field}
			          fullWidth
			          multiline
			          rows={2}
			          type='text'
			          label='Sub Title'
			          variant='outlined'
			          placeholder='Enter Sub Title'
			          className='mbe-1'
			          onChange={e => {
			            field.onChange(e.target.value)
			            errorState !== null && setErrorState(null)
			          }}
			          {...((errors.subscribe_sub_title || errorState !== null) && {
			            error: true,
			            helperText: errors?.subscribe_sub_title?.message || errorState?.message[0]
			          })}
			        />
			      )}
			    />
			  </Grid>
			  <Grid size={{ md: 6, xs: 12, lg: 6 }}>
			    <Controller
			      name='subscribe_button_text'
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
			          {...((errors.subscribe_button_text || errorState !== null) && {
			            error: true,
			            helperText: errors?.subscribe_button_text?.message || errorState?.message[0]
			          })}
			        />
			      )}
			    />
			  </Grid>
			  <Grid size={{ md: 6, xs: 12, lg: 6 }}>
			    <Controller
			      name='subscribe_button_link'
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
			          {...((errors.subscribe_button_link || errorState !== null) && {
			            error: true,
			            helperText: errors?.subscribe_button_link?.message || errorState?.message[0]
			          })}
			        />
			      )}
			    />
			  </Grid>
			  <Divider />
			  <Grid size={{ md: 12, xs: 12, lg: 12 }}>
			    <h2>Share</h2>
			  </Grid>
			  <Grid size={{ md: 12, xs: 12, lg: 12 }}>
			    <Controller
			      name='share_title'
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
			          {...((errors.share_title || errorState !== null) && {
			            error: true,
			            helperText: errors?.share_title?.message || errorState?.message[0]
			          })}
			        />
			      )}
			    />
			  </Grid>
			  <Grid size={{ md: 12, xs: 12, lg: 12 }}>
			    <Controller
			      name='share_sub_title'
			      control={control}
			      rules={{ required: true }}
			      render={({ field }) => (
			        <TextField
			          {...field}
			          fullWidth
			          multiline
			          rows={2}
			          type='text'
			          label='Sub Title'
			          variant='outlined'
			          placeholder='Enter Sub Title'
			          className='mbe-1'
			          onChange={e => {
			            field.onChange(e.target.value)
			            errorState !== null && setErrorState(null)
			          }}
			          {...((errors.share_sub_title || errorState !== null) && {
			            error: true,
			            helperText: errors?.share_sub_title?.message || errorState?.message[0]
			          })}
			        />
			      )}
			    />
			  </Grid>
			  <Grid size={{ md: 6, xs: 12, lg: 6 }}>
			    <Controller
			      name='share_button_text'
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
			          {...((errors.share_button_text || errorState !== null) && {
			            error: true,
			            helperText: errors?.share_button_text?.message || errorState?.message[0]
			          })}
			        />
			      )}
			    />
			  </Grid>
			  <Grid size={{ md: 6, xs: 12, lg: 6 }}>
			    <Controller
			      name='share_button_link'
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
			          {...((errors.share_button_link || errorState !== null) && {
			            error: true,
			            helperText: errors?.share_button_link?.message || errorState?.message[0]
			          })}
			        />
			      )}
			    />
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

export default Overview