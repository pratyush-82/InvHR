import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell } from '@mui/material';

import { convertDateTimeFormat } from '../../../utils/common';

// ----------------------------------------------------------------------

WorklogTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};

export default function WorklogTableRow({ row, selected }) {
  const { id, name, projectName, comment, createdOn, end } = row;


  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="left">{id}</TableCell>
        <TableCell align="left">{projectName}</TableCell>
        <TableCell align="left">{comment}</TableCell>
        <TableCell align="left">{convertDateTimeFormat(createdOn)}</TableCell>
        <TableCell align="left">{convertDateTimeFormat(end)}</TableCell>
      </TableRow>
    </>
  );
}
