export function getAppointmentsForDay(state, day) {
  // returns an array of appointments for that day
  if (state.days.length === 0 || state.days === undefined) {
    return [];
  }

  const days = state.days.filter( (item) => {
    if (item.name === day) {
      return true;
    } else return false;
  });

  // return empty array when day not found
  if (days.length === 0) {
    return [];
  }

  if (days[0].appointments.length === 0 || days[0].appointments === undefined){
    return [];
  }

  const appointments = days[0].appointments;
  let appointmentArr = [];
  appointments.forEach( (appt) => {
    if (state.appointments.hasOwnProperty(`${appt}`)) {
      appointmentArr.push(state.appointments[`${appt}`]);
    }
  });

  return appointmentArr;
}

export function getInterview(state, interview) {
  if (interview === null) {
    return null
  }
  let interviewObj = { ...interview }
  for (let key in state.interviewers) {
    if (key === interview.interviewer.toString()) {
      interviewObj['interviewer'] = state.interviewers[key]
    }
  }
  return interviewObj;
}

export function getInterviewersForDay (state, day) {
  const interviewerIdx = state.days.filter(d => d.name === day);
  let interviewerArr = [];
  if (interviewerIdx.length === 0) {
    return [];
  } else {
    for (let id of interviewerIdx[0].appointments) {
      interviewerArr.push(state.appointments[id])
    }
  }
  return interviewerArr;
}