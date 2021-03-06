import React, { Component } from 'react';
import Scroll from 'react-scroll'; // react-scroll import
import ReactGA from 'react-ga'; //google-analytics import
import TimeMe from 'timeme.js' // timeme import
import Rebase from 're-base'; // rebase import
// explore-it imports
import Activity from './Activity';
import CustomizeRobot from './CustomizeRobot';
import Instructions from './Instructions';
import MyProfile from './MyProfile';
import NavBar from './NavBar';
import Fade from 'react-bootstrap/lib/Fade';
import Quiz from './Quiz';
import RewardCountdown from './RewardCountdown';
import SelectActivity from './SelectActivity';
import ViewRobot from './ViewRobot';
import Welcome from './Welcome';
// css imports
import './css/App.css';

var scroll = Scroll.animateScroll;
var numOfActivitiesBeforeQuiz = 1;
var numOfActivitiesBeforeReward = 4;

var base = Rebase.createClass({
      apiKey: "AIzaSyBvNUuL3R89gOQIvilSJzjP-3dhOo3vxq0",
      authDomain: "glazer-exploreit.firebaseapp.com",
      databaseURL: "https://glazer-exploreit.firebaseio.com",
      storageBucket: "glazer-exploreit.appspot.com",
      messagingSenderId: "511948691806"
}, 'myApp');

