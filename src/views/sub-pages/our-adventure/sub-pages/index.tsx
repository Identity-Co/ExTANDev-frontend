'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import OurAdventureDetailSection1 from './OurAdventureDetailSection1'
import OurAdventureDetailSection2 from './OurAdventureDetailSection2'
import OurAdventureDetailSection3 from './OurAdventureDetailSection3'
import OurAdventureDetailSection4 from './OurAdventureDetailSection4'
import OurAdventureDetailSection5 from './OurAdventureDetailSection5'
import OurAdventureDetailSection6 from './OurAdventureDetailSection6'
import OurAdventureDetailSection7 from './OurAdventureDetailSection7'
import OurAdventureDetailSection8 from './OurAdventureDetailSection8'
import OurAdventureDetailSection9 from '@/views/shared/instagram-feed-section/InstagramFeed'
import OurAdventureDetailSection10 from '@/views/shared/cta-section/CTASection'
import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode, tour, tour_details, categories, filter_categories }: { mode: Mode; tour: any; tour_details: any; categories: any; filter_categories?: []; }) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const instagramFeedSectionProps = {
    username: '',
    general_class: 'py_150'
  }

  return (
    <>
      <BannerSection mode={mode} filter_categories={filter_categories} />
      <OurAdventureDetailSection1 tour={tour} tour_details={tour_details} topTitleAndInfo />
      <OurAdventureDetailSection2 tour={tour} imageAndDescription />
      <OurAdventureDetailSection3 tour_details={tour_details} categories={categories} isThisTourForMe />
      <OurAdventureDetailSection4 tour={tour} tour_details={tour_details} daysItinerary />
      <OurAdventureDetailSection5 tour={tour} tour_details={tour_details} departureDates />
      <OurAdventureDetailSection6 tour={tour} tour_details={tour_details} tourGallery />
      <OurAdventureDetailSection7 tour_details={tour_details} usefulInfo />
      <OurAdventureDetailSection8 tour={tour} tour_details={tour_details} whatsIncluded />
      <OurAdventureDetailSection9 sectionProps={instagramFeedSectionProps} />
      <OurAdventureDetailSection10 />
    </>
  )
}

export default LandingPageWrapper
