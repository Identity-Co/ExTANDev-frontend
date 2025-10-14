'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import OurDestinationsSection1 from './OurDestinationsSection1'
import OurDestinationsSection2 from '@/views/shared/destination-featured-destinations-section/OurDestinationsFeaturedDestinations'
import OurDestinationsSection3 from '@/views/shared/instagram-feed-slider-section/InstagramFeedSlider'
import OurDestinationsSection4 from '@/views/shared/destination-featured-resorts-section/OurDestinationsFeaturedResorts'
import OurDestinationsSection5 from '@/views/shared/instagram-feed-section/InstagramFeed'
import OurDestinationsSection6 from '@/views/shared/cta-section/CTASection'
import { useSettings } from '@core/hooks/useSettings'

const DestinationDetailPage = ({ mode, banners, pgData, featuredDestinations }: { mode: Mode; banners?: []; pgData?: []; destinations?: []; }) => {
  console.log(featuredDestinations)
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
    class: 'pb_150 pt_50',
  }

  const featuredResortsSectionProps = {
    resorts : pgData?.feature_resorts??[],
    heading_class: 'fs_35',
    class: ''
  }

  const featuredDestinationsSectionProps = {
    destinations : featuredDestinations??[],
    heading_class: 'fs_40',
    class: 'our_desti_sec2',
    box_title_class: 'fs_60'
  }

  const instagramFeedSectionProps = {
    username: '@andestinations',
    general_class: 'py_150'
  }

  return (
    <>
      {banners.length ? <BannerSection mode={mode} banners={banners} /> : null}
      <OurDestinationsSection1 data={pgData} />
      <OurDestinationsSection2 data={pgData} sectionProps={featuredDestinationsSectionProps} />
      <OurDestinationsSection3 data={pgData} sectionProps={instagramSliderSectionProps} />
      <OurDestinationsSection4 data={pgData} sectionProps={featuredResortsSectionProps} />
      <OurDestinationsSection5 sectionProps={instagramFeedSectionProps} />
      <OurDestinationsSection6 data={pgData} />
    </>
  )
}

export default DestinationDetailPage
