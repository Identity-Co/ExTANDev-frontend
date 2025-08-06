import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/login',
        destination: '/admin/login',
        permanent: true
      },
      {
        source: '/admin',
        destination: '/admin/dashboards',
        permanent: true
      },
      {
        source: '/',
        destination: '/home',
        permanent: true
      }
    ]}
}

export default nextConfig
