import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

class Header extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">Shooooort</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
            </Navbar.Collapse>
          </Navbar>
        </header>
      </div>
    );
  }
}

export default Header;
