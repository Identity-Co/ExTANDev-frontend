'use client'

// React Imports
import { useState, useEffect, useRef } from 'react'

import dynamic from 'next/dynamic'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import { getFilteredCount } from '@/app/server/tours'

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

const PageSection = ({ pgData, id, resortDestinations, adventures, hasParam, filter_categories, locations, locDestinations, resortsLists }: { pgData?: []; id?: String; resortDestinations?: []; adventures?: []; hasParam?: false; filter_categories: []; locations?: []; locDestinations?: []; resortsLists?: []; }) => {
  // , suitable_for, season -- suitable_for?: '', season?: ''; 

  //const [val, setVal] = useState<string>((((suitable_for !== undefined && suitable_for) || (season !== undefined && season)) ? 'adventures' : 'overview'))
  
  const [val, setVal] = useState<string>('overview')
  const [totAdventures, setTotAdventures] = useState(0)
  const [totResorts, seTtotResorts] = useState(resortsLists.length?? 0)
  const [isOverviewDetailPage, setIsOverviewDetailPage] = useState(false);
  const [isOverviewDetailPageID, setIsOverviewDetailPageID] = useState<string>('');
  const [hideResorts, setHideResorts] = useState(false);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setVal(newValue)
  }

  const adventureDetailPageData =
  val !== 'overview' && isOverviewDetailPageID && isOverviewDetailPage
    ? pgData?.adventures?.adventure_lists?.find(
        item => item._id === isOverviewDetailPageID
      )
    : null;

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

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hide = searchParams.get("hide_resorts");

      const t_count = await getFilteredCount('', pgData?.destination_location ?? '');
      setTotAdventures(t_count);

      if (hide === "1") {
        setHideResorts(true);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {val === 'overview' ? (
        <BannerOverviewSection bannerData={pgData?.overview?.banners ?? []} locations={locations} locDestinations={locDestinations} cur_location={pgData.destination_location??''} />
      ) : isOverviewDetailPageID && isOverviewDetailPage ? (
        <BannerOtherSection
          bannerData={adventureDetailPageData?.banner_image} tabID={val} bannerTitle={adventureDetailPageData?.title} locations={locations} locDestinations={locDestinations} cur_location={pgData.destination_location??''} />
      ) : (
        <BannerOtherSection
          bannerData={pgData?.[val]?.banner_image} tabID={val} scrollRef={scrollref} locations={locations} locDestinations={locDestinations} cur_location={pgData.destination_location??''} />
      )}
      <TabContext value={val} className="my-5">
        <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example' className="destinations_tab">
          <Tab value='overview' label='Overview' />
          {(!hideResorts && totResorts > 0) && <Tab value='resorts' label='Resorts' />}
          {totAdventures > 0 && <Tab value='adventures' label='Adventures' onClick={(e) => { setIsOverviewDetailPageID(''); setIsOverviewDetailPage(false); }} />}
          <Tab value='stories' label='Stories' />
        </TabList>
        <TabPanel value={val} className='pbs-0'>
            {tabContentList({ pgData: pgData, destinations: resortDestinations, isOverviewDetailPage: isOverviewDetailPage, setIsOverviewDetailPage: setIsOverviewDetailPage, isOverviewDetailPageID: isOverviewDetailPageID, setIsOverviewDetailPageID: setIsOverviewDetailPageID, adventures:adventures, filter_categories: filter_categories, resortsLists: resortsLists })[val]}
        </TabPanel>
      </TabContext>
    </>
  )
}

export default PageSection
