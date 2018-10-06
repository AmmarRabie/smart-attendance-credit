import React from 'react'
import {createStackNavigator, createSwitchNavigator} from 'react-navigation'
import {Provider} from 'react-redux'
import {AppLoading, Font} from 'expo'
import {Root} from 'native-base'

import store from './store'
import AuthScreen from './features/auth'
import CoursesScreen from './features/courses_available'
import ProfAttendanceScreen from './features/attendance_prof'
import OpenLecturesScreen from './features/open_lectures'
import LectureAttendanceScreen from './features/lecture_attendance'
import ProfCreatedLecturesScreen from './features/prof_created_lectures'
// import { persistor } from './store'
// import { PersistGate } from 'redux-persist/integration/react'

const ProfAppNavigator = createStackNavigator(
  {
    Courses: CoursesScreen,
    ProfSession: ProfAttendanceScreen,
    MyLectures: ProfCreatedLecturesScreen,
  },
  {
    initialRouteName: 'Courses',
    headerMode: 'none',
  }
)

const StdAppNavigator = createStackNavigator(
  {
    openLectures: OpenLecturesScreen, // in future this should be something like tab navigator
    lectureAttendance: LectureAttendanceScreen,
  },
  {
    initialRouteName: 'openLectures',
    headerMode: 'none',
  }
)

const AppNavigator = createSwitchNavigator(
  {
    Auth: AuthScreen,
    ProfApp: ProfAppNavigator,
    StdApp: StdAppNavigator,
    Courses: CoursesScreen,
  },
  {
    initialRouteName: 'Auth',
  }
)

export default class App extends React.Component {
  state = {
    isReady: false,
  }

  async componentWillMount() {
    await Font.loadAsync({
      // Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require('./assets/fonts/Roboto_medium.ttf'),
      Ionicons: require('./assets/fonts/Ionicons.ttf'),
      MaterialCommunityIcons: require('./assets/fonts/MaterialCommunityIcons.ttf'),
      // awesome:require('custom-fonts/fa.ttf'),
    })
    this.setState({isReady: true})
  }

  render() {
    const {isReady} = this.state
    if (!isReady) {
      return <AppLoading />
    }
    return (
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <Root>
          <AppNavigator />
        </Root>
        {/* </PersistGate> */}
      </Provider>
    )
  }
}
