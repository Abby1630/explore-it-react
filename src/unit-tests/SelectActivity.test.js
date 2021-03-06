import React from 'react';
import ReactDOM from 'react-dom';
import SelectActivity from './../SelectActivity';

it('renders without crashing', () => {
  const div = document.createElement('div');
  var addtoFirebaseFunction = function() {};
  var userID = '123';
  var ReactGA = function() {};
  var changePageFunction = function() {};
  var changeActivityFunction = function() {};
  var exhibitsAndActivities = [
    {
      "name": "Publix",
      "activities":   [
        {"name": "Cultural Foods"},
        {"name": "Nutrition"},
        {"name": "Money"},
        {"name": "Sorting"},
        {"name": "Letters"}
      ]
    },
  ];

  ReactDOM.render(
    <SelectActivity
      addtoFirebase={addtoFirebaseFunction}
      userID={userID}
      ReactGA={ReactGA}
      changePage={changePageFunction}
      changeActivity={changeActivityFunction}
      exhibitsAndActivities={exhibitsAndActivities}
    />, div);
});
