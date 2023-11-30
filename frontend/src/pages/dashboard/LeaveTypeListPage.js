import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Stack,
  Typography,
  Dialog,
} from '@mui/material';
// routes
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
import { LeaveTypeTableRow, LeaveTypeTableToolbar } from '../../sections/@dashboard/LeaveType/list';
import AddLeaveTypeForm from '../../sections/@dashboard/LeaveType/LeaveTypeForm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Leave Type ID', align: 'left' },
  { id: 'name', label: 'Leave Type Name', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

// ----------------------------------------------------------------------

export default function LeaveTypeListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
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

  const [leaveSettingOpen, setLeaveSettingOpen] = useState(false);

  const [openForm, setOpenForm] = useState(false);

  const [leaveTypeFormData, setLeaveTypeFormData] = useState('');

  const [leaveTypeView, setLeaveTypeView] = useState(false);

  const getLeaveTypeDetails = () => {
    getDataFromApi(`leave/type/list`).then((res) => {
      console.log('leave type res', res.data);
      setTableData(res.data);
    });
  };

  const [leaveType, setLeaveType] = useState({});
  const { id } = useParams();

  function getLeaveTypeById() {
    getDataFromApi(`leave/type/${id}`).then((res) => {
      setLeaveType(res.data);
    });
  }

  useEffect(() => {
    getLeaveTypeById();
    getLeaveTypeDetails();
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
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenModel = () => {
    setOpenForm(true);
    setLeaveSettingOpen(true);
  };
  const handleCloseModel = () => {
    setOpenForm(false);
  };
  const handelLeaveSettingClose = () => {
    setOpenForm(false);
    setLeaveSettingOpen(false);
    setLeaveTypeView(false);
    setLeaveTypeFormData('');
    setTimeout(() => {
      getLeaveTypeDetails();
    }, 0);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditRow = (data) => {
    setLeaveTypeFormData(data);
    setLeaveSettingOpen(true);
    setOpenForm(true);
  };

  const handleViewRow = (data) => {
    setLeaveTypeFormData(data);
    setLeaveTypeView(true);
    setLeaveSettingOpen(true);
    setOpenForm(true);
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  return (
    <>
      <Helmet>
        <title> Leave List | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <LeaveTypeTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            open={handleOpenModel}
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
                      <LeaveTypeTableRow
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
      <Dialog fullWidth maxWidth="xs" open={openForm} onClose={handleCloseModel}>
        <AddLeaveTypeForm
          open={leaveSettingOpen}
          view={leaveTypeView}
          row={leaveTypeFormData}
          onClose={handelLeaveSettingClose}
        />
      </Dialog>

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
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
