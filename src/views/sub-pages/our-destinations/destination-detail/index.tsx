'use client'

// React Imports
import { useState } from 'react'

import dynamic from 'next/dynamic'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

const OverviewTab = dynamic(() => import('@views/sub-pages/our-destinations/destination-detail/overview'))
const ResortTab = dynamic(() => import('@views/sub-pages/our-destinations/destination-detail/resorts'))
const AdventureTab = dynamic(() => import('@views/sub-pages/our-destinations/destination-detail/adventures'))
const StoryTab = dynamic(() => import('@views/sub-pages/our-destinations/destination-detail/story'))

import BannerOverviewSection from './BannerOverviewSection'
import BannerOtherSection from './BannerOtherSection'

const tabContentList = (props): { [key: string]: ReactElement } => ({
  overview: <OverviewTab {...props}/>,
  resorts: <ResortTab {...props}/>,
  adventures: <AdventureTab {...props}/>,
  stories: <StoryTab {...props}/>
})

const PageSection = ({ pgData, id, resortDestinations }: { pgData?: []; id?: String; resortDestinations?: []; }) => {

  const [val, setVal] = useState<string>('overview')
  const [isOverviewDetailPage, setIsOverviewDetailPage] = useState(false);
  const [isOverviewDetailPageID, setIsOverviewDetailPageID] = useState<string>('');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setVal(newValue)
  }

  const adventureDetailPageData =
  val !== 'overview' && isOverviewDetailPageID && isOverviewDetailPage
    ? pgData?.adventures?.adventure_lists?.find(
        item => item._id === isOverviewDetailPageID
      )
    : null;

  return (
    <>
      {val === 'overview' ? (
        <BannerOverviewSection bannerData={pgData?.overview?.banners ?? []} />
      ) : isOverviewDetailPageID && isOverviewDetailPage ? (
        <BannerOtherSection
          bannerData={adventureDetailPageData?.banner_image} tabID={val} bannerTitle={adventureDetailPageData?.title} />
      ) : (
        <BannerOtherSection
          bannerData={pgData?.[val]?.banner_image} tabID={val} />
      )}
      <TabContext value={val} className="my-5">
        <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example' className="destinations_tab">
          <Tab value='overview' label='Overview' />
          <Tab value='resorts' label='Resorts' />
          <Tab value='adventures' label='Adventures' onClick={(e) => { setIsOverviewDetailPageID(''); setIsOverviewDetailPage(false); }} />
          <Tab value='stories' label='Stories' />
        </TabList>
        <TabPanel value={val} className='pbs-0'>
            {tabContentList({ pgData: pgData, destinations: resortDestinations, isOverviewDetailPage: isOverviewDetailPage, setIsOverviewDetailPage: setIsOverviewDetailPage, isOverviewDetailPageID: isOverviewDetailPageID, setIsOverviewDetailPageID: setIsOverviewDetailPageID })[val]}
        </TabPanel>
      </TabContext>
    </>
  )
}

export default PageSection
