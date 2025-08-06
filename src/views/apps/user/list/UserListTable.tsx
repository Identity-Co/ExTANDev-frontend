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
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import { Switch, FormControlLabel } from '@mui/material'

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
import type { ThemeColor } from '@core/types'
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import TableFilters from './TableFilters'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import * as User from '@/app/server/users'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type UsersTypeWithAction = UsersType & {
  action?: string
  profile_picture?: string
  first_name?: string
  role?: string
  _id?: string
}

type UserRoleType = {
  [key: string]: { icon: string; color: string }
}

type UserStatusType = {
  [key: string]: ThemeColor
}

type roleData = {
  key: string;
  name: string;
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

// Vars
const userRoleObj: UserRoleType = {
  admin: { icon: 'ri-vip-crown-line', color: 'error' },
  author: { icon: 'ri-computer-line', color: 'warning' },
  editor: { icon: 'ri-edit-box-line', color: 'info' },
  maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
  subscriber: { icon: 'ri-user-3-line', color: 'primary' }
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>()

const UserListTable = ({ tableData, roles }: { tableData?: UsersType[]; roles?: roleData[] }) => {
  const setLoading = useNavigationStore((s) => s.setLoading)

  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [userId, setId] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [onSubmit, setSubmit] = useState<() => Promise<void>>(() => async () => {});

  const [openDelete, setOpenDelete] = useState(false)

  const getRoleName = (key: string): string => {
    const role = roles?.find(r => r.key === key);

    return role ? role.name : 'Unknown';
  };


  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('fullName', {
        header: 'User',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {row.original.profile_picture ? getAvatar({ avatar: process.env.NEXT_PUBLIC_UPLOAD_URL+'/'+row.original.profile_picture, fullName: row.original.first_name ?? '' }) : getAvatar({ avatar: '/images/avatars/1.png', fullName: row.original.first_name ?? '' })}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.first_name}
              </Typography>
              <Typography variant='body2'>{row.original.email}</Typography>
            </div>
          </div>
        ),
        sortingFn: (rowA, rowB, columnId) => {
          // Example: case-insensitive sort
          const a = rowA.original.first_name?.toLowerCase() ?? ''
          const b = rowB.original.first_name?.toLowerCase() ?? ''
          
          return a > b ? 1 : a < b ? -1 : 0
        },
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography>{row.original.email}</Typography>
      }),
      columnHelper.accessor('contact', {
        header: 'Phone',
        cell: ({ row }) => <Typography>{row.original.phone.country_code} {row.original.phone.number}</Typography>
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {/*<Icon
              className={userRoleObj[row.original.role].icon}
              sx={{ color: `var(--mui-palette-${userRoleObj[row.original.role].color}-main)`, fontSize: '1.375rem' }}
            />*/}

            <Typography className='capitalize' color='text.primary'>
              {getRoleName(row.original.role)}
            </Typography>
          </div>
        )
      }),
      
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <Chip
              variant='tonal'
              label={row.original.status}
              size='small'
              color={userStatusObj[row.original.status]}
              className='capitalize'
            /> */}

            <FormControlLabel
              label=""
              control={
                row.original.status? (
                  <Switch value='1' defaultChecked inputProps={{ 'aria-label': 'Switch A' }} onChange={(e) => handleSwitchChange(row.original._id, e)} />
                ) : (
                  <Switch value='1' inputProps={{ 'aria-label': 'Switch A' }} onChange={(e) => handleSwitchChange(row.original._id, e)} />
                )
              }
            />
          </div>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {/*<IconButton>
              <Link href={getLocalizedUrl('/admin/users/view/'+row.original._id, locale as Locale)} className='flex'>
                <i className='ri-eye-line text-textSecondary' />
              </Link>
            </IconButton>*/}
            <IconButton sx={{color: 'warning.main'}} href={'/admin/users/edit/'+row.original._id} className='flex'>
              <i className='ri-edit-box-line' />
            </IconButton>
            <IconButton sx={{color: 'error.main'}} onClick={() => handleDeleteList(row.original._id)}>
              <i className='ri-delete-bin-7-line' />
            </IconButton>
            {/*<OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                // {
                //   text: 'Download',
                //   icon: 'ri-download-line',
                //   menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                // },
                {
                  text: 'Edit',
                  icon: 'ri-edit-box-line',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                }
              ]}
            />*/}
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

  const handleDeleteList = async (id?: string) => {
    /*if(confirm('Are you sure to delete?')) {
      const res = await User.deleteUserData(id)
      toast.success(res.message);
      fetchData();
    }*/

    setId(id ?? '')
    setOpenDelete(true)
  }

  const handleDeleteClose = () => {
    setOpenDelete(false)
  };

  const handleDeleteAction = async () => {
    const res = await User.deleteUserData(userId)

    toast.success('User deleted successfully');

    setOpenDelete(false)

    fetchData();      
  }

  const editPermission = (userId?: string) => {
    setOpen(true)
    setId(userId ?? '')
    setSubmit(() => fetchData)
  }

  const fetchData = async () => {
    const refresh = await User.getUserData();
    
    setData(refresh);
  };

  const table = useReactTable({
    data: filteredData as UsersType[],
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

  /*  console.log(table.getState().sorting[0])
  useEffect(() => {
    if (table.getState().sorting[0]?.id === 'fullName') {
      table.setSorting([{ id: 'email', desc: table.getState().sorting[0]?.desc }])
    }
  }, [table.getState().sorting[0]?.id])*/

  const getAvatar = (params: Pick<UsersType, 'avatar' | 'fullName'>) => {
    const { avatar, fullName } = params
    
    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(fullName as string)}
        </CustomAvatar>
      )
    }
  }

  const handleSwitchChange = async (userID: any, event: React.ChangeEvent<HTMLInputElement>) => {    
    const _status_ = event.target.checked ? 1 : 0;
    const res = await User.updateUser(userID, {status: _status_})

    if (res && res._id) {
      if(_status_) {
        toast.success('User Activated successfully.')
      } else {
        toast.success('User De-Activated successfully.')
      }
    } else {
      if(res.errors) {
        toast.error(res.errors)
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Filters' />
        <TableFilters setData={setFilteredData} tableData={data} roles={roles} />
        <Divider />
        <div className='flex justify-between p-5 gap-4 flex-col items-start sm:flex-row sm:items-center'>
          {/*<Button
            color='secondary'
            variant='outlined'
            startIcon={<i className='ri-upload-2-line text-xl' />}
            className='max-sm:is-full'
          >
            Export
          </Button>*/}
          <div></div>
          <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search User'
              className='max-sm:is-full'
            />
            {/*<Button variant='contained' onClick={() => setAddUserOpen(!addUserOpen)} className='max-sm:is-full'>
              Add New User
            </Button>*/}

            <SmartLink href={`/admin/users/add/`}>
              <Button variant='contained' className='max-sm:is-full'>
                Add New User
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
      {/*<UserPermissionDialog open={open} setOpen={setOpen} userId={userId} onSubmit={fetchData} permissions={userPermission} />*/}
      {/*<AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        setData={setData}
      />*/}

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
        <DialogTitle id='alert-dialog-title' className='text-center'>Delete User?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' className='text-center'>
            Are you sure you want to delete this User?
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

export default UserListTable
