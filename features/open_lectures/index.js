import React from 'react'
import {View, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import {Constants} from 'expo'
import {Container, Body, Title, Right, Button, Content, Header, Icon} from 'native-base'

import OpenLecturesList from '../../components/openLecturesList'
import AppLoadingIndicator from '../../components/AppLoadingIndicator'
import {ErrorView} from '../../components/ErrorView'
import EmptyResultView from '../../components/EmptyResultView'

import {GetOpenLectures} from './Actions'

class OpenLecturesScreen extends React.Component {
  state = {}

  componentWillMount() {
    console.log('open lectures screen will mount')
    this.getLectures()
  }

  componentWillReceiveProps(nextProps) {
    //   console.log(nextProps.studentOpenLectures.lecture.id)
    if (
      nextProps.studentOpenLectures && // there is a lecturers
      nextProps.studentOpenLectures.length === 1 && // and there is only one
      true // this.props.studentOpenLectures !== nextProps.studentOpenLectures // and that is the first time receiving the lectures
    ) {
      const {id} = nextProps.studentOpenLectures[0]
      const name = nextProps.studentOpenLectures[0].Course_Name
      this.navigateFunction(id, name)
    }
  }

  getLectures = () => {
    this.props.GetOpenLectures()
  }

  navigateFunction(id, name) {
    this.props.navigation.navigate('lectureAttendance', {Lecture: id, course_name: name})
  }

  openLecturesRender(openLectures, loading, error) {
    if (loading) return <AppLoadingIndicator />
    if (error) return <ErrorView onRetry={this.getLectures} />
    if (openLectures.length === 0)
      return (
        <EmptyResultView
          onRefresh={this.getLectures}
          userMessage="you have no available lectures, my be the attendance is still closed"
        />
      )

    return (
      <OpenLecturesList
        marginTop={20}
        list={openLectures}
        onItemClick={(id, name) => this.navigateFunction(id, name)}
      />
    )
  }

  render() {
    const Lectures = this.props.studentOpenLectures
    const openLecturesError = this.props.studentOpenLecturesError
    const openLecturesLoading = this.props.studentOpenLecturesLoading

    return (
      <Container>
        <View style={styles.statusBar} />
        <Header>
          <Body>
            <Title>Available Lectures</Title>
          </Body>
          <Right>
            <Button onPress={this.getLectures}>
              <Icon name="refresh" type="MaterialCommunityIcons" />
            </Button>
          </Right>
        </Header>
        <Content>
          {/* <OfflineNotice style={{ height: 100 }} /> */}
          {this.openLecturesRender(Lectures, openLecturesLoading, openLecturesError)}
        </Content>
      </Container>
    )
  }
}
const mapStateToProps = state => ({
  studentOpenLectures: state.openLectures.Lectures,
  studentOpenLecturesLoading: state.openLectures.loading,
  studentOpenLecturesError: state.openLectures.error,
})
const mapDispatchToProps = {
  GetOpenLectures,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OpenLecturesScreen)
// //// StyleSheet for Courses Screen
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#EEEEEE',
    // alignSelf:'baseline',
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
