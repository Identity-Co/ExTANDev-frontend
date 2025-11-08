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
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import { Chip, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
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

import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import { useNavigationStore } from '@/libs/navigation-store'

import CustomAvatar from '@core/components/mui/Avatar'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import * as getAllReports from '@/app/server/comments'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type ReportsTypesWithAction = {
  action?: string
  reported_by?: {
    name?: string
    email?: string
    profile_picture?: string
  }
  comment_of?: {
    name?: string
    email?: string
    profile_picture?: string
  }
  reason?: string,
  status?: string,
  report_status?: string
  report_reason?: string
  collection_name?: string
  report_created_date?: string
  created_at?: string
  post_type?: string
  _id?: string
}

const Icon = styled('i')({})

// Combined filter function that handles both global search and status filter
const combinedFilter: FilterFn<any> = (row, columnId, filterValue, addMeta) => {
  const { globalFilter, statusFilter } = filterValue;
  
  // Apply status filter first
  if (statusFilter && statusFilter !== 'all') {
    if (row.original.report_status !== statusFilter) {
      return false;
    }
  }
  
  // Then apply global search filter
  if (globalFilter) {
    const searchableText = Object.keys(row.original)
      .map(key => {
        const val = row.original[key];
        
        // Handle nested objects (like reported_by, comment_of)
        if (val && typeof val === 'object') {
          return Object.values(val)
            .filter(nestedVal => typeof nestedVal === 'string' || typeof nestedVal === 'number')
            .map(nestedVal => String(nestedVal).toLowerCase())
            .join(' ');
        }
        
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase();
        }
        return '';
      })
      .join(' ');

    const itemRank = rankItem(searchableText, globalFilter.toLowerCase());
    addMeta({ itemRank });
    
    return itemRank.passed;
  }
  
  return true;
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
const columnHelper = createColumnHelper<ReportsTypesWithAction>()

const getInitials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

const getAvatar = (params: { avatar?: string, fullName?: string, borderclr?: string }) => {
  const { avatar, fullName, borderclr } = params
  
  if (avatar) {
    return <CustomAvatar src={avatar} skin='light' size={34} sx={{ borderColor: borderclr }} />
  } else {
    return (
      <CustomAvatar skin='light' size={34} sx={{ borderColor: borderclr, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
        {getInitials(fullName as string)}
      </CustomAvatar>
    )
  }
}

const statusConfig = {
  'adventure_post': { label: "Adventure Post", color: "primary", icon: "ri-map-pin-line" },
  'destination_story': { label: "Destination Story", color: "secondary", icon: "ri-bookmark-line" },
  'reviews': { label: "Reviews", color: "info", icon: "ri-star-line" },
};

const reportStatus = {
  pending: { color: 'warning', label: 'Pending' },
  reviewed: { color: 'info', label: 'Under Review' },
  resolved: { color: 'success', label: 'Resolved' },
  dismissed: { color: 'default', label: 'Dismissed' },
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC'
  };
  
  const date = new Date(dateString);
  return date.toLocaleString('en-US', options);
};

const ReportsListTable = ({ tableData }: { tableData?: ReportsTypesWithAction[] }) => {
  const setLoading = useNavigationStore((s) => s.setLoading)

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<ReportsTypesWithAction[]>(tableData ?? [])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilterValue, setStatusFilterValue] = useState<string>('all')

  const [entryID, setId] = useState<string>('')
  const [open, setOpen] = useState(false)

  // Hooks
  const { lang: locale } = useParams()

  const fetchData = async () => {
    try {
      const refresh = await getAllReports.getAllEntries();
      
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

  const columns = useMemo<ColumnDef<ReportsTypesWithAction, any>[]>(
    () => [
      columnHelper.accessor('reported_by', {
        header: 'Reported By',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {row.original?.reported_by?.profile_picture ? 
              getAvatar({ 
                avatar: process.env.NEXT_PUBLIC_UPLOAD_URL+'/'+row.original.reported_by.profile_picture, 
                fullName: row.original.reported_by?.name ?? '', 
                borderclr: '#FFF'
              }) : 
              getAvatar({ 
                fullName: row.original.reported_by?.name ?? '', 
                borderclr: '#FFF'
              })
            }
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.reported_by?.name ?? 'Unknown'}
              </Typography>
              <Typography variant='body2'>{row.original.reported_by?.email ?? 'No email'}</Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('comment_of', {
        header: 'Commented By',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {row.original?.comment_of?.profile_picture ? 
              getAvatar({ 
                avatar: process.env.NEXT_PUBLIC_UPLOAD_URL+'/'+row.original.comment_of.profile_picture, 
                fullName: row.original.comment_of?.name ?? '', 
                borderclr: '#FFF'
              }) : 
              getAvatar({ 
                fullName: row.original.comment_of?.name ?? '', 
                borderclr: '#FFF'
              })
            }
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.comment_of?.name ?? 'Unknown'}
              </Typography>
              <Typography variant='body2'>{row.original.comment_of?.email ?? 'No email'}</Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('report_reason', {
        header: 'Reason',
        cell: ({ row }) => <Typography>{row.original?.report_reason || 'No reason provided'}</Typography>,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const config = reportStatus[row.original?.report_status as keyof typeof reportStatus] || { label: "Unknown", color: "default" };
          return <Chip label={config.label} color={config.color as any} size='small' variant='tonal' />;
        },
      }),
      columnHelper.accessor('collection_name', {
        header: 'Post Type',
        cell: ({ row }) => {
          const config = statusConfig[row.original?.collection_name as keyof typeof statusConfig] || { label: "Unknown", color: "default" };
          return <Chip label={config.label} color={config.color as any} size='small' variant='tonal' />;
        },
      }),
      columnHelper.accessor('report_created_date', {
        header: 'Created at',
        cell: ({ row }) => <Typography>{formatDate(row.original?.report_created_date || row.original?.created_at)}</Typography>,
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton sx={{color: 'info.main'}} href={'/admin/comments/view/'+row.original._id} className='flex'>
              <i className='ri-eye-line' />
            </IconButton>
          </div>
        ),
        enableSorting: false,
      })
    ],
    [data]
  )

  // Create combined filter value
  const combinedFilterValue = useMemo(() => ({
    globalFilter,
    statusFilter: statusFilterValue
  }), [globalFilter, statusFilterValue]);

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      combined: combinedFilter
    },
    state: {
      rowSelection,
      globalFilter: combinedFilterValue
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: 'combined',
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    autoResetPageIndex: false
  })

  return (
    <>
      <Card>
        <CardHeader title='Comment Reports' />
        <Divider />
        <div className='flex justify-between p-5 gap-4 flex-col items-start sm:flex-row sm:items-center'>
          <div></div>
          <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row'>
            <FormControl size='small' sx={{ minWidth: 120 }}>
              <InputLabel id='status-filter-label'>Status</InputLabel>
              <Select
                labelId='status-filter-label'
                value={statusFilterValue}
                label='Status'
                onChange={(e) => setStatusFilterValue(e.target.value)}
              >
                <MenuItem value='all'>All Status</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='reviewed'>Under Review</MenuItem>
                <MenuItem value='resolved'>Resolved</MenuItem>
                <MenuItem value='dismissed'>Dismissed</MenuItem>
              </Select>
            </FormControl>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search all columns...'
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
                    {globalFilter || statusFilterValue !== 'all' ? 'No matching results found' : 'No data available'}
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
    </>
  )
}

export default ReportsListTable