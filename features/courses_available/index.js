import React from 'react'
import { View, Text } from 'react-native'
import {fetchCourses} from '../../DataProviders'
import {connect} from 'react-redux'
class CoursesScreen extends React.Component {
    render() {
        return (
            <Text> courses available screen</Text>
        )
    }
}

const mapStateToProps = state => ({
    courses: state.auth.loginErr,
    userData: state.auth.UserData,
})

export default connect(mapStateToProps, { fetchCourses })(CoursesScreen)