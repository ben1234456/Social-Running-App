import React, { Component } from 'react';
import { StyleSheet, Image,Text, View, TouchableOpacity,Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Dimensions } from 'react-native';
import Purple from '../../images/purple.png';
import Blue from '../../images/blue.png';
import Green from '../../images/green.png';
import Orange from '../../images/orange.png';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';

export default class addRouteScreen extends Component {

    constructor(props) {
        super(props);
        this.changeSelection = this.changeSelection.bind(this);
        this.state = {
            userID:"",
            routeName:"",
            distance:"",
            errorMessage:"",
            latitude:0,
            longitude:0,
            totaldistance:0,
            start: null,
            end:null,
            check1:null,
            check2:null,
            def:null,
            spinner:false,
  
            checkPointArray:[],

            startCoor:{
                latitude:0,
                longitude:0,
            },
            endCoor:{
                latitude:0,
                longitude:0,
            },
         
            reference:React.createRef(),
            startingPoint:"Start Point",
            endingPoint:"End Point",
            checkPoint1:"First Checkpoint",
            checkPoint2:"Second CheckPoint",
            selection:0,
     
            //sign up and get api key https://developer.here.com/#
            api:"ysrvAnGD9v99umFWd_SWtpu7O68r1jzIrLiDNV9GLKw",
            //get key https://developers.google.com/maps/documentation/directions/get-api-key
            //get Google Maps Directions API https://console.cloud.google.com/apis/dashboard?project=social-running-app&folder=&organizationId=
            googleApi:"AIzaSyB15Wdjt0OdRs09MlU09gENop0nLYtjz_o",
        };

        const getData = async () => {

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
        }

        getData();
    }
    
