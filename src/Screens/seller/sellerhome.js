import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SellerHomeScreen = () => {
    return (

        <ScrollView contentContainerStyle={styles.scrollContainer}>

            <View style={styles.container}>
                <StatusBar style="auto" />
                <Text style={styles.welcomeText}>Welcome back</Text>
                <Text style={styles.descriptionText}>Manage and grow your business</Text>

                <View style={styles.statusRow}>
                    <View style={styles.statusItem}>
                        <Icon name="shopping-cart" size={30} color="#4CAF50" />
                        <Text style={styles.statusText}>Pending Orders</Text>
                        <Text style={styles.statusText}>5</Text>
                    </View>

                    <View style={styles.statusItem}>
                        <Icon name="exclamation-circle" size={30} color="#FF5733" />
                        <Text style={styles.statusText}>Out of Stock</Text>
                        <Text style={styles.statusText}>5</Text>
                    </View>
                </View>

                <View style={styles.statusRow}>
                    <View style={styles.statusItem}>
                        <Icon name="exclamation-triangle" size={30} color="#FFD700" />
                        <Text style={styles.statusText}>Low Stock</Text>
                        <Text style={styles.statusText}>3</Text>
                    </View>

                    <View style={styles.statusItem}>
                        <Icon name="question-circle" size={30} color="#337ab7" />
                        <Text style={styles.statusText}>Queries Sloved</Text>
                        <Text style={styles.statusText}>1</Text>
                    </View>
                </View>

                <View style={styles.statusRow}>
                    <View style={styles.statusItem}>
                        <Icon name="low-vision" size={30} color="#9370DB" />
                        <Text style={styles.statusText}>Low Stock</Text>
                        <Text style={styles.statusText}>3</Text>
                    </View>

                    <View style={styles.statusItem}>
                        <Icon name="question-circle" size={30} color="#8B4513" />
                        <Text style={styles.statusText}>Queries</Text>
                        <Text style={styles.statusText}>2</Text>
                    </View>
                </View>

                <Text style={styles.businessInsightsText}>Business Insights</Text>

                <View style={styles.card}>
                    <View style={styles.cardColumn}>
                        <View>
                            <Text style={styles.cardTitle}>Orders</Text>
                            <Text style={styles.cardContent}>10</Text>
                        </View>
                        <View>
                            <Text style={styles.cardTitle}>Views</Text>
                            <Text style={styles.cardContent}>15</Text>
                        </View>
                    </View>
                    <View style={styles.cardColumn}>
                        <View>
                            <Text style={styles.cardTitle}>Payments</Text>
                            <Text style={styles.cardContent}>2000</Text>
                        </View>
                        <View>
                            <Text style={styles.cardTitle}>In-Stock Listings</Text>
                            <Text style={styles.cardContent}>15</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5', // Light background color
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333', // Dark text color
    },
    descriptionText: {
        fontSize: 16,
        color: '#888', // Medium grey color
        marginBottom: 20,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statusItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48%',
        backgroundColor: '#fff', // White background color
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    statusText: {
        fontSize: 16,
        marginTop: 5,
        color: '#333', // Dark text color
    },
    businessInsightsText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333', // Dark text color
    },
    card: {
        backgroundColor: '#fff', // White background color
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    cardColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333', // Dark text color
    },
    cardContent: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50', // Green color (you can adjust)
    },
    viewText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#333', // Dark text color
    },
});

export default SellerHomeScreen;
