import React from 'react'
import { Button,View, ImageBackground, StyleSheet, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logInUser } from './authActions'

class AuthScreen extends React.Component {
    static propTypes = {
        err: PropTypes.string,
        token: PropTypes.string,
        logInUser: PropTypes.func,
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

    _login = async () => {
        this.props.logInUser(this.state.username, this.state.password)
    }

    handleUsernameUpdate = username => {
        this.setState({ username })
    }

    handlePasswordUpdate = password => {
        this.setState({ password })
    }

    render() {
        return (
                <ImageBackground style={{flex:1}} source={require('../../images/lecture.jpg')} resizeMode='cover' blurRadius={3}>
                <View style={styles.login}>
                    <TextInput style={styles.textInput}
                        placeholder="Username"
                        value={this.state.username}
                        onChangeText={this.handleUsernameUpdate}
                        autoCapitalize="none"
                    />
                    <TextInput style={styles.textInput}
                        placeholder="Password"
                        value={this.state.password}
                        onChangeText={this.handlePasswordUpdate}
                        secureTextEntry
                    />
                    <Button title="Login" style={styles.loginButton} onPress={this._login} />
                    <Text style={styles.error}>{this.props.err}</Text>
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
        textAlign: "center",
        marginLeft: 45,
        marginRight: 45,
        marginTop: 20,
        marginBottom: 20,
        paddingTop: 9,
        paddingBottom: 9,
        paddingLeft: 9,
        paddingRight: 9,
    },
    textInput: {
        borderRadius: 15,
        marginLeft: 45,
        marginRight: 45,
        marginTop:20,
        marginBottom:20,
        paddingTop:9,
        paddingBottom: 9,
        paddingLeft: 9,
        paddingRight: 9,
        borderColor: 'white',
        borderWidth:1,
        textAlign: "center",
     

        color: 'white',
    },
})

const mapStateToProps = state => ({
    err: state.auth.loginErr,
    userData: state.auth.userData,
})

export default connect(mapStateToProps, { logInUser })(AuthScreen)
