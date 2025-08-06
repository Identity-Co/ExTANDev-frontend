'use client'

// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

import { useRouter } from 'next/navigation'

// import { useParams, useSearchParams } from 'next/navigation'
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

// import Alert from '@mui/material/Alert'
// import AlertTitle from '@mui/material/AlertTitle'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, minLength, string, pipe, nonEmpty, email, optional } from 'valibot'
import type { InferInput } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

// import Box from '@mui/material/Box'
// import Avatar from '@mui/material/Avatar'

import { useDropzone } from 'react-dropzone'

import { useSession } from 'next-auth/react'

import { useNavigationStore } from '@/libs/navigation-store'

type FileProp = {
  name: string
  type: string
  size: number
}

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
  user_password: pipe(string(), nonEmpty('This field is required')),
  role: pipe(string(), nonEmpty('This field is required')),
  user_address: pipe(string(), nonEmpty('This field is required')),
  user_address2: optional(string()),
  user_city: pipe(string(), nonEmpty('This field is required')),
  user_state: pipe(string(), nonEmpty('This field is required')),
  user_zip: pipe(string(), nonEmpty('This field is required')),
  user_country: pipe(string(), nonEmpty('This field is required')),
  user_fullphone: optional(string())
})

const AddForm = ({ roles }: { roles?: roleData[] }) => {
  const setLoading = useNavigationStore((s) => s.setLoading)

  const filteredRoles = roles?.filter(role => role.key !== 'admin');

  const router = useRouter()

  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [message, setMessage] = useState('');
  const [isSubmitting , setIsSubmitting ] = useState(false)

  const { data: session } = useSession()
  const [fileInput, setFileInput] = useState('')
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [logoInput, setLogoInput] = useState<File|null>(null)
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
    setImgSrc('/images/avatars/1.png')
  }

  const [u_ph0, setUserPhone0] = useState('us');
  const [u_ph1, setUserPhone1] = useState('+1');
  const [u_ph2, setUserPhone2] = useState('');
  
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
      user_first_name:  '',
      user_last_name:  '',
      user_email:  '',
      user_password:  '',
      user_address:  '',
      user_address2:  '',
      user_city:  '',
      user_state:  '',
      user_zip:  '',
      user_country:  '',
      role:'',
      user_fullphone : ''
    }
  })


  const onCreate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsPhError(false)

    if(u_ph2 == '') {
      setIsPhError(true)

      return;
    }
    
    //setIsSubmitting(true)

    const user = await User.getSingleUser(session?.user?.id)

    if (logoInput) fData.append('file', logoInput);
    
    const f_data = {
      "first_name" : data.user_first_name,
      "last_name" : data.user_last_name,
      "email" : data.user_email,
      "password" : data.user_password,
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
          "number" : u_ph2,
      },
      "role" : data.role,
    }

    const res = await User.saveUser(f_data)

    if (res && res._id) {
      if(logoInput) { const profile = await User.updateUserInfo(res._id, fData); }

      toast.success('User created successfully.')
      router.replace('/admin/users/')
    } else {
      if(res.errors) {
        toast.error(res.errors)
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
          onSubmit={handleSubmit(onCreate)}
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
                    value={u_email}
                    onChange={e => {
                      updateUEmail(e)
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
            <Grid size={{ md: 6 }}>
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
            </Grid>

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
                    value={u_address}
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
                    value={u_address2}
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
                    value={u_city}
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
                    value={u_state}
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
                    value={u_zip}
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
                    value={u_country}
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
            {/* <Grid size={{ md: 6 }}>
              <Typography color='default.main' className='mb-2'>Phone Number</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 3 }}>
                  <Controller
                    name='user_ph_country'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        autoFocus
                        type='text'
                        label='Country Code'
                        variant='outlined'
                        placeholder='Enter Country Code'
                        className='mbe-1'
                        value={u_ph1}
                        onChange={e => {
                          field.onChange(e.target.value)
                          updateUPhone1(e)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.user_ph_country || errorState !== null) && {
                          error: true,
                          helperText: errors?.user_ph_country?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 9 }}>
                  <Controller
                    name='user_ph_number'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        autoFocus
                        type='text'
                        label='Number'
                        variant='outlined'
                        placeholder='Enter Number'
                        className='mbe-1'
                        value={u_ph2}
                        inputProps={{ maxLength: 10 }}
                        onChange={e => {
                          field.onChange(e.target.value)
                          updateUPhone2(e)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.user_ph_number || errorState !== null) && {
                          error: true,
                          helperText: errors?.user_ph_number?.message || errorState?.message[0]
                        })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid> */}

            <Grid size={{ xs: 12 }} className='flex gap-4 mt-5 flex-wrap' justifyContent="space-between" container>
              <Grid>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button variant='contained' type='submit' disabled={isSubmitting}>
                    Submit
                  </Button>
                  {isSubmitting ? <CircularProgress style={{marginLeft: '8px'}} size={24} thickness={6} /> : ''}
                </div>
              </Grid>
              <Grid>
                {/* (submitErr && errorType)?
                  <Alert severity={errorType}>{submitErr}</Alert>
                :
                  ''
                */}
                
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddForm
