import { useEffect, useState } from 'react';
// @mui
import {
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Dialog,
} from '@mui/material';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { EmployeeAppraisalTableRow } from '../../sections/@dashboard/appraisal/list/index';
import EmployeeAppraisalForm from '../../sections/@dashboard/appraisal/EmployeeAppraisalForm';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialogAppraisal from '../../components/confirm-dialogAppraisal';
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
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'startDate', label: 'Employee ID', align: 'left' },
  { id: 'endDate', label: 'Employee Name', align: 'left' },
  { id: 'type', label: 'Appraisal Date', align: 'left' },
  { id: 'category', label: 'Submission Date', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];
// ----------------------------------------------------------------------
export default function EmployeeAppraisalListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const filterName = '';
  const [employeeAppraisalOpen, setEmployeeAppraisalOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [employeeAppraisalFormData, setEmployeeAppraisalFormData] = useState('');
  const [employeeAppraisalView, setEmployeeAppraisalView] = useState(false);
  const getEmployeeAppraisalDetails = () => {
    getDataFromApi(`appraisal/listEmployeeAppraisal`).then((res) => {
      setTableData(res.data);
    });
  };
  useEffect(() => {
    getEmployeeAppraisalDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = dense ? 52 : 72;
  const isNotFound = !dataFiltered.length && !!filterName;
  const handleOpenConfirm = () => {
    setEmployeeAppraisalOpen(true);
    setOpenConfirm(true);
  };
  const handleCloseConfirm = (data) => {
    const deleteRow = tableData.filter((row) => row.Id !== data);
    setSelected([]);
    setTableData(deleteRow);
    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
    setOpenForm(false);
    setOpenConfirm(false);
    setEmployeeAppraisalOpen(false);
    setEmployeeAppraisalView(false);
    setEmployeeAppraisalFormData('');
    setTimeout(() => {
      getEmployeeAppraisalDetails();
    }, 0);
  };
  const handleOpenModel = () => {
    setOpenForm(true);
    setEmployeeAppraisalOpen(true);
  };
  const handleCloseModel = () => {
    setEmployeeAppraisalView(false)
    setEmployeeAppraisalFormData('');

    setOpenForm(false);
  };
  const handelEmployeeAppraisalClose = () => {
    setEmployeeAppraisalFormData('');
    setOpenForm(false);
    setEmployeeAppraisalOpen(false);
    setEmployeeAppraisalView(false);
    setEmployeeAppraisalFormData('');
    setTimeout(() => {
      getEmployeeAppraisalDetails();
    }, 0);
  };
  const handleDeleteRow = (data) => {
    setOpenConfirm(true);
    setEmployeeAppraisalFormData(data);
  };
  const handleEditRow = (data) => {
    setEmployeeAppraisalFormData(data);
    setEmployeeAppraisalOpen(true);
    setOpenForm(true);
  };
  const handleViewRow = (data) => {
    setEmployeeAppraisalFormData(data);
    setEmployeeAppraisalView(true);
    setEmployeeAppraisalOpen(true);
    setOpenForm(true);
  };
  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Employee Appraisal"
          links={[
            { name: 'Dashboard', href: '' },
            { name: 'Employee Appraisal ', href: '' },
            { name: 'List', href: '' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenModel}
            >
              New Appraisal
            </Button>
          }
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
                    <EmployeeAppraisalTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row.Id)}
                      onSelectRow={() => onSelectRow(row.Id)}
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
      <Dialog fullWidth maxWidth="lg" open={openForm} onClose={handleCloseModel}>
        <EmployeeAppraisalForm
          open={employeeAppraisalOpen}
          view={employeeAppraisalView}
          row={employeeAppraisalFormData || {}}
          rowValidation={!!employeeAppraisalFormData}
          onClose={handelEmployeeAppraisalClose}
        />
      </Dialog>
      <ConfirmDialogAppraisal row={employeeAppraisalFormData || {}} open={openConfirm} onClose={handleCloseConfirm} />
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
      (user) => user.employeeAppraisalType.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }
  return inputData;
}
