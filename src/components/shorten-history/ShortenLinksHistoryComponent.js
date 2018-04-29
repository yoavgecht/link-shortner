import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import moment from 'moment';


const ShortenLinksHistoryComponent = (props) => {
  if(props.shortenLinksHistoryList && props.shortenLinksHistoryList.length > 0){
    return ( 
      <div className="searches-container">
        <label>Shorten links history:</label>
        <ListGroup>
          {props.shortenLinksHistoryList.map((url, i) => (
            <ListGroupItem url={url.long_url} key={i} className="list-group-class">
              <span className="details-contailner">
                <p class="short-url"><strong onClick={() => props.redirectToUrl(url.short_url)}>{url.short_url}</strong></p>
                <p><i>{url.long_url}</i></p>
                <p><i>Visits {url.hits}</i></p>
                <p><i>Last visited: {url.lastVisited}</i></p>
              </span>
              <span
                className="glyphicon glyphicon-trash  pull-right text-danger trash-class"
                onClick={() => props.deleteLink(url.short_url)}
              />
            </ListGroupItem>
          ))}
        </ListGroup>
      </div> ) 
  } else  {
    return (
      <h4>Previously shortened by you</h4>
    )
  }
}

export default ShortenLinksHistoryComponent;
