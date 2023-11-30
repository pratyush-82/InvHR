import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
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
  DialogTitle,
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
import PolicyNewAdd from '../../sections/@dashboard/policy/AddNewPolicyForm';

import { useSelector } from '../../redux/store';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['active', 'inactive'];

const TABLE_HEAD = [
  { id: 'id', label: 'Policy Id', align: 'left' },
  { id: 'policyName', label: 'Policy Name', align: 'left' },
  { id: 'policyEffectivefrom', label: 'Effective From', align: 'left' },

  { id: 'details', label: 'Description', align: 'left' },
  { id: '', label: 'Action', align: 'left' },
];

// ----------------------------------------------------------------------

export default function GeneralPolicyListPage() {
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

  const [policy_, setPolicy] = useState();
  const policy = ' Policy';
  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState('active');

  const [openForm, setOpenForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const selectedEvent = useSelector(() => {
    if (selectedEventId) {
      return selectedEventId;
    }

    return null;
  });
  const handleOpenModal = () => {
    setOpenForm(true);
  };
  const handleCloseModal = () => {
    setOpenForm(false);
    setSelectedEventId(null);
  };

  const getPolicyDetails = () => {
    getDataFromApi(`policy/list`).then((res) => {
      setTableData(res.data);
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

  const handleEditRow = (policyId, row) => {
    setOpenForm(true);
    handleOpenModal();
    setPolicy(row);
    setSelectedEventId(paramCase(policyId));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('Active');
  };

  return (
    <>
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
              Add Policy
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
                        key={row.policyId}
                        row={row}
                        selected={selected.includes(row.policyId)}
                        onSelectRow={() => onSelectRow(row.policyId)}
                        onEditRow={() => handleEditRow(row.policyId, row)}
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

      <Dialog fullWidth maxWidth="xs" open={openForm} onClose={handleCloseModal}>
        <DialogTitle>{selectedEvent ? 'Update Policy' : 'Add Policy'}</DialogTitle>

        <PolicyNewAdd
          selectedEventId={selectedEvent ? selectedEventId : ''}
          isEdit={selectedEvent ? true : ''}
          currentPolicy={selectedEvent ? policy_ : ''}
          handleCloseModal={handleCloseModal}
          getPolicyDetails={getPolicyDetails}
        />
      </Dialog>
    </>
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
      (policy) => policy.policyName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((policy) => policy.policyStatus === filterStatus);
  }
  return inputData;
}
