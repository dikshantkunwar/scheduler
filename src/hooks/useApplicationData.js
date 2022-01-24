import { useState, useEffect } from "react";
import axios from 'axios'

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

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

  const setDay = day => setState(prev => ({ ...prev, day }));

  function bookInterview(id, interview) {
    // Change local state of interview when an interview is booked
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios.put(`/api/appointments/${id}`, { ...appointment })
    .then(res => {
      updateSpots("create");
      const days = [...state.days]  //update days state to change the spots 
      setState({ ...state, appointments, days }); 
    });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    return axios.delete(`api/appointments/${id}`, { interview: null })
    .then(res => {
      updateSpots("delete");
      const days = [...state.days]
      setState({ ...state, appointments, days });
    })
  }

  function updateSpots(action) {
    const day = state.days.find(day => day.name === state.day);
    /* can also be determined by checking for null interview objects but not necessary */
    if (action === "create") {
      day.spots += 1;
    } else {
      day.spots -= 1;
    }
  }

  return { state, setDay, bookInterview, cancelInterview };

}