import { useReducer, useEffect } from "react";
import axios from 'axios'

function reducer(state, action) {
  switch(action.type){
    case "SET_DAY": 
      return {
        ...state, 
        day: action.value.day
      };
    case "SET_APPLICATION_DATA":
      return {
        ...state,
        days: action.value.days,
        appointments: action.value.appointments,
        interviewers: action.value.interviewers
      }
    case "SET_INTERVIEW":
      const appointment = {
        ...state.appointments[action.value.id],
        interview : {...action.value.interview}
      }
      const appointments = {
        ...state.appointments,
        [action.value.id]: appointment
      };

      const days = [...state.days];
      return {
        ...state,
        appointments,
        days
      }
  }
  if (action.type === "setDay") {

  }
}

export default function useApplicationData() {

  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {}
  // });
  const initialState = {day: "Monday", days: [], appointments: {}}
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      // setState(prev => ({...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data}));
      dispatch({
         type: "SET_APPLICATION_DATA", 
         value: {days: days.data, appointments: appointments.data, interviewers: interviewers.data}
        });
    });
  }, []);

  // const setDay = day => setState(prev => ({ ...prev, day }));
  const setDay = day => dispatch({ type: "SET_DAY", value: day });

  function bookInterview(id, interview) {
    // Change local state of interview when an interview is booked
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: { ...interview }
    // };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };
    
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(res => {
      updateSpots("create");
      const days = [...state.days]  //update days state to change the spots 
      // setState({ ...state, appointments, days }); 
      dispatch({
        type: "SET_INTERVIEW",
        value: {id: id, interview: interview}
      });
    });
  }

  function cancelInterview(id) {
    return axios.delete(`api/appointments/${id}`, { interview: null })
    .then(res => {
      updateSpots("delete");
      // const days = [...state.days]
      // setState({ ...state, appointments, days });
      dispatch({
        type: "SET_INTERVIEW",
        value: {id: id, interview: null}
      });
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