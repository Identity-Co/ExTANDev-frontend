// src/views/sub-pages/our-destinations/ReviewFormSection.js
import { useState, useRef } from 'react'

import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { Controller, useForm } from 'react-hook-form'
import classnames from 'classnames'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, pipe, string, minLength, number, minValue } from 'valibot'

import axios from 'axios';

import { createEntry } from '@/app/server/reviews'

import styles from './styles.module.css'

const schema = object({
  rating: pipe(number(), minValue(1, 'Rating required')),
  review_text: pipe(string(), minLength(1, 'Comment required')),
});

const ReviewForm = ({ data, collection_id, collection_name }: { data?: []; collection_id?: 0; collection_name?: '' }) => {
  const [submitted, setSubmitted] = useState(false)
  const [ratingError, setRatingError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)

  const userID = data?? '';

  const {
    control,
    handleSubmit,
    watch, setValue,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      rating: 0,
      review_text: '',
    }
  })

 const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true)
    setFormError(null)

    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json')
      const currentUrl = window.location.href;

      const formData = {
        'rating': data.rating,
        'review_text': data.review_text,
        'collection_id': collection_id,
        'collection_name': collection_name,
        'user_id': userID,
        'review_url': currentUrl,
        'status': 0,
        'ip_address': ipResponse?.data?.ip
      }

      const res = await createEntry(formData)
    
      if(res.success || res._id) {
        setIsSubmitting(false)
        reset() // Reset the form fields
        
        // Scroll to thank you message
        setTimeout(() => {
          messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 200)
        setSubmitted(true)
      } else {
        setFormError(res?.errors?.message || "Something went wrong. Please try again.")
        setIsSubmitting(false)
        setSubmitted(false)
      }
    } catch (error: any) {
      console.error('Submission error:', error)
      setFormError(error?.message || "Something went wrong. Please try again.")
      setIsSubmitting(false)
      setSubmitted(false)
    }
  }

  // Star icon component
  const StarIcon = ({ filled }) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )

  return (
    <section className={classnames(styles.review_frm_sec, 'pb_100')}>
      <div className="container">
        {submitted ? (
          // Success Message
          <div ref={messageRef} className={classnames(styles.review_card)}>
            <div className={classnames(styles.review_card_content)}>
              <div className={classnames(styles.success_message)}>
                {/* Success Icon */}
                <div className={classnames(styles.success_icon)}>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="#FFF"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
                
                <h2 className={classnames(styles.success_title)}>Thank You for Your Review!</h2>
                
                <p className={classnames(styles.success_description)}>
                  Your review has been submitted successfully. We appreciate you taking the time to share your experience with us.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Review Form
          <div className={classnames(styles.review_card)}>
            <div className={classnames(styles.review_card_header)}>
              <h2>Write a Review</h2>
            </div>
            <div className={classnames(styles.review_card_content)}>
              {formError && (
                <div className={styles.error_message}>
                  <Alert severity="error" onClose={() => setFormError(null)}>
                    {formError}
                  </Alert>
                </div>
              )}
              <form noValidate
              autoComplete='off'
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-5'
              method='POST'
              >
                <div className={classnames(styles.review_frm_inner)}>
                  {/* Star Rating Section */}
                  <div className={classnames(styles.rating_section)}>
                    <div className={classnames(styles.rating_label)}>Your Rating *</div>
                    <div className={classnames(styles.stars_container)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={classnames(
                            styles.star_wrapper,
                            star <= watch('rating') ? styles.star_filled : styles.star_empty
                          )}
                          onClick={() => setValue('rating', star, { shouldValidate: true })}
                        >
                          <StarIcon filled={star <= watch('rating')} />
                        </div>
                      ))}
                    </div>
                    {errors.rating && (
                      <div className={classnames(styles.rating_error)}>
                        {errors.rating.message}
                      </div>
                    )}
                  </div>

                  {/* Comment Field */}
                  <div className={classnames(styles.comment_box, 'textarea-box comment-field')}>
                    <Controller
                      name='review_text'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={2}
                          label='Your Review *'
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={!!errors.review_text}
                        />
                      )}
                    />
                    {errors.review_text && (
                      <div className={classnames(styles.rating_error)}>
                        {errors.review_text.message}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className={classnames(styles.frm_btn_wrap)}>
                    <button 
                      type="submit" 
                      className={classnames(styles.submit_btn, 'btn')}
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
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ReviewForm