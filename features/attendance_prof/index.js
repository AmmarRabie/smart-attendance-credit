import React from 'react'
import {
  Text,
  Icon,
  Toast,
  Container,
  Header,
  Right,
  Body,
  Title,
  Content,
  Button,
  ActionSheet,
} from 'native-base'
import {Image, ActivityIndicator, View, StyleSheet, Alert} from 'react-native'
import {connect} from 'react-redux'
import {Divider} from 'react-native-elements'

import AttendanceList from '../../components/AttendanceList'
import {ErrorView} from '../../components/ErrorView'

import {
  GetLectureAttendance,
  changeStudentAttendance,
  changeLectureAttendance,
  submitAttendance,
  submitAttendanceToken,
} from './actions'

class ProfAttendanceScreen extends React.Component {
  state = {
    attendance_count: 0,
    all_student_count: undefined,
  }

  componentWillReceiveProps(nextProps) {
    console.log(`componentWillReceiveProps`)
    // && this.state.all_student_count === undefined
    if (nextProps.attendance_list && nextProps.attendance_list !== this.props.attendance_list) {
      this.setState({all_student_count: nextProps.attendance_list.length})
    } else if (nextProps.submit_attendance_message) {
      this.props.submitAttendanceToken()
      Alert.alert(
        'info',
        nextProps.submit_attendance_message,
        [{text: 'OK', onPress: () => this.props.navigation.goBack()}],
        {cancelable: false}
      )
    } else if (nextProps.submit_attendance_error) {
      this.alert('error', nextProps.submit_attendance_error)
    }

    const changeStdAttError = nextProps.change_std_att_error
    if (changeStdAttError) {
      Toast.show({
        text: "attendance doesn't change, try re-attend again or refresh",
        type: 'danger',
      })
    }
  }

  getLectureAttendance = lectureId => {
    this.props.GetLectureAttendance(lectureId)
  }

  toggleStatus = () => {
    const currStatus = this.props.attendance_status
    this.props.changeLectureAttendance(this.props.navigation.getParam('lecture_id'), !currStatus)
  }

  onOpenActionMenu = () => {
    const BUTTONS = ['Refresh list', this.getTitleFromProp(), 'Submit the attendance', 'Cancel']
    const DESTRUCTIVE_INDEX = 2
    const CANCEL_INDEX = 3
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'What do you want ?',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this.getLectureAttendance(this.props.navigation.getParam('lecture_id'))
            break
          case 1:
            this.toggleStatus()
            break
          case 2:
            this.confirmSubmitAttendance()
            break
          default:
            break
        }
      }
    )
  }

  changeStdAttendance = (studentId, attendance) => {
    const lectureId = this.props.navigation.getParam('lecture_id')
    this.props.changeStudentAttendance(lectureId, studentId, attendance)
  }

  getTitleFromProp() {
    return this.props.attendance_status ? 'close attendance' : 'open attendance'
  }

  getAttendanceStatusMessageFromProp() {
    return this.props.attendance_status ? 'Attendance is opened' : 'Attendance is closed'
  }

  updateCount(newCount) {
    console.log(`new count is = ${newCount}`)
    this.setState({attendance_count: newCount})
  }

  confirmSubmitAttendance() {
    Alert.alert(
      'caution',
      "you can't edit this attendance again, are you sure to submit it",
      [{text: 'submit', onPress: () => this.submitAttendance()}, {text: 'cancel'}],
      {cancelable: false}
    )
  }

  submitAttendance() {
    const lectureId = this.props.navigation.getParam('lecture_id')

    this.props.submitAttendance(lectureId)
  }

  componentWillMount() {
    console.log('component will mount called')
    const lectureId = this.props.navigation.getParam('lecture_id') // this.props.navigation.state.params.lecture_id;
    this.getLectureAttendance(lectureId)
  }

  alert = (title, msg) => {
    Alert.alert(title, msg, [{text: 'OK'}], {cancelable: false})
  }

  attendanceRender(attendanceList, attendanceListLoading) {
    if (!attendanceList) return null
    if (attendanceListLoading) {
      return (
        <View style={styles.LoadingContainer}>
          <Text style={styles.headline}> Loading... </Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    if (attendanceList.length === 0) {
      return (
        <Image style={styles.Image} source={require('../../assets/images/no_results_found.png')} />
      )
    }

    return (
      <AttendanceList
        marginTop={20}
        list={attendanceList}
        onAttendanceChange={(stdId, attend) => this.changeStdAttendance(stdId, attend)}
        onCountChange={newCount => this.updateCount(newCount)}
      />
    )
  }

  render() {
    console.log('re render called')
    const attendanceList = this.props.attendance_list
    const getLectureAttendanceLoading = this.props.get_lecture_attendance_loading
    const getLectureAttendanceError = this.props.get_lecture_attendance_error

    if (getLectureAttendanceError) {
      return (
        <ErrorView
          logMessage={getLectureAttendanceError}
          userMessage="can't get the lecture data"
          onRetry={() => this.getLectureAttendance(this.props.navigation.getParam('lecture_id'))}
        />
      )
    }

    return (
      <Container>
        <View style={styles.statusBar} />
        <Header>
          <Body>
            <Title>Lecture Attendance</Title>
          </Body>
          <Right>
            <Button onPress={this.onOpenActionMenu}>
              <Icon name="dots-vertical" type="MaterialCommunityIcons" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          <Text style={{fontSize: 50, color: 'red', textAlign: 'center'}}>
            {' '}
            {this.state.attendance_count} / {this.state.all_student_count}{' '}
          </Text>

          <Divider style={styles.divider} />
          <Text style={{textAlign: 'center'}}> {this.getAttendanceStatusMessageFromProp()} </Text>
          <Divider style={styles.divider} />
          {this.attendanceRender(attendanceList, getLectureAttendanceLoading)}
        </Content>
      </Container>
    )
  }

  componentWillUnmount() {
    console.log('component will unmount called')
  }
}

const mapStateToProps = state => ({
  attendance_list: state.prof.attendanceList.lecture.att,
  attendance_status: state.prof.attendanceList.lecture.status,
  get_lecture_attendance_loading: state.prof.attendanceList.loading,
  get_lecture_attendance_error: state.prof.attendanceList.error,

  change_std_att_msg: state.prof.chngStuAtt.msg,
  change_std_att_error: state.prof.chngStuAtt.error,
  change_std_att_loading: state.prof.chngStuAtt.loading,

  submit_attendance_message: state.prof.submitAttendance.message,
  submit_attendance_error: state.prof.submitAttendance.error,
})

const mapDispatchToProps = {
  GetLectureAttendance,
  changeStudentAttendance,
  changeLectureAttendance,
  submitAttendance,
  submitAttendanceToken,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfAttendanceScreen)

// //// StyleSheet for Courses Screen
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#EEEEEE',
  },
  LoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
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
    height: 15,
  },
})
