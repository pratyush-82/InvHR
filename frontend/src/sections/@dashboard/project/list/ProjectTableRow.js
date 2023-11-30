import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Stack, TableRow, MenuItem, TableCell, IconButton, Typography } from '@mui/material';
// components
import Label from '../../../../components/label';
import { convertDateTimeFormat } from '../../../../utils/common';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
// ----------------------------------------------------------------------
ProjectTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
};
export default function ProjectTableRow({ row, selected, onEditRow }) {
  const { name, id, visibility, status, startDate } = row;
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
        <TableCell align="left">{convertDateTimeFormat(startDate)}</TableCell>
        <TableCell align="left">{status}</TableCell>
        <TableCell align="left">
          <Label
            variant="soft"
            color={(visibility === 'inactive' && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {visibility}
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
