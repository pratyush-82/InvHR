import PropTypes from 'prop-types';
import { useState } from 'react';
import { TableRow, MenuItem, TableCell, IconButton } from '@mui/material';
import { formatDate } from '../../../../utils/common';
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
// ----------------------------------------------------------------------
EmployeeAppraisalTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
export default function EmployeeAppraisalTableRow({ row, selected, onEditRow, onDeleteRow, onViewRow }) {
  const { employeeId, employeeName, appraisalDate, submission_date, status } = row;
  const [openPopover, setOpenPopover] = useState(null);
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  return (
    <>
      <TableRow key={row.Id} hover selected={selected}>
        <TableCell align="left">{employeeId}</TableCell>
        <TableCell align="left">{employeeName}</TableCell>
        <TableCell align="left">{formatDate(appraisalDate)}</TableCell>
        <TableCell align="left">{submission_date ? formatDate(submission_date) : ''}</TableCell>
        <TableCell align="left">
          <Label
            variant="soft"
            color={(status === 'In Process' && 'error') || (status === 'Submitted' && 'warning') || (status === 'Appraised' && 'info') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </TableCell>
        <TableCell align="left">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 146 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>
        {(status === 'In Process') ? <>
          <MenuItem
            onClick={() => {
              onEditRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Update
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDeleteRow();
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Cancel Request
          </MenuItem>
        </> : ''
        }
      </MenuPopover>
    </>
  );
}
