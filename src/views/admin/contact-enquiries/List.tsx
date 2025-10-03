// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { contactEnquiriesTypes } from '@/types/apps/contactEnquiriesTypes'

// Component Imports
import ListTable from './ListTable'

const ContactEnquiriesLists = ({ data }: { data?: contactEnquiriesTypes[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ListTable tableData={data} />
      </Grid>
    </Grid>
  )
}

export default ContactEnquiriesLists
