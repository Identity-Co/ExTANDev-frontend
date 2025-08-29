// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ListTable from './Table'

const PageList = ({ pages }: { pages?: [] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ListTable tableData={pages} />
      </Grid>
    </Grid>
  )
}

export default PageList