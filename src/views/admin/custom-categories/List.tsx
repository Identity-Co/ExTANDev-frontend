// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { CategoryTypes } from '@/types/apps/customCategoryTypes'

// Component Imports
import ListTable from './ListTable'

const CategoryList = ({ categories }: { categories?: CategoryTypes[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ListTable tableData={categories} />
      </Grid>
    </Grid>
  )
}

export default CategoryList
