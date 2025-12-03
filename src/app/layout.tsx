// Next Imports

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

import PageLoader from '@/app/providers/PageLoader'
import NavigationEvents from '@/app/providers/NavigationEvents'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports

// HOC Imports

// Config Imports

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// import '@/app/globals-front.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Adventure Network',
  description: ''
}

import Script from "next/script"

const RootLayout = async (props: ChildrenType ) => {
  

  const { children } = props

  // Vars
  
  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (
    
      <html id='__next' lang='en' dir={direction} suppressHydrationWarning>
        <body className='flex is-full min-bs-full flex-auto flex-col' suppressHydrationWarning>
          <AppRouterCacheProvider>
            <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
            <NavigationEvents />
            <PageLoader />
            {children}

            <Script
              type="module"
              src="https://cdn.ai12z.net/pkg/ai12z@latest/dist/esm/library.js"
              strategy="afterInteractive"
              onLoad={() => {
                if (window.Bot) window.Bot.init()
              }}
            />
          </AppRouterCacheProvider>
        </body>
      </html>
    
  )
}

export default RootLayout
