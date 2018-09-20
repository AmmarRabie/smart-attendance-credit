import {makeStudentAttend,checkAttendanceStatus }from './actions'
import React from '../../../AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/react'
import { AppRegistry,View, Text ,StyleSheet,Button} from 'react-native'
import { connect } from '../../../AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/react-redux'

export default class LectureAttendanceScreen extends React.Component{
    constructor(){
        super()
       /* this.state={
            isAttend:false,
            attendanceStatus:false //True means open ,false means closed
            }*/
    }
   componentWillMount(){
       attendanceStatus=this.props.checkAttendanceStatus(this.props.navigation.getParams('Lecture'))
   }
    checkStatus=()=>
    {
        this.setState({attendanceStatus:this.props.checkAttendanceStatus(this.props.navigation.getParams('Lecture'))})
    }

    takeStudentAttendance(){
        this.props.makeStudentAttend(this.props.navigation.getParams('stdId'),this.props.navigation.getParams('Lecture'))
    }
    render(){
        const studnetIsAttend=this.props.studnetIsAttend
        const studentAttendError=this.props.studentAttendError
        const studentAttendLoading=this.props.studentAttendLoading
        const statusIsOpen=this.props.statusIsOpen
        const statusError=this.props.statusError
        const statusLoading=this.props.statusLoading


        if(studentAttendError||statusError){
            return(
                <Image style={styles.Image} source={require('../../images/error_state.jpg')}>
                </Image>
            )
        }
        if(studentAttendLoading||statusLoading){
            return(
                <View style={styles.LoadingContainer}>
                <Text style={styles.headline}>  Loading... </Text>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
            )
        }
        return(
        <View style={styles.MainContainer}>
            <View style={styles.HorizontalContainer} >
            
            <Text>Attendance Status: </Text>
            <Text> {statusIsOpen}</Text>
            <Button 
            title="Check attendance!"
            onPress={()=>this.checkStatus()} />
            </View>
            <View style={styles.HorizontalContainer}>
            <Text> Attendance: {studnetIsAttend}</Text>
            <Button title='Take My Attendance' onPress={()=>makeStudentAttend()}></Button>
            
            </View>
        </View>
        )
    }

}


const mapStateToProps=state=>({
    studnetIsAttend:state.studentAttendance.isAttend,
    studentAttendError:state.studentAttendance.error,
    studentAttendLoading:state.studentAttendance.loading,
    statusIsOpen:state.studentAttendance.attendanceStatusOpen,
    statusError:state.studentAttendance.error,
    statusLoading:state.studentAttendance.loading
})
const mapDispatchToProps={
    makeStudentAttend,
    checkAttendanceStatus
}
const styles = StyleSheet.create({
    MainContainer:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#EEEEEE',
    }
    ,
    HorizontalContainer:{
        flex:1,
        flexDirection:'row'
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
