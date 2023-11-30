import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Stack, Button, Typography, IconButton, MenuItem } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';


// ----------------------------------------------------------------------

const VIEW_OPTIONS = [
  { value: 'dayGridMonth', label: 'Month', icon: 'ic:round-view-module' },
  { value: 'timeGridWeek', label: 'Week', icon: 'ic:round-view-week' },
  { value: 'timeGridDay', label: 'Day', icon: 'ic:round-view-day' },
  { value: 'listWeek', label: 'Agenda', icon: 'ic:round-view-agenda' },
];

// ----------------------------------------------------------------------

CalendarToolbar.propTypes = {
  onToday: PropTypes.func,
  onNextDate: PropTypes.func,
  onPrevDate: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onChangeView: PropTypes.func,
  switchToCalendar: PropTypes.func,
  switchToList: PropTypes.func,
  date: PropTypes.instanceOf(Date),
  view: PropTypes.oneOf(['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek']),
};

export default function CalendarToolbar({
  date,
  view,
  onToday,
  onNextDate,
  onPrevDate,
  onChangeView,
  onOpenFilter,
  switchToCalendar,
  switchToList
}) {
  const isDesktop = useResponsive('up', 'sm');

  const [openPopover, setOpenPopover] = useState(null);

  const [activeIcon, setActiveIcon] = useState('table');

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleTableLayout = () =>{
    setActiveIcon('table');
    switchToCalendar()
  }

  const handleListLayout = () =>{
    setActiveIcon('list');
    switchToList()
  }

  const selectedItem = VIEW_OPTIONS.filter((item) => item.value === view)[0];

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2.5, pr: 2 }}
      >
        {isDesktop && activeIcon === 'table' && (
          <Button
            color="inherit"
            onClick={handleOpenPopover}
            startIcon={<Iconify icon={selectedItem.icon} />}
            endIcon={<Iconify icon="eva:chevron-down-fill" />}
            sx={{
              py: 0.5,
              pl: 1.5,
              bgcolor: 'action.selected',
              '& .MuiButton-endIcon': { ml: 0.5 },
            }}
          >
            {selectedItem.label}
          </Button>
        )}

        {activeIcon === 'table' ?<Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={onPrevDate}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Typography variant="h6">{fDate(date)}</Typography>

          <IconButton onClick={onNextDate}>
            <Iconify icon="eva:arrow-ios-forward-fill" />
          </IconButton>
        </Stack> : ""}

        <Stack direction="row" alignItems="center" justifyContent="flex-end" flexGrow = {activeIcon === 'list' ? 1 : 0}>
          <IconButton
            color={activeIcon === 'table' ? 'primary' : 'default'}
            onClick={handleTableLayout}
          >
            <Iconify icon="mdi:table" />
          </IconButton>
          <IconButton
            color={activeIcon === 'list' ? 'primary' : 'default'}
            onClick={handleListLayout}
          >
            <Iconify icon="mdi:format-list-bulleted" />
          </IconButton>
        </Stack>
      </Stack>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="top-left"
        sx={{ width: 160 }}
      >
        {VIEW_OPTIONS.map((viewOption) => (
          <MenuItem
            key={viewOption.value}
            onClick={() => {
              handleClosePopover();
              onChangeView(viewOption.value);
            }}
            sx={{
              ...(viewOption.value === view && {
                bgcolor: 'action.selected',
              }),
            }}
          >
            <Iconify icon={viewOption.icon} />
            {viewOption.label}
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}
