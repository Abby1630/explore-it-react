import React, { Component } from 'react';
import Scroll from 'react-scroll';
import ReactGA from 'react-ga';
import TimeMe from 'timeme.js'
import './css/App.css';
import './css/common.css';
import NavBar from './NavBar';
import RewardCountdown from './RewardCountdown';
import Instructions from './Instructions';
import SelectActivity from './SelectActivity';
import Quiz from './Quiz';
import CustomizeRobot from './CustomizeRobot';
import Activity from './Activity';
import MyProfile from './MyProfile';
import Welcome from './Welcome';
import ViewRobot from './ViewRobot';

var scroll = Scroll.animateScroll;
var numOfActivitiesBeforeQuiz = 1;
var numOfActivitiesBeforeReward = 1;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exhibitsAndActivities: [],
      activitiesInDetail: [],
      robotArmsImages: [],
      robotBodyImages: [],
      robotHeadImages: [],
      robotLegsImages: [],
      questions: [],
      disclaimer: "",
      renderedPage: 'Welcome',
      quizDifficulty: 'medium',
      countUntilNextQuiz: numOfActivitiesBeforeQuiz,
      countUntilNextReward: numOfActivitiesBeforeReward,
      priorActivitiesForQuiz:[],
      selectedExhibit: "none",
      selectedActivity: "none",
      robotHead: "#",
      robotBody: "#",
      robotArms: "#",
      robotLegs: "#"
      /* On load load in all the questions, activities, and exhibits so you
        don't have to rerender since you have to use setState */
    };
    this.changePage = this.changePage.bind(this)
    this.changeActivity = this.changeActivity.bind(this)
    this.changeRobot = this.changeRobot.bind(this)
    this.changeQuizDifficulty = this.changeQuizDifficulty.bind(this)
    ReactGA.initialize('UA-96822574-1'); //Unique Google Analytics tracking number
  }

  changePage(pageName){
    //console.log(pageName);
    TimeMe.stopTimer();
    var timeInSeconds = TimeMe.getTimeOnPageInSeconds(this.state.renderedPage);
    var timeInMS = Math.round(timeInSeconds * 1000); // in milliseconds
    TimeMe.resetAllRecordedPageTimes();
    ReactGA.set({ UserTimeOnPage: timeInMS });
    ReactGA.set({ 'UserTimeOnPage': timeInMS });
    ReactGA.timing({
      category: 'Time On Page',
      variable: this.state.renderedPage,
      value: timeInMS, // in milliseconds
      label: this.state.selectedActivity
    });

    ReactGA.ga('send', 'timing', {
      'timingCategory': 'TimeOnPage',
      'timingVar': this.state.renderedPage,
      'timingValue': timeInMS,
      'timingLabel': this.state.selectedActivity
    });

    scroll.scrollToTop();
    var statesToSet = {renderedPage: pageName};
    if (this.state.renderedPage=== 'CustomizeRobot'){
      statesToSet = {
        renderedPage: pageName,
        countUntilNextReward: numOfActivitiesBeforeReward,
        priorActivitiesForQuiz:[]
      }
    }
    if (this.state.renderedPage === 'Quiz'){
      statesToSet = {
        renderedPage: pageName,
        countUntilNextQuiz: numOfActivitiesBeforeQuiz,
        priorActivitiesForQuiz:[]
      }
    }
    this.setState(statesToSet);
  }

  changeActivity(exhibit, activity){
    var activityArray = this.state.priorActivitiesForQuiz;

    activityArray.push(activity);
    this.setState({
      selectedExhibit: exhibit,
      selectedActivity: activity,
      priorActivitiesForQuiz: activityArray,
      countUntilNextQuiz: this.state.countUntilNextQuiz - 1,
      countUntilNextReward: this.state.countUntilNextReward - 1
    });
  }

  changeQuizDifficulty(changeTo){
    this.setState({
      quizDifficulty: changeTo
    });
  }

  changeRobot(bodyPart, selected){
    switch(bodyPart) {
      case "head":
        this.setState({robotHead:selected});
        break;
      case "body":
        this.setState({robotBody:selected});
        break;
      case "arms":
        this.setState({robotArms:selected});
        break;
      case "legs":
        this.setState({robotLegs:selected});
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    var me = this;
    fetch(process.env.PUBLIC_URL +'/content/exhibitsAndActivities.json').then(function (rawResponse) {
      return rawResponse.json();
    }).then(function (responseData) {
      me.setState({
        exhibitsAndActivities: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/activitiesInDetail.json').then(function (rawResponse) {
      return rawResponse.json();
    }).then(function (responseData) {
      me.setState({
        activitiesInDetail: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/questions.json').then(function (rawResponse) {
      return rawResponse.json();
    }).then(function (responseData) {
      me.setState({
        questions: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/disclaimer.json').then(function (rawResponse) {
      return rawResponse.json();

    }).then(function (responseData) {
      me.setState({
        disclaimer: responseData.disclaimer
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/robotArmsImages.json').then(function (rawResponse) {
      return rawResponse.json();

    }).then(function (responseData) {
      me.setState({
        robotArmsImages: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/robotBodyImages.json').then(function (rawResponse) {
      return rawResponse.json();

    }).then(function (responseData) {
      me.setState({
        robotBodyImages: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/robotHeadImages.json').then(function (rawResponse) {
      return rawResponse.json();

    }).then(function (responseData) {
      me.setState({
        robotHeadImages: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/robotLegsImages.json').then(function (rawResponse) {
      return rawResponse.json();

    }).then(function (responseData) {
      me.setState({
        robotLegsImages: responseData
      });
    })
  }

  render() {
    var robotArray = [this.state.robotHead, this.state.robotBody, this.state.robotArms, this.state.robotLegs];

    return (
      <div className="App">
        <NavBar changePage={this.changePage} currentPage={this.state.renderedPage} showRobot={this.props.showRobot} robotImage={robotArray[0]+robotArray[1]+robotArray[2]+robotArray[3]}/>
        {getTitle (this.state.renderedPage, this.state.selectedActivity)}
        <div className="App-Body">
          {getPage (this.state, this.props.showRobot, this.changePage, this.changeActivity, this.changeRobot, this.changeQuizDifficulty, ReactGA)}
          <hr className="explore-small-hr"/>
        </div>
      </div>
    );
  }
}

function getTitle (currentPage, activity) {
  if (currentPage === 'SelectActivity') {
    return (<h1 id="explore-page-title">Select an Activity</h1>);
  } else if (currentPage === 'Quiz'){
    return (<h1 id="explore-page-title">Quiz</h1>);
  } else if (currentPage === 'CustomizeRobot') {
    return (<h1 id="explore-page-title">Congratulations!</h1>);
  } else if (currentPage === 'Intro') {
    return (<h1 id="explore-page-title">Welcome</h1>);
  } else if (currentPage === 'MyProfile') {
    return (<h1 id="explore-page-title">My Profile</h1>);
  } else if (currentPage === 'ViewRobot') {
    return (<h1 id="explore-page-title">Check Out Your Robot</h1>);
  } else if (currentPage === 'Activity') {
    return (<h1 id="explore-page-title">{activity}</h1>);
  } else {
    return null;
  }
}


function getPage (state, showRobot, changePageFunction, changeActivityFunction, changeRobotFunction, changeQuizDifficultyFunction, ReactGA) {
// this.state.selectedActivity
  var renderPage = state.renderedPage;
  var countUntilNextQuiz = state.countUntilNextQuiz;
  var countUntilNextReward = state.countUntilNextReward;
  var selectedExhibit = state.selectedExhibit;
  var selectedActivity = state.selectedActivity;
  var robotArray = [state.robotHead, state.robotBody, state.robotArms, state.robotLegs];
  var exhibitsAndActivities = state.exhibitsAndActivities;
  var activitiesInDetail = state.activitiesInDetail;
  var questions = state.questions;
  var quizDifficulty = state.quizDifficulty;
  var disclaimer = state.disclaimer;
  var priorActivitiesForQuiz = state.priorActivitiesForQuiz;
  var robotArmsImages = state.robotArmsImages;
  var robotBodyImages = state.robotBodyImages;
  var robotHeadImages = state.robotHeadImages;
  var robotLegsImages = state.robotLegsImages;

  TimeMe.initialize({});
  TimeMe.setCurrentPageName(renderPage);
  TimeMe.startTimer();
  if (renderPage === "Activity"){
    ReactGA.pageview(selectedActivity + " " + renderPage);
  }else{
    ReactGA.pageview(renderPage);
  }


  if (renderPage === 'SelectActivity') {
    return (
      <div>
        {<RewardCountdown countUntilNextReward={countUntilNextReward}/> }
        <Instructions page={renderPage}/>
        <SelectActivity ReactGA={ReactGA} changePage={changePageFunction} changeActivity={changeActivityFunction} exhibitsAndActivities={exhibitsAndActivities}/>
      </div>
    );
  } else if (renderPage === 'Quiz') {
    return (
      <div>
        <Instructions page={renderPage}/>
        <Quiz ReactGA={ReactGA} changePage={changePageFunction} changeQuizDifficulty={changeQuizDifficultyFunction} quizDifficulty={quizDifficulty} exhibit={selectedExhibit} activity={priorActivitiesForQuiz} showRobot={showRobot} questions={questions}/>
      </div>
    );
  } else if (renderPage === 'CustomizeRobot') {
    return (
      <div>
        <Instructions page={renderPage}/>
        <CustomizeRobot ReactGA={ReactGA} changePage={changePageFunction} changeRobot={changeRobotFunction} head={robotArray[0]} body={robotArray[1]} arms={robotArray[2]} legs={robotArray[3]} robotArmsImages={robotArmsImages} robotBodyImages={robotBodyImages} robotHeadImages={robotHeadImages} robotLegsImages={robotLegsImages}/>
      </div>
    );
  } else if (renderPage === 'ViewRobot') {
    return (
      <div>
        <ViewRobot ReactGA={ReactGA} changePage={changePageFunction} head={robotArray[0]} body={robotArray[1]} arms={robotArray[2]} legs={robotArray[3]} />
      </div>
    );
  } else if (renderPage === 'Activity') {
    return (
      <div>
        <Activity ReactGA={ReactGA} changePage={changePageFunction} exhibit={selectedExhibit} activity={selectedActivity} activitiesInDetail={activitiesInDetail} countUntilNextQuiz={countUntilNextQuiz}/>
      </div>
    );
  } else if (renderPage === 'MyProfile' || renderPage === 'Intro') {
    return (
      <div>
        <MyProfile ReactGA={ReactGA} changePage={changePageFunction} page={renderPage} disclaimer={disclaimer}/>
      </div>
    );
  } else if (renderPage === 'Welcome' ) {
    return (
      <div>
        <Welcome ReactGA={ReactGA} changePage={changePageFunction} page={renderPage}/>
      </div>
    );
  }

}

export default App;
