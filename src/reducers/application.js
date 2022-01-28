const 
  SET_DAY = "SET_DAY",
  SET_APPLICATION_DATA = "SET_APPLICATION_DATA",
  SET_INTERVIEW = "SET_INTERVIEW",
  SET_INTERVIEWERS = "SET_INTERVIEWERS",
  SET_SPOTS = "SET_SPOTS";

export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, SET_INTERVIEWERS, SET_SPOTS}
export default function reducer(state, action) {
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