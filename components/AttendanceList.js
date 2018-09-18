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
     onCheckBoxPressed=(index)=>
    {
         let list = this.state.attendanceList.slice(); //creates the clone of the state
         list[index].attend = !list[index].attend
         console.log("in  pressed")
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

        console.log(this.state.attendanceList)
        return (
            <ScrollView marginTop={this.props.marginTop} >
                <List containerStyle={styles.ListContainer}>
                    {
                        this.state.attendanceList.map((l,index) => (
                            <ListItem
                                roundAvatar
                                title={l.name}
                                key={index}
                                avatar={
                                    <CheckBox
                                        title=''
                                        checked={l.attend}

                                        onPress={() => this.onCheckBoxPressed(index)}
                                    />
                                }
                            />
                        ))
                    }
                </List>
            </ScrollView>
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