import React from "react"
import Empty from "./Empty"
import Header from "./Header"
import Show from "./Show"
import useVisualMode from "hooks/useVisualMode"
import "./styles.scss"
import Form from "./Form"
import Status from "./Status"

// Mode constants 
const EMPTY = "EMPTY",
      SHOW = "SHOW",
      CREATE = "CREATE",
      SAVE = "SAVE",
      SAVING = "SAVING";

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
    .catch(error => console.log(error));
  }

  console.log('SHOW: ', interview, interviewers);

  return(
    <article className="appointment">
      <Header id={props.id} time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message="SAVING" />}
      {mode === SHOW && (
        <Show
          student = {interviewers.student}
          interviewer = {interviewers.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers = {interviewerList}
          onCancel = {back}
          onSave = {save}
        />
      )}
    </article>
  )
}