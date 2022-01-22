import React from "react"
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
      SAVE = "SAVE",
      SAVING = "SAVING",
      DELETING = "DELETING",
      CONFIRM = "CONFIRM",
      ERROR_SAVE = "ERROR_SAVE",
      ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { time, interview, interviewers, interviewerList } = props
  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
  )

  function save(name, interviewer) {
    const interview = {
      student: name, 
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(error => {
      transition(ERROR_SAVE);
    });
  }

  function deleteInterview() {
    transition(DELETING);
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(error => {
      transition(ERROR_DELETE, true);
    });
  }

  return(
    <article className="appointment">
      <Header id={props.id} time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message="SAVING" />}
      {mode === DELETING && <Status message="DELETING" />}
      {mode === SHOW && (
        <Show
          student = {interviewers.student}
          interviewer = {interviewers.interviewer}
          onDelete = {() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers = {interviewerList}
          onCancel = {back}
          onSave = {save}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message = "Do you want to delete?"
          onConfirm = {deleteInterview}
          onCancel = {back} 
        />
      )}
      {mode === ERROR_SAVE && ( <Error onClose={} message="Could not save appointment."/> )}
      {mode === ERROR_DELETE && (<Error onClose={} message="Could not delete appointment." /> )}
    </article>
  )
}