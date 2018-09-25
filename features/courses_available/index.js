import React from 'react'
import { Image, ActivityIndicator, View, Text, StyleSheet, Alert, Picker } from 'react-native'
import { Icon, Card, Button } from 'react-native-elements'

import { connect } from 'react-redux'
import { GetCodes, GetWantedSchedules, openNewLecture } from './actinos'
import SchedulesList from '../../components/SchedulesList'


class CoursesScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            code_holder: '',
            tutorial_type_holder: 'Lecture',
            tutorials_types_list: [
                { type: 'Lecture' },
                { type: 'Tutorial' }
            ],
        }
    }

    // fetch the codes before the screen show ups
    componentWillMount() {
        this._getcodes();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.codes[0] && this.state.code_holder === '') {
            const firstCode = (nextProps.codes)[0]
            console.log('componentWillReceiveProps with prop.codes[0]=', firstCode)
            this.setState({ code_holder: (nextProps.codes)[0] })
            this._getSchedules(firstCode)
        }
    }

    // function that updates the value of the picker
    UpdateSelectedCode = (itemValue, itemIndex) => {
        this.setState({ code_holder: itemValue })
        // if (itemIndex === 0) {
        //     this.setState({ code_holder: '' })
        // }
        // else {
        // }
    }
    // function that updates the value of the picker

    UpdateSelectedTurorialType = (itemValue, itemIndex) => {
        this.setState({ tutorial_type_holder: itemValue })
    }

    // to render codes list 
    loadcodes(codes) {
        return codes.map((code, index) => (
            <Picker.Item label={code} value={code} key={index} />
        ))
    }

    // to render session types
    loadTutorialsTypes() {
        return this.state.tutorials_types_list.map((tutorial, index) => (
            <Picker.Item label={tutorial.type} value={tutorial.type} key={index} />
        ))
    }
    _getcodes = () => {
        this.props.GetCodes()
    }
    _openNewLecture = (scheduleID) => {
        this.props.openNewLecture(scheduleID)
    }

    _getSchedules = (code = undefined, type = undefined) => {
        const _type = type || this.state.tutorial_type_holder
        const _code = code || this.state.code_holder
        console.log('_getSchedules with code=', _code)
        if (_code === '' || _type === '') return // avoid fake action with no code to happen
        this.props.GetWantedSchedules(_type, _code)
    }


    // ********** To Render the Schedules List ****************
    // There is three cases 
    // 1- there is error happend while fetching ( not handled in this function (handled in the main render function))
    // 2- schedules still loading
    // 3- schedules list empty
    // 4- schedules list have some elements
    schedulesRender(schedules, schedules_loading) {
        if (schedules_loading) {
            return (
                <View style={styles.LoadingContainer}>
                    <Text style={styles.headline}>  Loading... </Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        else if (schedules.length === 0) {
            return (
                <Image style={styles.Image} source={require('../../images/no_results_found.png')}>
                </Image>
            )
        }
        else {
            return (
                <SchedulesList marginTop={20} list={this.props.schedules} onSchedulePress={this._openNewLecture} />
            )
        }
    }

    // the main render function 
    render() {
        console.log('[function invoking]: render called from ', 'courses-available screen')

        const codes = this.props.codes;
        const codes_loading = this.props.codes_loading;
        const codes_error = this.props.codes_error;
        const schedules = this.props.schedules;
        const schedules_loading = this.props.schedules_loading;
        const schedules_error = this.props.schedules_error;

        const lecture_id = this.props.lecture_id
        const new_lecture_loading = this.props.new_lecture_loading
        const new_lecture_error = this.props.new_lecture_error

        //console.log("schedules = ", schedules, "loading =", schedules_loading, " error =", schedules_error)
        //console.log("codes = ", codes, "loading =", codes_loading, "error =", codes_error)
        //console.log("lecture_id = ", lecture_id, "new_lecture_loading =", new_lecture_loading, "new_lecture_error =", new_lecture_error)
        //console.log(lecture_id && !new_lecture_loading && !new_lecture_error)

        if (lecture_id&&!new_lecture_loading&&!new_lecture_error)  // if new lectue are opened go to its screen 
        {
            this.props.navigation.navigate('ProfSession',{lecture_id:lecture_id})
        }

        if (new_lecture_error)
        {
            Alert.alert('Error !!!', "there is something went wrong during the creation of the lecture", [
                { text: 'Ok' }])
        }
        if (codes_error || schedules_error) {
            console.log(`codes_error=${codes_error}, schedules_error=${schedules_error}`)
            return (
                <Image style={styles.Image} source={require('../../images/error_state.jpg')}>
                </Image>
            )
        }
        if (codes_loading || new_lecture_loading) {
            return (
                <View style={styles.LoadingContainer}>
                    <Text style={styles.headline}>  Loading... </Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }

        return (
            <View style={styles.MainContainer}>

                <Card containerStyle={styles.PickerContainer} >
                    <Picker
                        selectedValue={this.state.code_holder}
                        onValueChange={this.UpdateSelectedCode} >
                        {this.loadcodes(codes)}
                    </Picker>

                    <Picker
                        selectedValue={this.state.tutorial_type_holder}
                        onValueChange={this.UpdateSelectedTurorialType} >
                        {this.loadTutorialsTypes()}
                    </Picker>

                    <Button style={styles.button}
                        title='BUTTON WITH ICON COMPONENT'
                        onPress={() => this._getSchedules()}
                    />
                </Card>

                {this.schedulesRender(schedules, schedules_loading)}
            </View>
        )
    }
}

/// for every asyncronous action there is three variable
// 1- the result of the action 
//2- flag indicates error 
//3- flag indicates the action is running or not

const mapStateToProps = state => ({
    codes: state.codes.codes,
    codes_loading: state.codes.loading,
    codes_error: state.codes.error,

    schedules: state.schedules.schedules.map(schedule => ({ ...schedule, key: schedule.scheduleID })),
    schedules_loading: state.schedules.loading,
    schedules_error: state.schedules.error,

    lecture_id: state.openNewLec.lectureId,
    new_lecture_loading: state.openNewLec.loading,
    new_lecture_error: state.openNewLec.error
})

const mapDispatchToProps = {
    GetCodes,
    GetWantedSchedules,
    openNewLecture
}
export default connect(mapStateToProps, mapDispatchToProps)(CoursesScreen)
//////////////////////////////////////////////////////////////////////////////////////////////

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
    },
     button:{
         paddingTop: 20,
         paddingBottom: 20,
         textAlign: 'center',
         borderRadius: 10,
         borderWidth: 1,
         borderColor: '#fff'
    }
});