// MUI Imports
import Button from '@mui/material/Button'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Metadata } from 'next'

// Context Imports
import { IntersectionProvider } from '@/contexts/intersectionContext'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@components/layout/front-pages'
import ScrollToTop from '@core/components/scroll-to-top'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

import { getPageData } from '@/app/server/pages'

// Style Imports
import '@/app/globals-front.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

// Define props for generateMetadata
type Props = {
  params: { slug?: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Fetch metadata from database
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  try {
    const pageMetadata = await getPageData('Contact Us')

    return {
      title: pageMetadata?.meta_title || 'Adventure Network | Contact Us',
      description: pageMetadata?.meta_description || '',
      keywords: pageMetadata?.meta_keywords || '',
      robots: pageMetadata?.robots || 'index, follow',
      authors: pageMetadata?.author ? [{ name: pageMetadata.author }] : undefined,
      publisher: pageMetadata?.publisher || '',

      alternates: {
        canonical: `/contact/`,
      },

      openGraph: {
        title: pageMetadata?.meta_title || 'Adventure Network | Contact Us',
        description: pageMetadata?.meta_description || '',
        type: 'website',
        siteName: 'Adventure Network',
      },
      
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: pageMetadata?.meta_title || 'Adventure Network | Contact Us',
        description: pageMetadata?.meta_description || '',
      },

      other: {
        ...(pageMetadata?.copyright && { copyright: pageMetadata.copyright }),
        ...(pageMetadata?.revisit_after && { 'revisit-after': pageMetadata.revisit_after }),
        ...(pageMetadata?.classification && { classification: pageMetadata.classification }),
        ...(pageMetadata?.rating && { rating: pageMetadata.rating }),
        ...(pageMetadata?.author && { author: pageMetadata.author }),
      },
    }
  } catch (error) {
    console.error('Failed to fetch metadata:', error)
    return {
      title: 'Adventure Network | Contact Us',
      description: '',
    }
  }
}

const Layout = async ({ children }: ChildrenType) => {
  
  // Vars
  const systemMode = await getSystemMode()

  return (
    
        <Providers direction='ltr'>
          <BlankLayout systemMode={systemMode}>
            <IntersectionProvider>
              <FrontLayout>
                {children}
                <ScrollToTop className='mui-fixed'>
                  <Button
                    variant='contained'
                    className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
                  >
                    <i className='ri-arrow-up-line' />
                  </Button>
                </ScrollToTop>
              </FrontLayout>
            </IntersectionProvider>
          </BlankLayout>
        </Providers>
      
  )
}

export default Layout
