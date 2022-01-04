import React, { useState, useEffect } from "react";
import axios from 'axios'

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment/index";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  }, 
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Jonathan Banks",
      interviewer: {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png"
      }
    }
  },
  {
    id: 4,
    time: "3:30pm"
  },
  {
    id: "last",
    time: "4pm",
  }
];

export default function Application(props) {
  // const [days, setDays] = useState([]);
  // const [day, setDay] = useState("Monday");
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  
  const setDay = day => setState({ ...state, day })
  const setDays = days => setState({...state, days });
  
  useEffect(() => {
    axios.get('/api/days').then(response => setDays(response.data));
  }, []);

  
  const appointmentData = appointments.map( appointment => {
    return <Appointment key={appointment.id} {...appointment} />
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
            // setDay = {setDay}
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
        {appointmentData}
      </section>
    </main>
  );
}
