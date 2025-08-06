'use client'

import { Backdrop, CircularProgress } from '@mui/material'

import { useNavigationStore } from '@/libs/navigation-store'

const PageLoader = () => {
  const loading = useNavigationStore((s) => s.loading)

  return (
    <Backdrop
      open={loading}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1, color: '#fff' }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default PageLoader
