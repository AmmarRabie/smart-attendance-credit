import React from 'react'
import {ActivityIndicator, View, Text, StyleSheet} from 'react-native'

const AppLoadingIndicator = props => (
  <View style={props.style || styles.DefaultLoadingContainer}>
    <Text style={styles.headline}> {props.text || 'Loading...'} </Text>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
)

// //// StyleSheet for Courses Screen
const styles = StyleSheet.create({
  DefaultLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
  },
  headline: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    width: 200,
    textAlignVertical: 'center',
  },
})

export default AppLoadingIndicator
