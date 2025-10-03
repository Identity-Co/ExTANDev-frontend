'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import AdventuresSection1 from './AdventuresSection1'
import AdventuresSection2 from './AdventuresSection2'
import AdventuresSection3 from '@/views/shared/instagram-feed-slider-section/InstagramFeedSlider'
import AdventuresSection4 from '@/views/shared/destination-featured-resorts-section/OurDestinationsFeaturedResorts'
import AdventuresSection5 from '@/views/shared/cta-section/CTASection'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ pgData, destinations}: AdventureProps) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  let featuredResorts: any[] = [];
  if(pgData?.adventures?.feature_resorts?.resorts){
    pgData.adventures.feature_resorts.resorts.forEach((item: any, index: number) => {
      featuredResorts?.push(pgData?.resorts?.resorts?.find(itemsub => itemsub._id == item))
    });
  }

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
    resorts : featuredResorts,
    heading_class: 'fs_35',
    class: 'our_desti_sec4',
    general_class: 'pb_150',
    sectionHeading: pgData?.adventures?.feature_resorts?.title ?? ''
  }

  return (
    <>
      <AdventuresSection1 data={pgData?.adventures ?? []} />
      <AdventuresSection2 />
      <AdventuresSection3 sectionProps={instagramSliderSectionProps} />
      <AdventuresSection4 sectionProps={featuredResortsSectionProps} />
      <AdventuresSection5 data={pgData ?? []} />
    </>
  )
}

export default LandingPageWrapper
