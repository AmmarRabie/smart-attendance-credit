import React from 'react'
import {StyleSheet, Image} from 'react-native'
import {List, ListItem, CheckBox, Left, Right, Text} from 'native-base'

class AttendanceList extends React.Component {
  static defaultProps = {
    marginTop: 20,
  }

  state = {
    attendanceList: this.props.list,
    count: 0,
  }

  onCheckBoxPressed = (studentId, index) => {
    const list = this.state.attendanceList.slice() // creates the clone of the state
    list[index].attend = !list[index].attend
    this.props.onAttendanceChange(studentId, list[index].attend)
    this.setState({attendanceList: list})

    // update the new count and notify
    const incrementValue = list[index].attend ? 1 : -1
    this.setState(prevState => ({count: prevState.count + incrementValue}))
    this.props.onCountChange(this.state.count + incrementValue)
  }

  checkedIcon = () => <Image source={require('../images/checked.png')} />

  unCheckedIcon = () => <Image source={require('../images/unchecked.jpg')} />

  componentDidMount() {
    const count = this.props.list.reduce((acc, item) => (item.attend ? acc + 1 : acc), 0)
    this.setState({count})
    this.props.onCountChange(count)
  }

  render() {
    return (
      <List containerStyle={styles.ListContainer}>
        {this.state.attendanceList.map((l, index) => (
          <ListAttendanceItem
            key={l.id}
            name={l.name}
            index={index}
            attend={l.attend}
            id={l.id}
            onCheckBoxPressed={this.onCheckBoxPressed}
          />
        ))}
      </List>
    )
  }
}

class ListAttendanceItem extends React.Component {
  state = {
    attend: this.props.attend,
  }

  componentWillReceiveProps(nextProps) {
    const {attend} = nextProps

    this.setState({
      attend,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const newAttend = nextState.attend
    const oldAttend = this.state.attend
    return newAttend !== oldAttend
  }

  render() {
    return (
      <ListItem noIndent key={this.props.index}>
        <Left style={{flex: 0}}>
          <CheckBox
            checked={this.state.attend}
            onPress={() => this.props.onCheckBoxPressed(this.props.id, this.props.index)}
          />
        </Left>
        <Right style={{flex: 1}}>
          <Text> {this.props.name} </Text>
        </Right>
      </ListItem>
    )
  }
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

export default AttendanceList
