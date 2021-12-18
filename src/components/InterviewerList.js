import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import 'components/InterviewerList.scss'

export default function InterviewerList() {

  const interviewer = {
    id: 1,
    name: "Sylvia Palmer",
    avatar: "https://i.imgur.com/LpaY82x.png"
  };

  return (
    <>
      <section className="interviewers">
        <h4 className="interviewers__header text--light">Interviewer</h4>
        <ul className="interviewers__list">
        <InterviewerListItem 
          id = {interviewer.id}
          name = {interviewer.name}
          avatar = {interviewer.avatar}
          // selected = {}
          // setInterviewer = {}
        />
        </ul>
      </section>

    {/* <InterviewerListItem 
      id = {interviewer.id}
      name = {interviewer.name}
      avatar = {interviewer.avatar}
      // selected = {}
      // setInterviewer = {}
    /> */}
      </>
  )
}