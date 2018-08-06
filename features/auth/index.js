import React from 'react'
import { Button, View, StyleSheet, Text, TextInput } from 'react-native'
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
            <View style={styles.container}>
                <Text style={styles.error}>{this.props.err}</Text>
                <TextInput
                    placeholder="username"
                    value={this.state.username}
                    onChangeText={this.handleUsernameUpdate}
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="password"
                    value={this.state.password}
                    onChangeText={this.handlePasswordUpdate}
                    secureTextEntry
                />
                <Button title="Log In" onPress={this._login} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
    },
    text: {
        textAlign: 'center',
    },
    error: {
        textAlign: 'center',
        color: 'red',
    },
})

const mapStateToProps = state => ({
    err: state.auth.loginErr,
    userData: state.auth.userData,
})

export default connect(mapStateToProps, { logInUser })(AuthScreen)
