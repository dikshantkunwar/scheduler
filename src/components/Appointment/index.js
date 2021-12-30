import React from "react"
import Empty from "./Empty"
import Header from "./Header"
import Show from "./Show"
import "./styles.scss"

export default function Appointment(props) {
  const {time, interview} = props
  return(
    <article className="appointment">
      <Header id={props.id} time={time} />
      {props.interview ? <Show student={interview.student} interviewer={interview.interviewer}/> : <Empty />}
    </article>
  )
}