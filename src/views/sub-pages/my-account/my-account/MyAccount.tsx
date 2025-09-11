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

const MyAccount = () => {

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
      <section className={classnames(styles.ambassadorship_sec3, 'pb_100')}>
          <div className="container">
              <div className={classnames(styles.ambassadorship_sec3_inner)}>
                  <div className="grid gap_24">
                      <div className={classnames(styles.grid_box)}>
                          <div className={classnames(styles.signup_box)}>
                              <h4>My Account</h4>
                              <div className="grid2 gap_24">
                                <AccountSidebar />
                                <div className={classnames(styles.grid_box)}>
                                  Content here...
                                </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
    )
}

export default MyAccount
