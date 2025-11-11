'use client'

import { useEffect, useRef, useState } from 'react'

import { createAccessUserToken, checkUserLogin } from '@/app/server/total-travel';

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

// Config Imports
import themeConfig from '@configs/themeConfig'

const TotalTravelSection1 = ({ data, setOpenAccess, accessToken }: { data?: []; setOpenAccess: string; accessToken?: string; }) => {

    const [loginErr, setLoginErr] = useState(0)

    const isLoadRef = useRef(false)

    /* const fetchCarsData = async () => {
      const res = await createAccessUserToken();
      console.log(res)

      if (res && res.session_token) {

        // Function to dynamically load the travel client script
        const script = document.createElement('script')

        script.src = themeConfig.travel_client_script_url
        script.async = true

        script.onload = () => {
          console.log('Travel Client script loaded.')

          // Wait a bit for the library to attach itself to window
          const checkClient = setInterval(() => {
            if (window.travelClient) {
              clearInterval(checkClient)

              try {
                window.travelClient.start({
                  session_token: res.session_token,
                  container: '.flights_search_selector',
                  navigate_to: {
                    view: 'home',
                    start_tab: "flights"
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
        }

        script.onerror = () => {
          console.error('Failed to load Travel Client script.')
        }

        document.body.appendChild(script)

        // Cleanup on unmount
        return () => {
          if (script.parentNode) script.parentNode.removeChild(script)
        }
      } else if (res && res.LoginErr) {
        setLoginErr(res.LoginErr)
      }

    }; */

    const fetchCarsData = async () => {
      console.log('accessToken: ', accessToken)

      if (accessToken) {

          console.log('Travel Client script loaded with main token.')

          // Wait a bit for the library to attach itself to window
          const checkClient = setInterval(() => {
            if (window.travelClient) {
              clearInterval(checkClient)

              try {
                window.travelClient.start({
                  session_token: accessToken,
                  container: '.flights_search_selector',
                  navigate_to: {
                    view: 'home',
                    start_tab: "flights"
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
        

      } else {
        const res = await checkUserLogin();
        if (res && res.LoginErr) {
          setLoginErr(1)
        }
      }

    };

    useEffect(() => {
        if (isLoadRef.current) return;
        isLoadRef.current = true

        fetchCarsData();

    }, [])

  return (
    <section className={classnames(styles.home_section1, styles.our_desti_sec1)}>
        
        {/* <div className="container">
            <div className={classnames(styles.head_text_center, 'head_text_center')}>
                <div className={classnames(styles.adventure_right_text)}>
                  <h2 className="fs_55">Coming Soon</h2>
                </div>
            </div>
        </div> */}

        <div className='flights_search_selector'></div>

        {loginErr == 1 && (
          <div className='login-err-msg'>
            <div className="container">
              Please <a href="#" onClick={(e) => { e.preventDefault(); setOpenAccess(true); }}>Login</a> or <a href="#" onClick={(e) => { e.preventDefault(); setOpenAccess(true); }}>Signup</a> to access Flights data.
            </div>
          </div>
        )}

    </section>
  )
}

export default TotalTravelSection1
