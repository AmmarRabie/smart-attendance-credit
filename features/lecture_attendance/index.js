import React from 'react'
import {StyleSheet, ActivityIndicator, Alert, Image} from 'react-native'
import {connect} from 'react-redux'
import {
  Content,
  Title,
  Body,
  Header,
  Container,
  Right,
  Icon,
  View,
  Item,
  Input,
  Button,
  Text,
  Card,
  CardItem,
  Left,
} from 'native-base'

import {makeStudentAttend, checkAttendanceStatus, checkStdAttendanceStatus} from './actions'

class LectureAttendanceScreen extends React.Component {
  state = {
    secret: '',
  }

  componentWillMount() {
    this.checkStatus()
    this.props.checkStdAttendanceStatus(this.LectureId())
  }

  LectureId = () => this.props.navigation.getParam('Lecture')

  componentWillReceiveProps(nextprops) {
    if (
      nextprops.studentAttendError &&
      this.props.studentAttendError !== nextprops.studentAttendError
    ) {
      Alert.alert('Error', nextprops.studentAttendError, [{text: 'Ok'}])
    }
  }

  checkStatus = () => {
    this.props.checkAttendanceStatus(this.LectureId())
  }

  takeStudentAttendance() {
    this.props.makeStudentAttend(this.LectureId(), this.state.secret)
    console.log(`takeStudentAttendance ${this.props.studnetIsAttend}`)
  }

  renderTakeAttendanceBtn(draw) {
    if (!draw) return null
    return (
      <Card>
        <CardItem>
          <Left>
            <Button onPress={() => this.takeStudentAttendance()}>
              <Text>Take My Attendance</Text>
            </Button>
          </Left>
          <Right>
            <Item rounded>
              <Input
                value={this.state.secret}
                placeholder="Secret"
                onChangeText={text => this.setState({secret: text})}
              />
            </Item>
          </Right>
        </CardItem>
      </Card>
    )
  }

  renderStdAttendanceInfo() {
    const message = this.props.studnetIsAttend
      ? 'You are attended in this lecture'
      : 'You are not attended'
    return <Text>{message}</Text>
  }

  renderLectureAttendanceInfo() {
    return <Text>Attendance is {this.props.statusIsOpen ? 'open' : 'closed'}</Text>
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
          <Right>
            <Button onPress={this.checkStatus}>
              <Icon color="#FFFFFF" name="refresh" type="MaterialCommunityIcons" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          {/* <OfflineNotice /> */}
          {this.renderLectureAttendanceInfo()}
          {this.renderStdAttendanceInfo()}
          {this.renderTakeAttendanceBtn(statusIsOpen && !studnetIsAttend)}
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
  checkStdAttendanceStatus,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LectureAttendanceScreen)

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  HorizontalContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
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
    height: 0,
  },
})
