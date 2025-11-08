'use client'

// Next Imports
import Link from 'next/link'

import AccountSidebar from './../AccountSidebar'

// MUI Imports
import Typography from '@mui/material/Typography'

// Third-party Imports
import { signOut } from 'next-auth/react'
import classnames from 'classnames'

// Styles Imports
import styles from './../styles.module.css'

const MyAccount = ({ session, history }: { session: any; history: any }) => {

    const handleUserLogout = async () => {
      try {
        // Sign out from the app
        await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
      } catch (error) {
        console.error(error)

        // Show above error in a toast like following
        // toastService.error((err as Error).message)
      }
    }

    console.log('User Session: ', session)
  
    return (
      <div className={classnames(styles.grid_box)}>
        <p>Your referral link: {process.env.NEXT_PUBLIC_APP_URL}/signin/?ref_id={session.user.id}</p>
        <p>Total Points Earned: <strong>{history.total_earned}</strong>,
          Points Redeemed: <strong>{history.total_redeemed}</strong>,
          Current Balance: <strong>{history.current_balance}</strong>
        </p>
        <br /><br />
        Content here...
      </div>
    )
}

export default MyAccount
