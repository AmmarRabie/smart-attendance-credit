import React from '../../../AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/react'
import { View, Text ,FlatList,StyleSheet} from 'react-native'
import { connect } from '../../../AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/react-redux'
import {GetOpenLectures} from './Actions'
import {openLecturesList} from '../../components/openLecturesList'


export default class OpenLecturesScreen extends React.Component {
    constructor(){
        super()

    }
  
componentWillMount(){
   this._getLectures(this.props.navigation.getParams('stdId'))
}
componentWillReceiveProps(nextProps){
    if(this.props.studentOpenLectures.length===1)
    this.props.navigation.navigate(lectureAttendance,{Lecture:this.state.Lectures.lectureId,stdId:this.props.navigation.getParams('stdId')})
    
}



_getLectures=(studentId)=>{
    Lectures=this.props.GetOpenLectures(studentId)    
}
navigateFunction(id){
    this.state.navigation.navigate(lectureAttendance,{Lecture:id,stdId:this.props.navigation.getParams('stdId')})
}
openLecturesRender(openLectures,Loading){
    if(Loading){
        return (
            <View style={styles.LoadingContainer}>
                <Text style={styles.headline}>  Loading... </Text>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
    else if(openLectures.length===0){
        return (
            <Image style={styles.Image} source={require('../../images/no_results_found.png')}>
            </Image>
        )
    }
    else{
        return(
            <openLecturesList marginTop={20} list={this.props.schedules} onItemClick={this.navigateFunction(id)} />
        )
    }
}


render(){
    const Lectures=this.props.studentOpenLectures,
    const openLecturesError=this.props.studentOpenLecturesError,
    const openLecturesLoading=this.props.studentOpenLecturesLoading
    if (openLecturesError){
        return (
            <Image style={styles.Image} source={require('../../images/error_state.jpg')}>
            </Image>
        )
    }
  
    return(
    <View style={styles.MainContainer}>
        {this.openLecturesRender(Lectures,openLecturesLoading)}
    </View>    
    )
}

    
}
const mapStateToProps=state=>({
    studentOpenLectures:state.openLectures.Lectures,
    studentOpenLecturesLoading:state.openLectures.loading,
    studentOpenLecturesError:state.openLectures.error

})
const mapDispatchToProps={
    GetOpenLectures,
    makeStudentAttend

}
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
