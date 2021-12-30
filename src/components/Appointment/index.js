import React from "react"
import Empty from "./Empty"
import Header from "./Header"
import Show from "./Show"

import "./styles.scss"
// import Header from './Header'
export default function Appointment(props) {

  return(
    <article className="appointment">
      <Header time={props.time}/>
      {props.interview ? <Show /> : <Empty />}
    </article>
  )
}