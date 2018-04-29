import React, { Component } from "react";
import { connect } from "react-redux";
import moment from 'moment';
import { Grid, Row, Col, Button } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PushComponent from "./components/pushComponent";
import CurrentlyShortenedComponent from "./components/currentShortenUrl/CurrentlyShortenedComponent";
import ShortenLinksHistoryComponent from "./components/shorten-history/ShortenLinksHistoryComponent";
import Input from "./components/form/Input/Input";
import {
  getShortUrl,
  redirectToUrl,
  getShortenUrlsHistoryList,
  deleteLink
} from "./actions/data-actions";


class App extends Component {
  //form data
  state = {
    impraiseForm: {
      url: {
        label: "url:",
        elementType: "input",
        elementConfig: {
          type: "url",
          placeholder: "Enter url"
        },
        value: "",
        validation: {
          required: true,
          isUrl: true
        },
        valid: false,
        touched: false
      }
    },
    isFormValid: false,
    shortLinks: null,
    currentlyShorten: null,
    shortenLinksHistoryList: []
    
  };

  componentDidMount() {
    this.getShortenLinksHistoryList();
  }

   //validation function - checking for the rules we defined on the quandl form data state object

  checkValidation(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isAlphanumeric) {
      const pattern = /^([a-zA-Z0-9 _-]+)$/;
      isValid = pattern.test(value) && isValid;
    }

    if(rules.isUrl){
      const pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }

  //function that trigger on input onChange event
  inputChangedHandler = (event, inputId) => {
    //copy of the original quandl form

    const impraiseFormCopy = {
      ...this.state.impraiseForm
    };
    const newImpraiseFormElement = {
      ...impraiseFormCopy[inputId]
    };

   
    newImpraiseFormElement.value = event.target.value;
    
    newImpraiseFormElement.valid = this.checkValidation(
      newImpraiseFormElement.value,
      newImpraiseFormElement.validation
    );
    newImpraiseFormElement.touched = true;
    impraiseFormCopy[inputId] = newImpraiseFormElement;

    let isFormValid = true;
    let startDate = this.state.startDate;
    if(inputId === 'startDate' || inputId === 'endDate') this.onDataChangeHandler('date', startDate);
    
    for (var key in impraiseFormCopy) {
      isFormValid = impraiseFormCopy[key].valid && isFormValid;
    }

    this.setState({ impraiseForm: impraiseFormCopy, isFormValid: isFormValid });
  };

  //function that trigger on form submit
  formSubmitHandler = (event) => {
    event.preventDefault();
    const userInput = {};
    for (let inputId in this.state.impraiseForm) {
      userInput[inputId] = this.state.impraiseForm[inputId].value;
    }

    const formData = {
      userInput
    };
    //posting the form data to the server
    this.getShortLink(formData);
   
  };

  getShortLink = (formData) => {
    this.props.getShortUrl(formData).then(response => {
       console.log(this.props.currentlyShorten);
       this.setState({ currentlyShorten: this.props.currentlyShorten });
       this.getShortenLinksHistoryList();
    })
  }
  

  getShortenLinksHistoryList = () => {
    this.props.getShortenUrlsHistoryList().then(res => {
      this.setState({ shortenLinksHistoryList: this.props.shortenLinksHistoryList });
    });
  };

  deleteLinkHandler = (shortUrl) => {
    this.props.deleteLink(shortUrl).then(res => {
      this.setState({ shortenLinksHistoryList: this.props.shortenLinksHistoryList });
    });
  };

  redirectToUrlHandler = (url) => {
    this.props.redirectToUrl(url).then(res => {

    })
  }

  showSearchedDataHandler = (searchDate, stockName) => {
    this.props.showClickedSearchItem(searchDate, stockName).then(res => {
      this.setState({ tickerData: this.props.data[0][0] });
    });
  }

  render() {
    //looping on the quandl form state obj and pushing the id and every input type(first name, last name....)
    const contactForm = [];
    for (let key in this.state.impraiseForm) {
      contactForm.push({
        id: key, //key = first name, last name, email.....
        config: this.state.impraiseForm[key]
      });
    }

    let form = (
      <form onSubmit={this.formSubmitHandler}>
        {contactForm.map(input => (
  
          <Input
            key={input.id}
            Label={input.config.label}
            elementType={input.config.elementType} //the element type of the impraiseForm state obj (input)
            elementConfig={input.config.elementConfig}
            value={input.config.value} //the element value of the impraiseForm state obj (input)
            invalid={!input.config.valid} // we set it on checkValidation function
            shouldValidate={input.config.validation}
            touched={input.config.touched} //we set it on inputChangedHandler
            changed={(event) => this.inputChangedHandler(event, input.id)}
          />
        ))}

          <Button
            style={{ marginTop: 20 }}
            bsStyle="success"
            bsSize="large"
            type="submit"
            disabled={!this.state.isFormValid}
            >
            Shorten this link
          </Button>
      </form>
    );

    return (
      <Grid>
        <Row>
          <Col xs={12} sm={12} md={12}>
            <Header />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12}>
            {form}
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12}>
             <CurrentlyShortenedComponent redirectToUrl={this.redirectToUrlHandler} currentlyShorten={this.state.currentlyShorten} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12}>
             <ShortenLinksHistoryComponent redirectToUrl={this.redirectToUrlHandler} deleteLink={this.deleteLinkHandler} shortenLinksHistoryList={this.state.shortenLinksHistoryList} />
          </Col>
        </Row>  
        <Row>
          <Col xs={12} sm={12} md={12}>
            <PushComponent />
            <Footer />
          </Col>
        </Row>
      </Grid>
    );
  }
}

// Make data  array available in  props
function mapStateToProps(state) {
  return {
    data: state.dataReducer.data,
    currentlyShorten: state.dataReducer.currentlyShorten,
    shortenLinksHistoryList: state.dataReducer.shortenLinksHistoryList
  };
}

export default connect(mapStateToProps, {getShortUrl, redirectToUrl, getShortenUrlsHistoryList, deleteLink})(App);
