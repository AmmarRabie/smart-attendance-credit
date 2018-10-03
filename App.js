import React from 'react';
import {
  StyleSheet, View
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import store from './store'
// import { persistor } from './store'
// import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';
import { AppLoading } from 'expo'
import AuthScreen from './features/auth'
import CoursesScreen from './features/courses_available';
import ProfAttendanceScreen from './features/attendance_prof';
import OpenLecturesScreen from './features/open_lectures';
import LectureAttendanceScreen from './features/lecture_attendance';
import ProfCreatedLecturesScreen from './features/prof_created_lectures'
import { Root } from 'native-base';

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
);

const StdAppNavigator = createStackNavigator(
  {
    openLectures: OpenLecturesScreen, // in future this should be something like tab navigator
    lectureAttendance: LectureAttendanceScreen,
  },
  {
    initialRouteName: 'openLectures',
    headerMode: 'none',
  }
);


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
);

export default class App extends React.Component {
  state = {
    isReady: false
  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      // Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      MaterialCommunityIcons: require("@expo/vector-icons/fonts/MaterialCommunityIcons.ttf"),
      // awesome:require('custom-fonts/fa.ttf'),
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
          <Root>
            <AppNavigator />
          </Root>
        {/* </PersistGate> */}
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
