import React from 'react'
import {StyleSheet, ScrollView} from 'react-native'
import {List, ListItem} from 'react-native-elements'

const OpenLecturesList = props => (
  <ScrollView marginTop={props.marginTop || 20}>
    <List containerStyle={styles.ListContainer}>
      {props.list.map(l => (
        <ListItem
          title={l.time_created}
          key={l.id}
          onPress={() => props.onItemClick(l.id, l.Course_Name)}
          subtitle={l.Course_Name}
        />
      ))}
    </List>
  </ScrollView>
)
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

export default OpenLecturesList
