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

import SmartLink from '@/components/SmartLink'

// Type Imports
import type { adventureguideTypes } from '@/types/apps/adventureguideTypes'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import * as AdventureGuide from '@/app/server/adventure_guide'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type adventureguideTypesWithAction = adventureguideTypes & {
  action?: string
  title?: string
  _id?: string
}

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper<adventureguideTypesWithAction>()

const AdventureGuideListTable = ({ tableData }: { tableData?: adventureguideTypes[] }) => {
  const setLoading = useNavigationStore((s) => s.setLoading)

  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<adventureguideTypes[]>(tableData ?? [])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [userId, setId] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [onSubmit, setSubmit] = useState<() => Promise<void>>(() => async () => {});

  const [openDelete, setOpenDelete] = useState(false)


  // Hooks
  const { lang: locale } = useParams()

  const fetchData = async () => {
    try {
    // Fetch updated data
    const refresh = await AdventureGuide.getAdventureGuides();
    
    // Ensure the returned data is of the correct type
    if (Array.isArray(refresh)) {
      setData(refresh); // Update state with new data
    } else {
      toast.error('Failed to fetch updated data');
    }
  } catch (error) {
    toast.error('Error fetching updated data');
    console.error('Fetch error:', error);
  }
  };

  const columns = useMemo<ColumnDef<adventureguideTypesWithAction, any>[]>(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => <Typography>{row.original.title}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'Created at',
        cell: ({ row }) => <Typography>{row.original.created_at}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            
            <SmartLink href={'/admin/adventure-guide/edit/'+row.original._id}>
              <IconButton sx={{color: 'warning.main'}} className='flex'>
                <i className='ri-edit-box-line' />
              </IconButton>
            </SmartLink>

            <IconButton sx={{color: 'error.main'}} onClick={() => handleDeleteList(row.original._id)}>
              <i className='ri-delete-bin-7-line' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
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

  useEffect(() => {
    setFilteredData(data);
  }, [data]);


  const handleDeleteList = async (id?: string) => {
    setId(id ?? '')
    setOpenDelete(true)
  }

  const handleDeleteClose = () => {
    setOpenDelete(false)
  };

  const handleDeleteAction = async () => {
    try {
      const res = await AdventureGuide.deleteAdventureGuide(userId)

      toast.success('Adventure Guide deleted successfully');

      setOpenDelete(false)

      await fetchData();
    } catch (error) {
      toast.error('Error deleting Adventure Guide');
      console.error('Delete error:', error);
    }  
  }

  const table = useReactTable({
    data: filteredData as adventureguideTypes[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
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
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card>
        <CardHeader title='Adventure Guide' />
        {/*<TableFilters setData={setFilteredData} tableData={data} roles={roles} />*/}
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

            <SmartLink href={`/admin/adventure-guide/add/`}>
              <Button variant='contained' className='max-sm:is-full'>
                Add New Adventure Guide
              </Button>     
            </SmartLink>       
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
                    No data available
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
        <DialogTitle id='alert-dialog-title' className='text-center'>Delete Adventure Guide?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' className='text-center'>
            Are you sure you want to delete this Adventure Guide?
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

export default AdventureGuideListTable
