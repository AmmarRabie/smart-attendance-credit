import React from 'react'
import { Image, ActivityIndicator, View, Text, StyleSheet, Alert } from 'react-native'
import { connect } from 'react-redux'
import AttendaceList from '../../components/AttendanceList'
import { GetLectureAttendance, changeStudentAttendance } from './actions'

class ProfAttendanceScreen extends React.Component {
    constructor(){
        super();
    }
    _getLectureAttendance = (lecture_id) => {
        this.props.GetLectureAttendance(lecture_id)
    }

    _changeStdAttendance = (lecture_id,student_id,attendance) => {
        this.props.changeStudentAttendance(lecture_id, student_id, attendance)
    }
    componentWillMount() {
        this._getLectureAttendance(2);
    }

    alert = (title,msg)=>
    {
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
                <AttendaceList
                 marginTop={20} 
                 list={attendancelist} 
                 lecture_id={2}
                 onAttendanceChange={this._changeStdAttendance} 
                 />
            )
        }
    }
    render() {
        
        const attendance_list=this.props.attendance_list
        const get_lecture_attendance_loading = this.props.get_lecture_attendance_loading
        const get_lecture_attendance_error = this.props.get_lecture_attendance_error

        const change_std_att_msg       =this.props.change_std_att_msg
        const change_std_att_error     =this.props.change_std_att_error       
        const change_std_att_loading      =this.props.change_std_att_loading

        console.log("item loading", change_std_att_loading)

        if (change_std_att_msg)
        {
            this.alert('Successful', change_std_att_msg.mes)
        }
        else if (change_std_att_error)
        {
            this.alert('Error !!!', change_std_att_error.err)
        }
        console.log(get_lecture_attendance_loading,"   is the loading of list")
        //console.log('the list is  -------------->')
        //console.log(attendance_list)
        return (
            <View style={styles.MainContainer}>
                {this.attendanceRender(attendance_list, get_lecture_attendance_loading)}
            </View>
        )
    }
}

const mapStateToProps = state => ({
    attendance_list: state.prof.attendanceList.attendanceList,
    get_lecture_attendance_loading: state.prof.attendanceList.loading,
    get_lecture_attendance_error: state.prof.attendanceList.error,

    change_std_att_msg: state.prof.chngStuAtt.msg,
    change_std_att_error: state.prof.chngStuAtt.error,
    change_std_att_loading: state.prof.chngStuAtt.loading
})

const mapDispatchToProps = {
    GetLectureAttendance,
    changeStudentAttendance
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