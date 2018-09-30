import React from 'react'
import { Image, ActivityIndicator, View, Text, StyleSheet, Alert, Picker ,Button } from 'react-native'
import {  Card,  } from 'react-native-elements'

import { connect } from 'react-redux'
import { GetCodes, GetWantedSchedules, openNewLecture } from './actinos'
import SchedulesList from '../../components/SchedulesList'
import AppLoadingIndicator from '../../components/AppLoadingIndicator';
import {Constants} from 'expo'
import { Container, Header, Body, Right, Button as ButtonNativeBase, Title, Icon as IconNativeBase, Content, Text as TextNativeBase} from 'native-base';


class CoursesScreen extends React.Component {

    static navigationOptions = {
        title: 'Courses',
    };

    state = {
        code_holder: '',
        tutorial_type_holder: 'Lecture',
        tutorials_types_list: [
            { type: 'Lecture' },
            { type: 'Tutorial' }
        ],
    }

    // fetch the codes before the screen show ups
    componentWillMount() {
        this._getcodes();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.codes[0] && this.state.code_holder === '') {
            const firstCode = (nextProps.codes)[0]
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

    _openMyLectures = () => {
        this.props.navigation.navigate('MyLectures')
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

        console.log("codes error ",codes_error," codes", codes, " loading", codes_loading)
        if (lecture_id && !new_lecture_loading && !new_lecture_error)  // if new lectue are opened go to its screen 
        {
            this.props.navigation.navigate('ProfSession', { lecture_id: lecture_id })
        }

        if (new_lecture_error) {
            Alert.alert('Error !!!', "there is something went wrong during the creation of the lecture", [
                { text: 'Ok' }])
        }
        if (codes_error || schedules_error) {
            console.log(`coderrorView userMessage="can't loads_error=${codes_error}, schedules_error=${schedules_error}`)
            Alert.alert('Error !!!', "can't load proper data", [
                { text: 'ok',onPress: () => this._getcodes() }])
            
        }
        if (codes_loading || new_lecture_loading) {
            return (<AppLoadingIndicator />)
        }

        return (
            <Container >
                <View style={styles.statusBar} />
                <Header >
                    <Body>
                        <Title>Lecture Attendance</Title>
                    </Body>
                    <Right>
                        <ButtonNativeBase onPress={this._openMyLectures}>
                            {/* <IconNativeBase name='dots-vertical' type='MaterialCommunityIcons' /> */}
                            <TextNativeBase> my lectures</TextNativeBase>
                        </ButtonNativeBase>
                    </Right>
                </Header>
                <Content >
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

                            <Button style={styles.ButtonStyle}
                                title='Search'
                                onPress={() => this._getSchedules()}
                            />
                        </Card>

                        {this.schedulesRender(schedules, schedules_loading)}
                    </View>
                </Content>

            </Container>


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
    ButtonStyle:{
        borderRadius: 20,
        textAlign: "center",
        marginLeft: 45,
        marginRight: 45,
        marginTop: 20,
        marginBottom: 20,
        paddingTop: 9,
        paddingBottom: 9,
        paddingLeft: 9,
        paddingRight: 9,
        backgroundColor: 'darkblue'
    }
    ,MainContainer:
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
     statusBar: {
        backgroundColor: "#000000",
        height: Constants.statusBarHeight,
    },
});