import React from 'react'
import { View, Text } from 'react-native'

export const ErrorView = (props) => {
    console.error(props.logMessage)
    userMessage = props.userMessage || "can't load the screen"
    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: ''
        }}>
            <Image style={{
                flex: 1,
                resizeMode: 'stretch',
            }} source={require('../images/error_state2.jpg')} />
            <Text> {userMessage} </Text>
            {renderBtn(props.onRetry)}
        </View>
    )
}

function renderBtn(onRetry) {
    if (!onRetry) return null
    return <Button title='retry' onPress={onRetry} />
}

export default ErrorView