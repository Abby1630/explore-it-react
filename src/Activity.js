import React, { Component } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Col from 'react-bootstrap/lib/Col';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Button from 'react-bootstrap/lib/Button';
import Alert from 'react-bootstrap/lib/Alert';


var activity = {
  activityName: 'Cultural Foods',
  theActivity: 'Malcolm the Robot’s eyes light up, “I love to travel and try new cuisine from all over the world! During my travels, I’ve learned a lot about other cultures and their languages. Can you help me prepare a Hispanic meal?” Help the robot by finding three items from the store: rice, carrots, and soup. After you do so, the Robot will tell you how to say them in Spanish.',
  extendingTheActivity: 'You can incorporate other cultures into this activity. Try making an Italian dish, like spaghetti and meatballs. You should ask the child to find the ingredients to make the recipe and talk about Italian culture, perhaps how they make pasta from scratch using flour, eggs, salt, and olive oil. You can also try French cuisine, like ratatouille. Ask the child to find a variety of vegetables (zucchini, eggplant, squash, and tomato sauce) to incorporate and talk about how the French culture uses a lot of fresh ingredients.',
  whatChildrenLearn: 'In this activity the children are learning about other cultures traditions and about being bilingual. Learning a second language early on is much easier than trying to learn a language later in high school.',
  exploringLanguage:[
    {
      english: 'Rice',
      spanish: 'Arroz',
      french: 'Riz'
    },
    {
      english:'Carrots',
      spanish:'Zanahoria',
      french: 'Carottes'
    },
    {
      english:'Soup',
      spanish:'Sopa',
      french: 'Soupe'
    }
  ]
};

class Activity extends Component{
  constructor(props) {
    super(props);
    this.state = {

    }
    this.nextPage= this.nextPage.bind(this);
  }

  nextPage () {
    this.props.changePage('Quiz');
  }

  render(){
    return(
      <div>
        <Grid>
          <SectionTitle text={activity.activityName}/>
          <hr/>
          <Alert bsStyle="success" >
            <SectionContent heading="The Activity" text={activity.theActivity}/>
          </Alert>

          <hr/>
          <Alert bsStyle="info">
            <SectionContent heading="Extending The Activity" text={activity.extendingTheActivity}/>
          </Alert>
          <hr/>
          <Alert bsStyle="warning">
            <SectionContent heading="What Children Learn" text={activity.whatChildrenLearn}/>
          </Alert>
          <hr/>
          <ExploringLanguage heading="Exploring Language" languageContent={activity.exploringLanguage}/>
          <hr/>
          <Button bsStyle="success" bsSize="large" onClick={this.nextPage}>What's Next?</Button>
        </Grid>
      </div>
    );
  }
}

class SectionTitle extends Component {
  render () {
    return <h2>{this.props.text}</h2>;
  }
}

class SectionContent extends Component {
  render () {
    return (
      <div>
        <h3>{this.props.heading}</h3>
        <p>{this.props.text}</p>
      </div>
    );
  }
}

class ExploringLanguage extends Component {
  render () {
    console.log(this.props.languageContent);
    var langList = this.props.languageContent.map(function(word) {
      console.log(word);
      return (
        <Col xs={4}>
          <ListGroup>
            <ListGroupItem><strong>English:</strong> {word.english}</ListGroupItem>
            <ListGroupItem><strong>Spanish:</strong> {word.spanish}</ListGroupItem>
            <ListGroupItem><strong>French:</strong> {word.french}</ListGroupItem>
          </ListGroup>
        </Col>
      );
    });
    return (
      <div>
        <h3>{this.props.heading}</h3>
        <Grid>
          {langList}
        </Grid>
      </div>
    );
  }
}

export default Activity;
