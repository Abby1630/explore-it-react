import React, {Component} from 'react';
// react-bootstrap imports
import Button from 'react-bootstrap/lib/Button';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import Collapse from 'react-bootstrap/lib/Collapse';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Grid from 'react-bootstrap/lib/Grid';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Panel from 'react-bootstrap/lib/Panel';
import Well from 'react-bootstrap/lib/Well';
// react-auto-form import
import AutoForm from 'react-auto-form'

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iAgree: false,
      childName: '',
      childAge: '',
      favFood: '',
      favColor: '',
      parentName: '',
      email: ''
    }

    this.nextPage = this.nextPage.bind(this);
    this.enableSubmit = this.enableSubmit.bind(this);
    // this.returnTermsAndConditions = this.returnTermsAndConditions.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  nextPage() {
    var tableData;
    if (this.props.page === "MyProfile" || this.state.iAgree === true) {
      var now = new Date();
      now = now.toString()
      tableData = {
        user_id: this.props.userID,
        child_age: this.state.childAge,
        child_name: this.state.childName,
        parent_email: this.state.email,
        parent_name: this.state.parentName,
        timestamp: now,
      };
      this.props.addtoFirebase('my_profile', tableData);
      if (this.props.showRobot === true) {
        this.props.changePage('CustomizeRobot');
      } else {
        this.props.changePage('SelectActivity');
      }
    } else {
      this.props.ReactGA.event({category: 'TermsAndConditions', action: 'ForgotToAgree'});
      tableData = {
        user_id: this.props.userID,
        category: 'Terms And Conditions',
        action: 'Forgot To Agree'
      };
      this.props.addtoFirebase('event', tableData);

      alert("Please agree to the terms and conditions");
    }
  }

  enableSubmit(e) {
    this.setState({iAgree: e.target.checked});
  }

  // returnTermsAndConditions(currentPage, enableSubmit) {
  //   if (currentPage === "Intro") {
  //     return (
  //       <div>
  //         <Disclaimer header="Terms & Conditions" open={false} body={this.props.disclaimer}/>
  //         <Checkbox onChange={e => this.enableSubmit(e)} ref="check_me" id="iAgree">
  //           By selecting, you agree to the terms and conditions.
  //         </Checkbox>
  //       </div>
  //     );
  //   }
  //
  //   return null;
  // }

  onChange(event, name, data, change) {
    // ...
    var stateObject = function() {
        var returnObj = {};
        returnObj[name] = data;
        return returnObj;
    };

    this.setState(stateObject);
  }

  render() {
    return (
      <div>
        <Grid>
          <AutoForm onChange={this.onChange}>
            <ChildInfo bsStyle="success" className="explore-purple-panel"/>
            <hr className="explore-small-hr"/>
            <ParentInfo bsStyle="success" className="explore-blue-panel"/>
            <hr className="explore-small-hr"/>
            <div>
              <Disclaimer header="Terms & Conditions" open={false} body={this.props.disclaimer}/>
              <Checkbox onChange={e => this.enableSubmit(e)} ref="check_me" id="iAgree">
                By selecting, you agree to the terms and conditions.
              </Checkbox>
            </div>
            <Button className="explore-light-blue-button" bsStyle="info" bsSize="large" onClick={this.nextPage}>Done!</Button>
          </AutoForm>
        </Grid>
      </div>
    );
  }
}

function FieldGroup({
    id,
    label,
    ...props
}) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props}/>
      </FormGroup>
    );
}

class Disclaimer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }

        this.getIcon = this.getIcon.bind(this);
    }

    componentDidMount() {
        if (this.props.open) {
            this.setState({open: true})
        }
    }

    getIcon() {
        if (this.state.open) {
            return (<Glyphicon className="pull-right" glyph="chevron-up"/>);
        }
        return (<Glyphicon className="pull-right" glyph="chevron-down"/>);
    }

    render() {
        return (
            <div>
                <Button bsStyle={this.props.bsStyle} block onClick={() => this.setState({
                    open: !this.state.open
                })}>
                    {this.props.header}
                    {this.getIcon()}
                </Button>
                <Collapse in={this.state.open}>
                    <div>
                        <Well bsStyle={this.props.bsStyle} className="lang-container">
                            {this.props.body}
                        </Well>
                    </div>
                </Collapse>
            </div>
        );
    }
}

class ChildInfo extends Component {
  render() {
    return (
      <div>
        <Panel header="Child's Information" className={this.props.className}>
          <FieldGroup id="childName" name="childName" type="text" label="Child's First Name" placeholder="Enter name"/>
          <FieldGroup id="childAge" name="childAge" type="number" label="Child's Age:" placeholder="Enter age"/>
          {/*
          <FieldGroup id="favFood" name="favFood" type="text" label="Favorite Food:" placeholder="Enter food"/>
          <FormGroup controlId="formControlsSelect">
            <ControlLabel>Favorite Color</ControlLabel>
            <FormControl componentClass="select" placeholder="select" name="favColor">
              <option value="selectOne">Please select a color</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
              <option value="yellow">Yellow</option>
            </FormControl>
          </FormGroup>
          */}
        </Panel>
      </div>
    );
  }
}

class ParentInfo extends Component {
    render() {
        return (
            <div>
                <Panel header="Parent's Information" className={this.props.className}>
                    <FieldGroup id="parentName" name="parentName" type="text" label="Parent's Name" placeholder="Enter name"/>
                    <FieldGroup id="email" name="email" type="email" label="Parent's Email address" placeholder="Enter email"/>
                    <HelpBlock>We may contact you at a future time to inquire about your experience with ExploreIT</HelpBlock>
                </Panel>
            </div>
        );
    }
}

export default MyProfile;
