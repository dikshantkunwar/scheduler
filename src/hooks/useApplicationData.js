import { useReducer, useEffect } from "react";
import axios from 'axios'
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SET_INTERVIEWERS,
  SET_SPOTS
} from "reducers/application";
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
      if (response.type === SET_INTERVIEW) {
        dispatch({
          type: SET_INTERVIEW,
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
         type: SET_APPLICATION_DATA, 
         value: { days: days.data, appointments: appointments.data }
        });
      dispatch({
        type: SET_INTERVIEWERS,
        value: { interviewers: interviewers.data }
      });
    });

    wsocket.close();
  }, []);

  const setDay = (day) => dispatch({ type: SET_DAY , value: day });

  function bookInterview(id, interview, edit = false) {
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
        type: SET_APPLICATION_DATA,
        value: { appointments: appointments }
      });
      if (!edit) {
        dispatch({
          type: SET_SPOTS,
          value: {id, update: -1}
        });  
      }
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
        type: SET_APPLICATION_DATA,
        value: { appointments: appointments }
      });
      dispatch({
        type: SET_SPOTS,
        value: { id , update: 1}
      })
      
    })
  }

  return { state, setDay, bookInterview, cancelInterview };
}