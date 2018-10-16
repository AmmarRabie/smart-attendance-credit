import React from 'react'
import {Left, Icon, Input, Item, Body, ListItem, Right, Text} from 'native-base'

export default class SecretComponent extends React.Component {
  state = {
    secret: this.props.initial || '00000',
    change: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initial) {
      this.setState({secret: nextProps.initial, change: false})
    }
  }

  render() {
    return (
      <ListItem icon>
        <Left>
          <Text>Secret:</Text>
        </Left>
        <Body style={{borderBottomColor: 'transparent'}}>
          <Item rounded disabled={!this.state.change}>
            <Input
              disabled={!this.state.change}
              value={this.state.secret}
              style={{color: 'grey'}}
              onChangeText={text => this.setState({secret: text})}
            />
          </Item>
        </Body>
        <Right>
          <Text
            onPress={() => {
              if (this.state.change) {
                // save button clicked
                const mainMsg = this.state.secret
                this.props.onSecretChange(mainMsg)
              }
              this.setState(prevState => ({change: !prevState.change}))
            }}
          >
            <Icon name={this.state.change ? 'add' : 'swap'} />
            {this.state.change ? 'save' : 'change'}
          </Text>
        </Right>
      </ListItem>
    )
  }
}
