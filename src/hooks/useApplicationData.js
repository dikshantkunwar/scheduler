import { useReducer, useEffect } from "react";
import axios from 'axios'

function reducer(state, action) {
  switch(action.type){
    case "SET_DAY": 
      return {
        ...state,
        day: action.value
      };
    case "SET_APPLICATION_DATA":
      return {
        ...state,
        days: action.value.days || state.days,
        appointments: action.value.appointments,
      }
    case "SET_INTERVIEWERS":
      return { ...state, interviewers: action.value.interviewers }
    case "SET_SPOTS": {
      let days = state.days.map(d => {
        if (d.name === state.day) {
          return {
            ...d,
            spots: d.spots + action.value.update
          };
        }
        return d;
      });
      return {
        ...state,
        days
      };
    }
    default: 
      throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  }
}
export default function useApplicationData() {
  const initialState = {
    day: "Monday", 
    days: [], 
    appointments: {},
    interviewers: {}
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      dispatch({
         type: "SET_APPLICATION_DATA", 
         value: { days: days.data, appointments: appointments.data }
        });
      dispatch({
        type: "SET_INTERVIEWERS",
        value: { interviewers: interviewers.data }
      });
      console.log(state)
    });
  }, []);

  const setDay = (day) => dispatch({ type: "SET_DAY", value: day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(res => {
      dispatch({
        type: "SET_APPLICATION_DATA",
        value: { appointments: appointments }
      });
      dispatch({
        type: "SET_SPOTS",
        value: {id, update: -1}
      });      
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
      dispatch({
        type: "SET_APPLICATION_DATA",
        value: { appointments: appointments }
      });
      dispatch({
        type: "SET_SPOTS",
        value: { id , update: 1}
      })
      
    })
  }

  return { state, setDay, bookInterview, cancelInterview };

}