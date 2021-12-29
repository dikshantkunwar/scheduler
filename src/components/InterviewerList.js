import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import 'components/InterviewerList.scss'

export default function InterviewerList(props) {

  const interviewerList = props.interviewers.map( (item) => {
    return <InterviewerListItem
      key={item.id}
      name = {item.name}
      avatar = {item.avatar}
      selected = {props.value === item.id}
      setInterviewer = {event => props.onChange(item.id)}
      />
  })

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewerList}
      </ul>
    </section>
  )
}