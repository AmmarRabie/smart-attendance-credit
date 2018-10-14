import React from 'react'
import {
  ActivityIndicator,
  Button,
  View,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'


import {logInUser} from './authActions'

class AuthScreen extends React.Component {
  static propTypes = {
    err: PropTypes.string,
    logInUser: PropTypes.func,
    loading: PropTypes.bool,
    userData: PropTypes.shape({
      role: PropTypes.string,
    }),
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  }

  state = {
    username: '',
    password: '',
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userData) {
      if (nextProps.userData.role === 'prof') this.props.navigation.navigate('ProfApp')
      else this.props.navigation.navigate('StdApp')
    }
  }

  handleUsernameUpdate = username => {
    this.setState({username})
  }

  handlePasswordUpdate = password => {
    this.setState({password})
  }

  login = async () => {
    this.props.logInUser(this.state.username, this.state.password)
  }

  renderLoadingIndicator() {
    if (this.props.loading) {
      return <ActivityIndicator size="large" color="#ff5522" />
    }
    return null
  }

  render() {
    return (
      <ImageBackground
        style={{flex: 1}}
        source={require('../../assets/images/lecture.jpg')}
        resizeMode="cover"
        blurRadius={3}
      >
        <View style={styles.statusBar} />
        <View style={styles.login}>
          {this.renderLoadingIndicator()}
          <Text style={styles.error}>{this.props.err}</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            value={this.state.username}
            onChangeText={this.handleUsernameUpdate}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            value={this.state.password}
            onChangeText={this.handlePasswordUpdate}
            secureTextEntry
            autoCapitalize="none"
          />
          <Button title="Login" style={styles.loginButton} onPress={this.login} />
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
  error: {
    textAlign: 'center',
    color: 'red',
  },
  login: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  loginButton: {
    borderRadius: 20,
    textAlign: 'center',
    marginLeft: 45,
    marginRight: 45,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'darkblue',
  },
  textInput: {
    borderRadius: 15,
    marginLeft: 45,
    marginRight: 45,
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 9,
    paddingRight: 9,
    borderColor: 'white',
    borderWidth: 1,
    textAlign: 'center',

    color: 'white',
  },
  statusBar: {
    backgroundColor: '#000000',
    height: 0,
  },
})

const mapStateToProps = state => ({
  err: state.auth.loginErr,
  userData: state.auth.userData,
  loading: state.auth.loading,
})

export default connect(
  mapStateToProps,
  {logInUser}
)(AuthScreen)
