import React from "react";
import "components/DayListItem.scss"
const classNames = require('classnames');

const formatSpots = (spots) => {
  if (spots === undefined){
    return '';
  }
  return spots.toString().trim()
} 

export default function DayListItem(props) {

  const dayListClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.full
  });

  return (
    <li className = {dayListClass} onClick={() => props.setDay(props.name) }>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)} spots remaining</h3>
    </li>
  )
}



