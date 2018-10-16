import React from 'react'
import {Left, Icon, Input, Item, Body, ListItem} from 'native-base'

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
          <Icon
            name={this.state.change ? 'ios-add' : 'ios-appstore'}
            onPress={() => {
              if (this.state.change) {
                // save button clicked
                const mainMsg = this.state.secret
                this.props.onSecretChange(mainMsg)
              }
              this.setState(prevState => ({change: !prevState.change}))
            }}
          />
        </Left>
        <Body style={{borderBottomColor: 'transparent'}}>
          <Item disabled={!this.state.change}>
            <Input
              disabled={!this.state.change}
              value={`Secret: ${this.state.secret}`}
              onChangeText={text => this.setState({secret: text.slice(8, text.length)})}
            />
          </Item>
        </Body>
      </ListItem>
      // <Card>
      //   <Left>
      //     <Form>
      //       <Item disabled={!this.state.change}>
      //         <Input placeholder="Username" onChangeText={text => this.setState({ secret: text })} />
      //       </Item>
      //     </Form>
      //     <Text>Secret: {this.state.secret}</Text>
      //   </Left>
      //   <Right>
      //     <Button iconRight light>
      //       <Text>{this.state.change ? 'save' : 'change'}</Text>
      //       <Icon
      //         name={this.state.change ? 'ios-add' : 'ios-appstore'}
      //         onPress={() => {
      //           if (this.state.change) {
      //             // save button clicked
      //             this.props.onSecretChange(this.state.secret)
      //           }
      //           this.setState(prevState => ({ change: !prevState.change }))
      //         }}
      //       />
      //     </Button>
      //   </Right>
      // </Card>
    )
  }
}
