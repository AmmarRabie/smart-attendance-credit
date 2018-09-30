import React from 'react'
import { Text, Switch, Icon, Toast, Container, Header, Right, Left, Body, Title, Content, Button, Footer, FooterTab, ActionSheet } from 'native-base'
import { Image, ActivityIndicator, View, StyleSheet, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Card,Divider } from 'react-native-elements'

import AttendanceList from '../../components/AttendanceList'
import { GetLectureAttendance, changeStudentAttendance, changeLectureAttendance, submitAttendance } from './actions'
import { ErrorView } from '../../components/ErrorView';
import { Constants } from 'expo';


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
        this.props.changeLectureAttendance(this.props.navigation.getParam('lecture_id'), !currStatus)
    }

    _onOpenActionMenu = () => {
        const BUTTONS = ["Refresh list", this._getTitleFromProp(), "Submit the attendance", "Cancel"];
        const DESTRUCTIVE_INDEX = 2;
        const CANCEL_INDEX = 3;
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,
                title: "What do you want ?",
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        this._getLectureAttendance(2)
                        break
                    case 1:
                        this._toggleStatus()
                        break
                    case 2:
                        this._confirmSubmitAttendance()
                        break
                }
                this.setState({ clicked: BUTTONS[buttonIndex] });
            }
        )
    }

    _changeStdAttendance = (student_id, attendance) => {
        lecture_id = this.props.navigation.getParam('lecture_id')
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
            { text: 'submit', onPress: () => this._submitAttendance() },
            { text: 'cancel' },],
            { cancelable: false })
    }

    _submitAttendance() {
        lecture_id = this.props.navigation.getParam('lecture_id');

        this.props.submitAttendance(lecture_id)
    }

    componentWillMount() {
        lecture_id = this.props.navigation.getParam('lecture_id') //this.props.navigation.state.params.lecture_id;
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

        const change_std_att_msg = nextProps.change_std_att_msg
        const change_std_att_error = nextProps.change_std_att_error
        if (change_std_att_msg) {
            Toast.show({
                text: 'attendance changed successfully',
                type: 'success'
            })
        }
        else if (change_std_att_error) {
            Toast.show({
                text: "attendance doesn't change, try re-attend again or refresh",
                type: 'warning',
            })
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

    attendanceRender(attendance_list, attendance_list_loading) {
        if (!attendance_list)
            return;
        if (attendance_list_loading) {
            return (
                <View style={styles.LoadingContainer}>
                    <Text style={styles.headline}>  Loading... </Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        else if (attendance_list.length === 0) {
            return (
                <Image style={styles.Image} source={require('../../images/no_results_found.png')}>
                </Image>
            )
        }
        else {
            return (
                <AttendanceList
                    marginTop={20}
                    list={attendance_list}
                    onAttendanceChange={(stdId, attend) => this._changeStdAttendance(stdId, attend)}
                    onCountChange={(newCount) => this._updateCount(newCount)}
                />
            )
        }
    }

    render() {

        const attendance_list = this.props.attendance_list
        const get_lecture_attendance_loading = this.props.get_lecture_attendance_loading
        const get_lecture_attendance_error = this.props.get_lecture_attendance_error

        if (get_lecture_attendance_error) {
            return <ErrorView logMessage={get_lecture_attendance_error} userMessage="can't get the lecture data"
                onRetry={() => this._getLectureAttendance(this.props.navigation.getParam('lecture_id'))} />
        }

        return (
            <Container>
                <View style={styles.statusBar} />
                <Header>
                    <Body>
                        <Title>Lecture Attendance</Title>
                    </Body>
                    <Right>
                        <Button onPress={this._onOpenActionMenu}>
                            <Icon name='dots-vertical' type='MaterialCommunityIcons' />
                        </Button>
                    </Right>
                </Header>
                <Content padder>
                    <Text style={{ fontSize: 50, color: 'red', textAlign: 'center' }}> {this.state.attendance_count} / {this.state.all_student_count} </Text>
                    <Divider style={styles.divider} />
                    <Text style= {{textAlign: 'center',}}> {this._getAttendanceStatusMessageFromProp()} </Text>
                    <Divider style={styles.divider} />
                    {this.attendanceRender(attendance_list, get_lecture_attendance_loading)}
                </Content>
            </Container>
            // <View style={styles.MainContainer}>
            //     <Text style={{ fontSize: 50, color: 'red', textAlign: 'center' }}> {this.state.attendance_count} / {this.state.all_student_count} </Text>
            //     <Button title='Refresh' onPress={() => this._getLectureAttendance('2')} />
            //     <Button title={this._getTitleFromProp()} onPress={() => this._toggleStatus()} />
            //     <Button title='Submit attendance' onPress={() => this._confirmSubmitAttendance()} />
            //     <Text> {this._getAttendanceStatusMessageFromProp()} </Text>
            //     {/* {this.attendanceRender(attendance_list, get_lecture_attendance_loading)} */}
            // </View>
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
    LoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'whitesmoke'
    },
    divider:
    {
      marginTop:10,
      marginBottom:10,
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
    },
    statusBar: {
        backgroundColor: "#000000",
        height: Constants.statusBarHeight,
    },
});