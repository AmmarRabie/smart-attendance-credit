import React from 'react'
import {Image, ActivityIndicator, View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { GetOpenLectures ,makeStudentAttend} from './Actions'
import OpenLecturesList from '../../components/openLecturesList'
import OfflineNotice from '../../components/offlineComponent'


class OpenLecturesScreen extends React.Component {
    state = {
        
    }

    componentWillMount() {

        this._getLectures('1170406')

    }
    componentWillReceiveProps(nextProps) {
    //   console.log(nextProps.studentOpenLectures.lecture.id)  
        if (nextProps.studentOpenLectures && nextProps.studentOpenLectures.length === 1)
    {  console.log('receive props')
                    this.props.navigation.navigate('lectureAttendance', { Lecture: nextProps.studentOpenLectures[0].id, stdId: '11170406' })

    }    
}
     _getLectures = (studentId) => {
         this.props.GetOpenLectures(studentId)
    }
    navigateFunction(id) {
        console.log(id)
        this.props.navigation.navigate('lectureAttendance', { Lecture: id, stdId: '1170406' })
    }
    openLecturesRender(openLectures, Loading) {
    console.log(`open Lectures Renderer  ${openLectures}`)
        if (Loading) {
            return (
                <View style={styles.LoadingContainer}>
                    <Text style={styles.headline}>  Loading... </Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        else if (openLectures.length === 0) {
            return (
                <Image style={styles.Image} source={require('../../images/no_results_found.png')}>
                </Image>
            )
        }
        else {
            return (
                <OpenLecturesList marginTop={20} list={openLectures } onItemClick={(id)=>this.navigateFunction(id)}  />
            )
        }
    }


    render() {
        const Lectures = this.props.studentOpenLectures
        const openLecturesError = this.props.studentOpenLecturesError
        const openLecturesLoading = this.props.studentOpenLecturesLoading
        if (openLecturesError) {
            console.warn(openLecturesError)
            return (
                <Image style={styles.Image} source={require('../../images/error_state.jpg')}>
                </Image>
            )
        }

        return (
            <View style={styles.MainContainer}>
                <OfflineNotice style={{ height:100}}/>
                {this.openLecturesRender(Lectures, openLecturesLoading)}
            </View>
        )
    }


}
const mapStateToProps = state => ({
    studentOpenLectures: state.openLectures.Lectures,
    studentOpenLecturesLoading: state.openLectures.loading,
    studentOpenLecturesError: state.openLectures.error

})
const mapDispatchToProps = {
    GetOpenLectures,
    makeStudentAttend

}

export default connect(mapStateToProps, mapDispatchToProps)(OpenLecturesScreen)
////// StyleSheet for Courses Screen 
const styles = StyleSheet.create({
    MainContainer:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#EEEEEE',
        //alignSelf:'baseline',
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
