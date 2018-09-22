import React from 'react';
import {
  StyleSheet, View
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import store from './store'
import { Provider } from 'react-redux';

import AuthScreen from './features/auth'
import CoursesScreen from './features/courses_available';
import OpenLecturesScreen from './features/open_lectures';
import LectureAttendanceScreen from './features/lecture_attendance'
import ProfAttendanceScreen from './features/attendance_prof';

const ProfAppNavigator = createStackNavigator(
  {
    Courses: CoursesScreen,
    ProfSession: ProfAttendanceScreen, // in future this should be something like tab navigator
  },
  {
    initialRouteName: 'Courses',
    navigationOptions: {
      headerTintColor: '#a41034',
      headerStyle: {
        backgroundColor: '#fff',
      },
    },
  }
);

const StdAppNavigator = createStackNavigator(
  {
    openLectures: OpenLecturesScreen, // in future this should be something like tab navigator
    lectureAttendance:LectureAttendanceScreen
  },
  {
    initialRouteName: 'openLectures',
    navigationOptions: {
      headerTintColor: '#a41034',
      headerStyle: {
        backgroundColor: '#fff',
      },
    },
  }
);


const AppNavigator = createSwitchNavigator(
  {
    Auth: AuthScreen,
    ProfApp: ProfAppNavigator,
    StdApp: StdAppNavigator,
    Courses: CoursesScreen
  },
  {
    initialRouteName: 'StdApp',
  }
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
