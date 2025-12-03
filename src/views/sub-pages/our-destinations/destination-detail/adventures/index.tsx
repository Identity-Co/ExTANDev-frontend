'use client'

// React Imports
import { useEffect, useState } from 'react'

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
import { getResortsByTag } from '@/app/server/resorts';

type AdventureProps = {
  pgData: []
  destinations: []
  isOverviewDetailPage: boolean
  setIsOverviewDetailPage: React.Dispatch<React.SetStateAction<boolean>>;
  isOverviewDetailPageID: string
  setIsOverviewDetailPageID: React.Dispatch<React.SetStateAction<string>>;
  adventures: [];
  filter_categories: [];
}

const LandingPageWrapper = ({ pgData, destinations, isOverviewDetailPage, setIsOverviewDetailPage, isOverviewDetailPageID, setIsOverviewDetailPageID, adventures, filter_categories}: AdventureProps) => {
  
  const [currentCat, setCurrentCat] = useState('')
  const [currentTours, setCurrentTours] = useState([])
  const [featuredResorts, setFeaturedResorts] = useState([])

  const adventurePosts = pgData?.adventures?.adventure_posts;

  // Hooks
  const { updatePageSettings } = useSettings()
  
  useEffect(() => {
    const fetchData = async () => {
      if(pgData?.adventures?.feature_resorts?.resorts){
        const requestData: any = {
          'tag': pgData?.adventures?.feature_resorts?.resorts,
          'fields': '',
        };
        const resorts = await getResortsByTag(requestData);
        setFeaturedResorts(resorts);
      }
    }

    fetchData();
  }, pgData?.adventures?.feature_resorts?.resorts);

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
        <AdventuresDetailSection2 data={adventures ?? []} />
        <AdventuresDetailSection3 map_image={detailPageData?.map_image ?? ''} />
        <AdventuresDetailSection4 sectionProps={featuredResortsSectionProps} />
      </>
    );
  }else{
    return (
      <>
        <AdventuresSection1 data={pgData?.adventures ?? []} filter_categories={filter_categories} dest_data={pgData} setCurrentTours={setCurrentTours} setCurrentCat={setCurrentCat} />

        <AdventuresSection2 data={adventures ?? []} isOverviewDetailPage={isOverviewDetailPage} setIsOverviewDetailPage={setIsOverviewDetailPage} isOverviewDetailPageID={isOverviewDetailPageID} setIsOverviewDetailPageID={setIsOverviewDetailPageID} dest_data={pgData} currentTours={currentTours} setCurrentTours={setCurrentTours} currentCat={currentCat} setCurrentCat={setCurrentCat} />
        <AdventuresSection3 sectionProps={instagramSliderSectionProps} />
        <AdventuresSection4 sectionProps={featuredResortsSectionProps} />
        <AdventuresSection5 data={pgData ?? []} />
      </>
    )
  }
}

export default LandingPageWrapper
