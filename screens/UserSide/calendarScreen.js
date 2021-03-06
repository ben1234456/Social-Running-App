import {Agenda} from 'react-native-calendars';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default class calendarScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate:new Date(),
            currentMonth:new Date().getMonth+1,
            userID:"",
            loadedData:"",
            refresh:false,
            changed:false,
            spinner:false,
            //load day even is empty
            data:{
              },
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
                        userID: user.id,
                    });
                }

            } catch (e) {
                console.log(e);
            }
            // if(this.state.userID.length!=0 && this.state.userID!=null){
            //     fetch(IP + '/api/calendar/calendarList/'+this.state.userID, {
            //         headers: {
            //             Accept: 'application/json',
            //             'Content-Type': 'application/json'
            //         },
            //     })
            //     .then(response => response.json())
            //     .then(data => {
            //         console.log('Successfully get user calendar data')
            //         console.log(data)
            //         this.setState({
            //             loadedData: data
            //         });
            //     })
            //     .catch((error) => {
            //         console.error('Error:', error);
            //     });
            // }
            
            
        }

        getData();
        //date format for data
        console.log(new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate());
        
    }
    componentDidMount(){
        this.focusListener = this.props.navigation.addListener('focus', () => {
            
            //using localhost on IOS and using 10.0.2.2 on Android
            const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';
            const IP = 'https://socialrunningapp.herokuapp.com';
            //get event details
            if(this.state.userID.length!=0 && this.state.userID!=null){
                //change spinner to visible
                this.setState({spinner: true});
                fetch(IP + '/api/calendar/calendarList/'+this.state.userID, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Successfully get user calendar data')
                    console.log(data)
                    this.setState({
                        loadedData: data,
                        changed:true,
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
            
    
            });
    }
    render() {
        return (
            <View style={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    
                />
                <Agenda
                items={this.state.data}
                selected={this.state.currentDate}
                onDayChange={this.loadData.bind(this)}
                onDayPress={this.loadData.bind(this)}
                // Specify how empty date content with no items should be rendered
                renderEmptyDate={() => {return (
                <View>
                    <TouchableOpacity>
                        <View style={styles.emptyItem}>
                            <Text style={styles.noItemText}>Loading</Text>
                            <Text style={styles.noItemText}>Please wait</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                );}}

                renderItem={(item) => {return (
                    <View >
                        {item.planned==true
                        ?
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('editEventCalendarScreen', { 'id': item.id})}>
                            <View style={styles.item}>
                                <Text style={styles.itemText}>{item.time}</Text>
                                <Text style={styles.itemText}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('addEventCalendarScreen', { 'date': item.date})}>
                                {item.create
                                ?
                                <View style={styles.emptyItem}>
                                    <Text style={styles.noItemText}>No more plan today.</Text>
                                    <Text style={styles.noItemText}>Tap to create</Text>
                                </View>
                                :
                                <View style={styles.emptyItem}>
                                    <Text style={styles.noItemText}>No plan today.</Text>
                                    <Text style={styles.noItemText}>Tap to create</Text>
                                </View>
                                }
                                
                            </TouchableOpacity>
                        </View>
                        }
                        
                    </View>
                        
                )}}
                showClosingKnob={true}
                loadItemsForMonth={this.loadDataForMonth.bind(this)}
                // rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
                rowHasChanged={this.rowChanged.bind(this)}


                pastScrollRange={200}
                futureScrollRange={200}

                theme={{
                    selectedDotColor:"#00a6ff",
                    selectedDayBackgroundColor:"#00a6ff",
                    dotColor:"transparent",
                    agendaDayTextColor: '#424242',
                    agendaDayNumColor: '#424242',
                    agendaTodayColor: 'red',
                  }}
                
            />
            </View>
            
        );}
        rowChanged=()=>{
            // if(this.state.changed==true){
            //     this.setState({ changed: false });
                
            //     return true;
            // }
            // else{
            //     return false;
            // }
            
        }
        loadData=(day)=>{
            changeToTwoTimeDecimal=(time)=>{
                if(time.length==1){
                    return "0"+time;
                }
                else{
                    return time;
                }
            };
            this.setState({ data: {} });
            for (let i =-10; i < 10; i++) {
                let added=false;
                let indexFound=[];
                const time = day.timestamp+ i * 24 * 60 * 60 * 1000;
                const convertedTime = new Date(time).toISOString().split('T')[0];
                this.state.data[convertedTime] = [];
                for (let ind =0; ind < this.state.loadedData.length; ind++) { 
                    if(this.state.loadedData[ind].date==convertedTime){
                        added=true;
                        indexFound.push(ind);
                    }
                }
                if(added){
                    for(let x of indexFound){
                        //%60=mins /60=hour
                        const hourStart=changeToTwoTimeDecimal(parseInt(this.state.loadedData[x].time/60).toString());
                        const minStart=changeToTwoTimeDecimal((this.state.loadedData[x].time%60).toString());
                        this.state.data[convertedTime].push({
                            id:this.state.loadedData[x].id,
                            name:this.state.loadedData[x].title,
                            create:false,
                            time:hourStart+minStart,
                            planned:true,
                            date:convertedTime,
                        });
                    }
                    this.state.data[convertedTime].push({
                        planned:false,
                        date:convertedTime,
                        create:true,
                    });
                }
                else{
                    this.state.data[convertedTime].push({
                        planned:false,
                        date:convertedTime,
                        create:false,
                    });
                }
            }
            const newItems = {};
            Object.keys(this.state.data).forEach(key => {
            newItems[key] = this.state.data[key];
            });
            this.setState({ data: newItems });
            // console.log(this.state.data);
        }
        loadDataForMonth=(day)=>{
            
            //check is current month
            if(day.month==new Date().getMonth()+1){
                console.log("load month data");
                changeToTwoTimeDecimal=(time)=>{
                    if(time.length==1){
                        return "0"+time;
                    }
                    else{
                        return time;
                    }
                };
                const IP = 'https://socialrunningapp.herokuapp.com';

            if(this.state.userID.length!=0 && this.state.userID!=null){
                //change spinner to visible
                this.setState({spinner: true});
                fetch(IP + '/api/calendar/calendarList/'+this.state.userID, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Successfully get user calendar data')
                    console.log(data)
                    this.setState({
                        loadedData: data
                    });
                    this.setState({ data: {} });
                for (let i =-10; i < 10; i++) {
                    let added=false;
                    let indexFound=[];
                    const time = day.timestamp+ i * 24 * 60 * 60 * 1000;
                    const convertedTime = new Date(time).toISOString().split('T')[0];
                    this.state.data[convertedTime] = [];
                    for (let ind =0; ind < this.state.loadedData.length; ind++) { 
                        if(this.state.loadedData[ind].date==convertedTime){
                            added=true;
                            indexFound.push(ind);
                        }
                    }
                    if(added){
                        for(let x of indexFound){
                            //%60=mins /60=hour
                            const hourStart=changeToTwoTimeDecimal(parseInt(this.state.loadedData[x].time/60).toString());
                            const minStart=changeToTwoTimeDecimal((this.state.loadedData[x].time%60).toString());
                            this.state.data[convertedTime].push({
                                id:this.state.loadedData[x].id,
                                name:this.state.loadedData[x].title,
                                create:false,
                                time:hourStart+minStart,
                                planned:true,
                                date:convertedTime,
                            });
                        }
                        this.state.data[convertedTime].push({
                            planned:false,
                            date:convertedTime,
                            create:true,
                        });
                    }
                    else{
                        this.state.data[convertedTime].push({
                            planned:false,
                            date:convertedTime,
                            create:false,
                        });
                    }
                }
                const newItems = {};
                Object.keys(this.state.data).forEach(key => {
                newItems[key] = this.state.data[key];
                });
                this.setState({ data: newItems });
                //change spinner to invisible
                this.setState({spinner: false});
                // console.log("new items");
                // console.log(this.state.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    //change spinner to invisible
                    this.setState({spinner: false});
                });
            }
                
            }
            
        }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    //activity scheduled
    item: {
        backgroundColor: '#8352F2',
        flex: 1,
        borderRadius: 15,
        justifyContent:"center",
        padding: "5%",
        marginRight: "3%",
        marginTop: "6%",
        marginBottom:"6%",
    },
    //no activity scheduled
    emptyItem: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 15,
        justifyContent:"center",
        padding: "5%",
        marginRight: "3%",
        marginTop: "5%",
        marginBottom:"5%",
        
    },
    //text when activity scheduled
    itemText:{
        color:"white",
        fontSize:15,
    },
    //text when no activity scheduled
    noItemText:{
        color:"#808080",
        fontSize:15,
    },
    noItemContainer:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
  });