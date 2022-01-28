import React, { useEffect } from "react"
import Empty from "./Empty"
import Header from "./Header"
import Show from "./Show"
import useVisualMode from "hooks/useVisualMode"
import "./styles.scss"
import Form from "./Form"
import Status from "./Status"
import Confirm from "./Confirm"
import Error from "./Error"

// Mode constants 
const EMPTY = "EMPTY",
      SHOW = "SHOW",
      CREATE = "CREATE",
      SAVING = "SAVING",
      EDIT = "EDIT",
      DELETING = "DELETING",
      CONFIRM = "CONFIRM",
      ERROR_SAVE = "ERROR_SAVE",
      ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { time, interview, interviewers, interviewerList } = props
  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
  )

  function save(name, interviewer, edit) {
    const interview = {
      student: name, 
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview, edit)
    .then(() => transition(SHOW))
    .catch(error => {
      console.log('error save', error);
      transition(ERROR_SAVE, true);
    });
  }

  function deleteInterview() {
    transition(DELETING);
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(error => {
      console.log('error delete', error);
      transition(ERROR_DELETE, true);
    });
  }

  useEffect(() =>{
    if (interview && mode === EMPTY) { transition(SHOW) }
    if (interview === null && mode === SHOW ) { transition(EMPTY) }
  }, [interview, transition, mode])

  return(
    <article className="appointment" data-testid="appointment">
      <Header id={props.id} time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message="SAVING" />}
      {mode === DELETING && <Status message="DELETING" />}
      {mode === SHOW && interview && (
        <Show
          student = {interviewers.student}
          interviewer = {interviewers.interviewer}
          onDelete = {() => transition(CONFIRM)}
          onEdit = {() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers = {interviewerList}
          onCancel = {back}
          onSave = {save}
        />
      )}
      {mode === EDIT && (
        <Form 
          interviewer = {interview.interviewer}
          name = {interview.student}
          interviewers = {interviewerList}
          onCancel = {back}
          onSave = {save}
          editMode = {true}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message = "Do you want to delete?"
          onConfirm = {deleteInterview}
          onCancel = {back} 
        />
      )}
      {mode === ERROR_SAVE && ( <Error message="Could not save appointment."/> )}
      {mode === ERROR_DELETE && (<Error message="Could not delete appointment." /> )}
    </article>
  )
}