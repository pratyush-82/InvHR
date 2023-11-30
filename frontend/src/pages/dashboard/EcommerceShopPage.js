// import { Helmet } from 'react-helmet-async';
// import { useState, useEffect } from 'react';
// import orderBy from 'lodash/orderBy';
// // form
// import { useForm } from 'react-hook-form';
// // @mui
// import { Container, Typography, Stack } from '@mui/material';
// // redux
// import { useDispatch, useSelector } from '../../redux/store';
// import { getProducts } from '../../redux/slices/product';
// // routes
// import { PATH_DASHBOARD } from '../../routes/paths';
// // components
// import FormProvider from '../../components/hook-form';
// import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// import { useSettingsContext } from '../../components/settings';
// // sections
// import {
//   ShopTagFiltered,
//   ShopProductSort,
//   ShopProductList,
//   ShopFilterDrawer,
//   ShopProductSearch,
// } from '../../sections/@dashboard/e-commerce/shop';
// import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';

// // ----------------------------------------------------------------------

// export default function EcommerceShopPage() {
//   const { themeStretch } = useSettingsContext();

//   const dispatch = useDispatch();

//   const { products, checkout } = useSelector((state) => state.product);

//   const [openFilter, setOpenFilter] = useState(false);

//   const defaultValues = {
//     gender: [],
//     category: 'All',
//     colors: [],
//     priceRange: [0, 200],
//     rating: '',
//     sortBy: 'featured',
//   };

//   const methods = useForm({
//     defaultValues,
//   });

//   const {
//     reset,
//     watch,
//     formState: { dirtyFields },
//   } = methods;

//   const isDefault =
//     (!dirtyFields.gender &&
//       !dirtyFields.category &&
//       !dirtyFields.colors &&
//       !dirtyFields.priceRange &&
//       !dirtyFields.rating) ||
//     false;

//   const values = watch();

//   const dataFiltered = applyFilter(products, values);

//   useEffect(() => {
//     dispatch(getProducts());
//   }, [dispatch]);

//   const handleResetFilter = () => {
//     reset();
//   };

//   const handleOpenFilter = () => {
//     setOpenFilter(true);
//   };

//   const handleCloseFilter = () => {
//     setOpenFilter(false);
//   };

//   return (
//     <>
//       <Helmet>
//         <title> Ecommerce: Shop | Minimal UI</title>
//       </Helmet>

//       <FormProvider methods={methods}>
//         <Container maxWidth={themeStretch ? false : 'lg'}>
//           <CustomBreadcrumbs
//             heading="Shop"
//             links={[
//               { name: 'Dashboard', href: PATH_DASHBOARD.root },
//               {
//                 name: 'E-Commerce',
//                 href: PATH_DASHBOARD.eCommerce.root,
//               },
//               { name: 'Shop' },
//             ]}
//           />

//           <Stack
//             spacing={2}
//             direction={{ xs: 'column', sm: 'row' }}
//             alignItems={{ sm: 'center' }}
//             justifyContent="space-between"
//             sx={{ mb: 2 }}
//           >
//             <ShopProductSearch />

//             <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
//               <ShopFilterDrawer
//                 isDefault={isDefault}
//                 open={openFilter}
//                 onOpen={handleOpenFilter}
//                 onClose={handleCloseFilter}
//                 onResetFilter={handleResetFilter}
//               />

//               <ShopProductSort />
//             </Stack>
//           </Stack>

//           <Stack sx={{ mb: 3 }}>
//             {!isDefault && (
//               <>
//                 <Typography variant="body2" gutterBottom>
//                   <strong>{dataFiltered.length}</strong>
//                   &nbsp;Products found
//                 </Typography>

//                 <ShopTagFiltered isFiltered={!isDefault} onResetFilter={handleResetFilter} />
//               </>
//             )}
//           </Stack>

//           <ShopProductList products={dataFiltered} loading={!products.length && isDefault} />

//           <CartWidget totalItems={checkout.totalItems} />
//         </Container>
//       </FormProvider>
//     </>
//   );
// }

// // ----------------------------------------------------------------------

// function applyFilter(products, filters) {
//   const { gender, category, colors, priceRange, rating, sortBy } = filters;

//   const min = priceRange[0];

//   const max = priceRange[1];

//   // SORT BY
//   if (sortBy === 'featured') {
//     products = orderBy(products, ['sold'], ['desc']);
//   }

//   if (sortBy === 'newest') {
//     products = orderBy(products, ['createdAt'], ['desc']);
//   }

//   if (sortBy === 'priceDesc') {
//     products = orderBy(products, ['price'], ['desc']);
//   }

//   if (sortBy === 'priceAsc') {
//     products = orderBy(products, ['price'], ['asc']);
//   }

//   // FILTER PRODUCTS
//   if (gender.length) {
//     products = products.filter((product) => gender.includes(product.gender));
//   }

//   if (category !== 'All') {
//     products = products.filter((product) => product.category === category);
//   }

//   if (colors.length) {
//     products = products.filter((product) => product.colors.some((color) => colors.includes(color)));
//   }

//   if (min !== 0 || max !== 200) {
//     products = products.filter((product) => product.price >= min && product.price <= max);
//   }

//   if (rating) {
//     products = products.filter((product) => {
//       const convertRating = (value) => {
//         if (value === 'up4Star') return 4;
//         if (value === 'up3Star') return 3;
//         if (value === 'up2Star') return 2;
//         return 1;
//       };
//       return product.totalRating > convertRating(rating);
//     });
//   }

//   return products;
// }

import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
// sections
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';
import { getDataFromApi } from '../../utils/apiCalls';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['current employee', 'ex-employee', 'all'];

const ROLE_OPTIONS = [
  'all',
  'ux designer',
  'full stack designer',
  'backend developer',
  'project manager',
  'leader',
  'ui designer',
  'ui/ux designer',
  'front end developer',
  'full stack developer',
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'empId', label: 'Employee Id', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  // { id: 'role', label: 'Role', align: 'left' },
  // { id: 'isVerified', label: 'Verified', align: 'center' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function EcommerceShopPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('current employee');

  const getEmployeeDetails = () => {
    getDataFromApi(`employee/list`).then((res) => {
      setTableData(res.data);
    });
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered =
    filterName !== '' || filterRole !== 'all' || filterStatus !== 'current employee';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    // (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (empId) => {
    const deleteRow = tableData.filter((row) => row.empId !== empId);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.empId));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (empId) => {
    navigate(PATH_DASHBOARD.employee.edit(paramCase(empId)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  return (
    <>
      <Helmet>
        <title> Employee List | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Employee"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Employee', href: PATH_DASHBOARD.employee.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.employee.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add Employee
            </Button>
          }
        />

        <Card>
          <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <UserTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterRole}
            // optionsRole={ROLE_OPTIONS}
            onFilterName={handleFilterName}
            // onFilterRole={handleFilterRole}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.empId)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.empId)
                  //   )
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row.empId}
                        row={row}
                        selected={selected.includes(row.empId)}
                        onSelectRow={() => onSelectRow(row.empId)}
                        onDeleteRow={() => handleDeleteRow(row.empId)}
                        onEditRow={() => handleEditRow(row.empId)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.empStatus === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
