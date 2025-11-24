'use client'

import { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
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

// Content List Item Schema
const contentListItemSchema = object({
  image: pipe(custom<File | null>((value) => {
    if (!value) return true; // allow empty

    const allowed = ["image/png", "image/jpeg", "image/gif"];

    if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF allowed";

    const maxMB = 5;

    if (value.size > maxMB * 1024 * 1024)
      return `Max file size is ${maxMB} MB`;

    return true;
  })),
  heading: string(),
  content: string()
})

// Adventure List Item Schema
const adventureListItemSchema = object({
  title: pipe(string(), nonEmpty('This field is required')),
  feature_image: pipe(custom<File | null>((value) => {
    if (!value) return 'This field is required';

    const allowed = ["image/png", "image/jpeg", "image/gif"];

    if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF allowed";

    const maxMB = 5;

    if (value.size > maxMB * 1024 * 1024)
      return `Max file size is ${maxMB} MB`;

    return true;
  })),
  banner_image: pipe(custom<File | null>((value) => {
    if (!value) return 'This field is required';

    const allowed = ["image/png", "image/jpeg", "image/gif"];

    if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF allowed";

    const maxMB = 5;

    if (value.size > maxMB * 1024 * 1024)
      return `Max file size is ${maxMB} MB`;

    return true;
  })),
  suitable_for: pipe(array(string()), nonEmpty('This field is required')),
  seasons_time: pipe(array(string()), nonEmpty('This field is required')),  
  about_title: pipe(string(), nonEmpty('This field is required')),
  about_content: optional(string()),
  about_button_text: optional(string()),
  about_button_link: optional(string()),
  selected_review: optional(string()),
  content_title: pipe(string(), nonEmpty('This field is required')),
  content_list: array(contentListItemSchema),
  map_image: pipe(custom<File | null>((value) => {
  	if (!value) return true;
    const allowed = ["image/png", "image/jpeg", "image/gif"];

    if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF allowed";

    const maxMB = 5;

    if (value.size > maxMB * 1024 * 1024)
      return `Max file size is ${maxMB} MB`;

    return true;
  })),
})

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
  adventure_posts: array(
    optional(string()),
  ),
  feature_resorts_title: pipe(string(), nonEmpty('This field is required')),
  feature_resorts: array(
    optional(string()),
  ),
  adventure_lists: array(adventureListItemSchema) // New repeater field
})

type ResortProps = {
  pgData: []
  setFormId: () => void
  getFormId: () => void
  adventurePosts: []
  reviews: []
}

