'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const stickPage = ['privacy-policy','terms-of-use']

const Header = ({ mode }: { mode: Mode }) => {
  const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
  
  // States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Hooks
  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  //Sticky
  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true
  })

  const [isSticky, setIsSticky] = useState(stickPage.includes(firstSegment)?true:false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(stickPage.includes(firstSegment)?true:false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  //Toggle Menu

  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <header className={classnames(styles.header, { [styles.sticky]: isSticky })}>
      <div className="container">
          <div className={classnames(styles.headMain)}>
              <div className={classnames(styles.headerLogo)}>
                  <Link href={"/"}>
                      <img src="/images/front-pages/head-logo.svg" />
                  </Link>
              </div>
              <div className={classnames(styles.navMenu, {[styles.open]: isActive,})}>
                  <nav>
                      <ul>
                          <li><Link href={"/our-destinations"}>Our Destinations</Link></li>
                          <li><Link href={"/our-adventure"}>Our adventures</Link></li>
                          <li><Link href={"/total-travel"}>Total travel</Link></li>
                          <li><Link href={"/blog"}>Field notes</Link></li>
                          <li><Link href={"#"}>Merch</Link></li>
                          <li className={classnames(styles.hide_desktop)}><Link href={"/ambassadorship"}>Ambassadorship</Link></li>
                          <li className={classnames(styles.hide_desktop)}><Link href={"#"}>Find your next adventure</Link></li>
                      </ul>
                  </nav>
              </div>
              <div className={classnames(styles.head_right)}>
                  <div className={classnames(styles.head_buttons)}>
                      <div className={classnames(styles.head_btn1)}>
                          <Link href={"/ambassadorship"}>Ambassadorship</Link>
                      </div>
                      <div className={classnames(styles.head_btn2)}>
                          <Link href={"/signin/"}>Log in or <span>sign up</span></Link>
                      </div>
                      <div className={classnames(styles.head_btn3)}>
                          <Link href={"#"}> <svg xmlns="http://www.w3.org/2000/svg" width="17.923" height="17.759" viewBox="0 0 17.923 17.759">
                            <defs>
                              <clipPath id="clip-path">
                                <rect id="Rectangle_4336" data-name="Rectangle 4336" width="17.923" height="17.759" fill="#1f1f1f"/>
                              </clipPath>
                            </defs>
                            <g id="Group_834" data-name="Group 834" transform="translate(0 0)" opacity="0.65">
                              <path id="Path_1187" data-name="Path 1187" d="M8.962,0,7.67,6.672,4.742,4.693l2.011,2.96L0,8.912l6.754,1.259L4.775,13.066,7.686,11.1,8.962,17.76,10.237,11.1l2.911,1.962-1.979-2.895,6.754-1.259L11.169,7.653l2.012-2.96L10.253,6.672Z" transform="translate(0 0)" fill="#1f1f1f"/>
                              <g id="Group_833" data-name="Group 833" transform="translate(0 0)">
                                <g id="Group_832" data-name="Group 832" transform="translate(0 0)" clipPath="url(#clip-path)">
                                  <path id="Path_1188" data-name="Path 1188" d="M43.306,7.6a6.607,6.607,0,0,1,5.708,5.739l.81.151a7.394,7.394,0,0,0-6.675-6.7Z" transform="translate(-33.498 -5.272)" fill="#1f1f1f"/>
                                  <path id="Path_1189" data-name="Path 1189" d="M7.954,13.341A6.607,6.607,0,0,1,13.662,7.6l.157-.811a7.394,7.394,0,0,0-6.674,6.7Z" transform="translate(-5.547 -5.272)" fill="#1f1f1f"/>
                                  <path id="Path_1190" data-name="Path 1190" d="M48.993,43.1a6.607,6.607,0,0,1-5.7,5.672l-.156.811a7.4,7.4,0,0,0,6.672-6.635Z" transform="translate(-33.487 -33.344)" fill="#1f1f1f"/>
                                  <path id="Path_1191" data-name="Path 1191" d="M13.687,48.774a6.607,6.607,0,0,1-5.7-5.672l-.812-.151a7.4,7.4,0,0,0,6.672,6.635Z" transform="translate(-5.567 -33.344)" fill="#1f1f1f"/>
                                </g>
                              </g>
                            </g>
                          </svg>
                          Find your next adventure</Link>
                      </div>
                  </div>
              </div>
              <div className={classnames(styles.menu_button_container)}>
                  <div id="hamburger-6" className={classnames(styles.hamburger, {[styles.is_active]: isActive,})} onClick={toggleMenu}>
                    <span className={classnames(styles.line)}></span>
                    <span className={classnames(styles.line)}></span>
                    <span className={classnames(styles.line)}></span>
                  </div>
              </div>
          </div>
      </div>
    </header>
  )
}

export default Header