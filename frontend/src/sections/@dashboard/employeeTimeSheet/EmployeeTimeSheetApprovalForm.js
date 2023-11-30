/* eslint-disable arrow-body-style */
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
//
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// redux
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from '../../../redux/store';
import { getEvents, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import { useSnackbar } from '../../../components/snackbar';
import { useSettingsContext } from '../../../components/settings';
import { useDateRangePicker } from '../../../components/date-range-picker';
import { StyledCalendar, CalendarToolbar, CalendarFilterDrawer } from '../calendar';
import { getDataFromApi } from '../../../utils/apiCalls';
import { calculateDateTimeDifferenceInMinutes, convertMinutesToHours } from '../../../utils/common';
import FormProvider, { RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
EmployeeTimeSheetApprovalForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
};

export default function EmployeeTimeSheetApprovalForm({ onClose, open, row }) {
  console.log(row, 'row');
  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef(null);

  const events = useGetEvents();

  const [openForm, setOpenForm] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState(null);

  const [selectedRange, setSelectedRange] = useState(null);
  const [worklogFormData, setWorklogFormData] = useState({});
  const [holiday, setHoliday] = useState([]);
  const [worklog, setWorklog] = useState([]);
  const [leave, setLeave] = useState([]);
  const [timesheetData, setTimesheetData] = useState({});

  const { state } = useLocation();
  console.log(state, 'state');

  const LeaveSchema = Yup.object().shape({ comment: Yup.string() });

  const getHolidayDetails = () => {
    getDataFromApi(`holiday/list`).then((res) => {
      const holidayDateList = [];
      res.data.forEach((item) => {
        holidayDateList.push({
          id: item.id,
          title: item.name,
          date: item.date,
          allDay: true,
        });
      });

      setHoliday(holidayDateList);
    });
  };

  const getWorklogDetails = () => {
    getDataFromApi(`timesheet/worklog/list`).then((res) => {
      console.log('worklog', res.data);
      const worklogList = [];
      res.data.forEach((data) => {
        worklogList.push({
          title: data.projectName,
          date: data.createdOn,
          start: data.start,
          end: data.end,
          worklogObj: data,
          textColor: 'blue',
        });
      });
      setWorklog(worklogList);
    });
  };

  const getLeaveById = () => {
    getDataFromApi(`leave/leaverequest/list`).then((res) => {
      const leaveList = [];
      res.data.forEach((Data) => {
        leaveList.push({
          id: Data.id,
          title: Data.leaveCategory,
          date: new Date(Data.startDate).toISOString(),
          allDay: true,
        });
      });
      setLeave(leaveList);
    });
  };

  // const getTimeSheetDataByEmpId = () => {
  //   getDataFromApi(`employee/timesheet/INVI002`).then((res) => {
  //     setTimesheetData(res.data);
  //     console.log(res, 'res');
  //   });
  // };

  const defaultValues = useMemo(
    () => ({
      comment: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(LeaveSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    console.log(data);
  };

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.addEvent(worklog);
    calendarApi.addEvent(holiday);
    calendarApi.addEvent(leave);
    getHolidayDetails();
    getWorklogDetails();
    getLeaveById();
    // getTimeSheetDataByEmpId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedEvent = useSelector(() => {
    if (selectedEventId) {
      return events.find((event) => event.id === selectedEventId);
    }

    return null;
  });

  const picker = useDateRangePicker(null, null);

  const [date, setDate] = useState(new Date());

  const [openFilter, setOpenFilter] = useState(false);

  const [filterEventColor, setFilterEventColor] = useState([]);

  const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleOpenModal = () => {
    setOpenForm(true);
  };

  const handleCloseModal = () => {
    setOpenForm(false);
    setWorklogFormData('');
    setSelectedRange(null);
    setSelectedEventId(null);
  };

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.unselect();
    }
    handleOpenModal();
    setSelectedRange({
      start: arg.start,
      end: arg.end,
    });
  };

  const handleSelectEvent = (arg) => {
    setWorklogFormData({
      ...arg?.event?._def?.extendedProps?.worklogObj,
    });
    handleOpenModal();
    setSelectedEventId(arg.event.id);
  };

  const handleResizeEvent = (event) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateUpdateEvent = (data) => {
    setWorklogFormData(data);
  };

  const handleDeleteEvent = () => {
    try {
      if (selectedEventId) {
        handleCloseModal();
        dispatch(deleteEvent(selectedEventId));
        enqueueSnackbar('Delete success!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterEventColor = (eventColor) => {
    const checked = filterEventColor.includes(eventColor)
      ? filterEventColor.filter((value) => value !== eventColor)
      : [...filterEventColor, eventColor];

    setFilterEventColor(checked);
  };

  const handleResetFilter = () => {
    const { setStartDate, setEndDate } = picker;

    if (setStartDate && setEndDate) {
      setStartDate(null);
      setEndDate(null);
    }

    setFilterEventColor([]);
  };

  const handleDayRenderEvent = (mData) => {
    let mClass = '';

    holiday?.forEach((item) => {
      const itemDate = new Date(item.date);
      if (itemDate.toString() === mData.date.toString()) {
        mClass = 'calc-gray';
      }
    });

    leave?.forEach((Items) => {
      console.log(Items, 'items');
      const leaveDate = new Date(Items.date);
      if (leaveDate.toString() === mData.date.toString() || Items.title === 'Earn Leave ') {
        mClass = 'calc-yellow';
      }

      //  else if (leaveDate.toString() === mData.date.toString() || Items.title === 'Loss of Pay') {
      //   mClass = 'calc-orange';
      // }
    });

    worklog?.forEach((Item) => {
      const eventDate = new Date(Item.date);
      const currentData = new Date(mData.date.toString());

      // if (
      //   eventDate.getFullYear() + eventDate.getMonth() + eventDate.getDate() ===
      //   currentData.getFullYear() + currentData.getMonth() + currentData.getDate()
      // ) {
      //   mClass = 'worklog-calc-blue';
      // }
    });
    return mClass;
  };

  const formateEventList = (listOfEvents) => {
    const newEventDateList = [];
    const newEventList = [];

    listOfEvents.forEach((item) => {
      let eventDate = new Date(item.date);
      eventDate = eventDate.getFullYear() + eventDate.getMonth() + eventDate.getDate();

      if (newEventDateList.indexOf(eventDate) === -1) {
        newEventList.push({
          title: '',
          date: item.date,
          eventList: [{ ...item }],
        });
        newEventDateList.push(eventDate);
      } else {
        newEventList[newEventDateList.indexOf(eventDate)].eventList.push(item);
      }
    });
    return newEventList;
  };

  const handleEventContent = (arg) => {
    const cellDate = new Date(arg.date);
    const eventList = [];
    let totalWorkingMin = 0;

    // step 2; get worklog of the day
    if (worklog) {
      worklog.forEach((item) => {
        const dateObj = new Date(item.start);
        if (cellDate.getDate() + cellDate.getMonth() === dateObj.getDate() + dateObj.getMonth()) {
          eventList.push(item);
        }
      });
    }

    eventList?.forEach((item) => {
      totalWorkingMin += calculateDateTimeDifferenceInMinutes(item.start, item.end);
    });
    // console.log(convertMinutesToHours(totalWorkingMin));

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'inherit',
          padding: '5px 10px',
        }}
      >
        <p
          style={{
            padding: 0,
            margin: 0,
            color: totalWorkingMin > 240 ? 'green' : 'red',
          }}
        >
          {totalWorkingMin > 0 ? convertMinutesToHours(totalWorkingMin) : ''}
        </p>
        <p style={{ padding: 0, margin: 0 }}>{cellDate.getDate()}</p>
      </div>
    );
  };

  // <li style={{ color: 'black', fontWeight: '700' }} key={`${item.date}_${index}`}>
  //   {item.start && item.end && `Hours: ${c.hours} Minutes ${c.minutes}`}
  //   {item.title}
  // </li>

  // const calenderEvents = ;
  // console.log(calenderEvents, 'list');

  const [calenderEvents, setCalenderEvents] = useState([]);

  useEffect(() => {
    setCalenderEvents([...holiday, ...worklog, ...leave]);
  }, [holiday, worklog, leave]);
  return (
    <FormProvider
      methods={methods}
      // onSubmit={handleSubmit(onSubmit)}
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ pt: 3 }}>
          <Typography variant="h4" gutterBottom>
            Employee TimeSheet
          </Typography>
        </Stack>

        <Card>
          <StyledCalendar>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
              onOpenFilter={() => setOpenFilter(true)}
            />

            <FullCalendar
              weekends
              editable
              droppable
              selectable
              rerenderDelay={10}
              allDayMaintainDuration
              eventResizableFromStart
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              dayCellContent={handleEventContent}
              events={calenderEvents}
              headerToolbar={false}
              select={handleSelectRange}
              eventDrop={handleDropEvent}
              eventClick={handleSelectEvent}
              eventResize={handleResizeEvent}
              height={isDesktop ? 720 : 'auto'}
              dayCellClassNames={handleDayRenderEvent}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
        <Grid direction="column" spacing={2} sx={{ pt: 3 }}>
          <Grid item xs={12}>
            <RHFTextField name="comment" label="Comment*" multiline rows={3} />
          </Grid>
        </Grid>
        <Stack justifyContent="flex-end" direction="row" spacing={1} sx={{ p: 2, pb: 2 }}>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
      </Container>

      <CalendarFilterDrawer
        events={events}
        picker={picker}
        openFilter={openFilter}
        onResetFilter={handleResetFilter}
        filterEventColor={filterEventColor}
        onCloseFilter={() => setOpenFilter(false)}
        onFilterEventColor={handleFilterEventColor}
        onSelectEvent={(eventId) => {
          if (eventId) {
            handleOpenModal();
            setSelectedEventId(eventId);
          }
        }}
      />
    </FormProvider>
  );
}

// ----------------------------------------------------------------------

const useGetEvents = () => {
  const dispatch = useDispatch();

  const { events: data } = useSelector((state) => state.calendar);

  const getAllEvents = useCallback(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  const events = data.map((event) => ({
    ...event,
    textColor: event.color,
  }));

  return events;
};

// ----------------------------------------------------------------------
