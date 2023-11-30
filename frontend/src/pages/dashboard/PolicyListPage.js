import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Divider,
  TableBody,
  Container,
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
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../components/table';
// sections
import { PolicyTableToolbar, PolicyTableRow } from '../../sections/@dashboard/policy/list';
import { getDataFromApi } from '../../utils/apiCalls';
import AddNewPolicyForm from '../../sections/@dashboard/policy/AddNewPolicyForm';
import { ViewGuard } from '../../auth/MyAuthGuard';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// ----------------------------------------------------------------------
const STATUS_OPTIONS = ['active', 'inactive'];

const TABLE_HEAD = [
  { id: 'id', label: 'Policy Id', align: 'left' },
  { id: 'name', label: 'Policy Name', align: 'left' },
  { id: 'date', label: 'Effective From', align: 'left' },

  { id: 'decription', label: 'Description', align: 'left' },
  { id: '', label: 'Action', align: 'left' },
];
// ----------------------------------------------------------------------

export default function PolicyListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSelectRow,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const policy = ' Policy';
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [openForm, setOpenForm] = useState(false);
  const [policyFormData, setPolicyFormData] = useState('');
  const [loading, setLoading] = useState(true);

  const handleOpenModal = () => {
    setOpenForm(true);
  };
  const handleCloseModal = () => {
    setOpenForm(false);
    getPolicyDetails();
    setPolicyFormData('');
    setTimeout(() => {
      getPolicyDetails();
    }, 0);
  };

  const getPolicyDetails = () => {
    getDataFromApi(`policy/list`).then((res) => {
      setTableData(res.data);
      setLoading(false);
      console.log(res.data);
    });
  };

  useEffect(() => {
    getPolicyDetails();
  }, []);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  const denseHeight = dense ? 52 : 72;
  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus);

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const handleEditRow = (data) => {
    setOpenForm(true);
    setPolicyFormData(data);
    handleOpenModal();
  };
  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('Active');
  };
  return (
    <ViewGuard permission="employee.employee.read" page="true">
      <Helmet>
        <title> Policy | HRMS</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Policy"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.policyList },
            { name: 'Policy ', href: PATH_DASHBOARD.policy.policyList },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenModal}
            >
              Policy
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
              <Tab key={tab} label={tab + policy} value={tab} />
            ))}
          </Tabs>
          <Divider />
          <PolicyTableToolbar onFilterName={handleFilterName} onResetFilter={handleResetFilter} />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                      <PolicyTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
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
        <AddNewPolicyForm
          open={openForm}
          handleCloseModal={handleCloseModal}
          row={policyFormData}
        />
      </Dialog>
    </ViewGuard>
  );
}
// ----------------------------------------------------------------------
function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    inputData = inputData.filter(
      (policy) => policy.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }
  if (filterStatus !== 'all') {
    inputData = inputData.filter((policy) => policy.status === filterStatus);
  }
  return inputData;
}
