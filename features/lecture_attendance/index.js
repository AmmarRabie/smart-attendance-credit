import React from 'react'
import {StyleSheet, ActivityIndicator, Alert, View, Text, Button, Image} from 'react-native'
import {connect} from 'react-redux'
import {Content, Title, Body, Header, Container} from 'native-base'
import {Constants} from 'expo'

import {makeStudentAttend, checkAttendanceStatus} from './actions'

class LectureAttendanceScreen extends React.Component {
  componentWillMount() {
    this.checkStatus()
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.studentAttendError) {
      Alert.alert('Error', nextprops.studentAttendError, [{text: 'Ok'}])
    }
  }

  checkStatus = () => {
    this.props.checkAttendanceStatus(this.props.navigation.getParam('Lecture'))
  }

  takeStudentAttendance() {
    this.props.makeStudentAttend(this.props.navigation.getParam('Lecture'))
    console.log(`takeStudentAttendance ${this.props.studnetIsAttend}`)
  }

  renderTakeAttendanceBtn(draw) {
    if (!draw) return null
    return (
      <View style={styles.HorizontalContainer}>
        <Text> Attendance: {this.props.isAttend}</Text>
        <Button title="Take My Attendance" onPress={() => this.takeStudentAttendance()} />
      </View>
    )
  }

  renderMessageInfo() {
    const message = this.props.studnetIsAttend
      ? 'You are attended in this lecture'
      : 'You are not attended'
    return <Text> {message} </Text>
  }

  render() {
    const {studnetIsAttend} = this.props
    const {studentAttendLoading} = this.props
    const {statusIsOpen} = this.props
    const {statusError} = this.props
    const {statusLoading} = this.props

    if (statusError) {
      return <Image style={styles.Image} source={require('../../assets/images/error_state.jpg')} />
    }
    if (studentAttendLoading || statusLoading) {
      return (
        <View style={styles.LoadingContainer}>
          <Text style={styles.headline}> Loading... </Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    return (
      <Container>
        <View style={styles.statusBar} />
        <Header>
          <Body>
            <Title>{this.props.navigation.getParam('course_name')}</Title>
          </Body>
        </Header>
        <Content>
          <View style={styles.MainContainer}>
            {/* <OfflineNotice /> */}
            <View style={styles.HorizontalContainer}>
              <Text>Attendance Status: {statusIsOpen ? 'open' : 'closed'}</Text>
              <Button title="Check attendance!" onPress={() => this.checkStatus()} />
            </View>
            {this.renderTakeAttendanceBtn(statusIsOpen && !studnetIsAttend)}
            {this.renderMessageInfo()}
          </View>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  studnetIsAttend: state.studentAttendance.isAttend,
  studentAttendError: state.studentAttendance.studentAttendError,
  studentAttendLoading: state.studentAttendance.studentAttendLoading,
  statusIsOpen: state.checkAttendacneStatus.attendanceStatusOpen,
  statusError: state.checkAttendacneStatus.statusError,
  statusLoading: state.checkAttendacneStatus.statusLoading,
})
const mapDispatchToProps = {
  makeStudentAttend,
  checkAttendanceStatus,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LectureAttendanceScreen)

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#EEEEEE',
  },
  HorizontalContainer: {
    flexDirection: 'row',
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
