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
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from "@mui/material/Autocomplete";

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

import 'react-quill-new/dist/quill.snow.css';

import { toast } from 'react-toastify';

/*import type { Editor } from '@tiptap/react'

const TipTapEditor = dynamic(() => import('@/components/TipTap'), { ssr: false })*/

import { Controller, useForm, useFieldArray } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, custom, string, pipe, nonEmpty, array, optional } from 'valibot'
import type { InferInput } from 'valibot'

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
  about_button_link: optional(string()),
  adventure_list: array(
    optional(string()),
  ),
  adventure_posts: array(
    optional(string()),
  ),
  feature_resorts_title: pipe(string(), nonEmpty('This field is required')),
  feature_resorts: array(
    optional(string()),
  )
})

type ResortProps = {
	pgData: []
	setFormId: () => void
	getFormId: () => void
}

const Adventures = ({ pgData, setFormId, getFormId }: ResortProps) => {
	const isOnlyPBr = /^<p><br><\/p>$/;
	const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

	const [errorState, setErrorState] = useState<ErrorType | null>(null)
	const [isSubmitting , setIsSubmitting ] = useState(false)
	const [editor, setEditor] = useState<Editor | null>(null)
	const [message, setMessage] = useState(null);

	const [resorts, setResorts] = useState(pgData?.resorts?.resorts??[])
	const [resortOptions, setresortOptions] = useState<string[]>([])
	const [advOptions, setadvOptions] = useState<string[]>([])

	const fData = new FormData();

	useEffect(() => {
    const obj = resorts.map(item => ({
      label: item._id,
      value: item.title
    }));

    setresortOptions(obj);
  }, [resorts]);

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
			banner_image: pgData?.adventures?.banner_image??'',
			banner_image_preview: (pgData?.adventures?.banner_image) ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${pgData?.adventures?.banner_image}` : '',
		  about_title: pgData?.adventures?.about_title??'',
		  about_content: pgData?.adventures?.about_content??'',
		  about_button_text: pgData?.adventures?.button_text??'',
		  about_button_link: pgData?.adventures?.button_link??'',
		  adventure_list: pgData?.adventures?.adventures??[],
		  adventure_posts: pgData?.adventures?.adventure_posts??[],
		  feature_resorts_title: pgData?.adventures?.feature_resorts?.title??'',
		  feature_resorts: pgData?.adventures?.feature_resorts?.resorts??[],
		}
	})

	const { fields, append, remove } = useFieldArray({
    control,
    name: "resorts",
  });

	const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
		const id = getFormId();
		
    setIsSubmitting(true)

    if (data.banner_image instanceof File) {
    	fData.append('banner_image_file', data.banner_image);
    }else{
    	fData.append('adventures[banner_image]', pgData?.adventures?.banner_image);
    }
    fData.append('adventures[about_title]', data.about_title);
    if (isOnlyPBr.test(data.about_content.trim())) {
		  fData.append('adventures[about_content]', '');
		} else {
		  fData.append('adventures[about_content]', data.about_content);
		}
    fData.append('adventures[button_text]', data.about_button_text);
    fData.append('adventures[button_link]', data.about_button_link);
    fData.append('adventures[adventures]', data.adventure_list);
    fData.append('adventures[adventures]', data.adventure_list);
    fData.append('adventures[adventure_posts]', data.adventure_posts);
    fData.append('adventures[feature_resorts][title]', data.feature_resorts_title);
    // fData.append('adventures[feature_resorts]', data.feature_resorts);
    data.feature_resorts.forEach((resortId, i) => {
			fData.append(`adventures[feature_resorts][resorts][${i}]`, resortId);
		})

    const dataArray = Array.from(fData.entries());

    const log = await updateDestination(id, fData);

    if (log && log._id) {
      toast.success('Adventure tab data updated successfully.')
      setIsSubmitting(false)
    } else {
      if(log.errors) {
        toast.error(log.errors.message)
      }
      
      setIsSubmitting(false)
    }
	}

	return (
	  <form noValidate autoComplete="off" onSubmit={handleSubmit(onUpdate)}>

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
			    name='about_title'
			    control={control}
          rules={{ required: "This field is required" }}
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

	      {/* Adventures */}
	      <Grid size={{ md: 12, xs: 12, lg: 12 }}>
	        <h2>Adventures</h2>
	      </Grid>

	      <Grid size={{ md: 12, xs: 12, lg: 12 }}>
	        <Controller
	          name="adventure_list"
	          control={control}
	          render={({ field }) => (
	            <Autocomplete
	              multiple
	              options={advOptions}
	              getOptionLabel={(option) => option.value}
	              value={advOptions.filter((opt) =>
	                (field.value || []).includes(opt.value)
	              )}
	              renderOption={(props, option) => (
	                <li {...props} key={option.value}>
	                  {option.value}
	                </li>
	              )}
	              renderInput={(params) => (
	                <TextField {...params} label="Search Adventure" />
	              )}
	              onChange={(_, newValue) =>
	                field.onChange(newValue.map((item) => item.value))
	              }
	            />
	          )}
	        />
	      </Grid>

	      <Divider />

	      {/* Stories Section */}
				<Grid size={{ md: 12, xs: 12, lg: 12 }}>
				  <h2>Stories</h2>
				</Grid>

				<Grid size={{ md: 12, xs: 12, lg: 12 }}>
				  <br />
				</Grid>
				<Divider />

	      {/* Feature Resorts */}
	      <Grid size={{ md: 12, xs: 12, lg: 12 }}>
	        <h2>Feature Resorts</h2>
	      </Grid>

	      <Grid size={{ md: 6, xs: 12, lg: 6 }}>
	        <Controller
	          name="feature_resorts_title"
	          control={control}
	          rules={{ required: true }}
	          render={({ field }) => (
	            <TextField
	              {...field}
	              fullWidth
	              type="text"
	              label="Title"
	              variant="outlined"
	              placeholder="Enter Title"
	              error={!!errors.feature_resorts_title}
	              helperText={errors.feature_resorts_title?.message}
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
				      <TextField {...params} label="Search Destination" variant="outlined" />
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

export default Adventures