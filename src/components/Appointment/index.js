import React from "react"
import Empty from "./Empty"
import Header from "./Header"
import Show from "./Show"
import useVisualMode from "hooks/useVisualMode"
import "./styles.scss"
import Form from "./Form"

// Mode constants 
const EMPTY = "EMPTY",
      SHOW = "SHOW",
      CREATE = "CREATE";

export default function Appointment(props) {
  const { time, interview } = props
  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
  )
  const interviewers = [];
  return(
    <article className="appointment">
      <Header id={props.id} time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student = {interview.student}
          interviewer = {interview.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers = {interviewers}
          onCancel = {() => back()}
        />
      )}
    </article>
  )
}