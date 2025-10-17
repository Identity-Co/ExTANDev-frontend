'use client'

// React Imports
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import classnames from 'classnames'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
/*import TotalTravelSection1 from './TotalTravelSection1'
import TotalTravelSection2 from './TotalTravelSection2'*/

import { useSettings } from '@core/hooks/useSettings'

import styles from './styles.module.css'

const StaysTab = dynamic(() => import('@views/sub-pages/total-travel/stays'))
const FlightsTab = dynamic(() => import('@views/sub-pages/total-travel/flights'))
const CarsTab = dynamic(() => import('@views/sub-pages/total-travel/cars'))
const PackagesTab = dynamic(() => import('@views/sub-pages/total-travel/packages'))
const ThingsToDoTab = dynamic(() => import('@views/sub-pages/total-travel/things-to-do'))

//const CruisesTab = dynamic(() => import('@views/sub-pages/total-travel/cruises'))

const tabContentList = (props): { [key: string]: ReactElement } => ({
  stays: <StaysTab {...props}/>,
  flights: <FlightsTab {...props}/>,
  cars: <CarsTab {...props}/>,
  packages: <PackagesTab {...props}/>,
  thingstodo: <ThingsToDoTab {...props}/>
})

  //cruises: <CruisesTab {...props}/>

const LandingPageWrapper = ({ mode, banners, pgData }: { mode: Mode; banners?: []; pgData?: []; }) => {
  // Hooks
  const [val, setVal] = useState<string>('stays')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setVal(newValue)
  }

  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <BannerSection mode={mode} banners={banners?? []} />
      
      <TabContext value={val} className="my-5">
        <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example' className="destinations_tab total_travel_tab">
          <Tab value='stays' label='Stays' />
          <Tab value='flights' label='flights' />
          <Tab value='cars' label='Cars' />
          <Tab value='packages' label='Packages' />
          <Tab value='thingstodo' label='Things to do' />
          {/* <Tab value='cruises' label='Cruises' /> */}
        </TabList>
        <div className={classnames(styles.search_box, styles.search_box_total)}>
            <div className={classnames(styles.container, 'container')}>
                <div className={classnames(styles.search_box_inner)}>
                    <div className={classnames(styles.search_row)}>
                        <form>
                            <div className={classnames(styles.search_select, styles.ss1)}>
                                <label>Destinations</label>
                                <select name="cars" id="cars">
                                  <option value="">Destinations 1</option>
                                  <option value="">Destinations 2</option>
                                  <option value="">Destinations 3</option>
                                  <option value="">Destinations 4</option>
                                </select>
                            </div>
                            <div className={classnames(styles.search_select, styles.ss2)}>
                                <label>Dates</label>
                                <select name="cars" id="cars">
                                  <option value="">Dates 1</option>
                                  <option value="">Dates 2</option>
                                  <option value="">Dates 3</option>
                                  <option value="">Dates 4</option>
                                </select>
                            </div>
                            <div className={classnames(styles.search_select, styles.ss3)}>
                                <label>Travelers</label>
                                <select name="cars" id="cars">
                                  <option value="">Travelers 1</option>
                                  <option value="">Travelers 2</option>
                                  <option value="">Travelers 3</option>
                                  <option value="">Travelers 4</option>
                                </select>
                            </div>
                            <div className={classnames(styles.search_btn)}>
                                <input type="submit" name="" value="Search" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <TabPanel value={val} className='pbs-0'>
            {tabContentList({ pgData: pgData })[val]}
        </TabPanel>
      </TabContext>
    </>
  )
}

export default LandingPageWrapper
