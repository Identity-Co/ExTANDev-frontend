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
  
    return (
      <div className={classnames(styles.grid_box)}>
        <div className="welcome_user">Welcome {session?.user?.name}!</div>
        <div className="glass">
          <span className="referral_title">Your referral link:</span>
          <span className="referral_link">{process.env.NEXT_PUBLIC_APP_URL}/signin/?ref_id={session?.user.id}</span>
        </div>
        <div className="points_row gap_32">
          <div className="point_card">
            <h3 className="fs_35">Your referral link</h3>
            <p>{history.total_earned}</p>
          </div>
          <div className="point_card">
            <h3 className="fs_35">Points Redeemed</h3>
            <p>{history.total_redeemed}</p>
          </div>
          <div className="point_card">
            <h3 className="fs_35">Current Balance</h3>
            <p>{history.current_balance}</p>
          </div>
        </div>
      </div>
    )
}

export default MyAccount
