// MUI Imports
import Button from '@mui/material/Button'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Context Imports
import { IntersectionProvider } from '@/contexts/intersectionContext'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@components/layout/front-pages'
import ScrollToTop from '@core/components/scroll-to-top'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

import * as Common from '@/app/server/common'

import { redirect } from 'next/navigation';

// Style Imports
import '@/app/globals-front.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Adventure Network | Signup',
  description:
    ''
}

const Layout = async ({ children }: ChildrenType) => {
  // Vars
  const session = await Common.getUserSess()

  if(session?.user?.role == 'property_owner'){
    redirect('/admin/resorts/')
    
    return;
  }

  if(session?.user?.id && session?.user?.id != '') {
    redirect('/my-account/')

    return;
  }

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
