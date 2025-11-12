'use client'

// React Imports
import { useEffect, useState, useRef } from 'react'

import dynamic from 'next/dynamic'

import classnames from 'classnames'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
/*import TotalTravelSection1 from './TotalTravelSection1'
import TotalTravelSection2 from './TotalTravelSection2'*/

import FormSection from '../signin/FormSection'

import { useSettings } from '@core/hooks/useSettings'

import { createAccessUserToken } from '@/app/server/total-travel';

import styles from './styles.module.css'

// Config Imports
import themeConfig from '@configs/themeConfig'

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
  
  //const [isFirstTime, setIsFirstTime] = useState(true)
  const [openAccess, setOpenAccess] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  const isLoadRef = useRef(false)

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


  const handleAccessClose = () => {
    //setIsFirstTime(false)
    setOpenAccess(false)
  };


  const fetchTokenData = async () => {
    const res = await createAccessUserToken();
    console.log('createAccessUserToken: ', res)

    if (res && res.session_token) {
      setAccessToken(res.session_token)

      // Function to dynamically load the travel client script
      const script = document.createElement('script')
      script.src = themeConfig.travel_client_script_url
      script.async = true

      script.onload = () => {
        console.log('Travel Client script loaded from index...')

        const checkClient = setInterval(() => {
          if (window.travelClient) {
            clearInterval(checkClient)

            try {
              window.travelClient.start({
                session_token: res.session_token,
                container: '.hotel_search_selector',
                navigate_to: {
                    view: 'home',
                  start_tab: "hotels"
                },
              })

              window.travelClient.on('error', function (err) {
                //console.error('Travel Client error:', err)
              })
            } catch (err) {
              //console.error('Error initializing travelClient:', err)
            }
          }
        }, 500)

        setIsLoaded(true)
      }

      script.onerror = () => {
        console.error('Failed to load Travel Client script.')
        setIsLoaded(true)
      }

      document.body.appendChild(script)

      // Cleanup on unmount
      return () => {
        if (script.parentNode) script.parentNode.removeChild(script)
      }
    } else {
      setIsLoaded(true)
    }

  };

  useEffect(() => {
      if (isLoadRef.current) return;
      isLoadRef.current = true

      fetchTokenData();

  }, [])



  return (
    <>
      <BannerSection mode={mode} banners={banners?? []} />

      <TabContext value={val} className="my-5">
        {isLoaded && (

            <TabPanel value={val} className='pbs-0'>
              {accessToken ?
                <>
                  <div className='hotel_search_selector'></div>
                </>
              :
                <>
                  {tabContentList({ pgData: pgData, setOpenAccess: setOpenAccess, accessToken: accessToken })[val]}
                </>
              }
            </TabPanel>

        )}
      </TabContext>

    </>
  )
}

export default LandingPageWrapper
