'use client'

// React Imports
import { useState, useEffect, useRef } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import OurDestinationsSection1 from './OurDestinationsSection1'
import OurDestinationsSection2 from '@/views/shared/destination-featured-destinations-section/OurDestinationsFeaturedDestinations'
import OurDestinationsSection3 from '@/views/shared/instagram-feed-slider-section/InstagramFeedSlider'
import OurDestinationsSection4 from '@/views/shared/destination-featured-resorts-section/OurDestinationsFeaturedResorts'
import OurDestinationsSection5 from '@/views/shared/instagram-feed-section/InstagramFeed'
import OurDestinationsSection6 from '@/views/shared/review-form-section/ReviewFormSection'
import OurDestinationsSection7 from '@/views/shared/cta-section/CTASection'
import { useSettings } from '@core/hooks/useSettings'

import * as Common from '@/app/server/common'

const DestinationDetailPage = ({ mode, banners, pgData, featuredDestinations, featuredResorts, locations, locDestinations, hasParam, location, resort }: { mode: Mode; banners?: []; pgData?: []; destinations?: []; featuredResorts?: []; locations?: []; locDestinations?: []; hasParam?: false, location?: ''; resort?: '' }) => {
  const adventure_Posts = pgData?.adventure_posts;

  const scrollref = useRef(null);

  useEffect(() => {
    if (hasParam) {
      const el = scrollref.current;
      if (!el) return;

      const vw = window.innerWidth / 100;

      const desktopOffsetVW = 8;
      const desktopOffset = desktopOffsetVW * vw;

      const mobileOffsetVW = 14;
      const mobileOffset = mobileOffsetVW * vw;

      const offset = window.innerWidth < 768 ? mobileOffset : desktopOffset;

      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [hasParam]);

  // Hooks
  const { updatePageSettings } = useSettings()

  const [isUserLoggedIn, setisUserLoggedIn] = useState(null)
  const [userData, setuserData] = useState(null)

  useEffect(() => {
    const getSessData = async () => {
      const sess = await Common.getUserSess();
      if(sess && sess?.user?.role == 'user'){
        setuserData(sess)
        setisUserLoggedIn(true);
      }
    };
    getSessData();
  }, []);

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const instagramSliderSectionProps = {
    class: 'pb_150 pt_50',
    lists: adventure_Posts?? []
  }

  const featuredResortsSectionProps = {
    resorts : featuredResorts??[],
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
      {banners.length ? <BannerSection mode={mode} banners={banners} locations={locations} locDestinations={locDestinations?.data} scrollRef={scrollref}  /> : null}
      <OurDestinationsSection1 data={pgData} />
      <OurDestinationsSection2 data={pgData} sectionProps={featuredDestinationsSectionProps} hasParam={hasParam} isPaginated={true} />
      <OurDestinationsSection3 data={pgData} sectionProps={instagramSliderSectionProps} />
      <OurDestinationsSection4 data={pgData} sectionProps={featuredResortsSectionProps} />
      <OurDestinationsSection5 sectionProps={instagramFeedSectionProps} />
      {isUserLoggedIn &&(
        <OurDestinationsSection6 data={userData?.user?.id} collection_id={pgData?._id} collection_name="Destination Page" />
      )}
      <OurDestinationsSection7 data={pgData} />
    </>
  )
}

export default DestinationDetailPage
