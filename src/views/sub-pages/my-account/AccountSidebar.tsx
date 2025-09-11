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
        <div className={classnames(styles.grid_box)}>
          {session && (
            <>
              <Typography>Welcome {session?.user?.name}!</Typography>
              <Link href="/edit-profile/">Edit Profile</Link><br />
              <Link href="/change-password/">Change Password</Link><br />
              <Link href="#" onClick={handleUserLogout}>Logout</Link><br />
            </>
          )}
        </div>
    )
}

export default AccountSidebar
