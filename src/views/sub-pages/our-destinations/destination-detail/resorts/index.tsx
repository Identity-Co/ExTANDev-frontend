'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import ResortsSection1 from './ResortsSection1'
import ResortsSection2 from '@/views/shared/destination-featured-resorts-section/OurDestinationsFeaturedResorts'
import ResortsSection3 from '@/views/shared/instagram-feed-slider-section/InstagramFeedSlider'
import ResortsSection4 from '@/views/shared/destination-featured-destinations-section/OurDestinationsFeaturedDestinations'
import ResortsSection5 from '@/views/shared/cta-section/CTASection'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ pgData, destinations}: ResortsProps) => {
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
    resorts: pgData?.resorts?.resorts,
    heading_class: 'fs_55',
    class: 'destination_resort_sec2 our_desti_sec2'
  }

  const featuredDestinationsSectionProps = {
    destinations : destinations,
    heading_class: 'fs_55',
    class: 'destination_resort_sec4',
    general_class: 'pb_150',
    box_title_class: 'fs_70'
  }

  return (
    <>
      <ResortsSection1 data={pgData?.resorts ?? []} />
      <ResortsSection2 sectionProps={featuredResortsSectionProps} />
      <ResortsSection3 sectionProps={instagramSliderSectionProps} />
      <ResortsSection4 sectionProps={featuredDestinationsSectionProps} />
      <ResortsSection5 data={pgData ?? []} />
    </>
  )
}

export default LandingPageWrapper
