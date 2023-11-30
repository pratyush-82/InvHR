import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';

import { convertDateTimeFormat } from '../../../../utils/common';

// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
// eslint-disable-next-line import/order
import { useNavigate } from 'react-router';

// ----------------------------------------------------------------------

EmployeeLeaveManagementTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function EmployeeLeaveManagementTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewRow,
}) {
  const { empId, name, startDate, endDate, leaveType, leaveCategory, leaveCause, status, action } =
    row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const navigate = useNavigate();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="left">{empId}</TableCell>
        <TableCell align="left">{name}</TableCell>
        <TableCell align="left">{convertDateTimeFormat(startDate)}</TableCell>
        <TableCell align="left">{convertDateTimeFormat(endDate)}</TableCell>
        <TableCell align="left">{leaveType}</TableCell>
        <TableCell align="left">{leaveCategory}</TableCell>
        <TableCell align="left">{leaveCause}</TableCell>
        <TableCell align="left">
          {' '}
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
        sx={{ width: 140 }}
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
        {/* <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Approval
        </MenuItem> */}
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
