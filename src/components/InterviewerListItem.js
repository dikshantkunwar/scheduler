import React from "react";
import 'components/InterviewerListItem.scss'

export default function InterviewerListItem(props) {

  return (
    <>
    <li className="interviewers__item">
      <img
        className="interviewers__item-image"
        id = {props.id}
        src = {props.avatar}
        alt = {props.name}
      />
      {props.name}
    </li>
    </>
  )
}