const Adventures = ({ pgData, setFormId, getFormId, adventurePosts, reviews }: ResortProps) => {
  const isOnlyPBr = /^<p><br><\/p>$/;
  const router = useRouter()

  const setLoading = useNavigationStore((s) => s.setLoading)

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting , setIsSubmitting ] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [message, setMessage] = useState(null);

  const [adventurePostslist, setadventurePostslist] = useState(adventurePosts??[])
  const [adventurePostslistOptions, setadventurePostslistOptions] = useState<string[]>([])
  const [reviewsOptions, setreviewsOptions] = useState<string[]>([])

  const [resorts, setResorts] = useState(pgData?.resorts?.resorts??[])
  const [resortOptions, setresortOptions] = useState<string[]>([])
  const [advOptions, setadvOptions] = useState<string[]>([])

  const fData = new FormData();

  useEffect(() => {
    const obj = resorts.map(item => ({
      label: item._id,
      value: item.title
    }));

    obj.sort((a, b) => a.value.localeCompare(b.value));

    setresortOptions(obj);
  }, [resorts]);

  useEffect(() => {
    const obj = adventurePosts.map(item => ({
      label: item._id,
      value: item.name
    }));

    obj.sort((a, b) => a.value.localeCompare(b.value));

    setadventurePostslistOptions(obj);
  }, [adventurePosts]);

  useEffect(() => {
    const obj = reviews.map(item => ({
      label: item._id,
      value: `${item.user_first_name} ${item.user_last_name} (${item.user_email})`
    }));

    setreviewsOptions(obj);
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
      adventure_posts: pgData?.adventures?.adventure_posts??[],
      feature_resorts_title: pgData?.adventures?.feature_resorts?.title??'',
      feature_resorts: pgData?.adventures?.feature_resorts?.resorts??[],
      adventure_lists: pgData?.adventures?.adventure_lists?.map(adventure => ({
	      ...adventure,
	      feature_image_preview: adventure.feature_image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${adventure.feature_image}` : '',
        banner_image_preview: adventure.banner_image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${adventure.banner_image}` : '',
	      map_image_preview: adventure.map_image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${adventure.map_image}` : '',
	      content_list: adventure.content_list?.map(contentItem => ({
	        ...contentItem,
	        image_preview: contentItem.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${contentItem.image}` : ''
	      })) || []
	    })) || []
    }
  })

  // Field arrays for the repeaters
  const { fields: adventureListFields, append: appendAdventureList, remove: removeAdventureList } = useFieldArray({
    control,
    name: "adventure_lists"
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
    data.adventure_posts.forEach((resortId, i) => {
      fData.append(`adventures[adventure_posts][${i}]`, resortId);
    })
    fData.append('adventures[feature_resorts][title]', data.feature_resorts_title);
    data.feature_resorts.forEach((resortId, i) => {
      fData.append(`adventures[feature_resorts][resorts][${i}]`, resortId);
    })

    // Append adventure lists data
    data.adventure_lists.forEach((adventure, adventureIndex) => {
      fData.append(`adventures_adventure_lists[${adventureIndex}][title]`, adventure.title);
      
      if (adventure.feature_image instanceof File) {
        fData.append(`adventures_adventure_lists_imgs[${adventureIndex}][feature_image_file]`, adventure.feature_image);
      } else {
        fData.append(`adventures_adventure_lists[${adventureIndex}][feature_image]`, adventure.feature_image);
      }

      if (adventure.banner_image instanceof File) {
        fData.append(`adventures_adventure_lists_imgs[${adventureIndex}][banner_image_file]`, adventure.banner_image);
      } else {
        fData.append(`adventures_adventure_lists[${adventureIndex}][banner_image]`, adventure.banner_image);
      }

      if (adventure.map_image instanceof File) {
        fData.append(`adventures_adventure_lists_imgs[${adventureIndex}][map_image_file]`, adventure.map_image);
      } else {
        fData.append(`adventures_adventure_lists[${adventureIndex}][map_image]`, adventure.map_image);
      }
      
      fData.append(`adventures_adventure_lists[${adventureIndex}][about_title]`, adventure.about_title);

      adventure.suitable_for.forEach((contentItem, contentIndex) => {
        fData.append(`adventures_adventure_lists[${adventureIndex}][suitable_for][${contentIndex}]`, contentItem);
      });

      adventure.seasons_time.forEach((contentItem, contentIndex) => {
        fData.append(`adventures_adventure_lists[${adventureIndex}][seasons_time]`, contentItem);
      });
      
      if (isOnlyPBr.test(adventure.about_content?.trim() || '')) {
        fData.append(`adventures_adventure_lists[${adventureIndex}][about_content]`, '');
      } else {
        fData.append(`adventures_adventure_lists[${adventureIndex}][about_content]`, adventure.about_content || '');
      }
      
      fData.append(`adventures_adventure_lists[${adventureIndex}][about_button_text]`, adventure.about_button_text || '');
      fData.append(`adventures_adventure_lists[${adventureIndex}][about_button_link]`, adventure.about_button_link || '');
      fData.append(`adventures_adventure_lists[${adventureIndex}][selected_review]`, adventure.selected_review || '');
      fData.append(`adventures_adventure_lists[${adventureIndex}][content_title]`, adventure.content_title);

      // Append content list items
      adventure.content_list.forEach((contentItem, contentIndex) => {
        if (contentItem.image instanceof File) {
          fData.append(`adventures_adventure_lists_imgs[${adventureIndex}][content_list][${contentIndex}][image_file]`, contentItem.image);
        } else {
          fData.append(`adventures_adventure_lists[${adventureIndex}][content_list][${contentIndex}][image]`, contentItem.image || '');
        }
        
        fData.append(`adventures_adventure_lists[${adventureIndex}][content_list][${contentIndex}][heading]`, contentItem.heading);
        
        // Handle content field for content list items
        if (isOnlyPBr.test(contentItem.content?.trim() || '')) {
          fData.append(`adventures_adventure_lists[${adventureIndex}][content_list][${contentIndex}][content]`, '');
        } else {
          fData.append(`adventures_adventure_lists[${adventureIndex}][content_list][${contentIndex}][content]`, contentItem.content || '');
        }
      });
    });

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

  // Helper function to handle image changes for nested fields
  const handleImageChange = (adventureIndex: number, contentIndex: number | null, fieldName: string, file: File | null) => {
    if (contentIndex !== null) {
      // For content list images
      const currentContentList = watch(`adventure_lists.${adventureIndex}.content_list`);
      const updatedContentList = [...currentContentList];
      updatedContentList[contentIndex] = {
        ...updatedContentList[contentIndex],
        image: file,
        [`${fieldName}_preview`]: file ? URL.createObjectURL(file) : null
      };
      setValue(`adventure_lists.${adventureIndex}.content_list`, updatedContentList, { shouldDirty: true });
    } else {
      // For adventure list feature images
      setValue(`adventure_lists.${adventureIndex}.${fieldName}`, file, { shouldDirty: true });
      setValue(`adventure_lists.${adventureIndex}.${fieldName}_preview`, file ? URL.createObjectURL(file) : null, { shouldDirty: true });
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

        {/* Adventures Lists*/}
        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
          <h2>Adventures Lists</h2>
        </Grid>

        {/* NEW ADVENTURE LISTS REPEATER SECTION */}
        {adventureListFields.map((field, adventureIndex) => (
          <Grid key={field.id} size={{ md: 12, xs: 12, lg: 12 }} className="border rounded p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>Adventure List {adventureIndex + 1}</Typography>
              <Button 
                color="error" 
                variant="contained"
                size="small"
                onClick={() => removeAdventureList(adventureIndex)}
              >
                <i className="ri-delete-bin-7-line"></i>
              </Button>
            </div>

            <Grid container spacing={3}>
              {/* Feature Image */}
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <div className='flex max-sm:flex-col items-center gap-6'>
                  {watch(`adventure_lists.${adventureIndex}.feature_image_preview`) ? (
                    <img height={80} width={80} className='rounded' src={watch(`adventure_lists.${adventureIndex}.feature_image_preview`) as string} alt='Feature Image' />
                  ) : null}

                  <div className='flex flex-grow flex-col gap-4'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                      <Button component='label' size='small' variant='contained'>
                        Upload Feature Image
                        <input
                          hidden
                          type='file'
                          accept='image/png, image/jpeg, image/gif'
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            const maxSize = 5 * (1024 * 1024);

                            if (file && file.size > maxSize) {
                              toast.error("File is too large. Maximum allowed size is 5MB.")
                              return;
                            }

                            handleImageChange(adventureIndex, null, 'feature_image', file);
                          }}
                        />
                      </Button>
                      <Button size='small' variant='outlined' color='error' onClick={() => {
                        handleImageChange(adventureIndex, null, 'feature_image', null);
                      }}>
                        Reset
                      </Button>
                    </div>
                    <Typography>Allowed JPG, GIF or PNG. Max size of 5MB</Typography>
                    {errors.adventure_lists?.[adventureIndex]?.feature_image && (
                      <Typography color='error.main'>
                        {String(errors.adventure_lists[adventureIndex]?.feature_image?.message)}
                      </Typography>
                    )}
                  </div>
                </div>
              </Grid>

              {/* Feature Image */}
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <div className='flex max-sm:flex-col items-center gap-6'>
                  {watch(`adventure_lists.${adventureIndex}.banner_image_preview`) ? (
                    <img height={80} width={80} className='rounded' src={watch(`adventure_lists.${adventureIndex}.banner_image_preview`) as string} alt='Feature Image' />
                  ) : null}

                  <div className='flex flex-grow flex-col gap-4'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                      <Button component='label' size='small' variant='contained'>
                        Upload Feature Image
                        <input
                          hidden
                          type='file'
                          accept='image/png, image/jpeg, image/gif'
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            const maxSize = 5 * (1024 * 1024);

                            if (file && file.size > maxSize) {
                              toast.error("File is too large. Maximum allowed size is 5MB.")
                              return;
                            }

                            handleImageChange(adventureIndex, null, 'banner_image', file);
                          }}
                        />
                      </Button>
                      <Button size='small' variant='outlined' color='error' onClick={() => {
                        handleImageChange(adventureIndex, null, 'banner_image', null);
                      }}>
                        Reset
                      </Button>
                    </div>
                    <Typography>Allowed JPG, GIF or PNG. Max size of 5MB</Typography>
                    {errors.adventure_lists?.[adventureIndex]?.banner_image && (
                      <Typography color='error.main'>
                        {String(errors.adventure_lists[adventureIndex]?.banner_image?.message)}
                      </Typography>
                    )}
                  </div>
                </div>
              </Grid>

              {/* Title */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} className="mt-3">
                <Controller
                  name={`adventure_lists.${adventureIndex}.title`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Title"
                      variant="outlined"
                      error={!!errors.adventure_lists?.[adventureIndex]?.title}
                      helperText={errors.adventure_lists?.[adventureIndex]?.title?.message}
                    />
                  )}
                />
              </Grid>

              <Divider />

              {/* Suitable For */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                <Controller
                  name={`adventure_lists.${adventureIndex}.suitable_for`}
                  control={control}
                  render={({ field }) => {
                    const value = field.value || [];

                    const toggle = (option) => {
                      if (value.includes(option)) {
                        field.onChange(value.filter((v) => v !== option));
                      } else {
                        field.onChange([...value, option]);
                      }
                    };

                    return (
                      <div>
                        <div style={{ marginBottom: 8 }} component="label">
                          Suitable For
                        </div>

                        {/* HORIZONTAL CHECKBOXES */}
                        <div style={{ display: "flex", gap: 24 }}>
                          {["Solo", "Couple", "Family", "Kids Friendly", "Senior Friendly"].map((option) => (
                            <div
                              key={option}
                              style={{ display: "flex", alignItems: "center", gap: 0 }}
                            >
                              <Checkbox
                                checked={value.includes(option)}
                                onChange={() => toggle(option)}
                              />
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>

                        {errors.adventure_lists?.[adventureIndex]?.suitable_for && (
                          <Typography color="error.main">
                            {String(
                              errors.adventure_lists[adventureIndex]?.suitable_for?.message
                            )}
                          </Typography>
                        )}
                      </div>
                    );
                  }}
                />
              </Grid>

              {/* Season */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} className="mb-3">
                <Controller
                  name={`adventure_lists.${adventureIndex}.seasons_time`}
                  control={control}
                  render={({ field }) => {
                    const value = field.value || [];

                    const toggle = (option) => {
                      if (value.includes(option)) {
                        field.onChange(value.filter((v) => v !== option));
                      } else {
                        field.onChange([...value, option]);
                      }
                    };

                    return (
                      <div>
                        <div style={{ marginBottom: 8 }} component="label">
                          Seasons Time
                        </div>

                        {/* HORIZONTAL CHECKBOXES */}
                        <div style={{ display: "flex", gap: 24 }}>
                          {["Summer", "Winter", "Monsoon", "All Year"].map((option) => (
                            <div
                              key={option}
                              style={{ display: "flex", alignItems: "center", gap: 0 }}
                            >
                              <Checkbox
                                checked={value.includes(option)}
                                onChange={() => toggle(option)}
                              />
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>

                        {errors.adventure_lists?.[adventureIndex]?.seasons_time && (
                          <Typography color="error.main">
                            {String(
                              errors.adventure_lists[adventureIndex]?.seasons_time?.message
                            )}
                          </Typography>
                        )}
                      </div>
                    );
                  }}
                />
              </Grid>

              {/* About Title */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                <Controller
                  name={`adventure_lists.${adventureIndex}.about_title`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="About Title"
                      variant="outlined"
                      error={!!errors.adventure_lists?.[adventureIndex]?.about_title}
                      helperText={errors.adventure_lists?.[adventureIndex]?.about_title?.message}
                    />
                  )}
                />
              </Grid>

              {/* About Content */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                <Typography variant="h6" color="#a3a3a3">
                  About Content
                </Typography>
                <Controller
                  name={`adventure_lists.${adventureIndex}.about_content`}
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      modules={modules}
                      placeholder="Write about content..."
                      style={{ height: "200px", marginBottom: "60px" }}
                    />
                  )}
                />
              </Grid>

              {/* About Button Text & Link */}
              <Grid size={{ md: 6, xs: 12, lg: 6 }} className="mb-3">
                <Controller
                  name={`adventure_lists.${adventureIndex}.about_button_text`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="About Button Text"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>

              <Grid size={{ md: 6, xs: 12, lg: 6 }} className="mb-3">
                <Controller
                  name={`adventure_lists.${adventureIndex}.about_button_link`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="About Button Link"
                      variant="outlined"
                      placeholder="https://example.com"
                    />
                  )}
                />
              </Grid>

              {/* Selected Review */}
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <input
                  type="hidden"
                  {...register(`adventure_lists.${adventureIndex}.selected_review`)}
                />

                <Autocomplete
                  options={reviewsOptions}
                  getOptionLabel={(option) => option.value}
                  value={
                    reviewsOptions.find(
                      (opt) => opt.label === watch(`adventure_lists.${adventureIndex}.selected_review`)
                    ) || null
                  }
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
                      `adventure_lists.${adventureIndex}.selected_review`,
                      newValue ? newValue.label : null,
                      { shouldValidate: true }
                    );
                  }}
                />

              </Grid>

              {/* Content Title */}
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <Controller
                  name={`adventure_lists.${adventureIndex}.content_title`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Content Title"
                      variant="outlined"
                      error={!!errors.adventure_lists?.[adventureIndex]?.content_title}
                      helperText={errors.adventure_lists?.[adventureIndex]?.content_title?.message}
                    />
                  )}
                />
              </Grid>

              {/* Content List Repeater */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                <Typography variant="h6">Content List</Typography>
                
                {/* Content List Fields */}
                {watch(`adventure_lists.${adventureIndex}.content_list`)?.map((contentField, contentIndex) => (
                  <Grid key={contentIndex} container spacing={2} className="border rounded p-3 mb-3">
                    <Grid size={{ md: 12 }}>
                      <div className="flex justify-between items-center">
                        <Typography variant="subtitle1">Content Item {contentIndex + 1}</Typography>
                        <Button 
                          size="small" 
                          color="error"
                          variant="outlined"
                          onClick={() => {
                            const currentContentList = watch(`adventure_lists.${adventureIndex}.content_list`);
                            const updatedContentList = currentContentList.filter((_, idx) => idx !== contentIndex);
                            setValue(`adventure_lists.${adventureIndex}.content_list`, updatedContentList, { shouldDirty: true });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </Grid>

                    {/* Content List Image */}
                    <Grid size={{ md: 6, xs: 12, lg: 6 }}>
			                <div className='flex max-sm:flex-col items-center gap-6'>
			                  {watch(`adventure_lists.${adventureIndex}.content_list.${contentIndex}.image_preview`) ? (
                          <img height={60} width={60} className='rounded' src={watch(`adventure_lists.${adventureIndex}.content_list.${contentIndex}.image_preview`) as string} alt='Content Image' />
                        ) : null}

			                  <div className='flex flex-grow flex-col gap-4'>
			                    <div className='flex flex-col sm:flex-row gap-4'>
			                      <Button component='label' size='small' variant='contained'>
			                        Upload Feature Image
			                        <input
			                          hidden
			                          type='file'
			                          accept='image/png, image/jpeg, image/gif'
			                          onChange={(e) => {
	                                const file = e.target.files?.[0] ?? null;
	                                const maxSize = 5 * (1024 * 1024);

	                                if (file && file.size > maxSize) {
	                                  toast.error("File is too large. Maximum allowed size is 5MB.")
	                                  return;
	                                }

	                                handleImageChange(adventureIndex, contentIndex, 'image', file);
	                              }}
			                        />
			                      </Button>
			                      {watch(`adventure_lists.${adventureIndex}.content_list.${contentIndex}.image`) && (
	                            <Button size='small' variant='outlined' color='error' onClick={() => {
	                              handleImageChange(adventureIndex, contentIndex, 'image', null);
	                            }}>
	                              Reset
	                            </Button>
	                          )}
			                    </div>
			                    <Typography>Allowed JPG, GIF or PNG. Max size of 5MB</Typography>
			                    {errors.adventure_lists?.[adventureIndex]?.content_list?.[contentIndex]?.image && (
			                      <Typography color='error.main'>
			                        {String(errors.adventure_lists[adventureIndex]?.content_list?.[contentIndex]?.image?.message)}
			                      </Typography>
			                    )}
			                  </div>
			                </div>
			              </Grid>

                    {/* Content List Heading & Content */}
                    <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <Controller
                            name={`adventure_lists.${adventureIndex}.content_list.${contentIndex}.heading`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Heading"
                                variant="outlined"
                                size="large"
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <Typography variant="subtitle2" color="#a3a3a3" style={{ marginBottom: "8px" }}>
                            Content
                          </Typography>
                          <Controller
                            name={`adventure_lists.${adventureIndex}.content_list.${contentIndex}.content`}
                            control={control}
                            render={({ field }) => (
                              <ReactQuill
                                theme="snow"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                modules={modules}
                                placeholder="Write content..."
                                style={{ height: "200px", marginBottom: "60px" }}
                              />
                            )}
                          />
                        </Grid>
                  </Grid>
                ))}

                {/* Add Content List Item Button */}
                <Button
                  variant="outlined"
                  onClick={() => {
                    const currentContentList = watch(`adventure_lists.${adventureIndex}.content_list`) || [];
                    setValue(`adventure_lists.${adventureIndex}.content_list`, [
                      ...currentContentList,
                      { image: null, heading: '', content: '' }
                    ], { shouldDirty: true });
                  }}
                >
                  Add Content Item
                </Button>
              </Grid>

              {/* Map Image */}
              <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                <div className='flex max-sm:flex-col items-center gap-6'>
                  {watch(`adventure_lists.${adventureIndex}.map_image_preview`) ? (
                    <img height={80} width={80} className='rounded' src={watch(`adventure_lists.${adventureIndex}.map_image_preview`) as string} alt='Feature Image' />
                  ) : null}

                  <div className='flex flex-grow flex-col gap-4'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                      <Button component='label' size='small' variant='contained'>
                        Upload Feature Image
                        <input
                          hidden
                          type='file'
                          accept='image/png, image/jpeg, image/gif'
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            const maxSize = 5 * (1024 * 1024);

                            if (file && file.size > maxSize) {
                              toast.error("File is too large. Maximum allowed size is 5MB.")
                              return;
                            }

                            handleImageChange(adventureIndex, null, 'map_image', file);
                          }}
                        />
                      </Button>
                      <Button size='small' variant='outlined' color='error' onClick={() => {
                        handleImageChange(adventureIndex, null, 'map_image', null);
                      }}>
                        Reset
                      </Button>
                    </div>
                    <Typography>Allowed JPG, GIF or PNG. Max size of 5MB</Typography>
                    {errors.adventure_lists?.[adventureIndex]?.map_image && (
                      <Typography color='error.main'>
                        {String(errors.adventure_lists[adventureIndex]?.map_image?.message)}
                      </Typography>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        ))}

				<Grid size={{ md: 12, xs: 12, lg: 12 }}>
          <div className="flex justify-between items-center">
            <Button
              variant="contained"
              onClick={() => appendAdventureList({
                title: '',
                feature_image: null,
                about_title: '',
                about_content: '',
                about_button_text: '',
                about_button_link: '',
                selected_review: '',
                content_title: '',
                content_list: [],
                map_image: null,
              })}
            >
              Add Adventure List
            </Button>
          </div>
        </Grid>
        <Divider />

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