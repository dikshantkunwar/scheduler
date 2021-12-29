import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";
//onChange = {action("setInterviewer")}
export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || "");

  function reset() {
    setName("")
    setInterviewer(null)
  }

  function cancel() {
    reset()
    props.onCancel()
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            /*
              This must be a controlled component
            */
          />
        </form>
        <InterviewerList interviewers={props.interviewers} value={props.interviewer} onChange={props.setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm>Save</Button>
        </section>
      </section>
    </main>
  )
}