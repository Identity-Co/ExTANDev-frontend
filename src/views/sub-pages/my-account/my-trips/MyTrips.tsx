'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'

import AccountSidebar from './../AccountSidebar'

// MUI Imports
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

import { toast } from 'react-toastify';

// Styles Imports
import styles from './../styles.module.css'

const MyTrips = ({ user, accessToken }: {user?: {}; accessToken?: string }) => {

    console.log(user , ' :: ', accessToken)

    const isLoadRef = useRef(false)

    const fetchCarsData = async () => {

      if (accessToken) {

          // Wait a bit for the library to attach itself to window
          const checkClient = setInterval(() => {
            if (window.travelClient) {
              clearInterval(checkClient)

              try {
                window.travelClient.start({
                  session_token: accessToken,
                  container: '.activities_search_selector',
                  navigate_to: {
                    view: 'my-trips'
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
      <div className={classnames(styles.grid_box)}>
        <div className='activities_search_selector'></div>
      </div>
    )
}

export default MyTrips
