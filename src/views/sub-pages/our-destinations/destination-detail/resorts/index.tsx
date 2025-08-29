'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import ResortsSection1 from './ResortsSection1'
import ResortsSection2 from '@/views/shared/destination-featured-resorts-section/OurDestinationsFeaturedResorts'
import ResortsSection3 from '@/views/shared/instagram-feed-slider-section/InstagramFeedSlider'
import ResortsSection4 from '@/views/shared/destination-featured-destinations-section/OurDestinationsFeaturedDestinations'
import ResortsSection5 from '@/views/shared/cta-section/CTASection'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode }: { mode: Mode }) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const instagramSliderSectionProps = {
    class: 'py_150',
  }

  const featuredResortsSectionProps = {
    resorts : [
        {   
          title: 'Kalon Surf Resort',
          sub_title: 'Guenacaste, Costa Rica',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort1.jpg',
        },
        {
          title: 'Tan resort jarabacoa',
          sub_title: 'Jarabacoa, Dominican Republic',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort2.jpg',
        },
        {
          title: 'mashpi Lodge',
          sub_title: 'Mashpi, Ecuador',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort3.jpg',
        },
        {
          title: 'Hotel caret, Mexico',
          sub_title: 'Riviera Maya, Mexico',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort4.jpg',
        },
        {   
          title: 'Kalon Surf Resort',
          sub_title: 'Guenacaste, Costa Rica',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort1.jpg',
        },
        {
          title: 'Tan resort jarabacoa',
          sub_title: 'Jarabacoa, Dominican Republic',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort2.jpg',
        },
        {
          title: 'mashpi Lodge',
          sub_title: 'Mashpi, Ecuador',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort3.jpg',
        },
        {
          title: 'Hotel caret, Mexico',
          sub_title: 'Riviera Maya, Mexico',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort4.jpg',
        },
        {   
          title: 'Kalon Surf Resort',
          sub_title: 'Guenacaste, Costa Rica',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort1.jpg',
        },
        {
          title: 'Tan resort jarabacoa',
          sub_title: 'Jarabacoa, Dominican Republic',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort2.jpg',
        },
        {
          title: 'mashpi Lodge',
          sub_title: 'Mashpi, Ecuador',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort3.jpg',
        },
        {
          title: 'Hotel caret, Mexico',
          sub_title: 'Riviera Maya, Mexico',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/sub-pages/resort4.jpg',
        },
    ],
    heading_class: 'fs_55',
    class: 'destination_resort_sec2 our_desti_sec2'
  }

  const featuredDestinationsSectionProps = {
    destinations : [
        {   
          title: 'Colombia',
          description: 'Adventure Wrapped in Rhythm',
          image: '/images/sub-pages/dest1.jpg',
        },
        {   
          title: 'El Salvador',
          description: 'Where Fire Meets Water',
          image: '/images/sub-pages/dest2.jpg',
        },
        {   
          title: 'Jamaica',
          description: 'Bold Culture, Wild Beauty',
          image: '/images/sub-pages/dest3.jpg',
        },
    ],
    heading_class: 'fs_55',
    class: 'destination_resort_sec4',
    general_class: 'pb_150',
    box_title_class: 'fs_70'
  }

  return (
    <>
      <BannerSection mode={mode} />
      <ResortsSection1 />
      <ResortsSection2 sectionProps={featuredResortsSectionProps} />
      <ResortsSection3 sectionProps={instagramSliderSectionProps} />
      <ResortsSection4 sectionProps={featuredDestinationsSectionProps} />
      <ResortsSection5 />
    </>
  )
}

export default LandingPageWrapper
