'use client'

import { useState, useEffect } from 'react'

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

import { saveDestination, updateDestination } from '@/app/server/destinations'

type FileProp = {
  name: string
  type: string
  size: number
}
type ErrorType = {
  message: string[]
}

type OverviewProps = {
  pgData: []
  destinations: []
  setFormId: () => void
  getFormId: () => void
  adventurePosts: []
}

type FormData = InferInput<typeof schema>

const schema = object({
  title: pipe(string(), nonEmpty('This field is required')),
  sub_title: pipe(string(), nonEmpty('This field is required')),
  destination_location: pipe(string(), nonEmpty('This field is required')),
  banners: array(
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
      _preview: optional(string()),
    })
  ),
  about_title: pipe(string(), nonEmpty('This field is required')),
  about_content: optional(string()),
  about_button_text: optional(string()),
  about_button_link: pipe(string()),
  about_sections: array(
    object({
      content: pipe(string(), nonEmpty('This field is required')),
      direction: pipe(string(), nonEmpty('This field is required')),
      image: pipe(custom<File | null>((value) => {
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
  adventure_posts: array(
    optional(string()),
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

const Overview = ({ pgData, destinations, setFormId, getFormId, adventurePosts }: OverviewProps) => {
  const router = useRouter()

  let form_id = getFormId();

  const setLoading = useNavigationStore((s) => s.setLoading)

  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting , setIsSubmitting ] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [message, setMessage] = useState(null);
  const [fileInput, setFileInput] = useState('');
  const [imgSrc, setImgSrc] = useState<string>(pgData?.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${pgData?.image}` : '/images/avatars/1.png')
  const [imageInput, setImageInput] = useState<File | null>(null)

  const [resorts, setResorts] = useState(pgData?.resorts?.resorts??[])
  const [resortOptions, setresortOptions] = useState<string[]>([])

  const [adventurePostslist, setadventurePostslist] = useState(adventurePosts??[])
  const [adventurePostslistOptions, setadventurePostslistOptions] = useState<string[]>([])

  const [uploadedImages, setUploadedImages] = useState<string[]>(pgData?.overview?.slider_images??[])

  const [destID, setdestID] = useState(getFormId());

  // States
  const [files, setFiles] = useState<File[]>([])

  const fData = new FormData();

  useEffect(() => {
    const obj = resorts.map(item => ({
      label: item._id,
      value: item.title
    }));

    setresortOptions(obj);
  }, [resorts]);

  useEffect(() => {
    const obj = adventurePosts.map(item => ({
      label: item._id,
      value: item.name
    }));

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
      title: pgData?.title??'',
      sub_title: pgData?.sub_title??'',
      destination_location: pgData?.destination_location??'',
      banners: pgData?.overview?.banners?.map(section => ({
        title: section.title ?? '',
        content: section.content ?? '',
        image: section.image ? `${section.image}` : '',
        location: section.location ?? '',
        _preview: section.image ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${section.image}` : '',
      })) ?? [{title: '', content: '', image: null, location: '', _preview : ''}],
      about_title: pgData?.overview?.about_title??'',
      about_content: pgData?.overview?.about_content??'',
      about_button_text: pgData?.overview?.about_button_text??'',
      about_button_link: pgData?.overview?.about_button_link??'',
      about_sections: pgData?.overview?.sections?.map(section => ({
        content: section.content ?? '',
        image: section.image ?? null,
        direction: section.direction ?? '',
        _preview: section._preview ?? '',
      })) ?? [{content: '', image: null, direction: '', _preview : ''}],
      quick_facts: pgData?.overview?.facts?.map(fact => ({
        label: fact.label ?? '',
        content: fact.content ?? null,
      })) ?? [{label: '', content: ''}],
      adventure_posts: pgData?.overview?.adventure_posts??[],
      feature_resorts_title: pgData?.overview?.feature_resorts?.title??'',
      feature_resorts: pgData?.overview?.feature_resorts?.resorts??[],
      faqs: pgData?.overview?.faq?.map(faq => ({
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "banners",
  });

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

  useEffect(() => {
    if (fields.length === 0) {
      append({ title: '', location: '', content: '', image: null, _preview: null });
    } 
  }, [fields.length, append]);

  /*useEffect(() => {
    if (fields.length === 0) {
      append({ title: '', location: '', content: '', image: null, _preview: null });
    }
  }, [fields.length, append]);*/

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

  const generateSlug = text => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')   // remove invalid chars
      .replace(/\s+/g, '-')           // replace spaces with -
      .replace(/-+/g, '-')            // remove multiple -
  }

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    const isOnlyPBr = /^<p><br><\/p>$/;

    if (!imageInput && (pgData?.image == '' || pgData?.image === undefined)) {
      setMessage('This field is required.');
      
      return;
    }

    if (imageInput) { 
      fData.append('destination_image', imageInput);
    }

    fData.append('title', data.title);
    fData.append('sub_title', data.sub_title);
    fData.append('destination_location', data.destination_location);
    fData.append('meta_description', data.meta_description);
    fData.append('meta_keywords', data.meta_keywords);
    fData.append('meta_title', data.meta_title);
    fData.append('page_url', data.page_url);
    fData.append('author', data.author);
    fData.append('publisher', data.publisher);
    fData.append('copyright', data.copyright);
    fData.append('rating', data.rating);
    fData.append('revisit_after', data.revisit_after);
    fData.append('robots', data.robots);
    fData.append('classification', data.classification);
    fData.append('share_button_link', data.share_button_link);
    fData.append('share_button_text', data.share_button_text);
    fData.append('share_sub_title', data.share_sub_title);
    fData.append('share_title', data.share_title);
    fData.append('subscribe_button_link', data.subscribe_button_link);
    fData.append('subscribe_button_text', data.subscribe_button_text);
    fData.append('subscribe_sub_title', data.subscribe_sub_title);
    fData.append('subscribe_title', data.subscribe_title);

    // Overview tab content
    fData.append('overview[about_title]', data.about_title);

    if (isOnlyPBr.test(data.about_content.trim())) {
      fData.append('overview[about_content]', '');
    } else {
      fData.append('overview[about_content]', data.about_content);
    }
    fData.append('overview[button_text]', data.about_button_text);
    fData.append('overview[button_link]', data.about_button_link);


    files.forEach((file, i) => {
      fData.append(`overview_slider_images[${i}]`, file)
    })

    uploadedImages.forEach((file, i) => {
      fData.append(`overview_slider_images_old[${i}]`, file)
    })

    data.about_sections.forEach((section, i) => {
      fData.append(`about_sections[${i}][content]`, section.content)
      fData.append(`about_sections[${i}][direction]`, section.direction)
      if (section.image) {
        fData.append(`about_sections[${i}][image]`, section.image)
      }
    });

    data.quick_facts.forEach((section, i) => {
      fData.append(`facts[${i}][label]`, section.label)
      fData.append(`facts[${i}][content]`, section.content)
    });

    data.faqs.forEach((section, i) => {
      fData.append(`faq[${i}][question]`, section.question)
      fData.append(`faq[${i}][answer]`, section.answer)
    });

    data.adventure_posts.forEach((resortId, i) => {
      fData.append(`overview[adventure_posts][${i}]`, resortId);
    })

    fData.append('overview[feature_resorts_title]', data.feature_resorts_title);
    data.feature_resorts.forEach((resortId, i) => {
      fData.append(`overview[feature_resorts][${i}]`, resortId);
    })

    data.banners.forEach((section, i) => {
      fData.append(`overview_banners[${i}][title]`, section.title)
      fData.append(`overview_banners[${i}][content]`, section.content)
      fData.append(`overview_banners[${i}][location]`, section.location)
      if (section.image) {
        fData.append(`overview_banners[${i}][image]`, section.image)
      }
    });
    setIsSubmitting(true)

    var log = null;
    if(form_id === null) {
      log = await saveDestination(fData);
      router.replace(`/admin/destination/edit/${log._id}`)
    } else {
      log = await updateDestination(form_id, fData);
    }

    if (log && log._id) {
      toast.success('Overview data saved successfully.')
      setFormId(log._id);
      setIsSubmitting(false)
    } else {
      if(log.errors) {
        toast.error(log.errors.message)
      }
      
      setIsSubmitting(false)
    }
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

  const handleRemoveUploaded = (file: FileProp) => {
    const uploadedFiles = uploadedImages
    const filtered = uploadedFiles.filter((i: FileProp) => i !== file)

    setUploadedImages([...filtered])
  }

  const uploadedList = uploadedImages.map((file: FileProp) => (
      <ListItem key={file}>
        <div className='file-details'>
          <div className='file-preview'><img width={38} height={38} alt={file.name} src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${file}`} /></div>
        </div>
        <IconButton onClick={() => handleRemoveUploaded(file)}>
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
                  if(form_id === null) {
                    const slug = generateSlug(e.target.value)
                    setValue('page_url', slug)
                  }
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
        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
          <Controller
            name='destination_location'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='text'
                label='Destination Location'
                variant='outlined'
                placeholder='Destination Location'
                className='mbe-1'
                onChange={e => {
                  field.onChange(e.target.value)
                  errorState !== null && setErrorState(null)
                }}
                {...((errors.destination_location || errorState !== null) && {
                  error: true,
                  helperText: errors?.destination_location?.message || errorState?.message[0]
                })}
              />
            )}
          />
        </Grid>
      </Grid>
      {/* Banner Section */}
      <Grid container spacing={5} className="my-5">
        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
          <h2>Banner Section</h2>
        </Grid>
        <Grid size={{ md: 12, xs: 12, lg: 12 }}>
          {fields.map((field, index) => (
            <div key={field.id} spacing={5}>
              <Grid container spacing={6}>
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

                <Grid size={{ md: 6, xs: 12, sm: 12, lg: 6 }}>
                  <FormControl fullWidth>
                    <Controller
                      name={`banners.${index}.location`}
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
                          {...((errors.banners?.[index]?.location || errorState !== null) && {
                            error: true,
                            helperText: errors.banners?.[index]?.location?.message || errorState?.message[0]
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
                              const maxSize = 800 * 1024;

                              if (file && file.size > maxSize) {
                                toast.error("File is too large. Maximum allowed size is 800KB.")

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

                <Grid size={{ md: 6, xs: 12, lg: 6 }} style={{ marginBottom: "30px" }}>
                  <Typography variant='h6' color='#a3a3a3'>Content</Typography>
                  {/*<TipTapEditoror
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onReady={(editorInstance) => setEditor(editorInstance)}
                  />*/}
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
                        style={{ height: "200px", marginBottom: "60px" }}
                      />
                    )}
                  />
                  {errors.banners?.[index]?.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.banners?.[index]?.content.message}</p>
                  )}
                </Grid>
                <Divider />

                <Grid size={{ md: 6, xs: 2, sm: 2 }}>
                  { fields.length === index+1 ? (<Button aria-label='capture screenshot' onClick={() => append({content: '', image: null})} color='secondary' size='medium' variant="contained" startIcon={<i className='ri-add-line' />} >
                    Add More
                  </Button>) : null }

                  {index > 0 ? 
                    (<CustomIconButton aria-label='capture screenshot' color='error' size='medium' onClick={() => remove(index)}>
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
              {uploadedList}
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