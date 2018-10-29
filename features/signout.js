import Store from '../store'

const signOut = self => {
  Store.dispatch({type: 'SIGN_OUT'})
  self.props.navigation.navigate('Auth')
}

export default signOut
