import React, { Component } from 'react';
// react-bootstrap imports
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Label from 'react-bootstrap/lib/Label';
import Row from 'react-bootstrap/lib/Row';
import Scroll from 'react-scroll';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';
// css imports
import './css/SelectActivity.css';

var Element = Scroll.Element;
var scroller = Scroll.scroller;

function getActivities (exhibitName, exhibitsAndActivities) {
  var exhibit = exhibitsAndActivities.filter(
      function(exhibitsAndActivities){
        return exhibitsAndActivities.name === exhibitName;
      }
  );
  return exhibit[0].activities;
}

class SelectActivity extends Component{
  constructor(props) {
    super(props);
    this.state = {
      exhibit: "not set",
      activity: "not set"
    }

    var scroll = Scroll.animateScroll;
    scroll.scrollToTop();
    this.nextPage= this.nextPage.bind(this);
    this.setExhibitState= this.setExhibitState.bind(this);
    this.setActivityState= this.setActivityState.bind(this);
  }

  nextPage () {
    if(validateSelection()){
      this.props.changeActivity(this.state.exhibit, this.state.activity);
      this.props.changePage('Activity');
    }
  }

  setExhibitState (e) {
    // e.currentTarget.style.backgroundColor = '#eef7ea'; /* 10% lighten of the top of the alert */
    // e.currentTarget.style.border = '#a9a9a9 3px solid';
    scroller.scrollTo('step2', {
      duration: 1000,
      delay: 0,
      smooth: true,
    })
    this.props.ReactGA.event({
      category: 'SelectExhibit',
      action: e.currentTarget.name
    });
    this.setState({exhibit:e.currentTarget.name})

    var tableData = {
      user_id: this.props.userID,
      category: 'Select Exhibit',
      action: e.currentTarget.name
    };
    this.props.addtoFirebase('event', tableData);
  }

  setActivityState (e) {
    // e.currentTarget.style.backgroundColor = '#f8eeee';/* 5% lighten of the alert color */
    // e.currentTarget.style.border = '#a9a9a9 3px solid';
    scroller.scrollTo('step3', {
      duration: 1000,
      delay: 0,
      smooth: true,
    })
    this.props.ReactGA.event({
      category: 'SelectActivity',
      action: e.currentTarget.name
    });
    this.setState({activity:e.currentTarget.name})

    var tableData = {
      user_id: this.props.userID,
      category: 'Select Activity',
      action: e.currentTarget.name,
      pageCount: this.props.pageCount
    };
    this.props.addtoFirebase('event', tableData);
  }

  render(){
    return(
      <div>
        <Exhibit elements={this.props.exhibitsAndActivities} onSelection={this.setExhibitState} currentlySelected={this.state.exhibit}/>
        { this.state.exhibit !== "not set" ? <Activity elements={getActivities(this.state.exhibit, this.props.exhibitsAndActivities)} onSelection={this.setActivityState} currentlySelected={this.state.activity}/> : null }
        <Element name="step2"></Element>
        { this.state.activity !== "not set" ? <Enter onClick={this.nextPage}/> : null}
        <Element name="step3"></Element>
      </div>
    );
  }
}


class Exhibit extends Component{
  render(){
    return(
      <div>
        <div>
          <h2 className="explore-heading-no-top-margin">
            <Label id="step1" className="pull-left explore-green-label">1</Label>
          </h2>
          <h3 className="explore-heading-no-top-margin">Choose Your Exhibit</h3>
        </div>

        <Grid>
          <Squares exhibitOrActivity="exhibit" currentlySelected={this.props.currentlySelected} elements={this.props.elements} onSelection={this.props.onSelection} color="success"/>
          <hr className="explore-small-hr"/>
        </Grid>
      </div>
    );
  }
}

class Activity extends Component{
  render(){
    return(
      <div>
        <div>
          <h2 className="explore-heading-no-top-margin">
            <Label id="step2" className="pull-left explore-red-label">2</Label>
          </h2>
          <h3 className="explore-heading-no-top-margin">Choose Your Activity</h3>
        </div>

        <Grid>
          <Squares exhibitOrActivity="activity" currentlySelected={this.props.currentlySelected} elements={this.props.elements} onSelection={this.props.onSelection} color="danger"/>
          <hr className="explore-small-hr"/>
        </Grid>
      </div>
    );
  }
}

class Enter extends Component{
  render(){
    return(
      <div>
        <div>
          <h2 className="explore-heading-no-top-margin">
            <Label bsStyle="info" id="step3" className="pull-left explore-light-blue-label">3</Label>
          </h2>
          <h3 className="explore-heading-no-top-margin">Ready?</h3>
        </div>
        <Grid>
          <Row>
            <Col xs={2}></Col>
            <Col xs={8}>
              <Button bsStyle="info" className="explore-light-blue-button" bsSize="large" block onClick={this.props.onClick}>Lets Go!</Button>
            </Col>
            <Col xs={2}></Col>
          </Row>
          <hr className="explore-small-hr"/>
        </Grid>
      </div>
    );
  }
}

class Squares extends Component {
  constructor(props) {
    super(props);
    this.passSelection= this.passSelection.bind(this);
  }

  passSelection (e) {
    this.props.onSelection(e);
  }

  render() {
    var me = this;
    var alertClasses = "explore-flexbox-container "
    if(this.props.exhibitOrActivity === 'exhibit'){
      alertClasses += "exhibit-step1-container";
    }else{
      alertClasses += "exhibit-step2-container";
    }
    var exhibits = this.props.elements.map(function(element) {
      var classes = "explore-square-thumbnail ";
      if (me.props.exhibitOrActivity === 'exhibit' && element.name === me.props.currentlySelected) {
        classes += 'explore-selected-step1';
      } else if (me.props.exhibitOrActivity === 'activity' && element.name === me.props.currentlySelected) {
        classes += 'explore-selected-step2';
      }

      return (
        <Thumbnail className={classes} href="#" onClick={me.passSelection} key={element.name} name={element.name} >
          <h4>{element.name}</h4>
            {/*<p>{element.description}</p> */}
        </Thumbnail>
      );
    });
    return (
      <Alert bsStyle={this.props.color} className={alertClasses}>{exhibits} </Alert>
    );
  }
}
function validateSelection(){
 return true;
}

export default SelectActivity;
