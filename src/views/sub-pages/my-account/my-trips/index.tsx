'use client'

// React Imports
import { useEffect, useState, useRef } from 'react'

import { createAccessUserToken } from '@/app/server/total-travel';

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './../BannerSection'
import AmbassadorshipSection1 from './../AmbassadorshipSection1'
import MyTrips from './MyTrips'

import { useSettings } from '@core/hooks/useSettings'

// Config Imports
import themeConfig from '@configs/themeConfig'


const LandingPageWrapper = ({ mode, user }: { mode: Mode; user: {} }) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  const [openAccess, setOpenAccess] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  const isLoadRef = useRef(false)

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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
      {isLoaded && (
        <MyTrips user={user} accessToken={accessToken} />
      )}
    </>
  )
}

export default LandingPageWrapper
