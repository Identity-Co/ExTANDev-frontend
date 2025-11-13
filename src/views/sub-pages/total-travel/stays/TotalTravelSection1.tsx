'use client'

import { useEffect, useRef, useState } from 'react'

import { createAccessUserToken, checkUserLogin } from '@/app/server/total-travel';

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

// Config Imports
import themeConfig from '@configs/themeConfig'

const TotalTravelSection1 = ({ data, isMore, setIsMore, setOpenAccess, accessToken }: { data?: []; isMore?: string; setIsMore: string; setOpenAccess: string; accessToken?: string; }) => {

    const [loginErr, setLoginErr] = useState(0)

    const isLoadRef = useRef(false)

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

                    <div dangerouslySetInnerHTML={{ __html: data?.about_content }} ></div>

                </div>
            </div>
        </div>

        {!accessToken && (
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
