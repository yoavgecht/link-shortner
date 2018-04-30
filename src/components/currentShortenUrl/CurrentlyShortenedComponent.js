import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

const CurrentlyShortenedComponent = (props) => {
  if(props.currentlyShorten){
    return ( 
      <div className="searches-container">
        <label>Your Short link</label>
        <ListGroup>
            <ListGroupItem url={props.currentlyShorten}  className="list-group-class">
              <span className="details-contailner">
                <strong onClick={() => props.redirectToUrl(props.currentlyShorten)}>{props.currentlyShorten}</strong>
                <a href="https://impraise-shooooort.herokuapp.com//api/redirect/{props.currentlyShorten.split('/').pop()}">{props.currentlyShorten}</a>
              </span>
            </ListGroupItem>
          
        </ListGroup>
      </div> ) 
  } else  {
    return (
      null
    )
  }
}

export default CurrentlyShortenedComponent;
