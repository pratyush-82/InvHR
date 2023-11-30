import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isBefore, parseISO } from 'date-fns';
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
  Dialog,
  TableRow,
  TableCell,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
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
import {
  HolidayForm,
  HolidayTableRow,
  HolidayTableToolbar,
} from '../../sections/@dashboard/holiday/list';
import { getDataFromApi } from '../../utils/apiCalls';
import { ViewGuard } from '../../auth/MyAuthGuard';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';

// ----------------------------------------------------------------------

const BRANCH_OPTION = ['all', 'lucknow', 'bangalore', 'delhi'];

const TABLE_HEAD = [
  { id: 'id', label: 'Holiday ID', align: 'left' },
  { id: 'name', label: 'Holiday Name', align: 'left' },
  { id: 'branch', label: 'Branch', align: 'left' },
  { id: 'date', label: 'Holiday Date', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

// ----------------------------------------------------------------------

export default function HolidayListPage() {
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
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [holidayOpen, setHolidayOpen] = useState(false);
  const [holidayFormData, setHolidayFormData] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [loading, setLoading] = useState(true);

  const getHolidayDetails = () => {
    getDataFromApi(`holiday/list`).then((res) => {
      setLoading(false);
      console.log(res.data);
      setTableData(res.data);
    });
  };

  const [holiday, setHoliday] = useState({});
  const { id } = useParams();

  function getHolidayByID() {
    getDataFromApi(`holiday/${id}`).then((res) => {
      setHoliday(res.data);
    });
  }

  useEffect(() => {
    getHolidayByID();
    getHolidayDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [filterName, setFilterName] = useState('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterBranch,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterBranch !== 'all';
  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterBranch);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterBranch(event.target.value);
  };

  const handleOpenModal = () => {
    setOpenForm(true);
    setHolidayOpen(true);
  };
  const handleCloseModal = () => {
    setOpenForm(false);
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
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

  const handleHolidayClose = () => {
    setOpenForm(false);
    setHolidayOpen(false);
    setHolidayFormData('');
    setTimeout(() => {
      getHolidayDetails();
    }, 0);
  };

  const handleEditRow = (data) => {
    setHolidayFormData(data);
    setHolidayOpen(true);
    setOpenForm(true);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterBranch('all');
  };

  return (
    <ViewGuard permission="employee.employee.read" page="true">
      <Helmet>
        <title> Holiday | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Holidays"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Holiday', href: PATH_DASHBOARD.holiday.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenModal}
            >
              Holiday
            </Button>
          }
        />

        <Card>
          <HolidayTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            filterBranch={filterBranch}
            optionBranch={BRANCH_OPTION}
            onFilterBranch={handleFilterRole}
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
                      <HolidayTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onEditRow={() => handleEditRow(row)}
                        isDisabled={isBefore(parseISO(row.date), new Date())} // Check if the date has passed
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
      <Dialog fullWidth maxWidth="xs" open={openForm} onClose={handleCloseModal}>
        <HolidayForm open={holidayOpen} row={holidayFormData} onClose={handleHolidayClose} />
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
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </ViewGuard>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterBranch }) {
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

  if (filterBranch !== 'all') {
    inputData = inputData.filter((user) => user.branch[filterBranch?.toLowerCase()]);
  }

  return inputData;
}
