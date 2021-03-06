import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert ,FlatList} from 'react-native';
import profileImage from '../../images/avatar.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';

export default class BuddiesProfileScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buddyID: props.route.params.userID,
            userID:"",
            user:"",
            id: "",
            name: "",
            gender: "",
            city: "",
            dob: "",
            spinner:false,
            //diff buddy profile and random profile
            view:props.route.params.view,
        };

        //get data from async storage
        const getData = async () => {

            //using localhost on IOS and using 10.0.2.2 on Android
            const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';
            const IP = 'https://socialrunningapp.herokuapp.com';

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
            //change spinner to visible
            this.setState({spinner: true});
            fetch(IP + '/api/users/' + this.state.buddyID, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log('Successfully get user data')
                console.log(data)
                this.setState({
                    user: data
                });
                //change spinner to invisible
                this.setState({spinner: false});
            })
            .catch((error) => {
                console.error('Error:', error);
                //change spinner to invisible
                this.setState({spinner: false});
            });
            if(this.state.view!="true"){
                //change spinner to visible
                this.setState({spinner: true});
                fetch(IP + '/api/buddy/' + this.state.userID +'/'+this.state.buddyID, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Successfully get buddy id')
                    console.log(data)
                    this.setState({
                        id: data.id
                    });
                    //change spinner to invisible
                    this.setState({spinner: false});
                    
                })
                .catch((error) => {
                    console.error('Error:', error);
                    //change spinner to invisible
                    this.setState({spinner: false});
                });
            }
            
        }

        getData();
        
    }
        
    

    deleteBuddy=()=>{
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';
        const IP = 'https://socialrunningapp.herokuapp.com';
        //change spinner to visible
        this.setState({spinner: true});
        fetch(IP + '/api/buddy/' + this.state.id, {
            method: 'DELETE',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            },

        })
        .then(response => response.json())
        .then(data => {
            console.log('Successfully delete buddy')
            console.log(data)
            //change spinner to invisible
            this.setState({spinner: false});
        })
        .catch((error) => {
            console.error('Error:', error);
            //change spinner to invisible
            this.setState({spinner: false});
        });
        this.props.navigation.dispatch(StackActions.pop());

    }

    addBuddy=() =>{

        //using localhost on IOS and using 10.0.2.2 on Android
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';
        const IP = 'https://socialrunningapp.herokuapp.com';
        
        const data = {
            userID:this.state.userID,
            buddyID:this.state.buddyID,
        };
        //change spinner to visible
        this.setState({spinner: true});

        fetch(IP + '/api/buddyrequest', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        .then(response =>  response.json())
        
        .then(data => {
            console.log(data);
            //change spinner to invisible
            this.setState({spinner: false});
        })
        .catch((error) => {
            console.error('Error:', error);
            //change spinner to invisible
            this.setState({spinner: false});
        });  
        this.props.navigation.navigate('addSearchUserScreen');
    }
    render() {
        return (
            <View style={styles.wholeContainer}>
                <Spinner visible={this.state.spinner} textContent={'Loading...'}/>
                <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Image style={styles.proImage} source={profileImage} />
                </View>
                {/* <View style={{ flexDirection: 'column' }}>
                    <View style={styles.followerRow}>
                        <View style={styles.followPosition}>
                            <Text style={styles.noOfFollower}>0</Text>
                            <Text style={styles.follow}>FOLLOWERS</Text>
                        </View>
                        <View style={styles.followPosition}>
                            <Text style={styles.noOfFollower}>0</Text>
                            <Text style={styles.follow}>FOLLOWING</Text>
                        </View>
                    </View>
                </View> */}
                <View style={styles.cardView}>
                    <View style={styles.proRow}>
                        <View style={styles.proTitle}>
                            <Text style={styles.proColumnName}>Name:</Text>
                        </View>
                        <View style={styles.proInfo}>
                            <Text style={styles.proDetails}>{this.state.user.first_name}</Text>
                        </View>
                    </View>

                    <View style={styles.proRow}>
                        <View style={styles.proTitle}>
                            <Text style={styles.proColumnName}>Gender:</Text>
                        </View>

                        <View style={styles.proInfo}>
                            <Text style={styles.proDetails}>{this.state.user.gender}</Text>
                        </View>
                    </View>

                    <View style={styles.proRow}>
                        <View style={styles.proTitle}>
                            <Text style={styles.proColumnName}>State:</Text>
                        </View>

                        <View style={styles.proInfo}>
                            <Text style={styles.proDetails}>{this.state.user.city}</Text>
                        </View>
                    </View>

                    <View style={styles.proRow}>
                        <View style={styles.proTitle}>
                            <Text style={styles.proColumnName}>Date of Birth:</Text>
                        </View>

                        <View style={styles.proInfo}>
                            <Text style={styles.proDetails}>{this.state.user.dob}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.addBtnContainer}>
                    {this.state.id==""
                    ?
                    <TouchableOpacity onPress={this.addBuddy}>
                        <View style={styles.addBtn} >
                            <Text style={styles.addText}>ADD BUDDY</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={this.deleteBuddy}>
                        <View style={styles.addBtn} >
                            <Text style={styles.addText}>DELETE BUDDY</Text>
                        </View>
                    </TouchableOpacity>
                    }
                </View>
            </View>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    rowContainer: {
        flex: 0,
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    proImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    cardView: {
        margin: 50,
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
    },
    proTitle: {
        flex: 1,
        marginVertical: 15,
        marginHorizontal: 20,
    },
    proInfo: {
        marginVertical: 15,
        marginHorizontal: 20
    },
    proColumnName: {
        fontWeight: 'bold',
        color: '#373737',
    },
    proDetails: {
        color: '#8352F2',
    },
    follow: {
        color: '#8352F2',
        textAlign: 'center'
    },
    followerRow: {
        flexDirection: "row",
        marginTop: 20,
    },
    followPosition: {
        flex: 1,
    },
    noOfFollower: { 
        textAlign: 'center' 
    },
    addBtnContainer:{
        flex:1,
        justifyContent:"flex-end",
        padding:"5%",
        paddingLeft:"10%",
        paddingRight:"10%",
    },
    addBtn:{
        borderRadius:30,
        alignItems:"center",
        justifyContent:"flex-end",
        padding:"5%",
        backgroundColor: '#8352F2',
    },
    addText:{
        fontSize:16,
        color: 'white',
        textAlign: 'center',
    },
    wholeContainer:{
        flex:1,
        backgroundColor:"white",
    },
});
