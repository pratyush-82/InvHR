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

HolidayTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  isDisabled: PropTypes.func,
};

export default function HolidayTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  isDisabled,
}) {
  const { id, name, date, branch } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

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
      <TableRow
        hover
        selected={selected}
        sx={isDisabled ? { opacity: 0.5, pointerEvents: 'none' } : {}}
      >
        <TableCell align="left">{id}</TableCell>
        <TableCell align="left">{name}</TableCell>
        <TableCell align="left">
          {/* {Object.keys(branch).map((item, i) => (
            // <p key={i}>{item}</p>
            <Label sx={{ m: 0.3 }}>{item}</Label>
          ))} */}
          {Object.keys(branch).map(
            (item, i) =>
              branch[item] && (
                <Label sx={{ m: 0.3 }} key={i}>
                  {item}
                </Label>
              )
          )}
        </TableCell>
        <TableCell align="left">{convertDateTimeFormat(date)}</TableCell>

        <TableCell align="left">
          <IconButton
            color={openPopover ? 'inherit' : 'default'}
            onClick={handleOpenPopover}
            disabled={isDisabled}
          >
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
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Update
        </MenuItem>
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
