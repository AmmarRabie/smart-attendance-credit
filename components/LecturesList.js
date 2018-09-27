import React from 'react'
import {  View, Text, StyleSheet,  ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'

class LecturesList extends React.Component {
 
    constructor(props)
    {
        super(props)
    }
    static defaultProps = {
        marginTop: 20,
    }

    itemClick(){

    }

    render()
    {
    console.log('rendering lectures list')
       return(
       <ScrollView marginTop = {this.props.marginTop} >
            <List containerStyle={styles.ListContainer}>
                {
                    this.props.list.map((l) => (
                        <ListItem
                            roundAvatar
                            avatar={require('../images/university.png')}
                            title={l.time_created}
                            key={l.id}
                            subtitle={
                                <View>
                                    <View style={styles.subtitleView}>
                                        <Text style={styles.ratingText}> schedule id: {l.schedule_id}</Text>
                                    </View>
                                    <View style={styles.subtitleView}>
                                        <Text style={styles.ratingText}> attendance: {l.attendanceStatusOpen ? 'open': 'closed'} </Text>
                                    </View>
                                </View>
                            }
                            onPress={() => this.props.onLectureClick(l.id)}
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

export default LecturesList