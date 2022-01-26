import React from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment/index";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

export default function Application(props) {
  const {
    state, 
    setDay,
    bookInterview,
    cancelInterview  
  } = useApplicationData();
  console.log('state', state);
  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  const schedule = appointments.map( appointment => {
    return (
      <Appointment 
        key={appointment.id} 
        {...appointment}
        interviewerList = {interviewers}
        interviewers={getInterview(state, appointment.interview)}
        bookInterview = {bookInterview}
        cancelInterview = {cancelInterview}
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
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
