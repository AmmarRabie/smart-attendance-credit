import React from 'react'
import {  View, Text, StyleSheet,  ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'

export default class OpenLecturesList extends React.Component{
    constructor(props)
    {
        super(props)

    }
    static defaultProps = {
        marginTop: 20,
    }
    render()
    {
       return(
       <ScrollView marginTop = {this.props.marginTop} >
            <List containerStyle={styles.ListContainer}>
                {
                    this.props.list.map((l) => (
                        <ListItem
                            title={l.id}

                            onPress={()=>this.props.onItemClick(l.id)}

                            
                         
                           
                        />
                        
                    ))
                }
            </List>
        </ScrollView>
        )
       
    }
   
}
    const styles = StyleSheet.create({
        ListContainer:
        {
            flex: 3,
            justifyContent: 'flex-start',
            backgroundColor: 'white'
    
        },
        subtitleView: {
            flexDirection: 'row',
            paddingLeft: 10,
            paddingTop: 5
        },
        ratingText: {
            paddingLeft: 10,
            color: 'grey'
        }
    })
    
