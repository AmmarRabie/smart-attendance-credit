import React from 'react'
import { Image,ActivityIndicator,View, Text, StyleSheet, Alert, Picker } from 'react-native'
import { Icon, Card, Button } from 'react-native-elements'

import { connect } from 'react-redux'
import { GetCodes, GetWantedSchedules } from './actinos'
import  SchedulesList from '../../components/SchedulesList'


class CoursesScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            code_holder: '',
            tutorial_type_holder:'',
            tutorials_types_list:
            [
                    { type: 'Please select tutorial type' },{type:'Tutorial'},{type:'Lecture'}
            ],
             list :
            [
                {
                    name: 'Amy Farha',
                    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                    subtitle: 'Vice President'
                },
                {
                    name: 'Chris Jackson',
                    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                    subtitle: 'Vice Chairman'
                },
                 {
                         name: 'Chris Jacksocccn',
                         avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                         subtitle: 'Vice Chairman'
                },
                {
                         name: 'Chris Jackson,,,,,',
                         avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                         subtitle: 'Vice Chairman'
               },
                     {
                         name: 'Chris Jacksollllln',
                         avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                         subtitle: 'Vice Chairman'
                     },
                     {
                         name: 'Chris J,,,,ackson',
                         avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                         subtitle: 'Vice Chairman'
                     },

                     {
                         name: ';l;l;l;Chris Jackson',
                         avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                         subtitle: 'Vice Chairman'
                     },
                     {
                         name: ',,,,,,Chris Jackson',
                         avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                         subtitle: 'Vice Chairman'
                     },
            ]
        }
    }

    
    componentWillMount()
    {
        this._getcodes();
    }

    GetSelectedCode = () => {
        Alert.alert(this.state.code_holder);
    }
    UpdateSelectedCode = (itemValue, itemIndex) => {
        if (itemIndex===0)
        {
            this.setState({ code_holder: '' })
        }
        else
        {
        this.setState({ code_holder: itemValue })
        }
    }

    UpdateSelectedTurorialType = (itemValue, itemIndex) => {
        if (itemIndex===0)
        {
            this.setState({ tutorial_type_holder: '' })
            
        }
        else
        {
        this.setState({ tutorial_type_holder: itemValue })
        }
    }

    
    loadcodes(codes) {
        return codes.map((code, index) => (
            <Picker.Item label={code} value={code} key={index} />
        ))
    }
    loadTutorialsTypes ()
    {
        return this.state.tutorials_types_list.map((tutorial, index) => (
            <Picker.Item label={tutorial.type} value={tutorial.type} key={index} />
))
    }
    _getcodes = async () => {
        this.props.GetCodes()
    }

    _getSchedules = async () => {
        type=this.state.tutorial_type_holder
        code=this.state.code_holder
        if (code!==''&&type!=='')
        this.props.GetWantedSchedules(type,code)
    }

    schedulesRender(schedules,schedules_loading)
    {
         if (schedules_loading) {
            return (
                <View style={styles.LoadingContainer}>
                    <Text style={styles.headline}>  Loading... </Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        else if (schedules.length===0)
        {
            return (
                <Image style={styles.Image} source={require('../../images/no_results_found.png')}>
                </Image>
            )
        }
        else{
            return (
                <SchedulesList marginTop={20} list={this.state.list} />
            )
        }
    }
    
    render() {
        const codes =this.props.codes;
        const codes_loading= this.props.codes_loading;
        const codes_error = this.props.codes_error;
        const schedules=this.props.schedules;
        const schedules_loading = this.props.schedules_loading;
        const schedules_error = this.props.schedules_error;

        console.log("schedules = ",schedules, "loading =",schedules_loading," error =",schedules_error)
        console.log("codes = ", codes, "loading =", codes_loading, "error =", codes_error)

        if (codes_error||schedules_error) {
            // return (
            //     <View style={styles.LoadingContainer}>
            //         <Text style={styles.headline}>  Error !!!! </Text>
            //         <Text style={styles.headline}>  {String(codes_error)} </Text>
            //     </View>
            // )
            return (
                <Image style={styles.Image} source={require('../../images/error_state.jpg')}>
                </Image>
            )
        }
        if (codes_loading)
        {
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

                    <Button
                        icon={
                            <Icon
                                name='arrow-right'
                                size={15}
                                color='white'
                            />
                        }
                        title='BUTTON WITH ICON COMPONENT'
                        onPress={this._getSchedules}
                    />
                </Card>

                {this.schedulesRender(schedules,schedules_loading)}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    MainContainer: 
    {
        flex:1,
        flexDirection:'column',
        justifyContent: 'flex-start',
        backgroundColor: '#EEEEEE',
    },
    PickerContainer:
     {
        marginRight:0,
        marginLeft:0,
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
        alignItems:'center',
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

const mapStateToProps = state => ({
    codes: state.codes.codes,
    codes_loading: state.codes.loading,
    codes_error: state.codes.error,
    schedules: state.schedules.schedules,
    schedules_loading: state.schedules.loading,
    schedules_error: state.schedules.error,
})

const mapDispatchToProps = dispatch => {
    return {
        GetCodes: () => {
            dispatch(GetCodes())
        },
        GetWantedSchedules: (type, code) => {
            dispatch(GetWantedSchedules(code, type))
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps )(CoursesScreen)
///////////////////////////////////////////////////////////////////