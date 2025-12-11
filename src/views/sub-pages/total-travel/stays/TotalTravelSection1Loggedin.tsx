'use client'

import { useEffect, useRef, useState } from 'react'

import { createAccessUserToken, checkUserLogin } from '@/app/server/total-travel';

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

// Config Imports
import themeConfig from '@configs/themeConfig'

const TotalTravelSection1Loggedin = ({ data, setOpenAccess, accessToken }: { data?: []; setOpenAccess: string; accessToken?: string; }) => {

    const [loginErr, setLoginErr] = useState(0)

    const isLoadRef = useRef(false)

    const fetchCarsData = async () => {
      console.log('accessToken: ', accessToken)

      if (accessToken) {
          // Wait a bit for the library to attach itself to window
          const checkClient = setInterval(() => {
            if (window.travelClient) {
              clearInterval(checkClient)

              try {
                window.travelClient.start({
                  session_token: accessToken,
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
      }

    };

    const fetchIframe = () => {
      const checkFrame = setInterval(() => {
        var iframeEL = document.querySelector("iframe");

        if (iframeEL !== undefined) {
          clearInterval(checkFrame);

          const observer = new MutationObserver(() => {
            console.log("Iframe started loading (src changed)");
          });

          observer.observe(iframeEL, { attributes: true, attributeFilter: ["src"] });
        }
      }, 500);
    };

    useEffect(() => {
        if (isLoadRef.current) return;
        isLoadRef.current = true

        fetchCarsData();
        fetchIframe();
    }, [])


  return (
    <section className={classnames(styles.home_section1, styles.hotels_login, styles.our_desti_sec1)}>

      <div className='hotel_search_selector'></div>

    </section>
  )
}

export default TotalTravelSection1Loggedin
