import React from 'react'
import {  View, Text, StyleSheet,  ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'

class SchedulesList extends React.Component {
 
    constructor(props)
    {
        super(props)
    }
    static defaultProps = {
        marginTop: 20,
    }
    render()
    {
       return(
       <ScrollView marginTop = {this.props.marginTop} >
            <List containerStyle={styles.ListContainer}>
                {
                    this.props.list.map((l) => (
                        <ListItem
                            roundAvatar
                            avatar={require('../images/university.png')}
                            title={l.Name}
                            key={l.key}
                            subtitle={
                                <View>
                                    <View style={styles.subtitleView}>
                                        <Text style={styles.ratingText}> Code: {l.Code} </Text>
                                        <Text style={styles.ratingText}> Location: {l.Location}</Text>
                                    </View>
                                    <View style={styles.subtitleView}>
                                        <Text style={styles.ratingText}> Day: {l.DayName} </Text>
                                        <Text style={styles.ratingText}> Start: {l.BeginTime}</Text>
                                        <Text style={styles.ratingText}> end: {l.EndTime}</Text>
                                    </View>
                                    <View style={styles.subtitleView}>
                                        <Text style={styles.ratingText}> Session Type: {l.SessionType} </Text>
                                    </View>
                                </View>
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


export default SchedulesList