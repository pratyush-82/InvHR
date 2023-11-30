import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import {
  Table,
  TableBody,
  Container,
  TableContainer,
} from '@mui/material';
// routes
// _mock_
// components
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import { getDataFromApi } from '../../../utils/apiCalls';
import WorklogTableRow from './WorklogTableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'projectname', label: 'Project Name', align: 'left' },
  { id: 'comment', label: 'Comment', align: 'left' },
  { id: 'createdon', label: 'Created On', align: 'left' },
  { id: 'end', label: 'End', align: 'left' },
];


// ----------------------------------------------------------------------

export default function CalendarList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const [worklog, setWorklog] = useState([]);

  const [filterName, setFilterName] = useState('');

  const getWorklogDetails = () => {
    getDataFromApi(`timesheet/worklog/list`).then((res) => {
      const worklogList = [];
      res.data.forEach((data) => {
        worklogList.push({
          id: data.id,
          name: data.name,
          projectName: data.projectName,
          comment: data.comment,
          createdOn: data.createdOn,
          end: data.end,
        });
      });
      setWorklog(worklogList);
      console.log("Worklogs------>",worklog);
    });
  };

  useEffect(() => {
    getWorklogDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataFiltered = applyFilter({
    inputData: worklog,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '';

  const isNotFound = !dataFiltered.length;


  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>


        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>

          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={worklog.length}
                numSelected={selected.length}
                onSort={onSort}
              />

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <WorklogTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, worklog.length)}
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
