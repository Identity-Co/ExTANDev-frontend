'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import AdventuresSection1 from './AdventuresSection1'
import AdventuresSection2 from './AdventuresSection2'
import AdventuresSection3 from '@/views/shared/instagram-feed-slider-section/InstagramFeedSlider'
import AdventuresSection4 from '@/views/shared/destination-featured-resorts-section/OurDestinationsFeaturedResorts'
import AdventuresSection5 from '@/views/shared/cta-section/CTASection'

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
    ],
    heading_class: 'fs_35',
    class: 'our_desti_sec4',
    general_class: 'pb_150',
  }

  return (
    <>
      <BannerSection mode={mode} />
      <AdventuresSection1 />
      <AdventuresSection2 />
      <AdventuresSection3 sectionProps={instagramSliderSectionProps} />
      <AdventuresSection4 sectionProps={featuredResortsSectionProps} />
      <AdventuresSection5 />
    </>
  )
}

export default LandingPageWrapper