    //get user permission and current location
    getLocation=async()=>{
        
        const permissionStatus=await Location.requestForegroundPermissionsAsync();
        
        if(permissionStatus.status!=="granted"){
            this.setState({ errorMessage: "Permission to access location was denied"});
            return;
        }

        // permissionStatus=await Location.requestBackgroundPermissionsAsync();

        if(permissionStatus.status!=="granted"){
            this.setState({ errorMessage: "Permission to access location was denied"});
            return;
        }

        let currentLocation=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High });
        // console.log(currentLocation);

        console.log(this.state.errorMessage);
        const currentLatitude=currentLocation.coords.latitude;
        const currentLongitude=currentLocation.coords.longitude;
        console.log(currentLatitude);
        console.log(currentLongitude);
        this.state.reference.current.animateToRegion({
        
            latitude:currentLatitude,
            longitude:currentLongitude,

            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          })
        //set all marker to user current location
        this.setState({
            def:{ title:"You are here",coordinate:{latitude: currentLatitude,longitude: currentLongitude}},
        });        
    };
    
    changeLocation=(point)=>{

        //get the latitude and longitude clicked
        let tempoLat=point.nativeEvent.coordinate.latitude || this.state.latitude;
        let tempoLong=point.nativeEvent.coordinate.longitude || this.state.longitude;
        
        //get the address of the latitude and longitude
        this.getAddress(tempoLat,tempoLong);
    };

    getAddress(latitude, longitude) {
        return new Promise((resolve) => {
          const url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${this.state.api}&mode=retrieveAddresses&prox=${latitude},${longitude}`
          fetch(url)
            .then(res => res.json())
            .then((resJson) => {
                if (resJson && resJson.Response && resJson.Response.View && resJson.Response.View[0] && resJson.Response.View[0].Result && resJson.Response.View[0].Result[0]) {
                    if(this.state.selection==0){
                        this.setState({ startingPoint: resJson.Response.View[0].Result[0].Location.Address.Label});
                        // this.state.markers.push(this.state.startMarker);
                        this.setState({
                            start:{ title:"Starting point",coordinate:{latitude: latitude,longitude: longitude},selected:true},

                        });
                        //this.setState({ checkMarker1:{title:"Checkpoint 1",coordinate:{latitude: latitude,longitude: longitude},selected:true}});
                        //{ title:"Starting point",pinColor:"#0000FF",coordinate:{latitude: latitude,longitude: longitude}};

                    }
                    if(this.state.selection==1){
                        this.setState({ checkPoint1: resJson.Response.View[0].Result[0].Location.Address.Label});
                        this.setState({
                            check1:{ title:"Checkpoint 1",coordinate:{latitude: latitude,longitude: longitude},selected:true},

                        });
                        //this.setState({ checkMarker1:{title:"Checkpoint 1",coordinate:{latitude: latitude,longitude: longitude},selected:true}});
                    }
                    if(this.state.selection==2 && this.state.check1!=null){
                        this.setState({ checkPoint2: resJson.Response.View[0].Result[0].Location.Address.Label});
                        this.setState({
                            check2:{ title:"Checkpoint 2",coordinate:{latitude: latitude,longitude: longitude},selected:true},

                        });
                        //this.setState({ checkMarker2:{title:"Checkpoint 2",coordinate:{latitude: latitude,longitude: longitude},selected:true}});
                    }
                    if(this.state.selection==3){
                        this.setState({ endingPoint: resJson.Response.View[0].Result[0].Location.Address.Label});
                        this.setState({
                            end:{ title:"Ending point",coordinate:{latitude: latitude,longitude: longitude},selected:true},

                        });
                        //this.setState({ endMarker:{title:"Ending point",coordinate:{latitude: latitude,longitude: longitude},selected:true}});
                    }
                    console.log(resJson.Response.View[0].Result[0].Location.Address.Label)
                }
                //show the direction if start and end point was chosen
                if(this.state.start!=null && this.state.end!=null){
                    // this.setState({ startCoor:{latitude: this.state.start.coordinate.latitude,longitude: this.state.start.coordinate.longitude}});
                    // this.setState({ endCoor:{latitude: this.state.end.coordinate.latitude,longitude: this.state.end.coordinate.longitude}});
                    //add checkpoint if selected
                    if(this.state.check1!=null){
                        //set first checkpoint
                        let tempoArray=[{
                            latitude: this.state.check1.coordinate.latitude,
                            longitude: this.state.check1.coordinate.longitude,
                          }]
                          console.log("tempoArray");
                        console.log(tempoArray);
                        //set second checkpoint if selected
                        if(this.state.check2!=null){
                            tempoArray.push({
                                latitude: this.state.check2.coordinate.latitude,
                                longitude: this.state.check2.coordinate.longitude,
                              })
                        }
                        console.log("tempoArray");
                        console.log(tempoArray);
                        this.setState({checkPointArray:tempoArray});
                    }
                }
                resolve();
            })
            .catch((e) => {
              console.log(e)
              resolve()
            })
        })
    };
      
    changeSelection=(newSelection)=>{
        this.setState({ selection: newSelection});
        console.log(this.state.selection);
        
    };
    componentDidMount(){
        this.getLocation();
    };

    checkSelected=(value,type)=>{
        if(value!=null){
            if(type=="long"){
                return value.coordinate.longitude
            }
            else{
                return value.coordinate.latitude
            }
        }
        else{
            return null;
        }
    }
    //save route in database
    create=()=>{
        
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';
        const IP = 'https://socialrunningapp.herokuapp.com';
          
        //validation for empty or unable to get route
        if(this.state.routeName.length!=0){
            if(this.state.start!=null || this.state.end!=null){
                if(this.state.distance!=null && this.state.distance.length!=0){
                    const data = {
                        userID: this.state.userID,
                        name:this.state.routeName,
                        start_lat:this.state.start.coordinate.latitude,
                        start_lng:this.state.start.coordinate.longitude,
                        end_lat:this.state.end.coordinate.latitude,
                        end_lng:this.state.end.coordinate.longitude,
                        total_distance:this.state.distance,
                        check1_lat:this.checkSelected(this.state.check1,"lat"),
                        check1_lng:this.checkSelected(this.state.check1,"long"),
                        check2_lat:this.checkSelected(this.state.check2,"lat"),
                        check2_lng:this.checkSelected(this.state.check2,"long"),
                    };
                    console.log(data);
                    //change spinner to visible
                    this.setState({spinner: true});
                    fetch( IP + '/api/route', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data),
                    })
                    .then(response => response.json())
                    .then(data => {
                        //success
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
                else{
                    Alert.alert(
                        "Unable to get route for point selected. Please select other point for route",
                        '',
                        [
                            { text: "Ok", onPress: () => console.log("OK Pressed") }
                        ]
                    );
                }
            }
            else{
                Alert.alert(
                    "Please select a starting and ending point for the route",
                    '',
                    [
                        { text: "Ok", onPress: () => console.log("OK Pressed") }
                    ]
                );
            }
        }
        else{
            Alert.alert(
                "Please enter a name for the route",
                '',
                [
                    { text: "Ok", onPress: () => console.log("OK Pressed") }
                ]
            );
        }
        

        
    };
    
    render() {
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.spinner} textContent={'Loading...'}/>
                <View style={styles.topInfo}>
                    <View style={styles.row}>
                        <View style={styles.imgColumn}>
                            <Image style={styles.image} source={Blue} />
                        </View>
                        <View style={styles.infoColumn}>
                            <TouchableOpacity onPress={() => this.changeSelection(0)} >
                                <View style={styles.info} >
                                    <Text style={styles.infoText}>{this.state.startingPoint}</Text>
                                </View>
                            </TouchableOpacity>
                        </View> 
                    </View>
                    <View style={styles.row}>
                        <View style={styles.imgColumn}>
                            <Image style={styles.image} source={Green} />
                        </View>
                        <View style={styles.infoColumn}>
                            <TouchableOpacity onPress={() => this.changeSelection(1)}>
                                <View style={styles.info} >
                                    <Text style={styles.infoText}>{this.state.checkPoint1}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.imgColumn}>
                            <Image style={styles.image} source={Orange} />
                        </View>
                        <View style={styles.infoColumn}>
                            <TouchableOpacity onPress={() => this.changeSelection(2)}>
                                <View style={styles.info} >
                                    <Text style={styles.infoText}>{this.state.checkPoint2}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.imgColumn}>
                            <Image style={styles.image} source={Purple} />
                        </View>
                        <View style={styles.infoColumn}>
                            <TouchableOpacity onPress={() => this.changeSelection(3)}>
                                <View style={styles.info} >
                                    <Text style={styles.infoText}>{this.state.endingPoint}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <MapView onPress={this.changeLocation.bind(this)} style={styles.map} ref={this.state.reference} >
                    {this.state.def && 
                    <Marker coordinate={this.state.def.coordinate} title={this.state.def.title}/>
                    }
                    {this.state.start && 
                    <Marker coordinate={this.state.start.coordinate} pinColor={"#0000FF"} title={this.state.start.title}/>
                    }
                    {this.state.check1 && 
                    <Marker coordinate={this.state.check1.coordinate} pinColor={"#008000"} title={this.state.check1.title}/>
                    }
                    {this.state.check2 && 
                    <Marker coordinate={this.state.check2.coordinate} pinColor={"#ffcc00"} title={this.state.check2.title}/>
                    }
                    {this.state.end && 
                    <Marker coordinate={this.state.end.coordinate} pinColor={"#800080"} title={this.state.end.title}/>
                    }
                    {this.state.start&& this.state.end &&
                    <MapViewDirections origin={this.state.start.coordinate} destination={this.state.end.coordinate} waypoints={this.state.checkPointArray} apikey={this.state.googleApi} 
                    onReady={result => {
                        this.state.distance = result.distance
                        this.getLocation();
                        this.forceUpdate()
                    }}
                    />
                    }
                    {/* <Marker coordinate={this.state.startMarker.coordinate} pinColor={"#0000FF"} title={this.state.startMarker.title}/>
                    <Marker coordinate={this.state.endMarker.coordinate} pinColor={"#800080"} title={this.state.endMarker.title}/>
                    <Marker coordinate={this.state.checkMarker1.coordinate} pinColor={"#008000"} title={this.state.checkMarker1.title}/>
                    <Marker coordinate={this.state.checkMarker2.coordinate} pinColor={"#ffcc00"} title={this.state.checkMarker2.title}/> */}
                    {/* <MapViewDirections origin={this.state.start.coordinate} destination={this.state.end.coordinate} waypoints={this.state.checkPointArray} apikey={this.state.googleApi} 
                    onReady={result => {
                        this.state.distance = result.distance
                        this.forceUpdate()
                    }}
                    /> */}
                    {/* <Marker coordinate={this.state.defaultMarker.coordinates} title={this.state.defaultMarker.title} /> */}
                </MapView>
                <View style={styles.botInfo}>
                
                    <View style={styles.routeInfoBot}>
                        <View style={styles.routeInfoBotDetail}>
                            <Text style={styles.routeInfoTextSmall}>Route name</Text>
                            <View style={styles.timeContainer}>
                            <TextInput
                                placeholder = "Enter Route Name"
                                onChangeText={(name) => this.setState({routeName:name})}
                                value = {this.state.routeName}
                            />
                            </View>
                        </View>
                        <View style={styles.routeInfoBotDetail}>
                            <Text style={styles.routeInfoTextSmall}>Distance (km)</Text>
                            <Text style={styles.routeInfoTextBig}>{this.state.distance}</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <Icon name="save-sharp" style={{ marginRight: '10%', }} size={30} color={'#8352F2'} onPress={this.create} />
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
        backgroundColor:"white",
    },
    topInfo:{
        flex:3,
        paddingLeft:"5%",
        paddingRight:"5%",
        paddingTop:"1%",
        paddingBottom:"1%",
        width:"100%",
        backgroundColor: '#8352F2',
        justifyContent:"center",
        
    },
    info:{
        borderRadius:5,
        padding:"1%",
        backgroundColor: '#ffffff',
    },
    map: {
        flex:6,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    botInfo:{
        flex: 2,
        justifyContent: "center",
        width: "100%",
        paddingLeft: "10%",
        paddingTop: "5%",
        paddingBottom: "5%",
        backgroundColor: "#ffffff",
    },
    routeInfo:{
        flex:1,
    },
    image: {
        width: "40%",
        height: "40%",
    },
    row:{
        flexDirection:"row",
        height:"20%",
        marginTop:"1%",
        marginBottom:"1%",
    },
    imgColumn:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    infoColumn:{
        flex:9,
        paddingRight:"5%",
        justifyContent:"center",
    },
    infoText:{
        fontSize:12,
        color:"#808080",

    },
    routeInfoBot:{
        flexDirection:"row",
    },
    routeInfoBotDetail:{
        flex:1,
    },
    routeInfoTextSmall:{

    },
    routeInfoTextBig:{
        fontSize:20,
        fontWeight:"bold",
    },
    botTitleContainer:{
        flexDirection:"row",
    },
    icon:{
        flex:1,
    },
    timeContainer:{
        flexDirection:"row",
    },
    timeSpacing:{
        textAlignVertical:"center",
        fontSize:20.,
        fontWeight:"bold",
    },
    time:{
        fontSize:20,
        fontWeight:"bold",
        textAlignVertical:"bottom",
    },
});