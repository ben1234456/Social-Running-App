import React, { Component } from 'react';
import { View, Image, TouchableOpacity, TextInput, Text, ScrollView, StyleSheet, Alert, Picker, FlatList } from 'react-native';
import { Button } from 'native-base'
import DatePicker from 'react-native-datepicker';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import addImage from '../../images/addImage.png';
import * as ImagePicker from 'expo-image-picker';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import moment from 'moment';
import { StackActions } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';

export default class addEvent extends Component {
    constructor(props) {
        super(props);

        var today = new Date(),

            sampleDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        this.state = {
            eventName: "",
            regisDate: "",
            regisDueDate: "",
            startDate: "",
            endDate: "",
            description: "",
            imageSource: addImage,
            textInput : [],
            feeArray: [],
            distanceArray : [],
            height:0,
            spinner:false,
        }

    }
    validation = () => {

        var empty = [];

        //check empty
        if (!(this.state.eventName)) {
            empty.push("event name");
        }
        if (!(this.state.regisDate)) {
            empty.push("registration date");
        }
        if (!(this.state.regisDueDate)) {
            empty.push("registration due date");
        }
        if (!(this.state.startDate)) {
            empty.push("start date");
        }
        if (!(this.state.endDate)) {
            empty.push("end date");
        }
        if (!(this.state.feeArray.length)) {
            empty.push("fee");
        }
        if (!(this.state.distanceArray.length)) {
            empty.push("distance");
        }
        
        if (empty.length != 0) {

            console.log(empty[0]);

            var errormsg = "Your ";
            var i;

            for (i = 0; i < empty.length; i++) {
                if (i == empty.length - 1) {
                    errormsg += empty[i] + " ";
                }
                else {
                    errormsg += empty[i] + ", ";
                }
            }

            errormsg += "cannot be emtpy";

            Alert.alert(
                errormsg,
                '',
                [
                    { text: "Ok", onPress: () => console.log("OK Pressed") }
                ]
            );
            return false;
        }

        else {

            return true;
        }
    }
    
