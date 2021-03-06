import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Button } from 'native-base';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Marker, Polyline } from 'react-native-maps';
//import Geolocation from 'react-native-geolocation-service';
//import { request, PERMISSIONS } from 'react-native-permissions';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Font from 'react-native-vector-icons/FontAwesome5';
import Setting from 'react-native-vector-icons/SimpleLineIcons';
import { Dimensions } from 'react-native';
import haversine from "haversine";
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

export default class AdminMapScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: "",
            prevLat: 0,
            prevLng: 0,
            curnLat: 0,
            curnLng: 0,
            startLat: 0,
            startLng: 0,
            endLat: 0,
            latitude: 0,
            longitude: 0,
            tracking: false,
            distanceTravelled: 0,
            routeCoordinates: [],
            reference: React.createRef(),
            showInfo: 'none',
            spinner:false,
            date: new Date(),
            hour: "00",
            minute: "00",
            second: "00",
            hourCount: 0,
            minuteCount: 0,
            secondCount: 0,
            stopwatch: false,
            startPause: "START",

            //stopwatch
            stopwatchStart: false,
            stopwatchReset: false,
            runtime: "",

            //calculate time
            startsec: "",
            startminute: "",
            starthour: "",
            endsec: "",
            endminute: "",
            endhour: "",
            startTimestamp: "",
            endTimestamp: "",

            //button state
            button: "Start",
        };


    }

    getLocation = async () => {

        const permissionStatus = await Location.requestForegroundPermissionsAsync();

        if (permissionStatus.status !== "granted") {
            this.setState({ errorMessage: "Permission to access location was denied" });
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        console.log(this.state.errorMessage);
        console.log(currentLocation);
        this.setState({ latitude: currentLocation.coords.latitude });
        this.setState({ longitude: currentLocation.coords.longitude });
        const currentLatitude = currentLocation.coords.latitude;
        const currentLongitude = currentLocation.coords.longitude;

        this.setState({
            prevLat: currentLatitude,
            prevLng: currentLongitude,
            startLat: currentLatitude,
            startLng: currentLongitude,

        });


        this.state.reference.current.animateToRegion({

            latitude: currentLatitude,
            longitude: currentLongitude,

            latitudeDelta: 0.005,
            longitudeDelta: 0.005,

        })
    };


    componentDidMount() {
        this.getLocation();
    }


    tracking = () => {

        this.toggle();

        if (this.state.tracking == false) {

            const currentDate = new Date();
            const timestamp = currentDate.getTime();

            this.setState({
                tracking: true,
                startTimestamp: timestamp,
            });

        }

        else {
            const currentDate = new Date();
            const timestamp = currentDate.getTime();

            this.setState({
                tracking: false,
                endTimestamp: timestamp,
            });

            const totalDuration = this.state.hourCount;

            const data = {
                start_lat: String(this.state.startLat),
                start_lng: String(this.state.startLng),
                end_lat: String(this.state.latitude),
                end_lng: String(this.state.longitude),
                total_distance: String(this.state.distanceTravelled),
            };

            this.setState({
                date: new Date(),
                hour: "00",
                minute: "00",
                second: "00",
                hourCount: 0,
                minuteCount: 0,
                secondCount: 0,
            });
            //change spinner to visible
            this.setState({spinner: true});

            fetch('http://192.168.0.192:8000/api/activity', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
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

    }

    change = (geolocation) => {
        // console.log(geolocation.latitude);

        if (this.state.tracking == true) {
            this.state.reference.current.animateToRegion({

                latitude: geolocation.latitude,
                longitude: geolocation.longitude,

                latitudeDelta: 0.0005,
                longitudeDelta: 0.0005,
            })

            var previousgeo = { latitude: this.state.prevLat, longitude: this.state.prevLng };
            var currentgeo = { latitude: geolocation.latitude, longitude: geolocation.longitude };

            var totaldistance = this.state.distanceTravelled;
            var totalnewdistance = (haversine(previousgeo, currentgeo));

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
            });

            // console.log(this.state.routeCoordinates);

            if (geolocation.latitude != 0 || this.state.prevLat != 0) {
                this.setState({ distanceTravelled: totaldistance + totalnewdistance });
            }
        }

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
                    
                </MapView>

                <View style={styles.columnContainer}>

                    <View style={styles.contentContainer}>
                        <TouchableOpacity style={styles.icon2} onPress={() => this.props.navigation.navigate('AdminSavedRouteScreen')}>
                            <Font name="route" size={30} color={'#8352F2'} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity style={styles.icon} onPress={() => this.props.navigation.navigate('addRouteScreen')}>
                            <Icon name="add-location" size={30} color={'#8352F2'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    columnContainer: {
        flex: 0,
        flexDirection: 'column',
        alignItems: 'center'
    },
    contentContainer: {
        padding: 40,
        backgroundColor: 'transparent',
        flex: 0,
        flexDirection: 'row',
    },
    icon: {
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 6,
        // flex: 1,

        //ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,

        //android
        elevation: 5,
    },
    icon2: {
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 6,

        //ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,

        //android
        elevation: 5,
    },
    stickyBtn: {
        borderRadius: 30,
        backgroundColor: '#8352F2',
        flex: 1,
        width: "auto",
        marginLeft: 30,
        marginRight: 30,

        //ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        flex: 1,

        //android
        elevation: 5,
    },
    settingBtn: {
        backgroundColor: 'white',
        borderRadius: 30,
        position: 'absolute',
        left: 220,
        bottom: 41,
        padding: 6,
        flex: 1,

        //ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,

        //android
        elevation: 5,
    },
});
