import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import {
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Stack,
  Dialog,
  Typography,
  Card,
  Grid,
  TableRow,
  TableCell,
} from '@mui/material';
// routes
// _mock_
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
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
import { getDataFromApi } from '../../utils/apiCalls';
import UpdateViewLeaveRequestForm from '../../sections/@dashboard/LeaveManagment/UpdateViewLeaveRequestForm';
import {
  EmployeeLeaveManagementTableRow,
  EmployeeLeaveManagementTableToolbar,
} from '../../sections/@dashboard/LeaveManagment/EmployeeLeaveList';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'empId', label: 'Employee ID', align: 'left' },
  { id: 'name', label: 'Employee Name', align: 'left' },
  { id: 'startDate', label: 'Start Date', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'cause', label: 'Cause', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
  //   { id: '' },
];

// ----------------------------------------------------------------------

export default function EmployeeLeaveManagementListPage() {
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

  const [tableData, setTableData] = useState([]);

  const [employeeList, setEmployeeList] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterEmployee, setFilterEmployee] = useState('');

  const [leaveOpen, setLeaveOpen] = useState(false);

  const [openForm, setOpenForm] = useState(false);

  const [leaveFormData, setLeaveFormData] = useState('');

  const [leaveView, setLeaveView] = useState(false);

  const [leaveInBucket, setLeaveInBucket] = useState('');

  const [Employee, setEmployee] = useState([]);

  const [loading, setLoading] = useState(true);

  const getLeaveDetails = () => {
    getDataFromApi(`leave/management/list`).then((res) => {
      
      const empList = [];
      setLoading(false);
      setTableData(res.data ?? []);
      const employee = res.data.map((emp) => ({ name: emp.name }));
      console.log(employee, '116');
      // eslint-disable-next-line array-callback-return
      res.data.map((Emp) => {
        const tempObj = {};
        tempObj.name = Emp.name;
        tempObj.empid = Emp.empId;
        empList.push(tempObj);
      });
      setEmployeeList(empList);
    });
  };

  const [LeaveRequest, setLeaveRequest] = useState({});
  const { id } = useParams();

  function getleaveRequestById() {
    getDataFromApi(`leave/request/${id}`).then((res) => {
      setLeaveRequest(res.data);
    });
  }

  useEffect(() => {
    getleaveRequestById();
    getLeaveDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterEmployee,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterEmployee !== '';

  const isNotFound =
    // (
    !dataFiltered.length;
  //  && !!filterName) || (!dataFiltered.length && !!filterEmployee);

  const handleOpenConfirm = () => {
    setLeaveOpen(true);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = (data) => {
    const deleteRow = tableData.filter((row) => row.id !== data);
    setSelected([]);
    setLeaveFormData(data);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
    setOpenForm(false);
    setOpenConfirm(false);
    setLeaveOpen(false);
    setLeaveView(false);
    setLeaveFormData('');
    setTimeout(() => {
      getLeaveDetails();
    }, 0);
  };

  const handleOpenModel = () => {
    setOpenForm(true);
    setLeaveOpen(true);
  };
  const handleCloseModel = () => {
    setOpenForm(false);
  };
  const handelLeaveClose = () => {
    setOpenForm(false);
    setLeaveOpen(false);
    setLeaveView(false);
    setLeaveFormData('');
    setTimeout(() => {
      getLeaveDetails();
    }, 0);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteRow = (data) => {
    setOpenConfirm(true);
    setLeaveFormData(data);
  };

  const handleEditRow = (data) => {
    setLeaveFormData(data);
    setLeaveOpen(true);
    setOpenForm(true);
  };

  const handleViewRow = (data) => {
    setLeaveFormData(data);
    setLeaveView(true);
    setLeaveOpen(true);
    setOpenForm(true);
  };

  const handleFilterEmployee = (event) => {
    setPage(0);
    setFilterEmployee(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterEmployee('');
  };

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Card>
          <EmployeeLeaveManagementTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            filterEmployee={filterEmployee}
            optionEmployee={employeeList}
            onFilterEmployee={handleFilterEmployee}
          />
          {/* <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2, ml: 3 }}
          >
            <Grid item xs={12} md={4}>
              <Typography>
                Leave in Bucket: <b> 1 </b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>
                LOP in months: <b> 2 </b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>
                LOP in year: <b> 3 </b>
              </Typography>
            </Grid>
          </Grid> */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
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
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <EmployeeLeaveManagementTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row)}
                        onEditRow={() => handleEditRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />
                  {/* {loading && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <LoadingScreen />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )} */}
                  {/* {!loading && isNotFound && */}
                  <TableNoData isNotFound={isNotFound} />
                  {/* } */}
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
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
      <Dialog fullWidth maxWidth="sm" open={openForm} onClose={handleCloseModel}>
        <UpdateViewLeaveRequestForm
          open={leaveOpen}
          view={leaveView}
          row={leaveFormData}
          onClose={handelLeaveClose}
        />
      </Dialog>

      <ConfirmDialog row={leaveFormData} open={openConfirm} onClose={handleCloseConfirm} />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterEmployee }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (emp) => emp.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }
  if (filterEmployee !== '') {
    inputData = inputData.filter((emp) => emp.name.filterEmployee?.toLowerCase());
  }

  return inputData;
}
