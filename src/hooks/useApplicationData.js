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
    case "SET_INTERVIEW": {
      const appointments = { ...state.appointments };
      // update the appointments data according to its id
      appointments[action.value.id] = {
        ...appointments[action.value.id],
        interview: action.value.interview
      }
      // check spots through interviews
      let spotsRemaining = 5; // total spots in a day
      const days = [...state.days];

      // check and update for each day
      days.forEach( d => {
        const appts = d.appointments.map( (id) => appointments[id]);
        console.log('appts: ', appts)

        appts.forEach( a => {
          if (a.interview === null) {
            spotsRemaining++;
          } else {
            spotsRemaining--;
          }
        });

        d.spots = spotsRemaining;
        spotsRemaining = 5; // reset for a new day
      });

      return {
        ...state,
        appointments,
        days
      }
      
    }
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
    let wsocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    wsocket.onopen = (event) => {
      wsocket.send("ping");
    }

    wsocket.onmessage =  (event) => {
      const response = event.data;
      if (response.type === "SET_INTERVIEW") {
        dispatch({
          type: "SET_INTERVIEW",
          value: {
            id: response.id,
            interview: response.interview
          }
        });
      }
    }

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
    });

    wsocket.close();
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