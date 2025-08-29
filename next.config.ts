import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  trailingSlash: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
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
      /*{
        source: '/',
        destination: '/home',
        permanent: true
      }*/
    ]}
}

export default nextConfig
