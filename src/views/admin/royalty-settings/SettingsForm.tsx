'use client'

// React Imports
import { useState } from 'react'
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
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress';

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, pipe, nonEmpty, optional, number } from 'valibot'
import type { InferInput } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'

import { useSession } from 'next-auth/react'

import * as Royalty from '@/app/server/royalty'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  NEW_SIGNUP: pipe(number(), nonEmpty('This field is required')),
  REF_SIGNUP: pipe(number(), nonEmpty('This field is required')),
  WC_ORDER: pipe(number(), nonEmpty('This field is required')),
  SM_SHARING: pipe(number(), nonEmpty('This field is required')),
  SILVER_TIER: pipe(number(), nonEmpty('This field is required')),
  GOLD_TIER: pipe(number(), nonEmpty('This field is required')),
  PLATINUM_TIER: pipe(number(), nonEmpty('This field is required')),
  REDEEM_POINTS: pipe(number(), nonEmpty('This field is required')),
  LIKED_ITEM: pipe(number(), nonEmpty('This field is required')),
  SAVED_ITEM: pipe(number(), nonEmpty('This field is required')),
  COMMENTED_ITEM: pipe(number(), nonEmpty('This field is required')),
})

type EditProps = {
  royalty: any
}

const SettingsForm = ({ royalty }: EditProps) => {
  const router = useRouter()

  console.log(royalty);

  const royaltyData = royalty.reduce((acc, item) => {
    acc[item.parameter_key] = {
      name: item.parameter_name,
      value: item.parameter_value,
    };
    return acc;
  }, {});

  // ✅ Now you can easily access values:
  console.log(royaltyData);



  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [message, setMessage] = useState('');
  const [isSubmitting , setIsSubmitting ] = useState(false)

  const { data: session } = useSession()
  const fData = new FormData();

  const def_values = Object.entries(royaltyData).reduce((acc, [key, { value }]) => {
    acc[key] = value ?? 0;
    return acc;
  }, {});

  console.log('def_values: ', def_values)

  const {
    control,
    handleSubmit,
    trigger, setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      ...def_values
      
      /*NEW_SIGNUP: royaltyData.NEW_SIGNUP?.value ?? 0,
      REF_SIGNUP: 0, //royalty.REF_SIGNUP??0,
      WC_ORDER: 0, //royalty.WC_ORDER??0,
      SM_SHARING: 0, //royalty.SM_SHARING??0,
      SILVER_TIER: 0, //royalty.SILVER_TIER??0,
      GOLD_TIER: 0, //royalty.GOLD_TIER??0,
      PLATINUM_TIER: 0, //royalty.PLATINUM_TIER??0,
      REDEEM_POINTS: 0, //royalty.REDEEM_POINTS??0,*/
    }
  })

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)

    //console.log('Form data: ', data)

    const _data_1 = { "parameter_value" : data.NEW_SIGNUP }
    const log_1 = await Royalty.updateSetting("NEW_SIGNUP", _data_1);

    const _data_2 = { "parameter_value" : data.REF_SIGNUP }
    const log_2 = await Royalty.updateSetting("REF_SIGNUP", _data_2);

    const _data_3 = { "parameter_value" : data.WC_ORDER }
    const log_3 = await Royalty.updateSetting("WC_ORDER", _data_3);

    const _data_4 = { "parameter_value" : data.SM_SHARING }
    const log_4 = await Royalty.updateSetting("SM_SHARING", _data_4);

    const _data_5 = { "parameter_value" : data.SILVER_TIER }
    const log_5 = await Royalty.updateSetting("SILVER_TIER", _data_5);

    const _data_6 = { "parameter_value" : data.GOLD_TIER }
    const log_6 = await Royalty.updateSetting("GOLD_TIER", _data_6);

    const _data_7 = { "parameter_value" : data.PLATINUM_TIER }
    const log_7 = await Royalty.updateSetting("PLATINUM_TIER", _data_7);

    const _data_8 = { "parameter_value" : data.REDEEM_POINTS }
    const log_8 = await Royalty.updateSetting("REDEEM_POINTS", _data_8);

    const _data_9 = { "parameter_value" : data.LIKED_ITEM }
    const log_9 = await Royalty.updateSetting("LIKED_ITEM", _data_9);

    const _data_10 = { "parameter_value" : data.SAVED_ITEM }
    const log_10 = await Royalty.updateSetting("SAVED_ITEM", _data_10);

    const _data_11 = { "parameter_value" : data.COMMENTED_ITEM }
    const log_11 = await Royalty.updateSetting("COMMENTED_ITEM", _data_11);

    setIsSubmitting(false)

    toast.success('Royalty Settings updated successfully.')
    router.replace('/admin/royalty-settings/')

  }

  return (
    <Card>
      <CardContent>
        <form
          noValidate
          action={() => {}}
          autoComplete='off'
          onSubmit={handleSubmit(onUpdate)}
        >
          <Grid container spacing={5}>


            {Object.entries(royaltyData).map(([key, { name, value }]) => (
              <Grid size={{ md: 12 }} key={key}>
                <Controller
                  name={key}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type='number'
                      label={name}
                      variant='outlined'
                      placeholder={`Enter ${name}`}
                      className='mbe-1'
                      inputProps={{ 
                        inputMode: 'decimal', step: '0.01', min: '0',
                        onWheel: (e: React.WheelEvent<HTMLInputElement>) => {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      onChange={e => {
                        const value = e.target.value
                        const numericValue = value === '' ? '' : parseFloat(value)
                        field.onChange(numericValue)
                        errorState !== null && setErrorState(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      {...((errors[key] || errorState !== null) && {
                        error: true,
                        helperText: errors?.[key]?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
              </Grid>
            ))}



            {/* <Grid size={{ md: 12 }}>
              <Controller
                name='NEW_SIGNUP'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Points for Signup'
                    variant='outlined'
                    placeholder='Enter Points for Signup'
                    className='mbe-1'
                    inputProps={{ 
                      inputMode: 'decimal', step: '0.01', min: '0',
                      onWheel: (e: React.WheelEvent<HTMLInputElement>) => {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    onChange={e => {
                      //field.onChange(e.target.value)

                      const value = e.target.value
                      const numericValue = value === '' ? '' : parseFloat(value)

                      field.onChange(numericValue)

                      errorState !== null && setErrorState(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                      }
                    }}
                    {...((errors.NEW_SIGNUP || errorState !== null) && {
                      error: true,
                      helperText: errors?.NEW_SIGNUP?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 12 }}>
              <Controller
                name='REF_SIGNUP'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Points for Referral signup'
                    variant='outlined'
                    placeholder='Enter Points for Referral signup'
                    className='mbe-1'
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={e => {
                      field.onChange(Number(e.target.value))
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.REF_SIGNUP || errorState !== null) && {
                      error: true,
                      helperText: errors?.REF_SIGNUP?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 12 }}>
              <Controller
                name='WC_ORDER'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Points for Purchase Products (1 point for every $X)'
                    variant='outlined'
                    placeholder='Enter Points for Purchase Products (1 point for every $X)'
                    className='mbe-1'
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={e => {
                      field.onChange(Number(e.target.value))
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.WC_ORDER || errorState !== null) && {
                      error: true,
                      helperText: errors?.WC_ORDER?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 12 }}>
              <Controller
                name='SM_SHARING'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Points for Social Media Sharing'
                    variant='outlined'
                    placeholder='Enter Points for Social Media Sharing'
                    className='mbe-1'
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={e => {
                      field.onChange(Number(e.target.value))
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.SM_SHARING || errorState !== null) && {
                      error: true,
                      helperText: errors?.SM_SHARING?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 12 }}>
              <Controller
                name='SILVER_TIER'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Points required for Silver Tier'
                    variant='outlined'
                    placeholder='Enter Points required for Silver Tier'
                    className='mbe-1'
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={e => {
                      field.onChange(Number(e.target.value))
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.SILVER_TIER || errorState !== null) && {
                      error: true,
                      helperText: errors?.SILVER_TIER?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 12 }}>
              <Controller
                name='GOLD_TIER'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Points required for Gold Tier'
                    variant='outlined'
                    placeholder='Enter Points required for Gold Tier'
                    className='mbe-1'
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={e => {
                      field.onChange(Number(e.target.value))
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.GOLD_TIER || errorState !== null) && {
                      error: true,
                      helperText: errors?.GOLD_TIER?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 12 }}>
              <Controller
                name='PLATINUM_TIER'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Points required for Platinum Tier'
                    variant='outlined'
                    placeholder='Enter Points required for Platinum Tier'
                    className='mbe-1'
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={e => {
                      field.onChange(Number(e.target.value))
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.PLATINUM_TIER || errorState !== null) && {
                      error: true,
                      helperText: errors?.PLATINUM_TIER?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 12 }}>
              <Controller
                name='REDEEM_POINTS'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Redeem 1 Point = $X'
                    variant='outlined'
                    placeholder='Enter Redeem 1 Point = $X'
                    className='mbe-1'
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={e => {
                      field.onChange(Number(e.target.value))
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.REDEEM_POINTS || errorState !== null) && {
                      error: true,
                      helperText: errors?.REDEEM_POINTS?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid> */}



            <Grid size={{ xs: 12 }} className='flex gap-4 mt-5 flex-wrap' justifyContent="space-between" container>
              <Grid>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button variant='contained' type='submit' disabled={isSubmitting}>
                    Update
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

export default SettingsForm
