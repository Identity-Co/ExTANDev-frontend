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

import { object, string, pipe, nonEmpty, optional } from 'valibot'
import type { InferInput } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'

import { useSession } from 'next-auth/react'

import * as Category from '@/app/server/custom-categories'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  category_name: pipe(string(), nonEmpty('This field is required')),
  search_pattern: pipe(string(), nonEmpty('This field is required')),
})

type EditProps = {
  setId: string
  category: any
}

const EditForm = ({ setId, category }: EditProps) => {
  const router = useRouter()

  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [message, setMessage] = useState('');
  const [isSubmitting , setIsSubmitting ] = useState(false)

  const { data: session } = useSession()
  const fData = new FormData();

  const {
    control,
    handleSubmit,
    trigger, setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      category_name: category.category_name??'',
      search_pattern: category.search_pattern??''
    }
  })

  const onUpdate: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)

    const _data = {
      "category_name" : data.category_name,
      "search_pattern" : data.search_pattern
    }

    const log = await Category.updateCategory(setId, _data);

    if (log && log._id) {
      toast.success('Custom Category updated successfully.')
      router.replace('/admin/custom-categories/')
    } else {
      if(log.errors) {
        toast.error(log.errors.message)
      }
      
      setIsSubmitting(false)
    }
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
            <Grid size={{ md: 12 }}>
              <Controller
                name='category_name'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Category Name'
                    variant='outlined'
                    placeholder='Enter Category Name'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.category_name || errorState !== null) && {
                      error: true,
                      helperText: errors?.category_name?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 12 }}>
              <Controller
                name='search_pattern'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Search Pattern / Regular Expression'
                    variant='outlined'
                    placeholder='Enter Search Pattern'
                    className='mbe-1'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.search_pattern || errorState !== null) && {
                      error: true,
                      helperText: errors?.search_pattern?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </Grid>
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
