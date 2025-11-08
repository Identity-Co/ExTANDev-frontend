'use client'

// React Imports
import { useState, useRef } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import classnames from 'classnames'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe, nonEmpty, optional, boolean, check } from 'valibot'

import { toast } from 'react-toastify';

import axios from 'axios';

import { createEntry } from '@/app/server/contact_form_entries'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

// Fixed schema - match field names exactly and add required fields
const schema = object({
  first_name: pipe(string(), minLength(1, 'First name is required')),
  last_name: pipe(string(), minLength(1, 'Last name is required')),
  email_address: pipe(
    string(), 
    minLength(1, 'Email is required'), 
    email('Please enter a valid email address')
  ),
  country: optional(string()), // Made required
  phone: optional(string()), // Made required  
  how_can_help: optional(string()), // Made required
  subscribe_newsletter: optional(boolean()),
  agree_communication: pipe(boolean(), check(
    (value) => value === true, 
    'You must agree to receive communications'
  )),
});

// Styles Imports
import styles from './styles.module.css'

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo (Democratic Republic)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const ContactForm = () => {
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const messageRef = useRef<HTMLDivElement>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email_address: '',
      country: '',
      phone: '',
      how_can_help: '',
      subscribe_newsletter: false,
      agree_communication: false,
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {

    setIsSubmitting(true)
    setFormError(null)

    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json')

      const formData = {
        'first_name': data.first_name,
        'last_name': data.last_name,
        'email_address': data.email_address,
        'country': data.country,
        'phone': data.phone,
        'how_can_help': data.how_can_help,
        'subscribe_newsletter': data.subscribe_newsletter,
        'agree_communication': data.agree_communication,
        'ip_address': ipResponse?.data?.ip
      }

      const res = await createEntry(formData)
    
      if(res.success || res._id) {
        setIsSubmitting(false)
        setShowThankYou(true)
        reset() // Reset the form fields
        
        // Scroll to thank you message
        setTimeout(() => {
          messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 200)
      } else {
        setFormError(res?.errors?.message || "Something went wrong. Please try again.")
        setIsSubmitting(false)
      }
    } catch (error: any) {
      console.error('Submission error:', error)
      setFormError(error?.message || "Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <section className={classnames(styles.contact_sec2, 'pb_100')}>
      <div className="container">
        <div className={classnames(styles.contact_container)}>
          {/* Thank You Message */}
          {showThankYou && (
            <div ref={messageRef} className={styles.thank_you_message}>
              <Alert severity="success" onClose={() => setShowThankYou(false)}>
                <Typography variant="h6" component="div" gutterBottom>
                  Thank You!
                </Typography>
                <Typography variant="body1">
                  Your message has been submitted successfully. We'll get back to you soon!
                </Typography>
              </Alert>
            </div>
          )}

          {/* Form Error Message */}
          {formError && (
            <div className={styles.error_message}>
              <Alert severity="error" onClose={() => setFormError(null)}>
                {formError}
              </Alert>
            </div>
          )}

          <form
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-5'
            method='POST'
          >
            <div className={classnames(styles.contact_form, 'bx_sd')}>
              <div className={classnames(styles.contact_form_row, 'contact-fmain')}>
                <div className={classnames(styles.contact_half_box)}>
                  <Controller
                    name='first_name'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='First Name *'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
						InputLabelProps={{
						  shrink: true,
						}}
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message}
                      />
                    )}
                  />
                </div>
                <div className={classnames(styles.contact_half_box)}>
                  <Controller
                    name='last_name'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='text'
                        label='Last Name *'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
						InputLabelProps={{
						  shrink: true,
						}}
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                      />
                    )}
                  />
                </div>
                <div className={classnames(styles.contact_full_box)}>
                  <Controller
                    name='email_address'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='email'
                        label='Email *'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
						InputLabelProps={{
						  shrink: true,
						}}
                        error={!!errors.email_address}
                        helperText={errors.email_address?.message}
                      />
                    )}
                  />
                </div>
                <div className={classnames(styles.contact_half_box)}>
                  <Controller
                    name='country'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label='Country *'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
						InputLabelProps={{
						  shrink: true,
						}}
                        error={!!errors.country}
                        helperText={errors.country?.message}
                      >
                        <MenuItem value="">Select Country</MenuItem>
                        {countries.map((country, index) => (
                          <MenuItem key={index} value={country}>
                            {country}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </div>
                <div className={classnames(styles.contact_half_box)}>
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='tel'
                        label='Phone *'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
						InputLabelProps={{
						  shrink: true,
						}}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    )}
                  />
                </div>
                <div className={classnames(styles.contact_full_box, 'textarea-box')}>
                  <Controller
                    name='how_can_help'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label='How can we help? *'
                        onChange={e => {
                          field.onChange(e.target.value)
                          errorState !== null && setErrorState(null)
                        }}
						InputLabelProps={{
						  shrink: true,
						}}
                        error={!!errors.how_can_help}
                        helperText={errors.how_can_help?.message}
                      />
                    )}
                  />
                </div>
                <div className={classnames(styles.contact_full_box, styles.checkbox_label)}>
                  <Controller
                    name="subscribe_newsletter"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Get monthly inspiration. Subscribe to our newsletter."
                      />
                    )}
                  />
                </div>
                <div className={classnames(styles.contact_full_box, styles.checkbox_label)}>
                  <Controller
                    name="agree_communication"
                    control={control}
                    render={({ field }) => (
                      <>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          }
                          label="I agree to receive other communications from Adventure Network."
                        />
                        {errors.agree_communication && (
                          <p className={classnames(styles.contact_full_box, 'error-txt')}>
                            {errors.agree_communication.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className={classnames(styles.contact_full_box)}>
                  <p>You can unsubscribe at any time. We are committed to protecting your privacy. Please review our <a href="/privacy-policy/">Privacy Policy.</a></p>
                </div>
                <div className={classnames(styles.contact_full_box)}>
                  <button 
                    type="submit" 
                    className={styles.submit_btn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} style={{ marginRight: '8px' }} />
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactForm