import React from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import {List, ListItem} from 'react-native-elements'

const LecturesList = props => {
  console.log('rendering lectures list')
  return (
    <ScrollView marginTop={props.marginTop || 20}>
      <List containerStyle={styles.ListContainer}>
        {props.list.map(l => (
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
                  <Text style={styles.ratingText}>
                    {' '}
                    attendance: {l.attendanceStatusOpen ? 'open' : 'closed'}{' '}
                  </Text>
                </View>
              </View>
            }
            onPress={() => props.onLectureClick(l.id)}
          />
        ))}
      </List>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  ListContainer: {
    flex: 3,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey',
  },
})

export default LecturesList
