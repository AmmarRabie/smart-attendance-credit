import React from 'react'
import { StyleSheet, ScrollView, Image } from 'react-native'
import { List, ListItem ,CheckBox} from 'react-native-elements'

class AttendanceList extends React.Component {

    constructor(props) {
        super(props)
        this.state={
            attendanceList:this.props.list
        }
    }
    static defaultProps = {
        marginTop: 20,
    }
     onCheckBoxPressed=(student_id,index)=>
    {
         let list = this.state.attendanceList.slice(); //creates the clone of the state
         list[index].attend = !list[index].attend
         this.props.onAttendanceChange(this.props.lecture_id, student_id, list[index].attend);
         this.setState({ attendanceList: list });
    }

     checkedIcon =()=>
    {
        return(
            <Image source={require('../images/checked.png')}/>
        )
    }
    unCheckedIcon = () =>
    {
        return (
            <Image source={require('../images/unchecked.jpg')} />
        )
    }
    render() {

        //console.log(this.state.attendanceList)
        
        return (
            <ScrollView marginTop={this.props.marginTop} >
                <List containerStyle={styles.ListContainer} >
                    {
                        this.state.attendanceList.map((l,index) => (
                           /* <ListItem
                                roundAvatar
                                title={l.name}
                                key={index}
                                avatar={
                                    <CheckBox
                                        title=''
                                        checked={l.attend}
                                        onPress={() => this.onCheckBoxPressed(l.id,index)}
                                    />
                                }
                            />*/
                            <CustomAttendanceItem 
                            name={l.name}
                            index={index}
                            attend={l.attend}
                            id={l.id}
                            onCheckBoxPressed={this.onCheckBoxPressed}
                            />
                        ))
                    }
                </List>
            </ScrollView>
        )

    }

}

class CustomAttendanceItem extends React.Component {

    constructor(props) {
        super(props)
        this.state={
            attend:false
        }
    }
    componentWillReceiveProps(nextProps) {
        const {  attend, } = nextProps

        this.setState({
           attend,
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        const newAttend = nextState.attend
        const oldAttend = this.state.attend

        // If "liked" or "likeCount" is different, then update
        return newAttend !== oldAttend 
    }

    componentWillMount() {
        const { attend, } = this.props
       // console.log('in compinet will mount  ++ ', attend)

        this.setState({
            attend,
        })
    }



    render()
    {
        console.log(this.props.name)
        console.log(this.props.index)
        console.log(this.props.id)
        console.log(this.props.attend)
        return(
            <ListItem
                roundAvatar
                title={this.props.name}
                key={this.props.index}
                avatar={
                    <CheckBox
                        title=''
                        checked={this.state.attend}
                        onPress={() => this.props.onCheckBoxPressed(this.props.id, this.props.index)}
                    />
                }
            />
        )
    }
}

const styles = StyleSheet.create({
    ListContainer:
    {
        flex: 3,
        justifyContent: 'flex-start',
        backgroundColor: 'white'

    },
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5
    },
    ratingText: {
        paddingLeft: 10,
        color: 'grey'
    }
})





export default AttendanceList