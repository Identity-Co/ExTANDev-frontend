'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import AccountSidebar from '@components/layout/front-pages/AccountSidebar'

import Link from 'next/link'

// Hook Imports
import { usePathname } from 'next/navigation'

interface AccountLayoutClientProps {
  children: React.ReactNode
  systemMode: any
}

export default function AccountLayoutClient({ children, systemMode }: AccountLayoutClientProps) {
  const pathname = usePathname()
  
  // Get the current section from the URL path
  const getCurrentSection = () => {
    const segments = pathname.split('/').filter(segment => segment)
    return segments[segments.length - 1] || 'dashboard'
  }

  const getPreviousSection = () => {
    const segments = pathname.split('/').filter(segment => segment)
    return segments[segments.length - 2] || 'dashboard'
  }

  const getPrevious2Section = () => {
    const segments = pathname.split('/').filter(segment => segment)
    return segments[segments.length - 3] || 'dashboard'
  }

  const currentSection = getCurrentSection()
  const previousSection = getPreviousSection()
  const previous2Section = getPrevious2Section()

  // Format the section name for display (convert hyphens to spaces and capitalize)
  const formatSectionName = (section: string) => {
    return section
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getPageTitle = (cSection: string, pSection: string, pSection2: string, dSectionName: string) =>{
    if(cSection == 'my-account'){
      return 'My Account'
    }else if((pSection === 'adventure-guides') || (pSection2 === 'adventure-guides' && pSection === 'edit')){
      return 'My Account - Adventure Guide '+dSectionName
    }else{
      return 'My Account - '+dSectionName
    }
  }

  const displaySectionName = formatSectionName((previous2Section == 'adventure-guides') ? previousSection : currentSection)
  const pageTitle = getPageTitle(currentSection, previousSection, previous2Section, displaySectionName);

  return (
    <>
      <section className={classnames('cta_section', 'ambassadorship_banner', 'py_150')}></section>
      <section className={classnames('ambassadorship_sec1')}>
        <div className="container">
          <div className={classnames('ambassadorship_img', 'full_img')}>
            <img src="/images/sub-pages/signup.png" alt="My Account" />
          </div>
        </div>
      </section>
      <section className={classnames('ambassadorship_sec3', 'pb_100')}>
        <div className="container">
          <div className={classnames('ambassadorship_sec3_inner', 'full_width', {
            'no_sidebar': (previousSection === 'adventure-guides') || (previous2Section === 'adventure-guides' && previousSection === 'edit')
          })}>
            <div className="grid gap_24">
              <div className={classnames('grid_box')}>
                <div className={classnames('signup_box')}>
                  <h4>{pageTitle}</h4>
                  {((previousSection === 'adventure-guides') || (previous2Section === 'adventure-guides' && previousSection === 'edit')) && (
                    <>
                      <div className={classnames('btn', 'btn_adv_back')}>
                        <Link href="/my-account/adventure-guides/">Back</Link>
                      </div>
                    </>
                  )}
                  <div className="grid2 gap_24">
                    {(previousSection != 'adventure-guides') && (previous2Section != 'adventure-guides' && previousSection != 'edit') && <AccountSidebar currentSection={currentSection} />}
                    <div className={classnames('grid_box')}>
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}