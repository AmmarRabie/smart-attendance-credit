import React from 'react'
import { ActivityIndicator,View, Text, StyleSheet, Alert, Button, Picker } from 'react-native'
import { connect } from 'react-redux'
import { GetCodes } from './actinos'

class CoursesScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            CodeHolder: '',
        }
    }
    componentWillMount()
    {
        this._getcodes();
    }
    GetSelectedCode = () => {
        Alert.alert(this.state.CodeHolder);
    }
    UpdateSelectedCode = (itemValue, itemInde) => {
        this.setState({ CodeHolder: itemValue })
    }

    loadcodes(codes) {
        return codes.map((code, index) => (
            <Picker.Item label={code} value={code} key={index} />
        ))
    }
    _getcodes = async () => {
        this.props.GetCodes()
    }
    render() {
        const codes =this.props.codes;
        const loading= this.props.loading;
        const error = this.props.error;
        
        if (loading)
        {
             return (
                 <View style={styles.LoadingContainer}>
                     <Text style={styles.headline}>  Loading... </Text> 
                     <ActivityIndicator size="large" color="#0000ff" />  
                 </View>
                )
        }

        if (error) {
            return (
                <View style={styles.LoadingContainer}>
                    <Text style={styles.headline}>  Error !!!! </Text>
                    <Text style={styles.headline}>  {error} </Text>
                </View>
            )        }
        
        return (
            <View style={styles.MainContainer}>

                <Picker
                    selectedValue={this.state.CodeHolder}
                    onValueChange={this.UpdateSelectedCode} >

                    {this.loadcodes(codes)}

                </Picker>
                <Button title="Get Selected Picker Value" onPress={this.GetSelectedCode} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        margin: 20

    },
     LoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems:'center'
     },
    headline: {
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 0,
        width: 200,
        textAlignVertical: "center"
    }
});

const mapStateToProps = state => ({
    codes: state.codes.codes,
    loading: state.codes.loading,
    error: state.codes.error
})

export default connect(mapStateToProps, { GetCodes })(CoursesScreen)
///////////////////////////////////////////////////////////////////