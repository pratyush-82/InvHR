import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { TableRow, MenuItem, TableCell, IconButton } from '@mui/material';

import Label from '../../../../components/label/Label';
import { convertDateTimeFormat } from '../../../../utils/common';

// components
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';

// ----------------------------------------------------------------------

LeaveTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function LeaveTableRow({ row, selected, onEditRow, onDeleteRow, onViewRow }) {
  const { startDate, endDate, leaveType, leaveCategory, reportingPerson, status } = row;
console.log("Row data - ",reportingPerson);
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  let CancelBox = 'pending';
  if (status === 'approved') CancelBox = '';
  if (status === 'rejected') CancelBox = '';

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="left">{convertDateTimeFormat(startDate)}</TableCell>
        <TableCell align="left">{convertDateTimeFormat(endDate)}</TableCell>
        <TableCell align="left">{leaveType}</TableCell>
        <TableCell align="left">{leaveCategory}</TableCell>
        <TableCell align="left">{reportingPerson}</TableCell>
        <TableCell align="left">
          <Label
            color={
              (status === 'pending' && 'warning') ||
              (status === 'approved' && 'success') ||
              (status === 'rejected' && 'error')
            }
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
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Update
        </MenuItem>
        {CancelBox ? (
          <>
            {' '}
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
          </>
        ) : (
          ''
        )}
      </MenuPopover>
    </>
  );
}
