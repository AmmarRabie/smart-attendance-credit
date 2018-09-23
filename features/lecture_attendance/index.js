import { makeStudentAttend, checkAttendanceStatus } from './actions'
import React from 'react'
import {  View, Text, StyleSheet, Button,ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

class LectureAttendanceScreen extends React.Component {
    state = {

    }

    componentWillMount() {
         this.props.checkAttendanceStatus(this.props.navigation.getParam('Lecture'))
    }
    checkStatus = () => {
        this.setState({ attendanceStatus: this.props.checkAttendanceStatus(this.props.navigation.getParam('Lecture')) })
    }

    takeStudentAttendance() {
        this.props.makeStudentAttend(this.props.navigation.getParam('stdId'), this.props.navigation.getParam('Lecture'))
        console.log(`takeStudentAttendance ${this.props.studnetIsAttend}`)
    }
    render() {
        const studnetIsAttend = this.props.studnetIsAttend
        const studentAttendError = this.props.studentAttendError
        const studentAttendLoading = this.props.studentAttendLoading
        const statusIsOpen = this.props.statusIsOpen
        const statusError = this.props.statusError
        const statusLoading = this.props.statusLoading
        console.log(statusIsOpen)
        console.log(studnetIsAttend)

        if (studentAttendError || statusError) {
            return (
                <Image style={styles.Image} source={require('../../images/error_state.jpg')}>
                </Image>
            )
        }
        if (studentAttendLoading || statusLoading) {
            return (
                <View style={styles.LoadingContainer}>
                    <Text style={styles.headline}>  Loading... </Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        return (
            <View style={styles.MainContainer}>
                <View style={styles.HorizontalContainer} >

                    <Text>Attendance Status: </Text>
                    <Text> {statusIsOpen}</Text>
                    <Button
                        title="Check attendance!"
                        onPress={() => this.checkStatus()} />
                </View>

                {this.renderTakeAttendanceBtn(statusIsOpen && !studnetIsAttend)}
            </View>
        )
    }

    renderTakeAttendanceBtn(draw){
        if (!draw) return null
        return (
            <View  style={styles.HorizontalContainer}>
            <Text> Attendance: {this.props.isAttend}</Text>
            <Button title='Take My Attendance' onPress={() => this.takeStudentAttendance()}></Button>

        </View>
        )
    }
}


const mapStateToProps = state => ({
    studnetIsAttend: state.studentAttendance.isAttend,
    studentAttendError: state.studentAttendance.studentAttendError,
    studentAttendLoading: state.studentAttendance.studentAttendLoading,
    statusIsOpen: state.checkAttendacneStatus.attendanceStatusOpen,
    statusError: state.checkAttendacneStatus.statusError,
    statusLoading: state.checkAttendacneStatus.statusLoading
})
const mapDispatchToProps = {
    makeStudentAttend,
    checkAttendanceStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(LectureAttendanceScreen)

const styles = StyleSheet.create({
    MainContainer:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#EEEEEE',
    }
    ,
    HorizontalContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    LoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'whitesmoke'
    },
    headline: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 0,
        width: 200,
        textAlignVertical: "center"
    },
    Image: {
        flex: 3,
        width: null,
        height: null,
        resizeMode: 'stretch',
    }
})
