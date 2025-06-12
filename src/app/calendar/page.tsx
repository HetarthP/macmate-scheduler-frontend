'use client';
//this is the calendar ui to style the calendar on the user dashboard
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([
    {
      title: 'Example Event',
      start: new Date(),
      end: new Date(),
    },
  ]);
//extra styling
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your McMaster Schedule</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarPage;
