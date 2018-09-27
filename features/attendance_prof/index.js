import React from 'react'
import { Image, ActivityIndicator, View, Text, StyleSheet, Alert } from 'react-native'
import { connect } from 'react-redux'
import AttendaceList from '../../components/AttendanceList'
import { GetLectureAttendance, changeStudentAttendance, changeLectureAttendance, submitAttendance } from './actions'
import { Button } from '../../node_modules/react-native-elements';

class ProfAttendanceScreen extends React.Component {

    state = {
        attendance_count: 0,
        all_student_count: undefined,
    }

    _getLectureAttendance = (lecture_id) => {
        this.props.GetLectureAttendance(lecture_id)
    }

    _toggleStatus = () => {
        currStatus = this.props.attendance_status
        console.log('toggle status called')
        console.log(currStatus)
        this.props.changeLectureAttendance(this.props.navigation.state.params.lecture_id, !currStatus)
    }

    _changeStdAttendance = (lecture_id, student_id, attendance) => {
        this.props.changeStudentAttendance(lecture_id, student_id, attendance)
    }

    _getTitleFromProp() {
        return this.props.attendance_status ? 'close attendance' : 'open attendance'
    }

    _getAttendanceStatusMessageFromProp() {
        return this.props.attendance_status ? 'Attendance is opened' : 'Attendance is closed'
    }

    _updateCount(newCount) {
        console.log(`new count is = ${newCount}`)
        this.setState({ attendance_count: newCount })
    }

    _confirmSubmitAttendance() {
        Alert.alert('caution', "you can't edit this attendance again, are you sure to submit it", [
            { text: 'submit', onPress:() => this._submitAttendance() },
            { text: 'cancel' },],
            { cancelable: false })
    }

    _submitAttendance() {
        lecture_id = this.props.navigation.state.params.lecture_id;

        this.props.submitAttendance(lecture_id)
    }

    componentWillMount() {
        lecture_id = this.props.navigation.state.params.lecture_id;
        
        this._getLectureAttendance(lecture_id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.attendance_list && this.state.all_student_count === undefined) {
            this.setState({ all_student_count: nextProps.attendance_list.length })
        }
        else if (nextProps.submit_attendance_message) {
            Alert.alert('info', nextProps.submit_attendance_message,
                [
                    { text: 'OK', onPress: () => this.props.navigation.pop() },
                ],
                { cancelable: false }
            )
        }
        else if (nextProps.submit_attendance_error) {
            this.alert('info', nextProps.submit_attendance_error)
        }
    }

    alert = (title, msg) => {
        Alert.alert(
            title,
            msg,
            [
                { text: 'OK' },
            ],
            { cancelable: false }
        )
    }

    attendanceRender(attendancelist, attendance_list_loading) {
        if (!attendancelist)
            return;
        if (attendance_list_loading) {
            return (
                <View style={styles.LoadingContainer}>
                    <Text style={styles.headline}>  Loading... </Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        else if (attendancelist.length === 0) {
            return (
                <Image style={styles.Image} source={require('../../images/no_results_found.png')}>
                </Image>
            )
        }
        else {
            return (
                <View>
                    <AttendaceList
                        marginTop={20}
                        list={attendancelist}
                        lecture_id={this.props.navigation.state.params.lecture_id}
                        onAttendanceChange={this._changeStdAttendance}
                        onCountChange={(newCount) => this._updateCount(newCount)}
                    />
                </View>
            )
        }
    }

    render() {

        const attendance_list = this.props.attendance_list
        const get_lecture_attendance_loading = this.props.get_lecture_attendance_loading
        const get_lecture_attendance_error = this.props.get_lecture_attendance_error

        const change_std_att_msg = this.props.change_std_att_msg
        const change_std_att_error = this.props.change_std_att_error
        const change_std_att_loading = this.props.change_std_att_loading

        console.log("item loading", change_std_att_loading)
        console.log(`the attendnace status in props = ${this.props.attendance_status}`)
        if (change_std_att_msg) {
            this.alert('Successful', change_std_att_msg.mes)
        }
        else if (change_std_att_error) {
            this.alert('Error !!!', change_std_att_error.err)
        }

        console.log(get_lecture_attendance_loading, "   is the loading of list")
        return (
            <View style={styles.MainContainer}>
                <Button title='Refresh' onPress={() => this._getLectureAttendance(this.props.navigation.state.params.lecture_id)} />
                <Button title={this._getTitleFromProp()} onPress={() => this._toggleStatus()} />
                <Button title='Submit attendance' onPress={() => this._confirmSubmitAttendance()} />
                <Text> {this._getAttendanceStatusMessageFromProp()} </Text>
                <Text> {this.state.attendance_count} / {this.state.all_student_count} </Text>
                {this.attendanceRender(attendance_list, get_lecture_attendance_loading)}
            </View>
        )
    }
}

const mapStateToProps = state => ({
    attendance_list: state.prof.attendanceList.lecture.att,
    attendance_status: state.prof.attendanceList.lecture.status,
    get_lecture_attendance_loading: state.prof.attendanceList.loading,
    get_lecture_attendance_error: state.prof.attendanceList.error,

    change_std_att_msg: state.prof.chngStuAtt.msg,
    change_std_att_error: state.prof.chngStuAtt.error,
    change_std_att_loading: state.prof.chngStuAtt.loading,

    submit_attendance_message: state.prof.submitAttendance.message,
    submit_attendance_error: state.prof.submitAttendance.error,
})

const mapDispatchToProps = {
    GetLectureAttendance,
    changeStudentAttendance,
    changeLectureAttendance,
    submitAttendance,
}
export default connect(mapStateToProps, mapDispatchToProps)(ProfAttendanceScreen)




////// StyleSheet for Courses Screen 
const styles = StyleSheet.create({
    MainContainer:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#EEEEEE',
    },
    PickerContainer:
    {
        marginRight: 0,
        marginLeft: 0,
    },
    ListContainer:
    {
        flex: 3,
        justifyContent: 'flex-start',
        backgroundColor: 'white'

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
});