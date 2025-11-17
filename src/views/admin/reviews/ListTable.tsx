'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import type { IconProps } from '@mui/material/Icon';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import { Chip } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField'

import { toast } from 'react-toastify';

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import { useNavigationStore } from '@/libs/navigation-store'

import CustomAvatar from '@core/components/mui/Avatar'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import * as ReviewsLists from '@/app/server/reviews'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type ReviewsTypesWithAction = {
  action?: string
  first_name?: string
  last_name?: string
  email_address?: string
  _id?: string
}

const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank
  })

  return itemRank.passed
}

const globalFuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  if (!value) return true;

  const searchableText = Object.keys(row.original)
    .map(key => {
      const val = row.original[key];
      if (typeof val === 'string' || typeof val === 'number') {
        return String(val).toLowerCase();
      }
      return '';
    })
    .join(' ');

  const itemRank = rankItem(searchableText, value.toLowerCase());
  addMeta({ itemRank });
  
  return itemRank.passed;
};

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)

  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper<ReviewsTypesWithAction>()

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

const getAvatar = (params: Pick<UsersType, 'avatar' | 'fullName' | 'borderclr'>) => {
  const { avatar, fullName, borderclr } = params
  
  if (avatar) {
    return <CustomAvatar src={avatar} skin='light' size={34} className={borderclr} />
  } else {
    return (
      <CustomAvatar skin='light' size={34} className={borderclr} sx={{bgcolor: 'primary.main', fontSize: '0.8rem'}}>
        {getInitials(fullName as string)}
      </CustomAvatar>
    )
  }
}

const StarRating = ({ rating, maxStars = 5 }) => {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[...Array(maxStars)].map((_, index) => (
        <span
          key={index}
          style={{
            color: index < rating ? '#ffc107' : '#e4e5e9',
            fontSize: '18px'
          }}
        >
          {index < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

const statusConfig = {
  1: { label: "Approved", color: "success" },
  2: { label: "Declined", color: "error" },
};

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC'
  };
  
  const date = new Date(dateString);
  return date.toLocaleString('en-US', options); // Format the date
};

const ReviewsListTable = ({ tableData }: { tableData?: [] }) => {
  const setLoading = useNavigationStore((s) => s.setLoading)

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<[]>(tableData ?? [])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [entryID, setId] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [onSubmit, setSubmit] = useState<() => Promise<void>>(() => async () => {});

  const [openDelete, setOpenDelete] = useState(false)

  // Hooks
  const { lang: locale } = useParams()

  const fetchData = async () => {
    try {

      const refresh = await ReviewsLists.getAllEntries();
      
      if (Array.isArray(refresh)) {
        setData(refresh);
      } else {
        toast.error('Failed to fetch updated data');
      }
    } catch (error) {
      toast.error('Error fetching updated data');
      console.error('Fetch error:', error);
    }
  };

  const columns = useMemo<ColumnDef<ReviewsTypesWithAction, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {row.original.user_profile_picture ? getAvatar({ avatar: process.env.NEXT_PUBLIC_UPLOAD_URL+'/'+row.original.user_profile_picture, fullName: row.original.user_first_name ?? '', borderclr: '#FFF'}) : getAvatar({ fullName: (row.original.user_first_name +' '+row.original.user_last_name) ?? '', borderclr: '#FFF'})}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original?.user_first_name?? ''} {row.original?.user_last_name?? ''}
              </Typography>
              <Typography variant='body2'>{row.original.user_email}</Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('rating', {
        header: 'Rating',
        cell: ({ row }) => <StarRating rating={row.original?.rating} />
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const config = statusConfig[row.original?.status] || { label: "Pending", color: "warning" };
          return <Chip label={config.label} color={config.color} size='small' variant='tonal' />;
        },
      }),
      columnHelper.accessor('created_at', {
        header: 'Created at',
        cell: ({ row }) => <Typography>{formatDate(row.original.created_at)}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton sx={{color: 'info.main'}} href={'/admin/reviews/view/'+row.original._id} className='flex'>
              <i className='ri-eye-line' />
            </IconButton>
            <IconButton sx={{color: 'error.main'}} onClick={() => handleDeleteList(row.original._id)}>
              <i className='ri-delete-bin-7-line' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],

    [data]
  )

  // Vars
  const iconProps: IconProps = {
    className: 'ri-rotate-lock-line',
    sx:{
      cursor: 'pointer',
      fontSize: '1.375rem',
      color: 'info.main',
    }
  }

  const handleDeleteList = async (id?: string) => {
    setId(id ?? '')
    setOpenDelete(true)
  }

  const handleDeleteClose = () => {
    setOpenDelete(false)
  };

  const handleDeleteAction = async () => {
    try {
      const res = await ReviewsLists.deleteReviewEntry(entryID)
      toast.success('Review deleted successfully');
      setOpenDelete(false)
      await fetchData();
    } catch (error) {
      toast.error('Error deleting Review');
      console.error('Delete error:', error);
    }  
  }

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: globalFuzzyFilter
    },
    state: {
      columnFilters,
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: globalFuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    autoResetPageIndex: false
  })

  // Debug: Log filtered results
  useEffect(() => {
  }, [globalFilter, table.getFilteredRowModel().rows.length]);

  return (
    <>
      <Card>
        <CardHeader title='Reviews' />
        <Divider />
        <div className='flex justify-between p-5 gap-4 flex-col items-start sm:flex-row sm:items-center'>
          <div></div>
          <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search...'
              className='max-sm:is-full'
            />
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    {globalFilter ? 'No matching results found' : 'No data available'}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>

      <Dialog
        open={openDelete}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleDeleteClose()
          }
        }}
        closeAfterTransition={false}
      >
        <DialogTitle id='alert-dialog-title' className='text-center'>Delete Review?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' className='text-center'>
            Are you sure you want to delete this Review?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAction} variant='contained'>
            Yes
          </Button>
          <Button onClick={handleDeleteClose} variant='outlined' color='secondary'>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReviewsListTable