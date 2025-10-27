'use client'

import { useEffect, useRef, useState } from 'react'

import { createAccessUserToken } from '@/app/server/total-travel';

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

// Config Imports
import themeConfig from '@configs/themeConfig'

const TotalTravelSection1 = ({ data, isMore, setIsMore, setOpenAccess }: { data?: []; isMore?: string; setIsMore: string; setOpenAccess: string; }) => {

    const [loginErr, setLoginErr] = useState(0)

    const isLoadRef = useRef(false)

    const fetchCarsData = async () => {
      const res = await createAccessUserToken();

      if (res && res.session_token) {
        if(isMore == 1) {
          // Function to dynamically load the travel client script
          const script = document.createElement('script')

          //script.src = 'https://booking.accessdevelopment.com/scripts/travel.client.v2.js'
          //script.src = 'https://booking-stage.accessdevelopment.com/scripts/travel.client.v2.js'
          script.src = themeConfig.travel_client_script_url
          script.async = true

          /* script.onload = () => {
            console.log('Travel Client script loaded.')

            // Wait a bit for the library to attach itself to window
            const checkClient = setInterval(() => {
              if (window.travelClient) {
                clearInterval(checkClient)

                try {
                  window.travelClient.start({
                    session_token: res.session_token,
                    container: '.hotel_search_selector',
                    navigate_to: {
                      view: 'hotels',
                      destination: 'Portland%2C%20OR%2C%20US',
                      lat: 45.5231,
                      lon: -122.6765,
                      check_in: "2025-10-20",
                      check_out: "2024-10-25",
                      rooms: 1,
                      adults: 2,
                      children: 1,
                      child_ages: "7",
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

          document.body.appendChild(script) */


          // NEW CODE
          script.onload = () => {
            const restoreScroll = () => {
              const scrollY = window.scrollY;
              try {
                window.travelClient.start({
                  session_token: res.session_token,
                  container: '.hotel_search_selector',
                  navigate_to: {
                    view: 'hotels',
                    destination: 'Portland%2C%20OR%2C%20US',
                    lat: 45.5231,
                    lon: -122.6765,
                    check_in: "2025-10-20",
                    check_out: "2025-10-25",
                    rooms: 1,
                    adults: 2,
                    children: 1,
                    child_ages: "7",
                  },
                });
              } catch (err) {
                console.error('Error initializing travelClient:', err);
              }
              setTimeout(() => window.scrollTo(0, scrollY), 800);
            };

            const waitForClient = setInterval(() => {
              if (window.travelClient) {
                clearInterval(waitForClient);
                restoreScroll();
              }
            }, 300);
          };

          document.body.appendChild(script);
          // NEW CODE - ENDS


          // Cleanup on unmount
          return () => {
            if (script.parentNode) script.parentNode.removeChild(script)
          }
        }
      } else if (res && res.LoginErr) {
        setLoginErr(res.LoginErr)
        setIsMore(1)
      }

    };

    useEffect(() => {
        if (isLoadRef.current) return;
        isLoadRef.current = true

        fetchCarsData();

    }, [])

    useEffect(() => {
        fetchCarsData();
    }, [isMore])

    // Extract <strong> or <b> text only
    const extractBoldText = (html) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const strongText = tempDiv.querySelector('strong, b');
      return strongText ? strongText.textContent : '';
    };

    const boldText = extractBoldText(data?.about_content);

  return (
    <section className={classnames(styles.home_section1, styles.our_desti_sec1)}>
        <div className="container">
            <div className={classnames(styles.head_text_center, 'head_text_center')}>
                <div className={classnames(styles.adventure_right_text)}>
                    {data.about_title ? (<h2 className="fs_55">{data.about_title}</h2>) : null}

                    {/* isMore==1 && (
                      data?.about_content && (
                          <div dangerouslySetInnerHTML={{ __html: data?.about_content }} ></div>
                      )
                    ) */}

                    {isMore === 0 ? (
                      <>
                        <p><strong>{boldText}</strong></p>
                        <button
                          onClick={() => setIsMore(1)}
                          style={{
                            background: '#007bff',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          More
                        </button>
                      </>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: data?.about_content }} ></div>
                    )}


                </div>
            </div>
        </div>

        <div className='hotel_search_selector' style={{ display: isMore === 0 ? 'none' : 'block' }}></div>

        {loginErr == 1 && (
          <div className='login-err-msg'>
            <div className="container">
              Please <a href="#" onClick={(e) => { e.preventDefault(); setOpenAccess(true); }}>Login</a> or <a href="#" onClick={(e) => { e.preventDefault(); setOpenAccess(true); }}>Signup</a> to access Stays data.
            </div>
          </div>
        )}

    </section>
  )
}

export default TotalTravelSection1
