import React from 'react'
import {View, Text, NetInfo, Dimensions, StyleSheet} from 'react-native'

const {width} = Dimensions.get('window')
function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  )
}

export default class OfflineNotice extends React.PureComponent {
  state = {
    isConnected: true,
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange)
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange)
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({isConnected})
    } else {
      this.setState({isConnected})
    }
  }

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />
    }
    return null
  }
}
const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 30,
  },
  offlineText: {
    color: '#fff',
  },
})
