// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ListTable from './Table'

const DestinationList = ({ data }: { data?: [] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ListTable tableData={data} />
      </Grid>
    </Grid>
  )
}

export default DestinationList