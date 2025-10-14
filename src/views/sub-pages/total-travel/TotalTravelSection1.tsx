'use client'

import { useEffect } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const TotalTravelSection1 = ({ data }: { data?: [] }) => {

    useEffect(() => {
        // Function to dynamically load the travel client script
        const script = document.createElement('script')

        //script.src = 'https://booking.accessdevelopment.com/scripts/travel.client.v2.js'
        script.src = 'https://booking-stage.accessdevelopment.com/scripts/travel.client.v2.js'
        script.async = true

        script.onload = () => {
          console.log('Travel Client script loaded.')

          // Wait a bit for the library to attach itself to window
          const checkClient = setInterval(() => {
            if (window.travelClient) {
              clearInterval(checkClient)

              try {
                window.travelClient.start({
                  //session_token: "ACCESS_SESSION_s0xdt6nlUYd4ryTlmsUjNuKvw4ZVLsUF", // LIVE
                  session_token: 'ACCESS_SESSION_itR_bDu1Lg7HGM7msqxejJa8LyKBJnJv', // STAGE
                  container: '.hotel_search_selector',
                  navigate_to: {
                    view: 'cars',
                    destination: 'MCO - Orlando International Airport - Orlando United States',
                    return_destination: 'TPA - Tampa International Airport - Tampa United States',
                    pickup_date_time: '2025-10-20T10:00',
                    return_date_time: '2025-10-22T14:00',
                  },
                })

                window.travelClient.on('error', function (err) {
                  console.error('Travel Client error:', err)
                })
              } catch (err) {
                console.error('Error initializing travelClient:', err)
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
    }, [])
  
  return (
    <section className={classnames(styles.home_section1, styles.our_desti_sec1)}>
        <div className="container">
            <div className={classnames(styles.head_text_center, 'head_text_center')}>
                <div className={classnames(styles.adventure_right_text)}>
                    {data.about_title ? (<h2 className="fs_55">{data.about_title}</h2>) : null}

                    {data?.about_content && (
                        <div dangerouslySetInnerHTML={{ __html: data?.about_content }} ></div>
                    )}
                </div>
            </div>
        </div>

        <div className='hotel_search_selector'></div>

    </section>
  )
}

export default TotalTravelSection1
