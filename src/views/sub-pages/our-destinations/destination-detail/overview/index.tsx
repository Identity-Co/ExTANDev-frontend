'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import OverviewSection1 from './OverviewSection1'
import OverviewSection2 from './OverviewSection2'
import OverviewSection3 from './OverviewSection3'
import OverviewSection4 from './OverviewSection4'
import OverviewSection5 from './OverviewSection5'
import OverviewSection6 from '@/views/shared/instagram-feed-slider-section/InstagramFeedSlider'
import OverviewSection7 from '@/views/shared/destination-featured-resorts-section/OurDestinationsFeaturedResorts'
import OverviewSection8 from './OverviewSection8'
import OverviewSection9 from '@/views/shared/instagram-feed-section/InstagramFeed'
import OverviewSection10 from '@/views/shared/cta-section/CTASection'
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
    class: 'pb_150',
  }

  const featuredResortsSectionProps = {
    resorts : [
        {   
          title: 'Kalon Surf Resort',
          sub_title: 'Guenacaste, Costa Rica',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/front-pages/images/resort1.jpg',
        },
        {
          title: 'Tan resort jarabacoa',
          sub_title: 'Jarabacoa, Dominican Republic',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/front-pages/images/resort2.jpg',
        },
        {
          title: 'mashpi Lodge',
          sub_title: 'Mashpi, Ecuador',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/front-pages/images/resort3.jpg',
        },
    ],
    heading_class: 'fs_35',
    class: ''
  }

  const instagramFeedSectionProps = {
    username: '@andominican',
    general_class: 'py_150'
  }

  return (
    <>
      <BannerSection mode={mode} />
      <OverviewSection1 />
      <OverviewSection2 />
      <OverviewSection3 />
      <OverviewSection4 />
      <OverviewSection5 />
      <OverviewSection6 sectionProps={instagramSliderSectionProps} />
      <OverviewSection7 sectionProps={featuredResortsSectionProps} />
      <OverviewSection8 />
      <OverviewSection9 sectionProps={instagramFeedSectionProps} />
      <OverviewSection10 />
    </>
  )
}

export default LandingPageWrapper