    create = () => {
        
        //using localhost on IOS and using 10.0.2.2 on Android
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost';

        const IP = 'https://socialrunningapp.herokuapp.com';

        if (this.validation()){
            const data = {
                event_name: this.state.eventName,
                description: this.state.description,
                start: this.state.startDate,
                end: this.state.endDate,
                registration_start: this.state.regisDate,
                registration_end: this.state.regisDueDate,
            };

            const disData = {
                distance: this.state.distanceArray,
                fee: this.state.feeArray
            }
            //change spinner to visible
            this.setState({spinner: true});
            fetch( IP + '/api/events', {
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
                    if (data.status == "success") {
                        //save the event distance
                        fetch( IP + '/api/eventdistances', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(disData),
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

                        //Alert the user
                        Alert.alert(
                            "Success",
                            data.message,
                            [
                              {
                                text: "Ok",
                                onPress: () => this.props.navigation.dispatch(StackActions.replace('adminapp')),
                              },
                              
                            ]
                        );

                    }

                    //fail 
                    else if (data.status == "fail") {
                        //alert fail message
                        Alert.alert(
                            data.message,
                            '',
                            [
                                { text: "Ok", onPress: () => console.log("OK Pressed") }
                            ]
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    //change spinner to invisible
                    this.setState({spinner: false});
                });

        }

    }

    //function to add TextInput dynamically
    addTextInput = (index) => {
        let textInput = this.state.textInput;
        textInput.push(
            <View>
                
                <View style={styles.distanceContainer}>
                    <View style={styles.addRowTextContainer}>
                        <Text style={styles.botTitle}>Distance (KM)</Text>
                    </View>
                    <View style={styles.addRowIconContainer}>
                        <TouchableOpacity onPress={() => this.removeTextInput(index)}>
                            <Icon2 size={25} name="delete" color='#808080' />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.inputTitleTop}>

                    <View style={styles.inputText}>
                        <TextInput
                            placeholder="e.g. 5"
                            keyboardType='numeric'
                            onChangeText={(text) => this.addValues(text, index)}
                        />
                    </View>
                </View>
                <View style={styles.titleHeading}>
                    <Text style={styles.botTitle}>Fee (RM)</Text>
                </View>
                <View style={styles.inputTitleTop}>
                    <View style={styles.inputText}>
                        <TextInput
                            placeholder="e.g. RMXXX"
                            keyboardType='numeric'
                            onChangeText={(text) => this.addFee(text, index)}
                        />
                    </View>
                </View>
            </View>
        );
        this.setState({ textInput });
    }

    //function to remove TextInput dynamically
    removeTextInput = (index) => {
        let textInput = this.state.textInput;
        let distanceArray = this.state.distanceArray;
        let feeArray = this.state.feeArray;
        textInput.splice(index,1);
        distanceArray.splice(index,1);
        feeArray.splice(index,1);
        this.setState({ textInput,distanceArray,feeArray });
        
    }

    //function to add text from TextInputs into single array
    addFee = (text, index) => {
        let dataArray = this.state.feeArray;
        let checkBool = false;
        if (dataArray.length !== 0){
        dataArray.forEach(element => {
            if (element.index === index ){
            element.text = text;
            checkBool = true;
            }
        });
        }
        if (checkBool){
        this.setState({
            feeArray: dataArray
        });
    }
    else {
        dataArray.push({'text':text,'index':index});
        this.setState({
            feeArray: dataArray
        });
    }
    }

    //function to add text from TextInputs into single array
    addValues = (text, index) => {
        let dataArray = this.state.distanceArray;
        let checkBool = false;
        if (dataArray.length !== 0){
        dataArray.forEach(element => {
            if (element.index === index ){
            element.text = text;
            checkBool = true;
            }
        });
        }
        if (checkBool){
        this.setState({
        distanceArray: dataArray
        });
    }
    else {
        dataArray.push({'text':text,'index':index});
        this.setState({
        distanceArray: dataArray
        });
    }
    }

    render() {
        return (

            <ScrollView style={styles.container}>
                    <Spinner visible={this.state.spinner} textContent={'Loading...'}/>
                    <View>
                    <View style={styles.titleHeading}>
                            <Text style={styles.botTitle}>Event Name</Text>
                        </View>

                        <View style={styles.inputTitleTop}>
                            <View style={styles.inputText}>
                                <TextInput
                                    placeholder = "Event Name"
                                    onChangeText={(name) => this.setState({eventName:name})}
                                    value = {this.state.eventName}
                                />
                            </View>
                        </View>

                        <View style={styles.titleHeading}>
                            <Text style={styles.botTitle}>Description</Text>
                        </View>
                        <View style={styles.inputTitleTop}>
                            <View style={styles.inputText}>
                                <TextInput
                                    placeholder="Write your description here"
                                    onChangeText={(des) => this.setState({ description: des})}
                                    value={this.state.description}
                                    onContentSizeChange={(desc)=>this.setState({height:desc.nativeEvent.contentSize.height})}
                                    style={{height:Math.max(35,this.state.height)}}
                                    multiline
                                />
                            </View>
                        </View> 

                        <View style={styles.titleHeading}>
                            <Text style={styles.botTitle}>Distances and Fees</Text>
                        </View>

                        {this.state.textInput.map((value) => {
                        return value
                        })}
                        
                        <View>
                            <Button style={styles.addRow} title='Add' onPress={() => this.addTextInput(this.state.textInput.length)}>
                                <Text style={{ color: 'white', fontSize: 14 }}>Add row</Text>
                            </Button>     
                        </View>
                        
                        <View style={styles.titleHeading}>
                            <Text style={styles.botTitle}>Registration Start Date</Text>
                        </View>
                        <View style={styles.inputTitleTop}>
                            <DatePicker style={styles.inputDate}
                                placeholder="Choose registration date"
                                date={this.state.regisDate} 
                                maxDate={this.state.regisDueDate ? moment(this.state.regisDueDate).subtract(1, 'day').format('YYYY-MM-DD') : new Date("2023-12-31")}
                                minDate={new Date()} 
                                confirmBtnText="Confirm" 
                                cancelBtnText="Cancel" 
                                useNativeDriver='true' 
                                format="YYYY-MM-DD" 
                                customStyles={{
                                    dateIcon: { display: 'none' },
                                    dateInput: { borderWidth: 0 ,alignItems:"flex-start"},
                                }} 
                                onDateChange={(date) => { this.setState({ regisDate: date }) }} />
                        </View>
                        
                        <View style={styles.titleHeading}>
                            <Text style={styles.botTitle}>Registration End Date</Text>
                        </View>
                        <View style={styles.inputTitleTop}>
                            <DatePicker style={styles.inputDate}
                                placeholder="Choose registration due date"
                                date={this.state.regisDueDate} 
                                minDate={this.state.regisDate ? moment(this.state.regisDate).add(1, 'day').format('YYYY-MM-DD') : new Date()}
                                confirmBtnText="Confirm" 
                                cancelBtnText="Cancel" 
                                useNativeDriver='true' 
                                format="YYYY-MM-DD" 
                                customStyles={{
                                    dateIcon: { display: 'none' },
                                    dateInput: { borderWidth: 0 ,alignItems:"flex-start"},
                                }} 
                                onDateChange={(date) => { this.setState({ regisDueDate: date }) }} />
                        </View>

                        <View style={styles.titleHeading}>
                            <Text style={styles.botTitle}>Event Start Date</Text>
                        </View>
                        <View style={styles.inputTitleTop}>
                            <DatePicker style={styles.inputDate}
                                placeholder="Choose event start date"
                                date={this.state.startDate} 
                                minDate={this.state.regisDueDate ? moment(this.state.regisDueDate).add(1, 'day').format('YYYY-MM-DD') : new Date()}
                                maxDate={this.state.endDate ? moment(this.state.endDate).subtract(1, 'day').format('YYYY-MM-DD') : moment(new Date()).add(5, 'year').format('YYYY-MM-DD') }
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel" 
                                useNativeDriver='true' 
                                format="YYYY-MM-DD" 
                                customStyles={{
                                    dateIcon: { display: 'none' },
                                    dateInput: { borderWidth: 0 ,alignItems:"flex-start"},
                                }} 
                                onDateChange={(date) => { this.setState({ startDate: date }) }} />
                        </View>

                        <View style={styles.titleHeading}>
                            <Text style={styles.botTitle}>Event End Date</Text>
                        </View>
                        <View style={styles.inputTitleTop}>
                            <DatePicker style={styles.inputDate}
                                placeholder="Choose registration due date"
                                date={this.state.endDate} 
                                minDate={this.state.startDate ? moment(this.state.startDate).add(1, 'day').format('YYYY-MM-DD') : new Date()}
                                confirmBtnText="Confirm" 
                                cancelBtnText="Cancel" 
                                useNativeDriver='true' 
                                format="YYYY-MM-DD" 
                                customStyles={{
                                    dateIcon: { display: 'none' },
                                    dateInput: { borderWidth: 0 ,alignItems:"flex-start"},
                                }} 
                                onDateChange={(date) => { this.setState({ endDate: date }) }} />
                        </View>
                        <View style={styles.submitBtnContainer}>
                            <Button style={styles.submitBtn} onPress={this.create}>
                                <Text style={styles.btnText}>Create</Text>
                            </Button>
                        </View>



                    </View>
            </ScrollView>
        );
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        paddingTop:"2.5%",
    },
    
    heading: {
        fontSize: 30,
        fontWeight: '700',
        lineHeight: 40,
        textAlign: 'center',
        marginTop: 35,
        marginBottom: 15,
        color: '#373737',
    },
    input: {
        backgroundColor: '#ECECEC',
        borderRadius: 15,
        marginTop: 15,
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
    },
    inputText: {
        marginLeft: "5%",
        flex: 1,
    },
    inputDate: {
        width: "100%",
        marginLeft: "5%",
        flex: 1,
    },
    picker: {
        backgroundColor: '#ECECEC',
        borderRadius: 15,
        marginTop: 15,
        display: 'flex',
        paddingTop: 2,
        paddingBottom: 2,
    },
    submitBtn: {
        backgroundColor: '#8352F2',
        borderRadius: 30,
        display: 'flex',
        marginBottom:"10%",
    },
    btnText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        flex: 1,
        padding: 20,
    },
    infoRow: {
        flexDirection: "row",
        marginTop: "10%",

    },
    infoColumnTitle: {
        flex: 1,
    },
    infoTitle: {
        textAlign: "left",
        fontSize: 16,
        flex: 1,
        textAlignVertical: "center",
    },
    infoColumnInfo: {
        flex: 3,
    },
    eventInfo: {
        textAlign: "right",
        fontSize: 15,
        color: '#8352F2',
    },
    inputWithTitle: {
        backgroundColor: '#ECECEC',
        borderRadius: 15,
        padding: 10,
        marginTop:"2.5%",
        marginBottom:"2.5%",
    },
    pickerLeftTitle: {
        backgroundColor: '#ECECEC',
        borderRadius: 15,
    },
    inputDateLeftTitle: {
        width: "100%",
        marginLeft: "5%",
    },
    infoTitleTwoRow: {
        textAlign: "left",
        fontSize: 16,
        flex: 1,
        textAlignVertical: "top",
    },
    sameRow: {
        flexDirection: "row",
        marginBottom: "5%",
    },
    choseFile: {
        flex: 1,
        marginRight: "5%",
        backgroundColor: "#8352F2",
        textAlign: "center",
        color: "white",
    },
    fileStatus: {
        flex: 1,
    },
    botTitle: {
        fontSize: 20,
        flex: 1,
        fontWeight: "bold",
    },
    
    titleHeading:{
        padding:"2%",
    },
    inputTitleTop: {
        backgroundColor: '#ECECEC',
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        padding:"2%",
    },
    pickerTitleTop: {
        backgroundColor: '#ECECEC',
        borderRadius: 15,
        display: 'flex',
        paddingTop: 2,
        paddingBottom: 2,
        marginBottom:"5%",
    },
    camera: {
        width: 40,
        height: 40,

    },
    selectedImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,

    },
    selectPhotoTop: {
        flex: 1,
        borderWidth: 1,
        marginTop: "5%",
        backgroundColor: "white",
        padding: "20%",
        alignItems: "center",
    },
    selectedPhotoTop: {
        flex: 1,
        borderWidth: 1,
        marginTop: "5%",
        backgroundColor: "white",
        alignItems: "center",

    },
    selectedPhotoTopInfo: {
        display: "none",

    },
    addRow: {
        backgroundColor: '#8352F2',
        flex: 1,
        padding: 20,
        marginTop:"2.5%",
        marginBottom:"2.5%",
    },
    addRowTextContainer:{
        flex:9,
        
    },
    addRowIconContainer:{
        flex:1,
        alignContent:"center",
    },
    distanceContainer:{
        flexDirection:"row",
        padding:"2%",
    },
    submitBtnContainer:{
        marginTop:"5%",
    },
});