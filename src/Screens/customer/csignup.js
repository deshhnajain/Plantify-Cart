import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignUpScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const userType = 'customer';

    const handleContinue = async () => {
        try {
            // Validate inputs
            if (!fullName.trim() || !mobileNumber.trim() || !email.trim() || !password.trim() || !address.trim()) {
                Alert.alert('Input Error', 'Please fill in all fields');
                return;
            }

            if (!validateEmail(email)) {
                // 
                console.log('logged in');
                return;
            }

            if (password.length < 8) {
                Alert.alert('Password Error', 'Password should be 8 characters or more');
                return;
            }

            if (password !== confirmPassword) {
                Alert.alert('Password Error', 'Passwords do not match');
                return;
            }

            // Firebase authentication signup
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);

            // Save user data to Firestore
            const userId = userCredential.user.uid;
            await firestore().collection('users').doc(userId).set({
                fullName,
                mobileNumber,
                email,
                address,
                userType,
            });

            // Continue with navigation or other actions
            navigation.navigate('Login'); // Replace 'Login' with your desired screen name
        } catch (error) {
            // Handle signup errors
            Alert.alert('Error', error.message);
        }
    };

    const validateEmail = (email) => {
        // Simple email validation regex, you may use a more robust solution
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <ImageBackground
            source={require('../../../assets/bg.png')}
            style={styles.backgroundImage}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.signUpBox}>
                    <Text style={[styles.heading, styles.centerText]}>Sign Up</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={(text) => setFullName(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Mobile Number"
                        value={mobileNumber}
                        onChangeText={(text) => setMobileNumber(text)}
                        keyboardType="numeric"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Address"
                        value={address}
                        onChangeText={(text) => setAddress(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email ID"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        keyboardType="email-address"
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Text style={styles.eyeIcon}>{showPassword ? '👁' : '👁‍🗨'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={(text) => setConfirmPassword(text)}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁' : '👁‍🗨'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <Text style={[styles.buttonText, { fontSize: 18, fontWeight: 'bold' }]}>Continue</Text>
                    </TouchableOpacity>

                    <Text style={styles.privacyText}>
                        By continuing, you agree to Go Green's privacy notice and conditions of use
                    </Text>
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
    signUpBox: {
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
    input: {
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 15,
    },
    passwordInput: {
        flex: 1,
    },
    eyeIcon: {
        fontSize: 20,
        marginLeft: 10,
    },
    continueButton: {
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
    privacyText: {
        color: 'black',
        marginTop: 10,
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
