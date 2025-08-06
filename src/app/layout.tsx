// Next Imports

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PageLoader from '@/app/providers/PageLoader'
import NavigationEvents from '@/app/providers/NavigationEvents'

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports

// HOC Imports

// Config Imports

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Adventure Network',
  description: ''
}

const RootLayout = async (props: ChildrenType ) => {
  

  const { children } = props

  // Vars
  
  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (
    
      <html id='__next' lang='en' dir={direction} suppressHydrationWarning>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <ToastContainer />
          <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
          <NavigationEvents />
          <PageLoader />
          {children}
        </body>
      </html>
    
  )
}

export default RootLayout
