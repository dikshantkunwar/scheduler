export function getAppointmentsForDay(state, day) {
  // returns an array of appointments for that day
  if (state.days.length === 0 || state.days === undefined) {
    return [];
  }

  const days = state.days.filter( (item) => {
    if (item.name === day) {
      return true;
    } 
  });

  // return empty array when day not found
  if (days.length === 0) {
    return [];
  }

  if (days[0].appointments.length === 0 || days[0].appointments === undefined){
    return [];
  }

  const appointments = days[0].appointments;
  let results = [];
  
  appointments.forEach( (appointment) => {
    for (let appointmentVal in state.appointments) {
      if (appointment.toString() === appointmentVal) {
        results.push(state.appointments[appointmentVal]);
      }
    }
  });

  if (results.length > 0) {
    return results;
  }

}