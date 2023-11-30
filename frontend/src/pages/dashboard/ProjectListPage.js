import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Button,
  Divider,
  TableBody,
  Container,
  TableContainer,
  Dialog,
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
import { ProjectTableToolbar, ProjectTableRow } from '../../sections/@dashboard/project/list';
import { getDataFromApi } from '../../utils/apiCalls';
import AddNewProjectForm from '../../sections/@dashboard/project/AddNewProjectForm';
import { ViewGuard } from '../../auth/MyAuthGuard';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'id', label: 'Project ID', align: 'left' },
  { id: 'name', label: 'Project Name', align: 'left' },
  { id: 'startDate', label: 'Start Date', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'visibility', label: 'Visibility', align: 'left' },
  { id: '', label: 'Action', align: 'left' },
];
// ----------------------------------------------------------------------
export default function ProjectListPage() {
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
  const [filterName, setFilterName] = useState('');
  const filterStatus = 'all';
  const [openForm, setOpenForm] = useState(false);
  const [projectFormData, setProjectFormData] = useState('');

  const handleOpenModal = () => {
    setOpenForm(true);
  };
  const handleCloseModal = () => {
    setOpenForm(false);
    setProjectFormData('');
    setTimeout(() => {
      getProjectDetails();
    }, 0);
  };
  const getProjectDetails = () => {
    getDataFromApi(`project/list`).then((res) => {
      setTableData(res.data);
    });
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  const denseHeight = dense ? 52 : 72;
  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus);
  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const handleEditRow = (data) => {
    setOpenForm(true);
    setProjectFormData(data);
    handleOpenModal();
  };
  const handleResetFilter = () => {
    setFilterName('');
  };

  useEffect(() => {
    getProjectDetails();
  }, []);
  return (
    <ViewGuard permission="project.project.read" page="true">
      <Helmet>
        <title> Project | HRMS </title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Project"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.projectList },
            { name: 'Project ', href: PATH_DASHBOARD.project.projectList },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenModal}
            >
              Project
            </Button>
          }
        />
        <Card>
          <Divider />
          <ProjectTableToolbar onFilterName={handleFilterName} onResetFilter={handleResetFilter} />
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
                      <ProjectTableRow
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
        </Card>
      </Container>
      <Dialog fullWidth maxWidth="xs" open={openForm} onClose={handleCloseModal}>
        <AddNewProjectForm
          open={openForm}
          row={projectFormData}
          handleCloseModal={handleCloseModal}
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
      (Project) => Project.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }
  if (filterStatus !== 'all') {
    inputData = inputData.filter((Project) => Project.visibility === filterStatus);
  }
  return inputData;
}
