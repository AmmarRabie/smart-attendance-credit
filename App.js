import React from 'react';
import {
  StyleSheet, View
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import store from './store'
import { Provider } from 'react-redux';

import AuthScreen from './features/auth'
import CoursesScreen from './features/courses_available';
import StudentAttendanceScreen from './features/attendance_student';
import ProfAttendanceScreen from './features/attendance_prof';
import { Root } from 'native-base';

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
    StudentSession: StudentAttendanceScreen, // in future this should be something like tab navigator
  },
  {
    initialRouteName: 'StudentSession',
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
    initialRouteName: 'ProfApp',
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
        <Root>
          <AppNavigator />
        </Root>
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
