import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Picker, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Font from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements';

export default class ProgressScreen extends Component {
    state = {
        categoryPosition: '',
        categorySelected: '25 March - 01 April 2021',
        activitySelected: '',
    }

    render() {
        const screenWidth = 330;
        const data = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    data: [6.75, 8.45, 10.3, 16.2, 9.63, 5.5],
                    color: (opacity = 1) => `rgba(131, 82, 242, ${opacity})`, // optional
                    strokeWidth: 2 // optional
                }
            ],
            legend: ["Distance (km)"] // optional
        };
        const chartConfig = {
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#FFFFFF",
            color: (opacity = 1) => `rgba(55, 55, 55, ${opacity})`,
            barPercentage: 0.5,
        };
        return (

            <ScrollView style={styles.container}>
                <View style={styles.activityContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.activityTitle}>Recent Activities </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('activityHistoryScreen')}>
                            <Text style={styles.more}>{'View More >'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <View style={styles.rowContainer}>
                            <Icon name="run" style={styles.icon} size={30} color={'#8352F2'} />
                            <View style={styles.activityInfo}>
                                <Text style={styles.activityDistance}>3.55 / 5 km</Text>
                                <Text style={styles.activityDuration}>00:40:00</Text>
                            </View>
                            <Text style={styles.date}>2021-03-03</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.rowContainer}>
                            <Font name="bicycle" style={styles.icon} size={30} color={'#8352F2'} />
                            <View style={styles.activityInfo}>
                                <Text style={styles.activityDistance}>6.34 / 7 km</Text>
                                <Text style={styles.activityDuration}>01:00:00</Text>
                            </View>
                            <Text style={styles.date}>2021-02-02</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.rowContainer}>
                            <Icon name="hiking" style={styles.icon} size={30} color={'#8352F2'} />
                            <View style={styles.activityInfo}>
                                <Text style={styles.activityDistance}>5.67 / 6 km</Text>
                                <Text style={styles.activityDuration}>01:10:00</Text>
                            </View>
                            <Text style={styles.date}>2021-01-01</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.contentContainer}>
                    <Text style={styles.statis}>Statistics</Text>
                    <View style={styles.rowContainer3}>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={this.state.activitySelected}
                                onValueChange={(itemValue) => this.setState({ activitySelected: itemValue })}>

                                <Picker.Item label="Running" value="Running" color='#999999' />
                                <Picker.Item label="Cycling" value="Cycling" color='#999999' />
                                <Picker.Item label="Hiking" value="Hiking" color='#999999' />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.picker2}>
                        <Picker
                            selectedValue={this.state.categorySelected}
                            backgroundColor={'white'}
                            onValueChange={(itemValue, itemPosition) => this.setState({ categorySelected: itemValue, categoryPosition: itemPosition })}>

                            <Picker.Item label="WEEK" value="25 March - 01 April 2021" color='#999999' />
                            <Picker.Item label="MONTH" value="April 2021" color='#999999' />
                            <Picker.Item label="YEAR" value="2021" color='#999999' />
                        </Picker>
                    </View>
                    <Text style={styles.categoryDisplay}>{this.state.categorySelected}</Text>
                </View>

                <View style={styles.rowContainer2}>
                    <View style={styles.contentContainer2}>
                        <Text style={styles.distance}>Distance (km)</Text>
                        <Text style={styles.disValue}>6.95</Text>
                    </View>
                </View>
                <View style={styles.chart}>
                    <LineChart
                        data={data}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                    />
                </View>
                <View style={styles.rowContainer2}>
                    <View style={styles.contentContainer2}>
                        <Text style={styles.sections}>Avg. Pace (min/km)</Text>
                        <Text style={styles.disValue}>10:77</Text>
                    </View>
                    <View style={styles.contentContainer2}>
                        <Text style={styles.sections}>Duration</Text>
                        <Text style={styles.disValue}>09:56:35</Text>
                    </View>
                </View>
                <View style={styles.rowContainer2}>
                    <View style={styles.contentContainer2}>
                        <Text style={styles.sections}>Avg. Speed (km/hr)</Text>
                        <Text style={styles.disValue}>12.63</Text>
                    </View>
                    <View style={styles.contentContainer2}>
                        <Text style={styles.sections}>Calories Burned</Text>
                        <Text style={styles.disValue}>100.55</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        padding: 40,
    },
    contentContainer2: {
        paddingLeft: 40,
        paddingTop: 10,
    },
    activityContainer: {
        marginTop: 30,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 30,
        paddingLeft: 40,
        paddingRight: 40,
    },
    rowContainer2: {
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowContainer3: {
        paddingTop: 20,
    },
    more: {
        color: '#8352F2',
        fontSize: 16,
    },
    icon: {
        flex: 0,
        marginRight: 30
    },
    activityInfo: {
        flex: 1,
    },
    activityDistance: {
        color: '#373737',
    },
    activityDuration: {
        color: '#808080',
    },
    activityTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#373737',
    },
    statis: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#373737',
    },
    picker: {
        backgroundColor: 'white',
        borderRadius: 30,
        flex: 1,

        //ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,

        //android
        elevation: 5,
    },
    categoryDisplay: {
        color: '#8352F2',
    },
    distance: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8352F2',
    },
    sections: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8352F2',
        marginTop: 30,
    },
    disValue: {
        color: '#373737',
        fontSize: 25,
        fontWeight: 'bold',
    },
    chart: {
        marginLeft: 20,
    },
    divider: {
        backgroundColor: 'black',
        marginTop: 60,
    },
    date: {
        color: '#999999',
    },
});