import React from 'react'
import {View, Text, Image, Button} from 'react-native'

const EmptyResultView = props => (
  <View
    style={{
      flexDirection: 'column',
      flex: 10,
    }}
  >
    {renderUserMessage(props.userMessage)}
    {renderBtn(props.onRefresh)}
    <Image
      style={{
        resizeMode: 'stretch',
        width: undefined,
      }}
      source={require('../images/no_results_found.png')}
    />
  </View>
)

function renderBtn(onRefresh) {
  if (!onRefresh) return null
  return <Button title="refresh" onPress={onRefresh} />
}
function renderUserMessage(message) {
  if (!message) return null
  return <Text> {message} </Text>
}

export default EmptyResultView
