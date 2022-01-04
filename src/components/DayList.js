import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {

  const dayList = props.days.map( day => {
    return (
      <DayListItem 
        key={day.id}
        name={day.name} 
        spots={day.spots} 
        full={day.spots === 0}
        selected={day.name === props.day} 
        setDay={props.setDay} 
      />
      );
  })

  return (
    <ul>
      {dayList}
    </ul>
  )
}