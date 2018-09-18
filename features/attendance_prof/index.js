import React from 'react'
import { Image, ActivityIndicator, View, Text, StyleSheet, } from 'react-native'
import { Icon, Card, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import AttendaceList from '../../components/AttendanceList'
import { GetLectureAttendance } from './actions'

class ProfAttendanceScreen extends React.Component {
    constructor(){
        super();
    }
    _getLectureAttendance = (lecture_id) => {
        this.props.GetLectureAttendance(lecture_id)
    }

    componentWillMount() {
        this._getLectureAttendance(2);
    }

    attendanceRender(attendancelist, loading) {
        if (loading) {
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
                <AttendaceList marginTop={20} list={attendancelist} />
            )
        }
    }
    render() {
        
        const attendance_list=this.props.attendance_list
        const get_lecture_attendance_loading = this.props.get_lecture_attendance_loading

        console.log(get_lecture_attendance_loading,"   is the loading")
        console.log('the list is  -------------->')
        console.log(attendance_list)
        return (
            <View style={styles.MainContainer}>
                {this.attendanceRender(attendance_list, get_lecture_attendance_loading)}
            </View>
        )
    }
}

const mapStateToProps = state => ({
    attendance_list: state.prof.attendanceList,
    get_lecture_attendance_loading: state.prof.loading,
    get_lecture_attendance_error: state.prof.error,
})

const mapDispatchToProps = {
    GetLectureAttendance,
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