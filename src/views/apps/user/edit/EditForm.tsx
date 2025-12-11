'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, minLength, string, pipe, nonEmpty, email, optional, number } from 'valibot'
import type { InferInput } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useDropzone } from 'react-dropzone'

type FileProp = {
  name: string
  type: string
  size: number
}

import { useSession } from 'next-auth/react'

import * as User from '@/app/server/users'

type roleData = {
  key: string;
  name: string;
}

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  user_first_name: pipe(string(), nonEmpty('This field is required')),
  user_last_name: pipe(string(), nonEmpty('This field is required')),
  user_email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address')),
  full_address: optional(string()),
  role: pipe(string(), nonEmpty('This field is required')),
  user_address: pipe(string(), nonEmpty('This field is required')),
  user_address2: optional(string()),
  user_city: pipe(string(), nonEmpty('This field is required')),
  user_state: pipe(string(), nonEmpty('This field is required')),
  user_zip: pipe(string(), nonEmpty('This field is required')),
  user_country: pipe(string(), nonEmpty('This field is required')),
  user_fullphone: optional(string()),
  status: optional(number()),
  ambassador_status: optional(number()),
  instagram_url: optional(string()),
  facebook_url: optional(string()),
  pinterest_url: optional(string()),
  twitterx_url: optional(string()),
  whatsapp_url: optional(string()),
  tiktok_url: optional(string())
})

type EditProps = {
  setId: string
  userInfo: any
  roles: roleData[]
}

