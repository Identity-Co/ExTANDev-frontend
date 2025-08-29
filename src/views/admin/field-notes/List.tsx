// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { BannersType } from '@/types/apps/bannerTypes'

// Component Imports
import ListTable from './ListTable'

const BannerList = ({ banners }: { banners?: BannersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ListTable tableData={banners} />
      </Grid>
    </Grid>
  )
}

export default BannerList
