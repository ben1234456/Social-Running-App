import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, Alert, Dimensions, FlatList } from 'react-native';
import { Button } from 'native-base'
import { Actions } from 'react-native-router-flux';
import Event from '../../images/event.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { createAppContainer } from "react-navigation";
import { StackActions } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
const window = Dimensions.get("window");

export default class eventDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: "",
            checked: '',
            eventid: props.route.params.eventid,
            event_name: "",
            start_date: "",
            end_date: "",
            registration_start_date: "",
            registration_end_date: "",
            event_distance: "",
            desc: "",
            distanceSelected: "",
            distanceCounter:0,
            spinner:false,
        };

        //using localhost on IOS and using 10.0.2.2 on Android
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';
        const IP = 'https://socialrunningapp.herokuapp.com';
        //change spinner to visible
        this.setState({spinner: true});
        //get events' details
        fetch(IP + '/api/events/' + this.state.eventid, {
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
            })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.setState({
                event_name: data.event_name,
                start_date: data.start,
                end_date: data.end,  
                registration_start_date:  data.registration_start,   
                registration_end_date:  data.registration_end,
                desc:data.description
            });
            //get event distances
            fetch(IP + '/api/events/'  + this.state.eventid + '/distance', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log('Successfully get event distances + fee')
                this.setState({
                    event_distance: data
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

        

        const getData = async () => {
            try {
                const userJson = await AsyncStorage.getItem('@userJson')
                if (userJson !== null) {
                    const user = JSON.parse(userJson);
                    this.setState({
                        user_id: user.id,
                    });
                }

            } catch (e) {
                console.log(e);
            }

        }

        getData();

    }

    formatDateTime = (sDate,FormatType) => {
        var lDate = new Date(sDate)

        var month=new Array(12);
        month[0]="January";
        month[1]="February";
        month[2]="March";
        month[3]="April";
        month[4]="May";
        month[5]="June";
        month[6]="July";
        month[7]="August";
        month[8]="September";
        month[9]="October";
        month[10]="November";
        month[11]="December";

        var weekday=new Array(7);
        weekday[0]="Sunday";
        weekday[1]="Monday";
        weekday[2]="Tuesday";
        weekday[3]="Wednesday";
        weekday[4]="Thursday";
        weekday[5]="Friday";
        weekday[6]="Saturday";

        var hh = lDate.getHours() < 10 ? '0' + 
            lDate.getHours() : lDate.getHours();
        var mi = lDate.getMinutes() < 10 ? '0' + 
            lDate.getMinutes() : lDate.getMinutes();
        var ss = lDate.getSeconds() < 10 ? '0' + 
            lDate.getSeconds() : lDate.getSeconds();

        var d = lDate.getDate();
        var dd = d < 10 ? '0' + d : d;
        var yyyy = lDate.getFullYear();
        var mon = eval(lDate.getMonth()+1);
        var mm = (mon<10?'0'+mon:mon);
        var monthName=month[lDate.getMonth()];
        var weekdayName=weekday[lDate.getDay()];

        if(FormatType==1) {
            return mm+'/'+dd+'/'+yyyy+' '+hh+':'+mi;
        } else if(FormatType==2) {
            return weekdayName+', '+monthName+' '+ 
                dd +', ' + yyyy;
        } else if(FormatType==3) {
            return mm+'/'+dd+'/'+yyyy; 
        } else if(FormatType==4) {
            var dd1 = lDate.getDate();    
            return dd1+'-'+Left(monthName,3)+'-'+yyyy;    
        } else if(FormatType==5) {
            return mm+'/'+dd+'/'+yyyy+' '+hh+':'+mi+':'+ss;
        } else if(FormatType == 6) {
            return mon + '/' + d + '/' + yyyy + ' ' + 
                hh + ':' + mi + ':' + ss;
        } else if(FormatType == 7) {
            return  dd + '-' + monthName.substring(0,3) + 
                '-' + yyyy + ' ' + hh + ':' + mi + ':' + ss;
        }
    }

        // static getDerivedStateFromProps(props, state) {

        //     var start_Date = formatDateTime(state.start_date,1); 
        //     console.log(start_Date);


        //     return null;
        // }

    validation = () => {
        if (this.state.distanceSelected){
            return true
        } 

        else{

            Alert.alert(
                "Please select distance",
                '',
                [
                  { text: "Ok" }
                ]
            );

            return false
        }
    }

    renderDistanceDetails = (data) =>
        <Text style={styles.eventInfo}>RM{data.item.fee} ({data.item.distance}km)</Text>

    renderDistanceSelection = (data) =>
        <View style={{ flexDirection: 'row' }}>
            <Text style={{ marginTop: 8, flex: 1 }}>{data.item.distance}km (RM{data.item.fee})</Text>
            <RadioButton 
                value={data.item.distance} 
                color='#8352F2'
                status={this.state.checked===data.item.id?"checked":"unchecked"}
                onPress={()=>this.setState({ checked:data.item.id,distanceSelected:data.item.distance })}
            />
        </View>

    register = () =>{

        if (this.validation()){
            //using localhost on IOS and using 10.0.2.2 on Android
            const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';
            const IP = 'https://socialrunningapp.herokuapp.com';
            //change spinner to visible
            this.setState({spinner: true});
            const data = {
                user_id: String(this.state.user_id),
                event_id: String(this.state.eventid),
                distance: this.state.distanceSelected,

            };

            fetch(IP + '/api/userevents', {
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
            Alert.alert(
                'You have successfully signed-up for the event',
                '',
                [
                    { text: "Ok", onPress: () => this.props.navigation.dispatch(StackActions.replace('Coupon', {'user_id': this.state.user_id })) }
                ]
            );
        }
           
    }

    render() {
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.spinner} textContent={'Loading...'}/>
                <ScrollView>

                    <View >
                        <View style={styles.top}>
                            <Image style={styles.image} source={Event} />
                        </View>
                        <View>
                            <Text style={styles.title}>{this.state.event_name}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.infoColumnTitle}>
                                <Text style={styles.eventTitle}>Date</Text>
                            </View>
                            <View style={styles.infoColumnInfo}>
                                <Text style={styles.eventInfo}>{this.state.start_date} - {this.state.end_date} (GMT +8:00)</Text>
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.infoColumnTitle}>
                                <Text style={styles.eventTitle}>Venue</Text>
                            </View>
                            <View style={styles.infoColumnInfo}>
                                <Text style={styles.eventInfo}>Anywhere</Text>
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.infoColumnTitle}>
                                <Text style={styles.eventTitle}>Price</Text>
                            </View>
                            <View style={styles.infoColumnInfo}>
                                <FlatList
                                    data={this.state.event_distance}
                                    keyExtractor={item => item.id.toString()}
                                    renderItem={item => this.renderDistanceDetails(item)}
                                />
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.infoColumnTitle}>
                                <Text style={styles.eventTitle}>Reward</Text>
                            </View>
                            <View style={styles.infoColumnInfo}>
                                <Text style={styles.eventInfo}>Finished Medal</Text>
                            </View>
                        </View>
                        <View >

                            <View style={styles.about}>
                                <Text style={styles.aboutHeading}>About</Text>
                                <Text style={styles.aboutText}>{this.state.desc}</Text>
                            </View>

                            <View style={styles.about}>
                                <Text style={styles.aboutHeading}>REGISTRATION START DATE</Text>
                                <Text style={styles.aboutText}>{this.state.registration_start_date} (GMT +8:00)</Text>
                            </View>
                            <View style={styles.about}>
                                <Text style={styles.aboutHeading}>REGISTRATION END DATE</Text>
                                <Text style={styles.aboutText}>{this.state.registration_end_date} (GMT +8:00)</Text>
                            </View>
                            <View style={styles.about}>
                                <Text style={styles.aboutHeading}>RUN SUBMISSION</Text>
                                <Text style={styles.aboutText}>Please kindly submit your result through this mobile application</Text>
                            </View>
                            <View style={styles.about}>
                                <Text style={styles.aboutHeading}>DISTANCE</Text>
                                <View style={styles.infoColumnInfo}>
                                    
                                        <FlatList
                                            data={this.state.event_distance}
                                            keyExtractor={item => item.id.toString()}
                                            renderItem={item => this.renderDistanceSelection(item)}
                                        />
                                        
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={styles.spacing}>

                    </View>
                </ScrollView>
                <Button block style={styles.stickyBtn} onPress={this.register}>
                    <Text style={styles.btnText}>Sign Up Now</Text>
                </Button>
            </View>
        );
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    spacing: {
        margin: "10%",
    },
    stickyBtn: {
        alignSelf: "center",
        borderRadius: 30,
        width: "40%",
        position: "absolute",
        bottom: 15,
        backgroundColor: '#8352F2',
    },
    btnText: {
        color: "#ffffff",
    },
    image: {
        width: "100%",
        height: 277,
    },
    infoColumnTitle: {
        flex: 1,
    },
    infoColumnInfo: {
        flex: 2,
    },
    infoRow: {
        flexDirection: "row",
        padding: "5%",
    },
    eventTitle: {
        textAlign: "left",
        fontSize: 20,
    },
    eventInfo: {
        textAlign: "right",
        fontSize: 15,
        color: '#8352F2',
    },
    bottom: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        lineHeight: 40,
        textAlign: 'center',
        color: '#373737',
        margin: "5%",
        fontWeight: "bold",
    },
    about: {
        flex: 1,
        padding: "5%",
    },
    aboutHeading: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#373737",
    },
    aboutText: {
        fontSize: 15,
        color: "#373737",
    },
});