class App extends Component {
  constructor(props) {
    super(props);

    var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });

    this.state = {
      //Content States
      /* On load load in all the questions, activities, and exhibits so you
        don't have to rerender since you have to use setState and cause the page to flash*/
      exhibitsAndActivities: [],
      activitiesInDetail: [],
      robotArmsImages: [],
      robotBodyImages: [],
      robotHeadImages: [],
      robotLegsImages: [],
      robotBowTieImages: [],
      questions: [],
      disclaimer: "",
      //Application States
      renderedPage: 'Welcome',
      quizDifficulty: 'medium',
      quizQuestionsCorrectInARow: 0,
      quizQuestionsWrongInARow: 0,
      countUntilNextQuiz: numOfActivitiesBeforeQuiz,
      countUntilNextReward: numOfActivitiesBeforeReward,
      priorActivitiesForQuiz:[],
      selectedExhibit: "none",
      selectedActivity: "none",
      robotBowTie: "#",
      robotHead: "#",
      robotBody: "#",
      robotArms: "#",
      robotLegs: "#",
      pageCount: 1,
      //User Information
      userID: uid

    };
    this.changePage = this.changePage.bind(this)
    this.changeActivity = this.changeActivity.bind(this)
    this.changeRobot = this.changeRobot.bind(this)
    this.changeQuizValues = this.changeQuizValues.bind(this)
    this.addtoFirebase = this.addtoFirebase.bind(this)
    this.loadResources = this.loadResources.bind(this)
    ReactGA.initialize('UA-96822574-1'); //Unique Google Analytics tracking number

    ReactGA.set({ userId: uid });
  }


  addtoFirebase(tableName, tableData){
    var immediatelyAvailableReference = base.push(tableName, {
      data: tableData
    }).then(newLocation => {
      var generatedKey = newLocation.key;
    }).catch(err => {
      //handle error
      console.log(err);
    });
    //available immediately, you don't have to wait for the Promise to resolve
    var generatedKey = immediatelyAvailableReference.key;

    if (tableData.pageCount) {
      this.setState({pageCount: this.state.pageCount + 1});
    }
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

    var tableData = {
      user_id: this.state.userID,
      seconds_on_page: timeInSeconds,
      page: this.state.renderedPage,
      activity: this.state.selectedActivity,
      pageCount: this.state.pageCount
    };
    this.addtoFirebase('UserTimeOnPage', tableData);

    scroll.scrollToTop();
    var statesToSet = {
      renderedPage: pageName
    };

    if (this.state.renderedPage === 'Welcome') {
      this.loadResources();
    }

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
      countUntilNextReward: this.state.countUntilNextReward - 1,
    });
  }

  changeQuizValues(changeTo, quizQuestionsCorrectInARow, quizQuestionsWrongInARow){
    this.setState({
      quizDifficulty: changeTo,
      quizQuestionsCorrectInARow: quizQuestionsCorrectInARow,
      quizQuestionsWrongInARow: quizQuestionsWrongInARow

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
      case "bow tie":
        this.setState({robotBowTie:selected});
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    var me = this;

    fetch(process.env.PUBLIC_URL +'/content/disclaimer.json')
    .then(function (rawResponse) {
      return rawResponse.json();

    }).then(function (responseData) {
      me.setState({disclaimer: responseData.disclaimer});
    })
  }

  loadResources() {
    var me = this;

    fetch(process.env.PUBLIC_URL +'/content/exhibitsAndActivities.json')
    .then(function (rawResponse) {
      return rawResponse.json();
    }).then(function (responseData) {
      me.setState({
        exhibitsAndActivities: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/activitiesInDetail.json')
    .then(function (rawResponse) {
      return rawResponse.json();
    }).then(function (responseData) {
      me.setState({
        activitiesInDetail: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/questions.json')
    .then(function (rawResponse) {
      return rawResponse.json();
    }).then(function (responseData) {
      me.setState({
        questions: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/robotArmsImages.json')
    .then(function (rawResponse) {
      return rawResponse.json();

    }).then(function (responseData) {
      me.setState({
        robotArmsImages: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/robotBodyImages.json')
    .then(function (rawResponse) {
      return rawResponse.json();
    }).then(function (responseData) {
      me.setState({
        robotBodyImages: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/robotHeadImages.json')
    .then(function (rawResponse) {
      return rawResponse.json();
    }).then(function (responseData) {
      me.setState({
        robotHeadImages: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/robotLegsImages.json')
    .then(function (rawResponse) {
      return rawResponse.json();

    }).then(function (responseData) {
      me.setState({
        robotLegsImages: responseData
      });
    })

    fetch(process.env.PUBLIC_URL +'/content/robotBowTieImages.json')
    .then(function (rawResponse) {
      return rawResponse.json();

    }).then(function (responseData) {
      me.setState({
        robotBowTieImages: responseData
      });
    })

  }

  render() {
    var robotArray = [this.state.robotHead, this.state.robotBody, this.state.robotArms, this.state.robotLegs, this.state.robotBowTie];

    return (
      <div className="App">
        <NavBar
          changePage={this.changePage}
          currentPage={this.state.renderedPage}
          showRobot={this.props.showRobot}
          robotImage={robotArray[0]+robotArray[1]+robotArray[2]+robotArray[3]+robotArray[4]}
        />

        {getTitle (this.state.renderedPage, this.state.selectedActivity)}

        <div className="App-Body">
          {getPage (
            this.state,
            this.props.showRobot,
            this.changePage,
            this.changeActivity,
            this.changeRobot,
            this.changeQuizValues,
            this.addtoFirebase,
            ReactGA
          )}
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
    if (activity === 'none'){
      return (<h1 id="explore-page-title">Let's Get Started</h1>);
    }
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


function getPage (state, showRobot, changePageFunction, changeActivityFunction,
  changeRobotFunction, changeQuizValuesFunction, addtoFirebaseFunction, ReactGA) {
// this.state.selectedActivity
  var renderPage = state.renderedPage;
  var countUntilNextQuiz = state.countUntilNextQuiz;
  var countUntilNextReward = state.countUntilNextReward;
  var selectedExhibit = state.selectedExhibit;
  var selectedActivity = state.selectedActivity;
  var robotArray = [state.robotHead, state.robotBody, state.robotArms, state.robotLegs, state.robotBowTie];
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
  var robotBowTieImages = state.robotBowTieImages;
  var quizQuestionsCorrectInARow = state.quizQuestionsCorrectInARow;
  var quizQuestionsWrongInARow = state.quizQuestionsWrongInARow;
  var userID = state.userID;
  var pageCount = state.pageCount;

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
        <RewardCountdown countUntilNextReward={countUntilNextReward} showRobot={showRobot}/>
        <Instructions page={renderPage}/>
        <SelectActivity
          addtoFirebase={addtoFirebaseFunction}
          userID={userID}
          ReactGA={ReactGA}
          changePage={changePageFunction}
          changeActivity={changeActivityFunction}
          exhibitsAndActivities={exhibitsAndActivities}
          pageCount={pageCount}
        />
      </div>
    );
  } else if (renderPage === 'Quiz') {
    return (
      <div>
        <Instructions page={renderPage}/>
        <Quiz
          addtoFirebase={addtoFirebaseFunction}
          userID={userID}
          ReactGA={ReactGA}
          changePage={changePageFunction}
          changeQuizValues={changeQuizValuesFunction}
          quizDifficulty={quizDifficulty}
          quizQuestionsCorrectInARow={quizQuestionsCorrectInARow}
          quizQuestionsWrongInARow={quizQuestionsWrongInARow}
          exhibit={selectedExhibit}
          activity={priorActivitiesForQuiz}
          showRobot={showRobot}
          questions={questions}
          countUntilNextReward={countUntilNextReward}
          pageCount={pageCount}
        />
      </div>
    );
  } else if (renderPage === 'CustomizeRobot') {
    return (
      <div>
        <Instructions page={renderPage} selectedActivity={selectedActivity}/>
        <CustomizeRobot
          addtoFirebase={addtoFirebaseFunction}
          userID={userID}
          ReactGA={ReactGA}
          changePage={changePageFunction}
          changeRobot={changeRobotFunction}
          head={robotArray[0]}
          body={robotArray[1]}
          arms={robotArray[2]}
          legs={robotArray[3]}
          bowTie={robotArray[4]}
          robotArmsImages={robotArmsImages}
          robotBodyImages={robotBodyImages}
          robotHeadImages={robotHeadImages}
          robotLegsImages={robotLegsImages}
          robotBowTieImages={robotBowTieImages}
        />
      </div>
    );
  } else if (renderPage === 'ViewRobot') {
    return (
      <div>
        <ViewRobot
          addtoFirebase={addtoFirebaseFunction}
          userID={userID}
          ReactGA={ReactGA}
          changePage={changePageFunction}
          head={robotArray[0]}
          body={robotArray[1]}
          arms={robotArray[2]}
          legs={robotArray[3]}
          bowTie={robotArray[4]}
          test="test"
        />
      </div>
    );
  } else if (renderPage === 'Activity') {
    return (
      <div>
        <Activity
          addtoFirebase={addtoFirebaseFunction}
          userID={userID}
          ReactGA={ReactGA}
          changePage={changePageFunction}
          exhibit={selectedExhibit}
          activity={selectedActivity}
          activitiesInDetail={activitiesInDetail}
          countUntilNextQuiz={countUntilNextQuiz}
          countUntilNextReward={countUntilNextReward}
          pageCount={pageCount}
        />
      </div>
    );
  } else if (renderPage === 'MyProfile' || renderPage === 'Intro') {
    return (
      <div>
        <MyProfile
          addtoFirebase={addtoFirebaseFunction}
          userID={userID}
          ReactGA={ReactGA}
          changePage={changePageFunction}
          page={renderPage}
          disclaimer={disclaimer}
          showRobot={showRobot}
        />
      </div>
    );
  } else if (renderPage === 'Welcome' ) {
    return (
      <div>
        <Fade in={true}>
          <Welcome
            addtoFirebase={addtoFirebaseFunction}
            userID={userID}
            ReactGA={ReactGA}
            changePage={changePageFunction}
            page={renderPage}
          />
        </Fade>
      </div>
    );
  }

}

export default App;
