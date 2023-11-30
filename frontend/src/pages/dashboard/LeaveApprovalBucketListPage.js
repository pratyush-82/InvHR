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
import {
  LeaveManagementTableRow,
  LeaveManagementTableToolbar,
} from '../../sections/@dashboard/LeaveManagment/list';
import UpdateViewLeaveRequestForm from '../../sections/@dashboard/LeaveManagment/UpdateViewLeaveRequestForm';
import EmployeeLeaveManagementListPage from './EmployeeLeaveManagementListPage';
import { ViewGuard } from '../../auth/MyAuthGuard';
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

export default function LeaveManagementListPage() {
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

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [leaveOpen, setLeaveOpen] = useState(false);

  const [openForm, setOpenForm] = useState(false);

  const [leaveFormData, setLeaveFormData] = useState('');

  const [leaveView, setLeaveView] = useState(false);

  const [loading, setLoading] = useState(false);

  const getLeaveDetails = () => {
    const pendingLeaveList = [];
    getDataFromApi(`leave/management/list`).then((res) => {
      // eslint-disable-next-line array-callback-return
      res.data.map((leave) => {
        if (leave.status === 'pending') {
          pendingLeaveList.push(leave);
        }
      });
      console.log(pendingLeaveList, 'pendingLeaveList');
      setTableData(pendingLeaveList ?? []);
      setLoading(false);
    });
  };

  const [LeaveRequest, setLeaveRequest] = useState({});
  const { id } = useParams();

  function getleaveRequestById() {
    getDataFromApi(`leave/request/${id}`).then((res) => {
      console.log(res.data, '123');
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
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '';

  const isNotFound = !dataFiltered.length && !!filterName;

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

  const handleResetFilter = () => {
    setFilterName('');
  };

  return (
    <ViewGuard permission="employee.employee.read" page="true">
      <Helmet>
        <title> Leave Management | HRMS</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ pb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Leave Management
          </Typography>
        </Stack>
        {tableData.length > 0 && (
          <Card>
            <LeaveManagementTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
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
                        <LeaveManagementTableRow
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
                    {loading && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <LoadingScreen />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}

                    {!loading && isNotFound && <TableNoData isNotFound={isNotFound} />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          /> */}
          </Card>
        )}
      </Container>
      &nbsp; &nbsp;
      <EmployeeLeaveManagementListPage />
      <Dialog fullWidth maxWidth="sm" open={openForm} onClose={handleCloseModel}>
        <UpdateViewLeaveRequestForm
          open={leaveOpen}
          view={leaveView}
          row={leaveFormData}
          onClose={handelLeaveClose}
        />
      </Dialog>
      <ConfirmDialog row={leaveFormData} open={openConfirm} onClose={handleCloseConfirm} />
    </ViewGuard>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.leaveType.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
