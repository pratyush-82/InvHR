import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// components
import { formatDate } from '../../../../utils/common';
import MenuPopover from '../../../../components/menu-popover';
import Iconify from '../../../../components/iconify';
// ----------------------------------------------------------------------
PolicyTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
};
export default function PolicyTableRow({ row, selected, onEditRow }) {
  const { name, id, description, date } = row;
  const [openPopover, setOpenPopover] = useState(null);
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {id}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell align="left">{name}</TableCell>
        <TableCell align="left">{formatDate(date)}</TableCell>
        <TableCell align="left">{description}</TableCell>
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
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Update
        </MenuItem>
      </MenuPopover>
    </>
  );
}
