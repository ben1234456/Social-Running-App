import React, { Component } from 'react';
import { View, Image, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Logo from '../../images/logo.png';
import Event from '../../images/event.png';
import UpcomingEvent from '../../images/family_marathon.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);

        var today = new Date()
        var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        var day = today.getDay()
        var day = weekdays[day]

        this.state = {
            id: "",
            user_id: "",
            name: "",
            eventdata: "",
            comingSoonEventData: "",
            currenDate: date,
            currentDay: day,
            spinner:false,
        };

        
        const getData = async () => {

            //using localhost on IOS and using 10.0.2.2 on Android
            const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';
            const IP = 'https://socialrunningapp.herokuapp.com';

            try {
                const userJson = await AsyncStorage.getItem('@userJson')
                if (userJson !== null) {
                    const user = JSON.parse(userJson);
                    this.setState({
                        name: user.first_name,
                        user_id: user.id,
                    });
                }

            } catch (e) {
                console.log(e);
            }
            //change spinner to visible
            this.setState({spinner: true});
            //get event details
            fetch(IP + '/api/events/exclusive/' + this.state.user_id, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log('Successfully get event data')
                this.setState({
                    eventdata: data
                });
                //get upcoming events
                fetch(IP + '/api/events/comingsoon/all', {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success')
                    this.setState({
                        comingSoonEventData: data
                    });
                    //change spinner to invisible
                    this.setState({spinner: false});
                })
                .catch((error) => {
                    console.error('Error:', error);
                    //change spinner to invisible
                    this.setState({spinner: false});
                });
                })
            .catch((error) => {
                console.error('Error:', error);
                //change spinner to invisible
                this.setState({spinner: false});
            });
            
        }

        getData();

    }
    componentDidMount(){
        this.focusListener = this.props.navigation.addListener('focus', () => {
            //using localhost on IOS and using 10.0.2.2 on Android
            const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';
            const IP = 'https://socialrunningapp.herokuapp.com';
            //get event details
            if(this.state.user_id.length!=0 && this.state.user_id!=null){
                //change spinner to visible
                this.setState({spinner: true});
                fetch(IP + '/api/events/exclusive/' + this.state.user_id, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Successfully get event list')
                    console.log(data)
                    this.setState({
                        eventdata: data
                    });
                    //get upcoming events
                    fetch(IP + '/api/events/comingsoon/all', {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success')
                        this.setState({
                            comingSoonEventData: data
                        });
                        //change spinner to invisible
                        this.setState({spinner: false});
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        //change spinner to invisible
                        this.setState({spinner: false});
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                    //change spinner to invisible
                    this.setState({spinner: false});
                });
    
                
            }
            
    
            });
    }

    renderEvents = (data) =>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('eventDetails', { 'eventid': data.item.id })}>
            <View style={styles.cardView}>
                <View style={styles.view1}>
                    <Image style={styles.image2} source={Event} />
                </View>
                <View style={styles.view2}>
                    <Text style={styles.title}>{data.item.event_name}</Text>
                    <Text style={styles.venue}>Anywhere</Text>
                </View>
            </View>
        </TouchableOpacity>

    renderComingSoonEvents = (data) =>
                    
        <TouchableOpacity onPress={() => this.props.navigation.navigate('userUpcomingEventScreen', { 'eventid': data.item.id })}>
            <View style={styles.cardView}>
                <View style={styles.view1}>
                    <Image style={styles.image2} source={Event} />
                </View>
                <View style={styles.view2}>
                    <Text style={styles.title}>{data.item.event_name}</Text>
                    <Text style={styles.venue}>Anywhere</Text>
                </View>
            </View>
        </TouchableOpacity>


    render() {
        return (
            <ScrollView style={styles.container}>
                <Spinner visible={this.state.spinner} textContent={'Loading...'}/>
                <View style={styles.contentContainer1}>
                    <View style={styles.rowContainerBig}>
                        <Text style={styles.welcome}>Hi,</Text>
                        <Text style={styles.name}> {this.state.name}</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Activity')}>
                            <Image style={styles.image} source={Logo} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('calendarScreen')}>
                        <View style={styles.rowContainer}>
                            <Text style={{ color: '#8352F2', fontSize: 18, fontWeight: 'bold' }}>{this.state.currenDate},</Text>
                            <Text style={{ color: '#8352F2', marginLeft: 10, fontSize: 18, fontWeight: 'bold' }}>{this.state.currentDay}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.rowContainer}>
                        <Text style={styles.event}>Events</Text>
                        <Text onPress={() => this.props.navigation.navigate('eventsScreen', { 'user_id': this.state.user_id })} style={styles.more}>{"View More >"}</Text>
                    </View>
                </View>

                {this.state.eventdata.length!=0
                    ?
                    <View style={styles.scrollview}>
                        <FlatList horizontal={true}
                            data={this.state.eventdata}
                            keyExtractor={item => item.id.toString()}
                            renderItem={item => this.renderEvents(item)}
                        />  
                    </View>
                    :
                    <View style={styles.noEventView}>
                        <Text style={styles.noEventText}>There is currently no event, please wait for the update!</Text>
                    </View>
                }
                
                <View style={styles.contentContainer1}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.event}>Coming Soon</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('upcomingEventsScreen')}>
                            <Text style={styles.more}>{"View More >"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {this.state.comingSoonEventData.length!=0
                ?
                <View style={styles.scrollview}>
                    <FlatList horizontal={true}
                        data={this.state.comingSoonEventData}
                        keyExtractor={item => item.id.toString()}
                        renderItem={item => this.renderComingSoonEvents(item)}
                    />  
                </View>
                :
                <View style={styles.noEventView}>
                    <Text style={styles.noEventText}>There is currently no upcoming event, please wait for the update!</Text>
                </View>
                }

                

            </ScrollView>
        );
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop:"2%",
    },
    contentContainer1: {
        marginTop:"5%",
        // padding: 20,
        // paddingTop:0,
        // paddingBottom:0,
    },
    rowContainer: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop:10,
        paddingBottom:10,
    },
    rowContainerBig: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop:10,
        paddingBottom:0,
    },
    scrollview:{
        marginTop:"5%",
    },
    cardView: {
        height: 210,
        width: 250,
        marginLeft: 20,
        borderRadius: 15,
        marginBottom:20,
        backgroundColor: 'white',

        //ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,

        //android
        elevation: 5,
    },
    welcome: {
        fontSize: 35,
        fontWeight: 'bold',
    },
    name: {
        flex: 1,
        fontSize: 35,
        fontWeight: 'bold',
        color: '#8352F2',
    },
    image: {
        width: 60,
        height: 60
    },
    image2: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    view1: {
        flex: 2,
    },
    view2: {
        flex: 1,
        paddingLeft: 20
    },
    event: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 18,
    },
    more: {
        color: '#8352F2',
    },
    title: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    venue: {
        flex: 1,
        fontSize: 18,
        color: 'grey',
    },
    noEventView:{
        flex:1,
        
        alignItems:"flex-start",
        justifyContent:"center",
        padding:"10%",
    },

    noEventText:{
        fontSize:16,
        color:"#808080",
    },
});
