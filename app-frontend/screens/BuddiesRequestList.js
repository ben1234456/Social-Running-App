import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Button } from 'native-base'
import profileImage from '../images/avatar.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class BuddiesRequestList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: "",
            userID:"",
        };
        const getData = async () => {

            //using localhost on IOS and using 10.0.2.2 on Android
            const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';

            try {
                const userJson = await AsyncStorage.getItem('@userJson')
                if (userJson !== null) {
                    const user = JSON.parse(userJson);
                    this.setState({
                        userID: user.id,
                    });
                }

            } catch (e) {
                console.log(e);
            }
            fetch(baseUrl + '/api/buddyReq/list/'+"1", {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log('Successfully get buddylist data')
                console.log(data)
                this.setState({
                    data: data
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            
            
        }
        
        getData();
    }
    renderItemComponent = (data) =>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('buddyRequestDetailScreen', { 'userID': data.item.id })}>
            <View style={styles.cardView}>
                <View style={styles.proRow}>
                    <View style={styles.proTitle}>
                        <Image style={styles.proColumnName} source={profileImage} />
                    </View>
                    <View style={{ marginLeft: 20, flex: 3 }}>
                        <Text style={styles.title}>{data.item.first_name}</Text>
                        <Text style={styles.date}>{data.item.gender}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.request}>
                    <Text>Buddies Request: </Text>
                    <Text style={styles.requestNo}>{this.state.data.length}</Text>
                </View>
                <FlatList horizontal={false}
                    data={this.state.data}
                    keyExtractor={item => item.id.toString()}
                    renderItem={item => this.renderItemComponent(item)}
                /> 
                
            </View>
        );
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    cardView: {
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 15,
        backgroundColor: 'white',

        //ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,

        //android
        elevation: 5,
    },
    proRow: {
        flexDirection: "row",
        alignItems: 'center'
    },
    proTitle: {
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    proColumnName: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    title: {
        fontSize: 18,
        color: '#373737'
    },
    date: {
        fontSize: 14,
        color: '#808080',
    },
    acceptBtn: {
        backgroundColor: '#8352F2',
        borderRadius: 10,
        height: 25,
    },
    btnText: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        padding: 10,
    },
    deleteBtn: {
        marginLeft: 15,
        backgroundColor: '#ECECEC',
        borderRadius: 10,
        height: 25,
    },
    btnText2: {
        fontSize: 14,
        color: '#373737',
        textAlign: 'center',
        padding: 10,
    },
    request: {
        flexDirection: 'row', 
        marginVertical: 10,
        marginHorizontal: 20,
    },
    requestNo: {
        color: '#8352F2'
    }
});