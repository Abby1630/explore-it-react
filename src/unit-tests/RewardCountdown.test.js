import React from 'react';
import ReactDOM from 'react-dom';
import RewardCountdown from './../RewardCountdown';

it('renders without crashing', () => {
  const div = document.createElement('div');
  var countUntilNextReward = ''

  ReactDOM.render(<RewardCountdown countUntilNextReward={countUntilNextReward}/>, div);
});
