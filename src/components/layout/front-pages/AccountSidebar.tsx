'use client'

import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

import * as Common from '@/app/server/common'

// MUI Imports
import Typography from '@mui/material/Typography'

// Third-party Imports
import { signOut } from 'next-auth/react'
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const AccountSidebar = () => {
    const [session, setSession] = useState(null)

    useEffect(() => {
      const getSessData = async () => {
        const sess = await Common.getUserSess();
        setSession(sess);
      };
      getSessData();
    }, []);

    const handleUserLogout = async () => {
      try {
        await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
      } catch (error) {
        console.error(error)
      }
    }
  
    return (
      <div className={classnames(styles.grid_box), "sidebar-box"}>
        {session && (
          <>
            <Typography>Welcome {session?.user?.name}!</Typography>
            <ul>
              <li>
                <Link href="/edit-profile/">Edit Profile</Link>
              </li>
              {session?.user?.role == 'ambassador' && (
                <li>
                  <Link href="/my-account/adventure-guides/">Adventure Guide</Link>
                </li>
              )}
              <li>
                <Link href="/change-password/">Change Password</Link>
              </li>
              <li>
                <Link href="#" onClick={handleUserLogout}>Logout</Link>
              </li>
            </ul>
          </>
        )}
      </div>
    )

}

export default AccountSidebar
