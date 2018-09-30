import React from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { Card, Button } from 'react-native-elements'

import { connect } from 'react-redux'
import { fetchLectures } from './actions'
import LecturesList from '../../components/LecturesList'
import AppLoadingIndicator from '../../components/AppLoadingIndicator';
import lecturesLinker from './linker'
import { Constants } from 'expo';



class ProfLecturesScreen extends React.Component {

    componentWillMount() {
        this._getLectures();
    }

    _getLectures = () => {
        // this.props.fetchLectures(this.props.navigation.getParam('prof_id'))
        this.props.fetchLectures('2')
    }

    lecturesRender(lectures) {
        console.log('lecturesRender with lectures: ')
        console.log(lectures)
        if (lectures === undefined) return
        if (lectures.length === 0) {
            return (
                <Image style={styles.Image} source={require('../../images/no_results_found.png')} />
            )
        }
        return (
            <LecturesList marginTop={20} list={lectures} onLectureClick={(id)=> this.props.navigation.navigate('',)}/>
        )

    }

    // the main render function 
    render() {
        console.log('[function invoking]: render called from ', 'ProfLectures screen')

        if (this.props.error) {
            console.log('error happened: ', this.props.error)
            return (
                <view>
                    <View style={styles.statusBar} />
                    <Image style={styles.Image} source={require('../../images/error_state.jpg')} />
                </view>
            )
        }
        if (this.props.isLoading)
            return <AppLoadingIndicator style={styles.LoadingContainer} />

        return (
            <View style={styles.MainContainer}>
                <View style={styles.statusBar} />
                <Card containerStyle={styles.PickerContainer} >
                    <Button
                        title='Refresh'
                        onPress={() => this._getLectures()}
                    />
                </Card>
                {this.lecturesRender(this.props.lectures)}
            </View>
        )
    }
}

const mapStateToProps = state => ({
    lectures: state.lectures.list, // lecturesLinker(state.lectures.list)
    isLoading: state.lectures.loading,
    error: state.lectures.error,
})

const mapDispatchToProps = {
    fetchLectures,
}
export default connect(mapStateToProps, mapDispatchToProps)(ProfLecturesScreen)
//////////////////////////////////////////////////////////////////////////////////////////////



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
    LoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'whitesmoke'
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