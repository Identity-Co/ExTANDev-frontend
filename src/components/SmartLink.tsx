'use client'

import { useCallback } from 'react'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

import type { LinkProps } from 'next/link'

import { useNavigationStore } from '@/libs/navigation-store'

type SmartLinkProps = LinkProps & {
  children: React.ReactNode
  className?: string
}

const SmartLink = ({ children, href, ...props }: SmartLinkProps) => {
  const setLoading = useNavigationStore((s) => s.setLoading)
  const pathname = usePathname()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const targetPath =
        typeof href === 'string' ? href.split('?')[0] : href.pathname || ''

      // Avoid setting loading if the link is to the same route
      if (pathname === targetPath) {
        e.preventDefault()

        return
      }

      setLoading(true)
    },
    [setLoading, pathname, href]
  )

  return (
    <Link {...props} href={href} onClick={handleClick}>
      {children}
    </Link>
  )
}

export default SmartLink
