import React from "react";
import "components/DayListItem.scss"
const classNames = require('classnames');



export default function DayListItem(props) {
  const formatSpots = (spots) => {
    if (spots === undefined) {
      return ''
    }
    else if (spots === 0) {
      return 'no spots remaining'
    }
    else if (spots === 1) {
      return '1 spot remaining'
    }
    else {
      return `${spots} spots remaining`
    }
  } 

  const dayListClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.full
  });

  return (
    <li 
      className = {dayListClass} 
      onClick={() => props.setDay(props.name) }
      data-testid='day'
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  )
}



