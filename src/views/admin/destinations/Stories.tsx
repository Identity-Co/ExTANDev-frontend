'use client'

import { useState } from 'react'

import dynamic from 'next/dynamic'

import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

import 'react-quill-new/dist/quill.snow.css';

type FileProp = {
  name: string
  type: string
  size: number
}

/*import type { Editor } from '@tiptap/react'

const TipTapEditor = dynamic(() => import('@/components/TipTap'), { ssr: false })*/

import { Controller, useForm, useFieldArray } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, custom, string, pipe, nonEmpty, optional } from 'valibot'
import type { InferInput } from 'valibot'

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
  about_title: pipe(string(), nonEmpty('This field is required')),
  about_content: pipe(custom<string | null>((value) => {
		if (!value || value == "<p><br></p>") return false;

		return true;
	}, 'This field is required')),
  about_button_text: optional(string()),
  about_button_link: pipe(string()),
})

const Stories = ({ pgData }: { pgData?: []; destinations?: []; }) => {
	const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

	const [errorState, setErrorState] = useState<ErrorType | null>(null)
	const [isSubmitting , setIsSubmitting ] = useState(false)
	const [editor, setEditor] = useState<Editor | null>(null)
	const [message, setMessage] = useState(null);
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
		  about_title: pgData?.about_title??'',
		  about_content: pgData?.about_content??'',
		  about_button_text: pgData?.about_button_text??'',
		  about_button_link: pgData?.about_button_link??'',
		}
	})

	const { fields, append, remove } = useFieldArray({
    control,
    name: "resorts",
  });

	const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
		console.log(data);
		
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

	return (
	  <form noValidate autoComplete="off" onSubmit={handleSubmit(onUpdate)}>
	    {/* About Us fields*/}
	    <Grid container spacing={5} className="my-5">
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
	          rules={{
	            validate: (val) =>
	              val && val !== "<p><br></p>" || "Content is required",
	          }}
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