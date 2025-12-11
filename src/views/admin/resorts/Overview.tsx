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
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress';

import CustomIconButton from '@core/components/mui/IconButton'

import { toast } from 'react-toastify';

import { Controller, useForm, useFieldArray } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, optional, custom, array, any } from 'valibot'
import type { InferInput } from 'valibot'

import { useNavigationStore } from '@/libs/navigation-store'

import { createResort, updateResort } from '@/app/server/resorts'

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
  name: pipe(string(), nonEmpty('This field is required')),
  resort_image: optional(custom<File | null>((value) => {
    if (!value) return 'This field is required';

    const allowed = ["image/png", "image/jpeg", "image/gif"];

    if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF allowed";

    const maxMB = 2;

    if (value.size > maxMB * 1024 * 1024)

      return `Max file size is ${maxMB} MB`;

    return true;
  })),
  resort_image_preview: optional(string()),
  location: optional(string()),
  country: pipe(string(), nonEmpty('This field is required')),
  short_description: optional(string()),
  tags: array(string()),
  booking_url: optional(string()),
  booking_url_date_format:  optional(string()),
  banners: array(
    object({
      content: optional(string()),
      image: pipe(custom<File | null>((value) => {
        if (!value) return 'This field is required';

        const allowed = ["image/png", "image/jpeg", "image/gif"];

        if (!allowed.includes(value.type)) return "Only PNG/JPG/GIF allowed";

        const maxMB = 2;

        if (value.size > maxMB * 1024 * 1024)

          return `Max file size is ${maxMB} MB`;

        return true;
      })),
      _preview: optional(string()),
    })
  ),
  about_title: pipe(string(), nonEmpty('This field is required')),
  about_content: optional(string()),
  about_button_text: optional(string()),
  about_button_link: pipe(string()),
  property_highlights: array(
    object({
      title: pipe(string(), nonEmpty('This field is required')),
      description: optional(string()),
      image: pipe(custom<File | null>((value) => {
        if (!value) return 'This field is required';

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
  slider_images: optional(array(any())),
  slider_images_gpreview: optional(array(any())),
  map_latitude: optional(string()),
  map_longitude: optional(string()),
  map_content_box: array(
    object({
      title: pipe(string(), nonEmpty('This field is required')),
      content: optional(string()),
    })
  ),
  map_info_box: array(
    object({
      title: pipe(string(), nonEmpty('This field is required')),
      content: optional(string()),
    })
  ),
  adventure_posts: array(
    optional(string()),
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

const AddResorts = ({ pgData, adventurePosts, getFormId }: { pgData?: []; adventurePosts?: []; getFormId?: void }) => {  
  const router = useRouter()

  let form_id = getFormId();

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting , setIsSubmitting ] = useState(false)

  const [adventurePostslistOptions, setadventurePostslistOptions] = useState<string[]>([])

  useEffect(() => {
    const obj = adventurePosts.map(item => ({
      label: item._id,
      value: item.name
    }));

    obj.sort((a, b) => a.value.localeCompare(b.value));

    setadventurePostslistOptions(obj);
  }, [adventurePosts]);

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
      name: pgData?.name?? '',
      resort_image: pgData?.image?? '',
      resort_image_preview: pgData?.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${pgData?.image}` : '',
      short_description: pgData?.short_description?? '',
      location: pgData?.location?? '',
      country: pgData?.country?? '',
      booking_url: pgData?.booking_url?? '',
      booking_url_date_format: pgData?.booking_url_date_format?? '',
      tags: pgData?.tags?? [],
      banners: (pgData?.overview?.banners && Array.isArray(pgData.overview.banners) && pgData.overview.banners.length > 0) 
        ? pgData.overview.banners.map((section: any) => ({
            content: section.content ?? '',
            image: section.image || null,
            _preview: section.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${section.image}` : '',
          }))
        : [{ content: '', image: null, _preview: '' }],
      about_title: pgData?.overview?.about_title??'',
      about_content: pgData?.overview?.about_content??'',
      about_button_text: pgData?.overview?.about_button_text??'',
      about_button_link: pgData?.overview?.about_button_link??'',
      property_highlights: (pgData?.overview?.property_highlights && Array.isArray(pgData.overview.property_highlights) && pgData.overview.property_highlights.length > 0) 
        ? pgData.overview.property_highlights.map((section: any) => ({
            title: section.title || '',
            description: section.description ?? '',
            image: section.image || null,
            _preview: section.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${section.image}` : '',
          }))
        : [{ title: '', description: '', image: null, _preview: '' }],
      slider_images: pgData?.overview?.slider_images?? [],
      slider_images_gpreview: (pgData?.overview?.slider_images ?? []).map(img => `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${img}`),
      map_latitude: pgData?.overview?.map?.map_latitude?? '',
      map_longitude: pgData?.overview?.map?.map_longitude?? '',
      map_content_box: (pgData?.overview?.map?.content_boxes && Array.isArray(pgData.overview.map.content_boxes) && pgData.overview.map.content_boxes.length > 0) 
        ? pgData.overview.map.content_boxes.map((section: any) => ({
            title: section.title ?? '',
            content: section.content ?? '',
          }))
        : [{ title: '', content: ''}],
      map_info_box: (pgData?.overview?.map?.info_boxes && Array.isArray(pgData.overview.map.info_boxes) && pgData.overview.map.info_boxes.length > 0) 
        ? pgData.overview.map.info_boxes.map((section: any) => ({
            title: section.title ?? '',
            content: section.content ?? '',
          }))
        : [{ title: '', content: ''}],
      adventure_posts: pgData?.overview?.adventure_posts?? '',
      subscribe_title: pgData?.subscribe_title??'',
      subscribe_sub_title: pgData?.subscribe_sub_title??'',
      subscribe_button_text: pgData?.subscribe_button_text??'',
      subscribe_button_link: pgData?.subscribe_button_link??'',
      share_title: pgData?.share_title??'',
      share_sub_title: pgData?.share_sub_title??'',
      share_button_text: pgData?.share_button_text??'',
      share_button_link: pgData?.share_button_link??'',
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

  const { fields: bannersFields, append: appendbannersFields, remove: removebannersFields } = useFieldArray({
    control,
    name: "banners",
  });

  const { fields: propertyHighlightsFields, append: appendPropertyHighlightsFields, remove: removePropertyHighlightsFields } = useFieldArray({
    control,
    name: "property_highlights",
  });

  const { fields: mapContentBoxFields, append: appendmapContentBoxFields, remove: removemapContentBoxFields } = useFieldArray({
    control,
    name: "map_content_box",
  });

  const { fields: mapInfoBoxFields, append: appendmapInfoBoxFields, remove: removemapInfoBoxFields } = useFieldArray({
    control,
    name: "map_info_box",
  });

  const TagsInput = ({ value, onChange }: TagsInputProps) => {
    const [inputValue, setInputValue] = useState('')

    const handleAddTag = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && inputValue.trim()) {
        event.preventDefault()
        const newTag = inputValue.trim()
        if (newTag && !value.includes(newTag)) {
          onChange([...value, newTag])
        }
        setInputValue('')
      }
    }

    const handleDeleteTag = (tagToDelete: string) => {
      onChange(value.filter(tag => tag !== tagToDelete))
    }

    return (
      <Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add tags and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddTag}
          size="medium"
          id='resort_tags'
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {value.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
              size="small"
              color="primary"
              variant="outlined"
              style={{marginBottom: "5px"}}
            />
          ))}
        </Box>
      </Box>
    )
  }

  const handleDragStart = (imageIndex: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ imageIndex }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetImageIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { imageIndex: sourceImageIndex } = draggedData;
      
      const currentPreviews = watch('slider_images_gpreview') || [];
      
      // Move item from source to target position
      const moveItem = (arr: any[]) => {
        const newArr = [...arr];
        const [movedItem] = newArr.splice(sourceImageIndex, 1);
        newArr.splice(targetImageIndex, 0, movedItem);
        return newArr;
      };
      
      setValue('slider_images_gpreview', moveItem(currentPreviews), { shouldDirty: true });
      
      // If you also have files array, update it too
      const currentFiles = watch('slider_images') || [];
      if (currentFiles.length > 0) {
        setValue('slider_images', moveItem(currentFiles), { shouldDirty: true });
      }
    } catch (error) {
      console.error('Drag and drop error:', error);
    }
  };

  const handleRemoveGalleryImage = (imageIndex: number) => {
    const currentPreviews = watch('slider_images_gpreview') || [];
    const currentFiles = watch('slider_images') || [];
    
    // Only revoke the specific URL being removed
    URL.revokeObjectURL(currentPreviews[imageIndex]);
    
    const newPreviews = currentPreviews.filter((_, i) => i !== imageIndex);
    const newFiles = currentFiles.filter((_, i) => i !== imageIndex);
    
    setValue('slider_images_gpreview', newPreviews, { shouldDirty: true });
    setValue('slider_images', newFiles, { shouldDirty: true });
  };

  const generateSlug = text => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')   // remove invalid chars
      .replace(/\s+/g, '-')           // replace spaces with -
      .replace(/-+/g, '-')            // remove multiple -
  }

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)

    const formData = new FormData();

    // Basic fields
    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("country", data.country);
    formData.append("booking_url", data.booking_url);
    formData.append("booking_url_date_format", data.booking_url_date_format);
    formData.append("short_description", data.short_description);

    formData.append("tags", JSON.stringify(data.tags?? []));

    // Other basic fields...
    formData.append("subscribe_title", data.subscribe_title);
    formData.append("subscribe_sub_title", data.subscribe_sub_title);
    formData.append("subscribe_button_text", data.subscribe_button_text);
    formData.append("subscribe_button_link", data.subscribe_button_link);
    formData.append("share_title", data.share_title);
    formData.append("share_sub_title", data.share_sub_title);
    formData.append("share_button_text", data.share_button_text);
    formData.append("share_button_link", data.share_button_link);

    formData.append("page_url", data.page_url);
    formData.append("meta_title", data.meta_title);
    formData.append("meta_description", data.meta_description);
    formData.append("meta_keywords", data.meta_keywords);
    formData.append("robots", data.robots);
    formData.append("author", data.author);
    formData.append("publisher", data.publisher);
    formData.append("copyright", data.copyright);
    formData.append("revisit_after", data.revisit_after);
    formData.append("classification", data.classification);
    formData.append("rating", data.rating);

    // Overview fields
    formData.append("overview[about_title]", data.about_title);
    formData.append("overview[about_content]", data.about_content);
    formData.append("overview[about_button_text]", data.about_button_text);
    formData.append("overview[about_button_link]", data.about_button_link);
    
    formData.append("overview[map][map_latitude]", data.map_latitude);
    formData.append("overview[map][map_longitude]", data.map_longitude);

    formData.append("overview[map][content_boxes]", JSON.stringify(data.map_content_box?? []));
    formData.append("overview[map][info_boxes]", JSON.stringify(data.map_info_box?? []));
    formData.append("overview[adventure_posts]", JSON.stringify(data.adventure_posts?? []));

    if (data.resort_image instanceof File){
      formData.append("resort_image", data.resort_image);
    }else if(data.resort_image){
      formData.append("image", data.resort_image);
    }

    data.banners.forEach((section, i) => {
      formData.append(`overview_banners[${i}][content]`, section.content)
      if (section.image) {
        formData.append(`overview_banners[${i}][image]`, section.image)
      }
    });

    data.property_highlights.forEach((section, i) => {
      formData.append(`overview_property_highlights[${i}][title]`, section.title)
      formData.append(`overview_property_highlights[${i}][description]`, section.description)
      if (section.image) {
        formData.append(`overview_property_highlights[${i}][image]`, section.image)
      }
    });

    data.slider_images.forEach((section, i) => {
      if (section) {
        formData.append(`overview_slider_images[${i}]`, section)
      }
    });

    let log = null;
    if(form_id === null) {
      log = await createResort(formData);
      router.replace(`/admin/resorts/edit/${log._id}`)
    } else {
      log = await updateResort(form_id, formData);
    }

    if (log && log._id) {
      if(form_id === null) {
        toast.success('Resort created successfully.')
      }else{
        toast.success('Overview tab updated successfully.')
      }
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
        <Grid size={{ xs: 12, md: 12, lg: 12, }}>
          <Card className="mb-2">
            <CardHeader title="General Data" />
            <Divider />

            <CardContent className='mbe-5'>
              <Grid container spacing={5} className="my-5">
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Name'
                        variant='outlined'
                        placeholder='Enter Name'
                        className='mbe-1'
                        id='resort_name'
                        onChange={e => {
                          field.onChange(e.target.value)
                          if(form_id === null) {
                            const slug = generateSlug(e.target.value)
                            setValue('page_url', slug)
                          }
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
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <div className='flex max-sm:flex-col items-center gap-6 flex-wrap'>
                    {watch('resort_image_preview') ? (
                      <img height={100} width={100} className='rounded' src={watch('resort_image_preview')} alt='Resort Image' />
                    ) : null}
                    <div className='flex flex-grow flex-col gap-4'>
                      <div className='flex flex-col sm:flex-row gap-4'>
                        <Button component='label' size='small' variant='contained' htmlFor='resort_image'>
                          Upload Resort Image
                          <input
                            hidden
                            required
                            type='file'
                            accept='image/png, image/jpeg, image/svg+xml'
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;

                              const maxSize = 800 * 1024;

                              if (file.size > maxSize) {
                                toast.error("File is too large. Maximum allowed size is 800KB.")

                                return;
                              }

                              const url = file ? URL.createObjectURL(file) : null;
                              const prev = (watch('resort_image_preview') as string | null) || null;
                              
                              if (prev) URL.revokeObjectURL(prev);
                              setValue('resort_image_preview', url, { shouldDirty: true });
                              setValue('resort_image', file, { shouldDirty: true });
                            }}
                            id='resort_image'
                          />
                        </Button>
                        <Button size='small' variant='outlined' color='error' onClick={(e) => {
                            setValue('resort_image_preview', null, { shouldDirty: true });
                            setValue('resort_image', null, { shouldDirty: true });
                          }}>
                            Reset
                        </Button>
                      </div>
                      <Typography>Allowed JPG, GIF, SVG or PNG. Max size of 800K</Typography>
                      {errors.resort_image && (
                        <Typography color="error.main">
                          {String(errors.resort_image.message)}
                        </Typography>
                      )}
                    </div>
                  </div>
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='location'
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Location'
                        variant='outlined'
                        placeholder='Enter Location'
                        className='mbe-1'
                        id='resort_location'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.location || errorState !== null) && {
                          error: true,
                          helperText: errors?.location?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='country'
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Country'
                        variant='outlined'
                        placeholder='Enter Country'
                        className='mbe-1'
                        id='resort_country'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.country || errorState !== null) && {
                          error: true,
                          helperText: errors?.country?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Typography variant='h6' color='#a3a3a3'>Short Description</Typography>
                  <Controller
                    name='short_description'
                    control={control}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        modules={modules}
                        placeholder="Write something amazing..."
                        style={{ height: "100px", marginBottom: "60px" }}
                      />
                    )}
                  />
                  {errors.short_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.short_description.message}</p>
                  )}
                </Grid>  
                <Grid size={{ md: 6, xs: 12, lg: 6 }} className="mb-5">
                  <Typography variant="h6" component="h6" color="primary" className="mb-2">Tags</Typography>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <TagsInput
                        value={field.value || []}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.tags && (
                    <Typography color="error.main" variant="caption">
                      {errors.tags.message}
                    </Typography>
                  )}
                </Grid>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Controller
                    name='booking_url'
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <>
                        <TextField
                          {...field}
                          fullWidth
                          type='text'
                          label='Booking URL'
                          variant='outlined'
                          placeholder='Enter Booking URL'
                          className='mbe-1'
                          id='resort_booking_url'
                          onChange={e => {
                            field.onChange(e.target.value);
                            errorState !== null && setErrorState(null);
                          }}
                          {...((errors.booking_url || errorState !== null) && {
                            error: true,
                            helperText: errors?.booking_url?.message || errorState?.message[0],
                          })}
                        />
                        
                        {/* Description or additional helper text below */}
                        <FormHelperText>
                          <span style={{display: "block", marginBottom: "10px"}}>Use placeholders for dates and guest, Available placeholders(DTCHECKIN, DTCHECKOUT, DTGUESTS). Example:</span>
                          • Example 1: <code>https://example.com/booking?DateIn={"DTCHECKIN"}&DateOut={"DTCHECKOUT"}&guest={"DTGUESTS"}</code><br />
                          • Example 2: <code>https://example.com/booking?checkin={"DTCHECKIN"}&checkout={"DTCHECKOUT"}&adult={"DTGUESTS"}</code>
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid><Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <Controller
                    name='booking_url_date_format'
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <>
                        <TextField
                          {...field}
                          fullWidth
                          type='text'
                          label='Booking URL Date Format'
                          variant='outlined'
                          placeholder='Enter Booking URL Date Format'
                          className='mbe-1'
                          id='resort_booking_url_date_format'
                          onChange={e => {
                            field.onChange(e.target.value);
                            errorState !== null && setErrorState(null);
                          }}
                          {...((errors.booking_url_date_format || errorState !== null) && {
                            error: true,
                            helperText: errors?.booking_url_date_format?.message || errorState?.message[0],
                          })}
                        />
                        
                        {/* Description or additional helper text below */}
                        <FormHelperText>
                          For example YYYY/MM/DD, YYYY-MM-DD, MM/DD/YYYY, MM-DD-YYYY, DD/MM/YYYY, DD-MM-YYYY etc...
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card className="mt-2">
            <CardHeader title='Overview Tab' />
            <Divider />

            <CardContent className='mbe-5'>
              {/* Banner Section */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px;'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Banners</h3>
              </Grid>
              <Grid container spacing={5}>  
                <Grid size={{ xs: 12 }} className='flex gap-4 mt-5 flex-wrap' justifyContent="space-between" container>
                  <Grid size={{ xs:12 }}>
                    <Grid container spacing={5}>
                      {bannersFields.map((field, index) => (
                        <div key={field.id} spacing={4} className="border rounded p-4 mb-2" style={{width: '100%'}}>
                          <div className="flex justify-between items-center mb-4">
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>Banner Slide {index + 1}</Typography>
                            {index > 0 ? 
                              (<CustomIconButton aria-label='capture screenshot' color='error' size='medium' onClick={() => removebannersFields(index)}>
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
                            { bannersFields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => appendbannersFields({content: '', image: null})} color='secondary' size='small' variant="contained" startIcon={<i className='ri-add-line' />} >
                              Add Banner
                            </Button>) : null }               
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
                        label='Title'
                        variant='outlined'
                        placeholder='Enter Title'
                        className='mbe-1'
                        id='overview_about_title'
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
                <Grid size={{ md: 12, xs: 12, lg: 12 }} style={{ marginBottom: "30px" }}>
                  <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                  <Controller
                    name='about_content'
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
              </Grid>

              {/* Property Highlights*/}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Property Highlights</h3>
              </Grid>
              <Grid container spacing={5}>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  {propertyHighlightsFields.map((field, index) => (
                    <div key={field.id} spacing={5} className="border rounded p-4 mb-2">
                      <div className="flex justify-between items-center mb-4">
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>Property {index + 1}</Typography>
                        {index > 0 ? 
                          (<CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => removePropertyHighlightsFields(index)}>
                          <i className="ri-delete-bin-7-line"></i>
                        </CustomIconButton>) 
                        : null }       
                      </div>
                      <Grid container spacing={6}>
                        <Grid size={{ md: 6, xs: 6, lg: 6 }}>
                          <div className='flex max-sm:flex-col items-center gap-6'>
                            {watch(`property_highlights.${index}._preview`) ? (
                              <img height={100} width={100} className='rounded' src={watch(`property_highlights.${index}._preview`) as string} alt='Section Image' />
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

                                      const maxSize = 800 * 1024;

                                      if (file && file.size > maxSize) {
                                        toast.error("File is too large. Maximum allowed size is 800KB.")

                                        return;
                                      }

                                      const url = file ? URL.createObjectURL(file) : null;
                                      const prev = (watch(`property_highlights.${index}._preview`) as string | null) || null;
                                      
                                      if (prev) URL.revokeObjectURL(prev);
                                      setValue(`property_highlights.${index}._preview`, url, { shouldDirty: true });
                                      setValue(`property_highlights.${index}.image`, file, { shouldDirty: true });
                                    }}
                                    id={`section_image_${index}`}
                                  />
                                </Button>
                                <Button size='small' variant='outlined' color='error' onClick={(e) => {
                                  setValue(`property_highlights.${index}.image`, null, { shouldDirty: true });
                                  setValue(`property_highlights.${index}._preview`, null, { shouldDirty: true });
                                }}>
                                  Reset
                                </Button>
                              </div>
                              <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                              {errors.property_highlights?.[index]?.image && (<Typography color='error.main'>{String(errors.property_highlights[index]?.image?.message)}</Typography>)}
                            </div>
                          </div>
                        </Grid>
                        <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                          <Controller
                            name={`property_highlights.${index}.title`}
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
                                id={`property_highlights.${index}.title`}
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errorState !== null) && {
                                  error: true,
                                  helperText: errors?.property_highlights[index]?.title?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <Controller
                            name={`property_highlights.${index}.description`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                rows={3}
                                multiline
                                type='text'
                                label='Description'
                                variant='outlined'
                                placeholder='Enter Description'
                                className='mbe-0'
                                id={`property_highlights.${index}.description`}
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errorState !== null) && {
                                  error: true,
                                  helperText: errors?.property_highlights[index]?.description?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ md: 6, xs: 2, sm: 2 }}>
                          { propertyHighlightsFields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => appendPropertyHighlightsFields({title: '', description: '', image: null})} color='secondary' size='small' variant="contained" startIcon={<i className='ri-add-line' />} >
                            Add Property
                          </Button>) : null }              
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                </Grid>
              </Grid>

              {/* Slider Images */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Slider Section</h3>
              </Grid>
              <Grid container spacing={5}>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                    <div className='flex max-sm:flex-col items-center gap-6'>
                      <div className='flex flex-grow flex-col gap-4'>
                        <div className='flex flex-col sm:flex-row gap-4'>
                          <Button component='label' size='small' variant='contained' htmlFor='slider_images'>
                            Upload Slider Images
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
                                const existingUrls = watch(`slider_images_gpreview`) || [];
                                
                                setValue(`slider_images_gpreview`, [...existingUrls, ...newPreviewUrls], { shouldDirty: true });
                                
                                const existingFiles = watch(`slider_images`) || [];
                                setValue(`slider_images`, [...existingFiles, ...validFiles], { shouldDirty: true });
                              }}
                              id='slider_images'
                            />
                          </Button>
                          <Button size='small' variant='outlined' color='error' onClick={(e) => {
                            // Revoke ALL preview URLs when resetting
                            const previews = watch(`slider_images_gpreview`) || [];
                            previews.forEach((url) => URL.revokeObjectURL(url));
                            
                            setValue(`slider_images`, [], { shouldDirty: true });
                            setValue(`slider_images_gpreview`, [], { shouldDirty: true });
                          }}>
                            Reset All
                          </Button>
                        </div>
                        <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
                        
                        {/* Image Preview Grid with Remove and Reorder Functionality */}
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <div className='flex max-sm:flex-col items-center gap-6'>
                            {watch(`slider_images_gpreview`)?.map((previewUrl, imageIndex) => (
                              <div key={imageIndex} 
                                   className="relative group"
                                   draggable onDragStart={handleDragStart(imageIndex)}
                                   onDragOver={handleDragOver}
                                   onDrop={handleDrop(imageIndex)}>
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
                                  onClick={() => handleRemoveGalleryImage(imageIndex)}
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

                      </div>
                    </div>
                  </Grid>
              </Grid>

              {/* Map Section */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Map Section</h3>
              </Grid>
              <Grid container spacing={5}>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='map_latitude'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Latitude'
                        variant='outlined'
                        id='overview_map_latitude'
                        placeholder='Enter Latitude'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.map_latitude || errorState !== null) && {
                          error: true,
                          helperText: errors?.map_latitude?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6, xs: 12, lg: 6 }}>
                  <Controller
                    name='map_longitude'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Longitude'
                        variant='outlined'
                        id='overview_map_longitude'
                        placeholder='Enter Longitude'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.map_longitude || errorState !== null) && {
                          error: true,
                          helperText: errors?.map_longitude?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  {mapContentBoxFields.map((field, index) => (
                    <div key={field.id} spacing={5} className="border rounded p-4 mb-2">
                      <div className="flex justify-between items-center mb-4">
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>Content Box {index + 1}</Typography>
                        {index > 0 ? 
                          (<CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => removemapContentBoxFields(index)}>
                          <i className="ri-delete-bin-7-line"></i>
                        </CustomIconButton>) 
                        : null }       
                      </div>
                      <Grid container spacing={6}>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <Controller
                            name={`map_content_box.${index}.title`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='text'
                                label='Title'
                                variant='outlined'
                                placeholder='Enter title'
                                className='mbe-0'
                                id={`map_content_box.${index}.title`}
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errorState !== null) && {
                                  error: true,
                                  helperText: errors?.map_content_box[index]?.title?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                            <Controller
                              name={`map_content_box.${index}.content`}
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
                            {errors.map_content_box?.[index]?.content && (
                              <p className="text-red-500 text-sm mt-1">{errors.map_content_box?.[index]?.content.message}</p>
                            )}
                        </Grid>

                        <Grid size={{ md: 6, xs: 2, sm: 2 }}>
                          { mapContentBoxFields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => appendmapContentBoxFields({title: '', content: null})} color='secondary' size='small' variant="contained" startIcon={<i className='ri-add-line' />} >
                            Add Content Box
                          </Button>) : null }              
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                </Grid>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  {mapInfoBoxFields.map((field, index) => (
                    <div key={field.id} spacing={5} className="border rounded p-4 mb-2">
                      <div className="flex justify-between items-center mb-4">
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>Info Box {index + 1}</Typography>
                        {index > 0 ? 
                          (<CustomIconButton aria-label='capture screenshot' color='error' size='large' onClick={() => removemapInfoBoxFields(index)}>
                          <i className="ri-delete-bin-7-line"></i>
                        </CustomIconButton>) 
                        : null }       
                      </div>
                      <Grid container spacing={6}>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <Controller
                            name={`map_info_box.${index}.title`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                type='text'
                                label='Title'
                                variant='outlined'
                                placeholder='Enter title'
                                className='mbe-0'
                                id={`map_info_box.${index}.title`}
                                onChange={e => {
                                  field.onChange(e.target.value)
                                  errorState !== null && setErrorState(null)
                                }}
                                {...((errorState !== null) && {
                                  error: true,
                                  helperText: errors?.map_info_box[index]?.title?.message || errorState?.message[0]
                                })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                          <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                            <Controller
                              name={`map_info_box.${index}.content`}
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
                            {errors.map_info_box?.[index]?.content && (
                              <p className="text-red-500 text-sm mt-1">{errors.map_info_box?.[index]?.content.message}</p>
                            )}
                        </Grid>

                        <Grid size={{ md: 6, xs: 2, sm: 2 }}>
                          { mapInfoBoxFields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => appendmapInfoBoxFields({title: '', content: null})} color='secondary' size='small' variant="contained" startIcon={<i className='ri-add-line' />} >
                            Add Info Box
                          </Button>) : null }              
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                </Grid>
              </Grid>

              {/* Adventure Posts Section */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Adventure Posts Section</h3>
              </Grid>
              <Grid container spacing={5}>
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                  <input type="hidden" {...register("adventure_posts")} />
                    <Autocomplete
                      multiple
                      options={adventurePostslistOptions}
                      getOptionLabel={(option) => option.value} 
                      id='overview_adventure_posts'
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

              {/* Subscribe OR Share */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>Subscribe Or Share</h3>
              </Grid>
              <Grid container spacing={5}>  
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>Subscribe</Typography>
                </Grid>
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
                        id='subscribe_title'
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
                        id='subscribe_sub_title'
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
                        id='subscribe_button_text'
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
                        id='subscribe_button_link'
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
                
                <Grid size={{ md: 12, xs: 12, lg: 12 }}>
                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary'}}>Share</Typography>
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
                        id='share_title'
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
                        id='share_sub_title'
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
                        id='share_button_text'
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
                        id='share_button_link'
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

              {/* SEO */}
              <Grid size={{ md: 12, xs: 12, lg: 12 }} sx={{backgroundColor: '#d9d9d982', padding: '8px 1.25rem', marginBottom: '20px', marginTop: '20px'}}>
                <h3 sx={{paddingLeft: '1.25rem', paddingRight: '1.25rem'}}>SEO Data</h3>
              </Grid>
              <Grid container spacing={5}>
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
                            id='overview_page_url'
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
                            id='meta_title'
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
                            id='meta_description'
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
                            id='meta_keywords'
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
                            id='robots'
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
                            id='author'
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
                            id='publisher'
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
                            id='copyright'
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
                            id='revisit_after'
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
                            id='classification'
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
                            id='rating'
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