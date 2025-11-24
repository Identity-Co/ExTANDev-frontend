'use client'

import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

import * as Common from '@/app/server/common'

// Third-party Imports
import { signOut } from 'next-auth/react'
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

type EditProps = {
  pathName: string
}

const AccountSidebar = ({ pathName, }: EditProps) => {
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
            <ul>
              {session?.user?.role != 'property_owner' && (
                <li className={pathName === "/my-account/" ? "active" : ""}>
                  <Link href="/my-account/">
                    <img src="/images/front-pages/dashboard.svg" alt="Dashboard" />
                    Dashboard
                  </Link>
                </li>
              )}
              
              <li className={pathName === "/edit-profile/" ? "active" : ""}>
                <Link href="/edit-profile/">
                <img src="/images/front-pages/edit-profile.svg" alt="edit-profile" />
                  Edit Profile
                </Link>
              </li>
              {session?.user?.role == 'user' && (
                <>
                  <li className={pathName === "/my-account/liked-items/" ? "active" : ""}>
                    <Link href="/my-account/liked-items/">
                      <img src="/images/front-pages/like.svg" alt="like" />
                      Liked Items
                    </Link>
                  </li>
                  <li className={pathName === "/my-account/saved-items/" ? "active" : ""} >
                    <Link href="/my-account/saved-items/">
                      <img src="/images/front-pages/saved.svg" alt="saved" />
                      Saved Items
                    </Link>
                  </li>
                </>
              )}
              {session?.user?.role == 'ambassador' && (
                <li className={pathName === "/my-account/adventure-guides/" ? "active" : ""} >
                  <Link href="/my-account/adventure-guides/">Adventure Guide</Link>
                </li>
              )}

              {session?.user?.role == 'property_owner' && (
                <li className={pathName.includes('/my-account/properties/') ? "active" : ""} >
                  <Link href="/my-account/properties/">Manage Properties</Link>
                </li>
              )}

              {session?.user?.role != 'property_owner' && (
                <li className={pathName === "/my-account/points-history/" ? "active" : ""} >
                  <Link href="/my-account/points-history/">
                    <img src="/images/front-pages/point.svg" alt="point" />
                    Points History
                  </Link>
                </li>
              )}
              
              <li className={pathName === "/change-password/" ? "active" : ""} >
                <Link href="/change-password/">
                  <img src="/images/front-pages/password.svg" alt="password" />
                  Change Password
                </Link>
              </li>
              <li>
                <Link href="#" onClick={handleUserLogout}>
                <img src="/images/front-pages/logout.svg" alt="logout" />
                  Logout
                </Link>
              </li>
            </ul>
          </>
        )}
      </div>
    )

}

export default AccountSidebar
