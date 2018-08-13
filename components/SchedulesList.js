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
                            key={l.name}
                            title={l.name}
                            subtitle={
                                <View>
                                    <View style={styles.subtitleView}>
                                        <Text style={styles.ratingText}> Code: 11111 </Text>
                                        <Text style={styles.ratingText}> Schedule ID:</Text>
                                    </View>
                                    <View style={styles.subtitleView}>
                                        <Text style={styles.ratingText}> Day: 11111 </Text>
                                        <Text style={styles.ratingText}> Start: 13</Text>
                                        <Text style={styles.ratingText}> end: 13</Text>
                                    </View>
                                    <View style={styles.subtitleView}>
                                        <Text style={styles.ratingText}> Session Type: Tutorials </Text>
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