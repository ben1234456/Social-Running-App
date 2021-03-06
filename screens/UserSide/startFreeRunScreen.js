import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Dimensions } from 'react-native';
import { Button } from 'native-base';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';
import Setting from 'react-native-vector-icons/SimpleLineIcons';
import haversine from "haversine";
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default class startFreeRunScreen extends Component {

    constructor(props) {
        super(props);

        var vdt = new Date();

        var dt = vdt.getFullYear() + '-' + (vdt.getMonth() + 1) + '-' + vdt.getDate() + " " + vdt.getHours() + ':' + this.setDigit(vdt.getMinutes()) + ':' + this.setDigit(vdt.getSeconds());

        this.state = {
            user_ID:"",
            spinner:false,
            date:new Date(),
            hour:"00",
            minute:"00",
            second:"00",
            hourCount:0,
            minuteCount:0,
            secondCount:0,
            stopwatch:false,
            startPause:"START",

            start_dt: dt.toLocaleString(),
            end_dt: new Date(),

            activityType: props.route.params.activityType,

            errorMessage: "",
            prevLat: 0,
            prevLng: 0,
            curnLat: 0,
            curnLng: 0,
            startLat: props.route.params.lat,
            startLng: props.route.params.lng,
            endLat: 0,
            latitude: 0,
            longitude: 0,
            altitude: 0,
            tracking: false,
            distanceTravelled: 0,
            routeCoordinates: [],
            reference: React.createRef(),
            avgSpeed: 0,
            count: 0,
            start: null,
            end: null,
            check1: null,
            check2: null,
            def: null,
            spinner:false,
            checkPointArray: [],

            reference: React.createRef(),
            startingPoint: "Start Point",
            endingPoint: "End Point",
            checkPoint1: "First Checkpoint",
            checkPoint2: "Second CheckPoint",

            //sign up and get api key https://developer.here.com/#
            api: "ysrvAnGD9v99umFWd_SWtpu7O68r1jzIrLiDNV9GLKw",
            //get key https://developers.google.com/maps/documentation/directions/get-api-key
            //get Google Maps Directions API https://console.cloud.google.com/apis/dashboard?project=social-running-app&folder=&organizationId=
            googleApi: "AIzaSyB15Wdjt0OdRs09MlU09gENop0nLYtjz_o",
        };

        const getData = async () => {
            //using localhost on IOS and using 10.0.2.2 on Android
            const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';
            const IP = 'https://socialrunningapp.herokuapp.com';
            try {
                const userJson = await AsyncStorage.getItem('@userJson')
                const routeID = await AsyncStorage.getItem('@route')
                if (userJson !== null) {
                    const user = JSON.parse(userJson);
                    this.setState({
                        userID: user.id,
                    });
                }

                if(routeID != ''){
                    //change spinner to visible
                    this.setState({
                        spinner: true, 
                        route_ID: routeID
                    });
                    console.log('fetch');
                    fetch(IP + '/api/route/routeList/'+this.state.userID, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Successfully get user route data testing')
                        console.log(data)

                        this.setState({
                            routeName: data[0].name,
                            eventName: data[0].title,
                            ownerId: data[0].userID,

                            start: { title: "Starting point", selected: true, coordinate: { latitude: parseFloat(data[0].start_lat), longitude: parseFloat(data[0].start_lng) } },
                            end: { title: "Ending point", selected: true, coordinate: { latitude: parseFloat(data[0].end_lat), longitude: parseFloat(data[0].end_lng) } },
                            loadedData: data,
                            data: data[0],

                        });

                        if (data[0].check1_lat != null) {
                            this.setState({
                                check1: { title: "Checkpoint 1", selected: true, coordinate: { latitude: parseFloat(data[0].check1_lat), longitude: parseFloat(data[0].check1_lng) } },
                            });
                        }

                        if (data[0].check2_lat != null) {
                            this.setState({
                                check2: { title: "Checkpoint 2", selected: true, coordinate: { latitude: parseFloat(data[0].check2_lat), longitude: parseFloat(data[0].check2_lng) } },

                            });
                        }
                        //change spinner to invisible
                        this.setState({spinner: false});

                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        //change spinner to invisible
                        this.setState({spinner: false});
                    })
                        }

                    } catch (e) {
                        console.log(e);
                    }
            ;
        }

        getData();
    }
    //animate to starting point
    getLocation = async () => {
        const permissionStatus = await Location.requestForegroundPermissionsAsync();

        if (permissionStatus.status !== "granted") {
            this.setState({ errorMessage: "Permission to access location was denied" });
            return;
        }

        // permissionStatus=await Location.requestBackgroundPermissionsAsync();

        if (permissionStatus.status !== "granted") {
            this.setState({ errorMessage: "Permission to access location was denied" });
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        console.log(this.state.errorMessage);
        this.state.reference.current.animateToRegion({

            latitude: this.state.start.coordinate.latitude,
            longitude: this.state.start.coordinate.longitude,

            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        })
        this.setState({
            def: { title: "You are here", coordinate: { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude } },
        });
    };
    startTimer=()=>{
        if(this.state.stopwatch==true){
            var currentTime=moment(new Date());
            var date=moment(this.state.date);
            const diff = currentTime.diff(date);
            const diffDuration = moment.duration(diff);
            var hour=this.state.hourCount+diffDuration.hours()
            var minute=this.state.minuteCount+diffDuration.minutes()
            var second=this.state.secondCount+diffDuration.seconds()

            
            this.setState({
                hour: this.setDigit(hour),
                minute: this.setDigit(minute),
                second: this.setDigit(second),
                 
            });
        }
    };

    //add 0 if single digit
    setDigit=(digit)=>{
        if (digit.toString().length == 1) {
            const newdigit = "0" + digit;
            return newdigit;
        }

        else{
            return digit;
        }
    }

    //calculate pace (km/hr)
    calculatePace=(second,minute,hour,distance)=>{
        
        var totalDuration = parseFloat(hour) + (parseFloat(minute)/60) + (parseFloat(second)/60/60);

        if (totalDuration > 0){
            var pace = parseFloat(distance) / totalDuration;
            var roundedPace = Number(pace).toFixed(2);  
        }

        this.setState({
            avgSpeed: roundedPace,
        })
    }

    toggle=()=>{

        if(this.state.count == 0){
            this.setState({ 
                end_dt: Date().toLocaleString(),
                count: 1,
            });
        }

        if(this.state.stopwatch==true){
            this.setState({ stopwatch: false});
            this.setState({ startPause: "RESUME"});
            var currentTime=moment(new Date());
            var date=moment(this.state.date);
            const diff = currentTime.diff(date);
            const diffDuration = moment.duration(diff);
            var hour=this.state.hourCount+diffDuration.hours()
            var minute=this.state.minuteCount+diffDuration.minutes()
            var second=this.state.secondCount+diffDuration.seconds()
            this.setState({ hourCount: hour});
            this.setState({ minuteCount: minute});
            this.setState({ secondCount: second});
             
        }

        else{
            this.setState({ stopwatch: true});
            this.setState({ date: new Date()});
            
            this.setState({ startPause: "PAUSE"});
        }
    };

    change = (geolocation) => {
        // console.log(geolocation.latitude);
        this.state.reference.current.animateToRegion({

            latitude: geolocation.latitude,
            longitude: geolocation.longitude,

            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        })

        var previousgeo = { latitude: this.state.prevLat, longitude: this.state.prevLng };
        var currentgeo = { latitude: geolocation.latitude, longitude: geolocation.longitude };

        var latitude = geolocation.latitude;
        var longitude = geolocation.longitude;
        var vrc = this.state.routeCoordinates;

        var newCoordinate = {
            latitude,
            longitude
        };

        this.setState({
            prevLat: geolocation.latitude,
            prevLng: geolocation.longitude,
            routeCoordinates: vrc.concat([newCoordinate]),
            altitude: geolocation.altitude,
        });

        // console.log(this.state.routeCoordinates);

        //if stopwatch is running
        if (this.state.stopwatch){

            //calculate the distance
            var totaldistance = this.state.distanceTravelled;
            var totalnewdistance = (haversine(previousgeo, currentgeo));

            // distance checker, if >10m then the distance won't be added to the total distance 
            if (totalnewdistance < 0.01) {
                this.setState({ distanceTravelled: totaldistance + totalnewdistance });
                this.calculatePace(this.state.second, this.state.minute, this.state.hour, this.state.distanceTravelled);
            }

        }    

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    };

    componentDidMount(){
        this.interval = setInterval(() => this.startTimer(), 1000);

        this.toggle();

        this.state.reference.current.animateToRegion({

            latitude: this.state.startLat,
            longitude: this.state.startLng,

            latitudeDelta: 0.0005,
            longitudeDelta: 0.0005,

        })
    };

    stopTracking = () =>{
        
        //using localhost on IOS and using 10.0.2.2 on Android
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';
        const IP = 'https://socialrunningapp.herokuapp.com';

        clearInterval(this.interval);

        var vdt = new Date();

        var dt = vdt.getFullYear() + '-' + (vdt.getMonth() + 1) + '-' + vdt.getDate() + " " + vdt.getHours() + ':' + this.setDigit(vdt.getMinutes()) + ':' + this.setDigit(vdt.getSeconds());

        this.setState({end_dt: dt.toLocaleString()});
        

        const total_duration = String(this.state.hour) + ":" + String(this.state.minute) + ":" + String(this.state.second)

        const data = {
            activity_type : this.state.activityType,
            start_lat: String(this.state.startLat),
            start_lng: String(this.state.startLng),
            end_lat: String(this.state.latitude),
            end_lng: String(this.state.longitude),
            total_distance: String(this.state.distanceTravelled),
            user_ID: String(this.state.user_ID),
            total_duration: total_duration,
            start_dt: this.state.start_dt,
            end_dt: this.state.end_dt
        };
        //change spinner to visible
        this.setState({spinner: true});

        fetch(IP + '/api/activity', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
        })
        .then(response => response.json())
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
        
        this.props.navigation.navigate('Progress');
    }

    render() {
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.spinner} textContent={'Loading...'}/>
                <MapView style={styles.map}
                    ref={this.state.reference}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation
                    followUserLocation
                    onUserLocationChange={
                        (geolocation) => this.change(geolocation.nativeEvent.coordinate)
                    }
                >
                    <Polyline coordinates={this.state.routeCoordinates} strokeWidth={3} strokeColor={"#add8e6"} />
                    {this.state.def &&
                        <Marker coordinate={this.state.def.coordinate} title={this.state.def.title} />
                    }
                    {this.state.start &&
                        <Marker coordinate={this.state.start.coordinate} pinColor={"#0000FF"} title={this.state.start.title} />
                    }
                    {this.state.check1 &&
                        <Marker coordinate={this.state.check1.coordinate} pinColor={"#008000"} title={this.state.check1.title} />
                    }
                    {this.state.check2 &&
                        <Marker coordinate={this.state.check2.coordinate} pinColor={"#ffcc00"} title={this.state.check2.title} />
                    }
                    {this.state.end &&
                        <Marker coordinate={this.state.end.coordinate} pinColor={"#800080"} title={this.state.end.title} />
                    }
                    {this.state.start && this.state.end &&
                        <MapViewDirections strokeWidth={3} strokeColor="red" origin={this.state.start.coordinate} destination={this.state.end.coordinate} waypoints={this.state.checkPointArray} apikey={this.state.googleApi}
                            onReady={result => {
                                this.getLocation();
                                this.forceUpdate();
                            }}
                            onStart={() => {
                                this.forceUpdate();

                            }}
                        />
                    }

                    {this.state.route_ID != ' ' ?
                    <View>
                        {this.state.start && this.state.end &&
                        <MapViewDirections strokeWidth={3} strokeColor="red" origin={this.state.start.coordinate} destination={this.state.end.coordinate} waypoints={this.state.checkPointArray} apikey={this.state.googleApi}
                            onReady={result => {
                                this.getLocation();
                                this.forceUpdate();
                            }}
                            onStart={() => {
                                this.forceUpdate();

                            }}
                        />
                    } 
                    </View>
                    :
                    <View></View>
                    }       
                    
                </MapView>

                <View style={styles.botInfo}>
                    <View style={styles.infoRow}>
                        <View style={styles.info}>
                            <Text style={styles.infoTitle}>Distance (km)</Text>
                            <Text style={styles.infoWord}>{parseFloat(this.state.distanceTravelled).toFixed(2)}</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.infoTitle}>Duration</Text>
                            <Text style={styles.infoWord}>{this.state.hour}:{this.state.minute}:{this.state.second}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.info}>
                            <Text style={styles.infoTitle}>Avg. Speed (km/hr)</Text>
                            <Text style={styles.infoWord}>{this.state.avgSpeed}</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.infoTitle}>Altitude</Text>
                            <Text style={styles.infoWord}>{this.state.altitude}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.info}>
                            <Button block style={styles.btn1} onPress={this.toggle}>
                                <Text style={styles.btnText1}>{this.state.startPause}</Text>
                            </Button>
                        </View>
                        <View style={styles.info}>
                            <Button block style={styles.btn2} onPress={this.stopTracking}>
                                <Text style={styles.btnText2}>STOP</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
}
        
const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
    },
    
    map: {
        flex:6,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    botInfo:{
        flex:4,
        justifyContent:"center",
        width:"100%",
        paddingLeft:"10%",
        paddingRight:"10%",
        paddingTop:"5%",
        paddingBottom:"5%",
        backgroundColor:"#ffffff",
    },

    infoRow:{
        flexDirection:"row",
        marginTop:"5%",
        marginBottom:"5%",
    },  
    
    info:{
        flex:1,
    },

    infoWord:{
        fontWeight:"bold",
        fontSize:20,
    },

    btn1:{
        borderWidth:1,
        borderRadius:30,
        marginLeft:"20%",
        marginRight:"10%",
        backgroundColor:"#ffffff",
        borderColor:"#8100e3",
    },

    btn2:{
        borderWidth:1,
        borderColor:"#8100e3",
        borderRadius:30,
        marginRight:"20%",
        marginLeft:"10%",
        backgroundColor:"#8100e3",
    },

    btnText1:{
        fontSize:15,
        color:"#8100e3",
    },

    btnText2:{
        fontSize:15,
        color:"#ffffff",
    },
});