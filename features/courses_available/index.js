import React from 'react'
import {Image, ActivityIndicator, View, Text, StyleSheet, Alert, Picker, Button} from 'react-native'
import {Card} from 'react-native-elements'
import {connect} from 'react-redux'
import {Constants} from 'expo'
import {
  Container,
  Header,
  Body,
  Right,
  Button as ButtonNativeBase,
  Title,
  Content,
  Text as TextNativeBase,
  Icon,
} from 'native-base'

import SchedulesList from '../../components/SchedulesList'
import AppLoadingIndicator from '../../components/AppLoadingIndicator'
import signOut from '../signout'

import {GetCodes, GetWantedSchedules, openNewLecture} from './actinos'

class CoursesScreen extends React.Component {
  state = {
    code_holder: '',
    tutorial_type_holder: 'Lecture',
    tutorials_types_list: [{type: 'Lecture'}, {type: 'Tutorial'}],
  }

  // fetch the codes before the screen show ups
  componentWillMount() {
    this.getcodes()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.codes[0] && this.state.code_holder === '') {
      const firstCode = nextProps.codes[0]
      this.setState({code_holder: nextProps.codes[0]})
      this.getSchedules(firstCode)
    }
    if (
      nextProps.lecture_id &&
      this.props.lecture_id !== nextProps.lecture_id &&
      !nextProps.new_lecture_loading &&
      !nextProps.new_lecture_error
    )
      // if new lectue are opened go to its screen
      this.props.navigation.navigate('ProfSession', {lecture_id: nextProps.lecture_id})
  }

  componentDidUpdate(prevProps) {
    const {new_lecture_error} = prevProps
    if (new_lecture_error) {
      Alert.alert('Error !!!', new_lecture_error, [{text: 'Ok'}])
    }

    const {codes_error} = this.props
    const {schedules_error} = this.props
    if (codes_error && codes_error !== this.props.codes_error) {
      console.log(`codes error userMessage="can't loads_error=${codes_error}`)
      Alert.alert('Error !!!', `can't load codes because ${codes_error}`, [
        {text: 'retry', onPress: () => this.getcodes()},
      ])
    }

    if (schedules_error && schedules_error !== this.props.schedules_error) {
      console.log(`codes error userMessage="can't loads_error=${schedules_error}`)
      Alert.alert('Error !!!', `can't load codes because ${schedules_error}`, [{text: 'ok'}])
    }
  }

  UpdateSelectedCode = itemValue => {
    this.setState({code_holder: itemValue})
  }

  UpdateSelectedTurorialType = itemValue => {
    this.setState({tutorial_type_holder: itemValue})
  }

  loadcodes() {
    return this.props.codes.map(code => <Picker.Item label={code} value={code} key={code} />)
  }

  // to render session types
  loadTutorialsTypes() {
    return this.state.tutorials_types_list.map(tutorial => (
      <Picker.Item label={tutorial.type} value={tutorial.type} key={tutorial.type} />
    ))
  }

  getcodes = () => {
    this.props.GetCodes()
  }

  openNewLecture = scheduleID => {
    this.props.openNewLecture(scheduleID)
  }

  openMyLectures = () => {
    this.props.navigation.navigate('MyLectures')
  }

  getSchedules = (_code = undefined, _type = undefined) => {
    const type = _type || this.state.tutorial_type_holder
    const code = _code || this.state.code_holder
    if (code === '' || type === '') return // avoid fake action with no code to happen
    this.props.GetWantedSchedules(type, code)
  }

  // ********** To Render the Schedules List ****************
  // There is three cases
  // 1- there is error happend while fetching ( not handled in this function (handled in the main render function))
  // 2- schedules still loading
  // 3- schedules list empty
  // 4- schedules list have some elements
  schedulesRender(schedules, schedulesLoading) {
    if (schedulesLoading) {
      return (
        <View style={styles.LoadingContainer}>
          <Text style={styles.headline}> Loading... </Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    if (schedules.length === 0) {
      return (
        <Image style={styles.Image} source={require('../../assets/images/no_results_found.png')} />
      )
    }

    return (
      <SchedulesList
        marginTop={20}
        list={this.props.schedules}
        onSchedulePress={this.openNewLecture}
      />
    )
  }

  // the main render function
  render() {
    const {codes_loading} = this.props
    const {schedules} = this.props
    const {schedules_loading} = this.props
    const {new_lecture_loading} = this.props

    if (codes_loading || new_lecture_loading) {
      return <AppLoadingIndicator />
    }

    return (
      <Container>
        <View style={styles.statusBar} />
        <Header>
          <Body>
            <Title>Courses</Title>
          </Body>
          <Right>
            <ButtonNativeBase onPress={() => signOut(this)}>
              <Icon name="log-out" />
            </ButtonNativeBase>
            <ButtonNativeBase onPress={this.openMyLectures}>
              {/* <IconNativeBase name='dots-vertical' type='MaterialCommunityIcons' /> */}
              <TextNativeBase>lectures</TextNativeBase>
            </ButtonNativeBase>
          </Right>
        </Header>
        <Content>
          <View style={styles.MainContainer}>
            <Card containerStyle={styles.PickerContainer}>
              <Picker
                selectedValue={this.state.code_holder}
                onValueChange={this.UpdateSelectedCode}
              >
                {this.loadcodes()}
              </Picker>

              <Picker
                selectedValue={this.state.tutorial_type_holder}
                onValueChange={this.UpdateSelectedTurorialType}
              >
                {this.loadTutorialsTypes()}
              </Picker>
              <Button
                style={styles.ButtonStyle}
                title="Search"
                onPress={() => this.getSchedules()}
              />
            </Card>
            {this.schedulesRender(schedules, schedules_loading)}
          </View>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  codes: state.codes.codes,
  codes_loading: state.codes.loading,
  codes_error: state.codes.error,

  schedules: state.schedules.schedules.map(schedule => ({...schedule, key: schedule.scheduleID})),
  schedules_loading: state.schedules.loading,
  schedules_error: state.schedules.error,

  lecture_id: state.openNewLec.lectureId,
  new_lecture_loading: state.openNewLec.loading,
  new_lecture_error: state.openNewLec.error,
})

const mapDispatchToProps = {
  GetCodes,
  GetWantedSchedules,
  openNewLecture,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesScreen)
// ////////////////////////////////////////////////////////////////////////////////////////////

// //// StyleSheet for Courses Screen
const styles = StyleSheet.create({
  ButtonStyle: {
    borderRadius: 20,
    textAlign: 'center',
    marginLeft: 45,
    marginRight: 45,
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 9,
    paddingRight: 9,
    backgroundColor: 'darkblue',
  },
  MainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#EEEEEE',
  },
  PickerContainer: {
    marginRight: 0,
    marginLeft: 0,
  },
  ListContainer: {
    flex: 3,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  LoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
  },
  headline: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    width: 200,
    textAlignVertical: 'center',
  },
  Image: {
    flex: 3,
    width: null,
    height: null,
    resizeMode: 'stretch',
  },
  statusBar: {
    backgroundColor: '#000000',
    height: Constants.statusBarHeight,
  },
})
