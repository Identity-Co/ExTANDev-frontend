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

import AdventuresDetailSection1 from './sub-pages/AdventuresDetailSection1'
import AdventuresDetailSection2 from './sub-pages/AdventuresDetailSection2'
import AdventuresDetailSection3 from './sub-pages/AdventuresDetailSection3'
import AdventuresDetailSection4 from '@/views/shared/instagram-feed-section/InstagramFeed'

import { useSettings } from '@core/hooks/useSettings'

import { getEntry } from '@/app/server/reviews'

type AdventureProps = {
  pgData: []
  destinations: []
  isOverviewDetailPage: boolean
  setIsOverviewDetailPage: React.Dispatch<React.SetStateAction<boolean>>;
  isOverviewDetailPageID: string
  setIsOverviewDetailPageID: React.Dispatch<React.SetStateAction<string>>;
}

const LandingPageWrapper = ({ pgData, destinations, isOverviewDetailPage, setIsOverviewDetailPage, isOverviewDetailPageID, setIsOverviewDetailPageID}: AdventureProps) => {
  const adventurePosts = pgData?.adventures?.adventure_posts;

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
    lists: adventurePosts?? []
  }

  const featuredResortsSectionProps = {
    resorts : featuredResorts,
    heading_class: 'fs_35',
    class: 'our_desti_sec4',
    general_class: 'pb_150',
    sectionHeading: pgData?.adventures?.feature_resorts?.title ?? ''
  }

  if(isOverviewDetailPage && isOverviewDetailPageID){
    const detailPageData = pgData?.adventures?.adventure_lists?.find(item => item._id === isOverviewDetailPageID);
    return (
      <>
        <AdventuresDetailSection1 data={detailPageData ?? []} />
        <AdventuresDetailSection2 data={detailPageData ?? []} />
        <AdventuresDetailSection3 map_image={detailPageData?.map_image ?? ''} />
        <AdventuresDetailSection4 sectionProps={featuredResortsSectionProps} />
      </>
    );
  }else{
    return (
      <>
        <AdventuresSection1 data={pgData?.adventures ?? []} />
        <AdventuresSection2 data={pgData?.adventures ?? []} isOverviewDetailPage={isOverviewDetailPage} setIsOverviewDetailPage={setIsOverviewDetailPage} isOverviewDetailPageID={isOverviewDetailPageID} setIsOverviewDetailPageID={setIsOverviewDetailPageID} />
        <AdventuresSection3 sectionProps={instagramSliderSectionProps} />
        <AdventuresSection4 sectionProps={featuredResortsSectionProps} />
        <AdventuresSection5 data={pgData ?? []} />
      </>
    )
  }
}

export default LandingPageWrapper
