import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [address, setAddress] = useState('');
    const [MobileNumber, setMobileNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Fetch the current user's data from Firebase
        const fetchUserData = async () => {
            try {
                const user = auth().currentUser;
                if (user) {
                    const userId = user.uid;
                    const userDoc = await firestore().collection('users').doc(userId).get();
                    const userData = userDoc.data();
                    if (userData) {
                        setUserName(userData.fullName);

                        // Check if 'address' field exists in userData
                        if (userData.address) {
                            setAddress(userData.address);
                        }
                        else {
                            setAddress('Address not available'); // Set a default value or handle accordingly
                        }

                        if (userData.mobileNumber) {
                            setMobileNumber(userData.mobileNumber);
                        }
                        else {
                            setMobileNumber('Mobile Number not available'); // Set a default value or handle accordingly
                        }

                        if (userData.companyName) {
                            setCompanyName(userData.companyName);
                        }
                        else {
                            setCompanyName('Company Name not available');
                        }
                        if (userData.email) {
                            setEmail(userData.email);
                        }
                        else {
                            setEmail('Email not available');
                        }
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Unable to fetch user data');
            }
        };

        fetchUserData();
    }, []);

    const handleSignOut = async () => {
        try {
            await auth().signOut();
            // Navigate to the login screen after signing out
            navigation.replace('Login'); // Replace with your desired login screen name
        } catch (error) {
            Alert.alert('Error', 'Unable to sign out');
        }
    };

    // Add additional features or UI elements here

    return (
        <ImageBackground
            source={require('../../../assets/bg.png')}
            style={styles.backgroundImage}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profileBox}>
                    <Text style={[styles.heading, styles.centerText]}>User Profile</Text>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.addresstext}>{address}</Text>
                    <Text style={styles.mobileNumbertext}>{MobileNumber}</Text>
                    <Text style={styles.emailtext}>{email}</Text>
                    <Text style={styles.companyNametext}>{companyName}</Text>
                    {/* Add more UI elements or features here */}

                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <Text style={[styles.buttonText, { fontSize: 18, fontWeight: 'bold' }]}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    profileBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
        borderRadius: 10,
        width: '100%',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    centerText: {
        textAlign: 'center',
    },
    userName: {
        fontSize: 18,
        marginBottom: 20,
    },
    signOutButton: {
        backgroundColor: '#81b29a',
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 15,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
