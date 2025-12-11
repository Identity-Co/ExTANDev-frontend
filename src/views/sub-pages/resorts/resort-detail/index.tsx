'use client'

// React Imports
import { useState, useEffect, useRef } from 'react'

import dynamic from 'next/dynamic'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

const OverviewTab = dynamic(() => import('@views/sub-pages/resorts/resort-detail/overview'))
const RoomsTab = dynamic(() => import('@views/sub-pages/resorts/resort-detail/rooms'))
const ServicesAmenitiesTab = dynamic(() => import('@views/sub-pages/resorts/resort-detail/services-amenities'))
const OffersTab = dynamic(() => import('@views/sub-pages/resorts/resort-detail/offers'))
const StoryTab = dynamic(() => import('@views/sub-pages/resorts/resort-detail/story'))

import BannerOverviewSection from './BannerOverviewSection'
import BannerOtherSection from './BannerOtherSection'

const tabContentList = (props): { [key: string]: ReactElement } => ({
  overview: <OverviewTab {...props}/>,
  rooms: <RoomsTab {...props}/>,
  services_amenities: <ServicesAmenitiesTab {...props}/>,
  offers: <OffersTab {...props}/>,
  stories: <StoryTab {...props}/>
})

const PageSection = ({ pgData}: { pgData?: []; }) => {

  const [val, setVal] = useState<string>('overview')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setVal(newValue)
  }

  return (
    <>
      <BannerOverviewSection resortName={pgData?.name ?? ''} bannerData={pgData?.[val]?.banners ?? []} bookingUrl={pgData?.booking_url ?? ''} bookingDateFormat={pgData?.booking_url_date_format ?? ''} />
      <TabContext value={val} className="my-5">
        <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example' className="destinations_tab">
          <Tab value='overview' label='Overview' />
          <Tab value='rooms' label='Rooms' />
          <Tab value='services_amenities' label='Services & Amenities' />
          <Tab value='offers' label='Offers' />
          <Tab value='stories' label='Stories' />
        </TabList>
        <TabPanel value={val} className='pbs-0'>
            {tabContentList({ pgData: pgData })[val]}
        </TabPanel>
      </TabContext>
    </>
  )
}

export default PageSection
