'use client'

import { useEffect, useRef } from 'react'

import { usePathname } from 'next/navigation'

import { useNavigationStore } from '@/libs/navigation-store'

const NavigationEvents = () => {
  const pathname = usePathname()
  const { setLoading } = useNavigationStore()
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setLoading(true)

      // Let the new page settle in before stopping loader
      const timeout = setTimeout(() => {
        setLoading(false)
      }, 500) // Adjust as needed

      prevPath.current = pathname

      return () => clearTimeout(timeout)
    } else {
      setLoading(false)
    }
  }, [pathname, setLoading])

  return null
}

export default NavigationEvents
