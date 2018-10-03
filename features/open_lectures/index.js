import React from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { GetOpenLectures, makeStudentAttend } from './Actions'
import OpenLecturesList from '../../components/openLecturesList'
import OfflineNotice from '../../components/offlineComponent'
import { Constants } from 'expo';
import AppLoadingIndicator from '../../components/AppLoadingIndicator';
import { ErrorView } from '../../components/ErrorView';
import EmptyResultView from '../../components/EmptyResultView';
import { Container, Body, Title, Right, Button, Content, Header, Icon } from 'native-base';



class OpenLecturesScreen extends React.Component {
    state = {

    }

    componentWillMount() {
        console.log('open lectures screen will mount')
        this._getLectures('1170406')

    }
    componentWillReceiveProps(nextProps) {
        //   console.log(nextProps.studentOpenLectures.lecture.id)  
        if (nextProps.studentOpenLectures && nextProps.studentOpenLectures.length === 1) {
            const id = nextProps.studentOpenLectures[0].id
            const name = nextProps.studentOpenLectures[0].Course_Name
            this.navigateFunction(id, name)
        }
    }

    _getLectures = () => {
        this.props.GetOpenLectures()
    }

    navigateFunction(id, name) {
        this.props.navigation.navigate('lectureAttendance', { Lecture: id, course_name: name })
    }

    openLecturesRender(openLectures, loading, error) {
        if (loading) return <AppLoadingIndicator />
        if (error) return <ErrorView onRetry={this._getLectures} />
        if (openLectures.length === 0) return <EmptyResultView onRefresh={this._getLectures} userMessage={'you have no available lectures, my be the attendance is still closed'} />

        return <OpenLecturesList
            marginTop={20}
            list={openLectures}
            onItemClick={(id, name) => this.navigateFunction(id, name)} />
    }


    render() {
        const Lectures = this.props.studentOpenLectures
        const openLecturesError = this.props.studentOpenLecturesError
        const openLecturesLoading = this.props.studentOpenLecturesLoading

        return (
            <Container>
                <View style={styles.statusBar} />
                <Header>
                    <Body>
                        <Title>Available Lectures</Title>
                    </Body>
                    <Right>
                        <Button onPress={this._getLectures}>
                            <Icon name='refresh' type='MaterialCommunityIcons' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    {/* <OfflineNotice style={{ height: 100 }} /> */}
                    {this.openLecturesRender(Lectures, openLecturesLoading, openLecturesError)}

                </Content>
            </Container>
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
    },
    statusBar: {
        backgroundColor: "#000000",
        height: Constants.statusBarHeight,
    },
});