const EditForm = ({ setId, userInfo, roles }: EditProps) => {
  const router = useRouter()

  const filteredRoles = roles.filter(role => role.key !== 'admin');

  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [message, setMessage] = useState('');
  const [isSubmitting , setIsSubmitting ] = useState(false)

  const { data: session } = useSession()
  const [fileInput, setFileInput] = useState('')
  const [imgSrc, setImgSrc] = useState<string>(userInfo.profile_picture? process.env.NEXT_PUBLIC_UPLOAD_URL+"/"+userInfo.profile_picture : '/images/avatars/1.png')
  const [logoInput, setLogoInput] = useState<File | null>(null)
  const fData = new FormData();

  const [u_email, setUserEmail] = useState('');
  const [u_address, setUserAddress] = useState('');
  const [u_address2, setUserAddress2] = useState('');
  const [u_city, setUserCity] = useState('');
  const [u_state, setUserState] = useState('');
  const [u_zip, setUserZip] = useState('');
  const [u_country, setUserCountry] = useState('');
  const [isPhError , setIsPhError ] = useState(false)

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

    setLogoInput(file2); 

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
    setImgSrc(userInfo.profile_picture??'/images/avatars/1.png')
  }

  const [u_ph0, setUserPhone0] = useState(userInfo?.phone?.country_name ?? 'us');
  const [u_ph1, setUserPhone1] = useState(userInfo?.phone?.country_code ?? '+1');
  const [u_ph2, setUserPhone2] = useState(userInfo?.phone?.number ?? '');
  
  const handleOnChange2 = (value: any, countryObj: any, e: ChangeEvent, formattedValue: any) => {
    const fValArr = formattedValue.split(' ')
    const ph_country_code = fValArr[0]
    
    fValArr.shift()
    const ph_formatted_value = fValArr.join('')
    const tel_number = ph_formatted_value.replace(/\D+/g, "");

    if (u_ph0 === countryObj?.countryCode) {
      setUserPhone1(ph_country_code);
      setUserPhone2(tel_number);
      setUserPhone0(countryObj?.countryCode);
    } else {
      setUserPhone1(ph_country_code);
      setUserPhone2('');
      setUserPhone0(countryObj?.countryCode);
    }
  };

  const [files, setFiles] = useState<File[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const img = files.map((file: FileProp) => (
    <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
  ))

  const updateUEmail = (e: any) => {
    setUserEmail(e.target.value);
  };

  const updateUAddress = (e: any) => {
    setUserAddress(e.target.value);
  };

  const updateUAddress2 = (e: any) => {
    setUserAddress2(e.target.value);
  };

  const updateUCity = (e: any) => {
    setUserCity(e.target.value);
  };

  const updateUState = (e: any) => {
    setUserState(e.target.value);
  };

  const updateUZip = (e: any) => {
    setUserZip(e.target.value);
  };

  const updateUCountry = (e: any) => {
    setUserCountry(e.target.value);
  };

  const updateUPhone1 = (e: any) => {
    setUserPhone1(e.target.value);
  };

  const updateUPhone2 = (e: any) => {
    setUserPhone2(e.target.value);
  };

  const {
    control,
    handleSubmit,
    trigger, setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      user_first_name: userInfo.first_name??'',
      user_last_name: userInfo.last_name??'',
      user_email: userInfo.email??'',
      user_address: userInfo.address?.address??'',
      user_address2: userInfo.address?.address2??'',
      user_city: userInfo.address?.city??'',
      user_state: userInfo.address?.state??'',
      user_zip: userInfo.address?.zip??'',
      user_country: userInfo.address?.country??'',
      role: userInfo.role??'',
      user_fullphone : '',
      status: userInfo.status??0,
      ambassador_status: userInfo.ambassador_status??0,
      instagram_url: userInfo.socialmedia_urls?.instagram_url??'',
      facebook_url: userInfo.socialmedia_urls?.facebook_url??'',
      pinterest_url: userInfo.socialmedia_urls?.pinterest_url??'',
      twitterx_url: userInfo.socialmedia_urls?.twitterx_url??'',
      whatsapp_url: userInfo.socialmedia_urls?.whatsapp_url??'',
      tiktok_url: userInfo.socialmedia_urls?.tiktok_url??'',
    }
  })

  useEffect(() => {
    if(userInfo.profile_picture) {
      setImgSrc(`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${userInfo.profile_picture}`)
    }
  }, [userInfo])

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsPhError(false)
    
    if(u_ph2 == '') {
      setIsPhError(true)

      return;
    }

    setIsSubmitting(true)
    const _user = await User.getSingleUser(session?.user?.id)
    
    if (logoInput) fData.append('file', logoInput);

    // "company_id": _user.company_id,

    const f_data = {
      "first_name" : data.user_first_name,
      "last_name" : data.user_last_name,
      "email" : data.user_email,
      "address" : {
        "address" : data.user_address,
        "address2" : data.user_address2,
        "city" : data.user_city,
        "state" : data.user_state,
        "zip" : data.user_zip,
        "country" : data.user_country,
      },
      "phone" : {
        "country_name" : u_ph0,
        "country_code" : u_ph1,
        "number" : u_ph2
      },
      "role" : data.role,
      "status" : data.status,
      "ambassador_status" : data.ambassador_status ?? 0,
      "socialmedia_urls" : {
        "instagram_url" : data.instagram_url ?? '',
        "facebook_url" : data.facebook_url ?? '',
        "pinterest_url" : data.pinterest_url ?? '',
        "twitterx_url" : data.twitterx_url ?? '',
        "whatsapp_url" : data.whatsapp_url ?? '',
        "tiktok_url" : data.tiktok_url ?? ''
      }
    }

    const log = await User.updateUser(setId, f_data);

    if (log && log._id) {
      if(logoInput) {
        const user = await User.updateUserInfo(setId, fData)
      }
      
      toast.success('User updated successfully.')
      router.replace('/admin/users/')
    } else {
      if(log.errors) {
        toast.error(log.errors.message)
      }
      
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className='mbe-5'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button component='label' size='small' variant='contained' htmlFor='account-settings-upload-image'>
                Upload New Photo
                <input
                  hidden
                  type='file'
                  value={fileInput}
                  accept='image/png, image/jpeg'
                  onChange={handleFileInputChange}
                  id='account-settings-upload-image'
                />
              </Button>
              <Button size='small' variant='outlined' color='error' onClick={handleFileInputReset}>
                Reset
              </Button>
            </div>
            <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
          </div>
        </div>
      </CardContent>

      <CardContent>
        <form
          noValidate
          action={() => {}}
          autoComplete='off'
          onSubmit={handleSubmit(onUpdate)}
        >
          <Grid container spacing={5}>   
            <Grid size={{ md: 6 }}>
              <Controller
                name='user_first_name'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='text'
                    label='First Name'
                    variant='outlined'
                    placeholder='Enter First Name'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.user_first_name || errorState !== null) && {
                      error: true,
                      helperText: errors?.user_first_name?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6 }}>
              <Controller
                name='user_last_name'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='text'
                    label='Last Name'
                    variant='outlined'
                    placeholder='Enter Last Name'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.user_last_name || errorState !== null) && {
                      error: true,
                      helperText: errors?.user_last_name?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6 }}>
              <Controller
                name='user_email'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='text'
                    label='Email'
                    variant='outlined'
                    placeholder='Enter Email'
                    className='mbe-0'
                    id='user_email'
                    slotProps={{
                      input: { readOnly: true }
                    }}
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.user_email || errorState !== null) && {
                      error: true,
                      helperText: errors?.user_email?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            {/*<Grid size={{ md: 6 }}>
              <Controller
                name='user_password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='password'
                    label='Password'
                    variant='outlined'
                    placeholder='Enter Password'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.user_password || errorState !== null) && {
                      error: true,
                      helperText: errors?.user_password?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>*/}

            <Grid size={{ md: 6 }}>
              <Controller
                name='user_address'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='text'
                    label='Address'
                    variant='outlined'
                    placeholder='Enter Address'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      updateUAddress(e)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.user_address || errorState !== null) && {
                      error: true,
                      helperText: errors?.user_address?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6 }}>
              <Controller
                name='user_address2'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='text'
                    label='Address#2'
                    variant='outlined'
                    placeholder='Enter Address#2'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      updateUAddress2(e) 
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6 }}>
              <Controller
                name='user_city'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='text'
                    label='City'
                    variant='outlined'
                    placeholder='Enter City'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      updateUCity(e)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.user_city || errorState !== null) && {
                      error: true,
                      helperText: errors?.user_city?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6 }}>
              <Controller
                name='user_state'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='text'
                    label='State'
                    variant='outlined'
                    placeholder='Enter State'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      updateUState(e)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.user_state || errorState !== null) && {
                      error: true,
                      helperText: errors?.user_state?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6 }}>
              <Controller
                name='user_zip'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='text'
                    label='Zip'
                    variant='outlined'
                    placeholder='Enter Zip'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      updateUZip(e)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.user_zip || errorState !== null) && {
                      error: true,
                      helperText: errors?.user_zip?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6 }}>
              <Controller
                name='user_country'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='text'
                    label='Country'
                    variant='outlined'
                    placeholder='Enter Country'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      updateUCountry(e)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.user_country || errorState !== null) && {
                      error: true,
                      helperText: errors?.user_country?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>

            <Grid size={{ md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id='country' error={Boolean(errors.role)}>
                  Select Role
                </InputLabel>
                <Controller
                  name='role'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select label='Select Role' {...field} error={Boolean(errors.role)}>
                      
                      {filteredRoles?.map((item, index) => (
                        <MenuItem key={index} value={`${item.key}`}>{`${item.name}`}</MenuItem>
                      ))}

                      {filteredRoles?null:(<MenuItem value=''>Role</MenuItem>)}
                    </Select>
                  )}
                />
                {errors.role && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid size={{ md: 6 }}>
              {/* <Typography color='default.main' className='mb-2'>Phone Number</Typography> */}
              <Controller
                name='user_fullphone'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <PhoneInput
                    inputProps={{
                      required: true
                    }}
                    {...field}
                    enableSearch={false}
                    countryCodeEditable={false}
                    country={u_ph0}
                    value={u_ph1+' '+u_ph2}
                    onChange={(value, countryObj, e, formattedValue) =>
                      handleOnChange2(value, countryObj, e, formattedValue)
                    }
                    specialLabel='Enter Number'
                  />
                )}
              />
              {isPhError ?
                <p className="custom-error-class">Please enter valid phone number</p>
              :
                ''
              }
            </Grid>

            <Grid size={{ md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id='status' error={Boolean(errors.status)}>
                  User Status
                </InputLabel>
                <Controller
                  name='status'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select label='Select Status' {...field} error={Boolean(errors.status)}>
                      <MenuItem value={1}>Approve</MenuItem>
                      <MenuItem value={0}>Pending</MenuItem>
                      <MenuItem value={2}>Reject</MenuItem>
                    </Select>
                  )}
                />
                {errors.status && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>

            {userInfo.role == 'ambassador' && (
              <>
                <Grid size={{ md: 12 }}>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Controller
                          name='ambassador_status'
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              {...field}
                              checked={field.value === 1}
                              onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                            />
                          )}
                        />
                      }
                      label='Approved as Ambassador Profile'
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ md: 6 }}>
                  <Controller
                    name='instagram_url'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        autoFocus
                        type='text'
                        label='Instagram URL'
                        variant='outlined'
                        placeholder='Enter Instagram URL'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6 }}>
                  <Controller
                    name='facebook_url'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        autoFocus
                        type='text'
                        label='Facebook URL'
                        variant='outlined'
                        placeholder='Enter Facebook URL'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6 }}>
                  <Controller
                    name='pinterest_url'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        autoFocus
                        type='text'
                        label='Pinterest URL'
                        variant='outlined'
                        placeholder='Enter Pinterest URL'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6 }}>
                  <Controller
                    name='twitterx_url'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        autoFocus
                        type='text'
                        label='Twitter/X URL'
                        variant='outlined'
                        placeholder='Enter Twitter/X URL'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6 }}>
                  <Controller
                    name='whatsapp_url'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        autoFocus
                        type='text'
                        label='WhatsApp URL'
                        variant='outlined'
                        placeholder='Enter WhatsApp URL'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ md: 6 }}>
                  <Controller
                    name='tiktok_url'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        autoFocus
                        type='text'
                        label='TikTok URL'
                        variant='outlined'
                        placeholder='Enter TikTok URL'
                        className='mbe-1'
                        onChange={e => {
                          field.onChange(e.target.value)
                        }}
                      />
                    )}
                  />
                </Grid>
              </>
            )}


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
        </form>
      </CardContent>
    </Card>
  )
}

export default EditForm
