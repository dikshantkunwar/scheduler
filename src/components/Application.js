import React, { useState, useEffect } from "react";
import axios from 'axios'

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment/index";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  
  const setDay = day => setState(prev => ({ ...prev, day }));
  function bookInterview(id, interview) {
    // Change local state of interview when an interview is booked
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    setState({ ...state, appointments });
    axios.put(`/api/appointments/${id}`)
    .then(res => console.log(res));

  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      setState(prev => ({...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data}));
    });
  }, []);

  console.log(state)
  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

  const schedule = appointments.map( appointment => {
  const interview = getInterview(state, appointment.interview);

    return (
      <Appointment 
        key={appointment.id} 
        {...appointment}
        interview={interview} 
        interviewerList = {interviewers}
        interviewers={getInterview(state, appointment.interview)}
        bookInterview = {bookInterview}
      />)
  });

  
  
  return (
    <main className="layout">
      <section className="sidebar">
        <img
            className="sidebar--centered"
            src="images/logo.png"
            alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay = {setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */}
        {schedule}
      </section>
    </main>
  );
}
