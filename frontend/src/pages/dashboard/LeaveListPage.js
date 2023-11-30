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
import { LeaveTableRow, LeaveTableToolbar } from '../../sections/@dashboard/Leave/list';
import LeaveRequestForm from '../../sections/@dashboard/Leave/LeaveRequestForm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'startDate', label: 'Start Date', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'approvedBy', label: 'Approved By', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
  //   { id: '' },
];

// ----------------------------------------------------------------------

export default function LeaveListPage() {
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

  const getLeaveDetails = () => {
    getDataFromApi(`leave/leaverequest/list`).then((res) => {
      console.log(res.data, 'res Data');
      setTableData(res.data ?? []);
    });
  };

  const [leave, setLeave] = useState({});
  const { id } = useParams();

  function getLeaveById() {
    getDataFromApi(`leave/leaverequest/${id}`).then((res) => {
      setLeave(res.data);
    });
  }

  useEffect(() => {
    getLeaveById();
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

  const isNotFound = !dataFiltered.length;

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
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ pt: 2 }}>
          <Button
            startIcon={<Iconify icon="eva:plus-fill" />}
            variant="contained"
            onClick={handleOpenModel}
          >
            Request
          </Button>
        </Stack>

        <LeaveTableToolbar
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
                tableData.map((row) => row.Id)
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
                    <LeaveTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row)}
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
          dense={dense}
          onChangeDense={onChangeDense}
        />
      </Container>
      <Dialog fullWidth maxWidth="sm" open={openForm} onClose={handleCloseModel}>
        <LeaveRequestForm
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
