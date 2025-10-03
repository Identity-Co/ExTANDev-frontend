'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
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

const LandingPageWrapper = ({ pgData, destinations}: OverviewProps) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  let featuredResorts: any[] = [];
  if(pgData?.overview?.feature_resorts?.resorts){
    pgData.overview.feature_resorts.resorts.forEach((item: any, index: number) => {
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
    class: 'pb_150',
  }

  const featuredResortsSectionProps = {
    resorts: featuredResorts,
    heading_class: 'fs_35',
    class: '',
    sectionHeading: pgData?.overview?.feature_resorts?.title ?? ''
  }

  const instagramFeedSectionProps = {
    username: '@andominican',
    general_class: 'py_150'
  }

  return (
    <>
      <OverviewSection1 data={pgData?.overview ?? []} />
      
      {pgData?.overview?.sections.map((section: any, index: number) => {
        return section?.direction === 'content_first' 
          ? <OverviewSection2 key={index} data={section ?? []} />
          : <OverviewSection3 key={index} data={section ?? []} />;

      })}
      <OverviewSection4 data={pgData?.overview?.slider_images ?? []} />
      <OverviewSection5 data={pgData?.overview?.facts ?? []} />
      <OverviewSection6 sectionProps={instagramSliderSectionProps} />

      <OverviewSection7 sectionProps={featuredResortsSectionProps} />
      <OverviewSection8 data={pgData?.overview?.faq ?? []} />
      <OverviewSection9 sectionProps={instagramFeedSectionProps} />
      <OverviewSection10 data={pgData ?? []} />
    </>
  )
}
export default LandingPageWrapper
