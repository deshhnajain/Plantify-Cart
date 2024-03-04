import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ImageBackground, TextInput, Alert, TouchableWithoutFeedback } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes, } from '@react-native-google-signin/google-signin';
import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null); // Firebase user object
    const navigation = useNavigation();
    const showAlert = () =>
        Alert.alert(
            'Alert Title',
            'Wrong email id Trying to login as a Customer?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            {
                cancelable: true,
            },
        );

    useBackHandler(() => {
        // Handle hardware back button press
        navigation.navigate('welcome'); // Navigate to the welcome screen
        return true; // Prevent default behavior (exit the app)
    });
    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {

                // Check user type
                checkUserType(user.uid);
                // User is signed in, navigate to the main part of your app
                navigation.replace('SellerTabNavigator');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '49040752279-n26th7rl5p47q5802883l3es0vgl26do.apps.googleusercontent.com',
        });
    }, []);


    const checkUserType = async (userId) => {
        try {
            const userDoc = await firestore().collection('users').doc(userId).get();
            const userType = userDoc.data()?.userType;

            if (userType === 'seller') {
                // Navigate to the main part of your app
                navigation.replace('SellerTabNavigator');
            } else if (userType === 'customer') {
                // Log out the user if userType is 'customer'
                await auth().signOut();
                showAlert();
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Error checking user type:', error);
        }
    };

    const handleLogin = async () => {
        try {
            if (!email.trim()) {
                Alert.alert('Email Error', 'Please enter your email');
            } else if (password.length < 8) {
                Alert.alert('Password Error', 'Password should be 8 characters or more');
            } else {
                // Firebase authentication login
                const userCredential = await auth().signInWithEmailAndPassword(email, password);
                // Check userType after successful login
                checkUserType(userCredential.user.uid);
            }
        } catch (error) {
            // Handle login errors
            Alert.alert('Error', error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setuserType
            setUser({ userInfo });
            // Check userType after successful Google sign-in
            checkUserType(userInfo.user.id);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                console.log('User created using google sign in');
                navigation.navigate('SellerTabNavigator');
            }
        }
    };

    useEffect(() => {
        if (user) {
            // If the user is logged in, navigate to the desired screen
            navigation.navigate('SellerTabNavigator');
        }
    }, [user, navigation]);

    return (
        <ImageBackground
            source={require('../../../assets/bg.png')}
            style={styles.backgroundImage}
        >
            <ScrollView
                contentContainerStyle={styles.container}>
                {/* Logo */}
                <Image source={require('../../../assets/gglogo.png')} style={styles.enlargedLogo} />

                {/* Login Box */}
                <View style={styles.loginBox}>
                    <Text style={[styles.loginHeading, styles.centerText]}>LOGIN</Text>

                    {/* Email and Password */}
                    <View style={styles.inputContainer}>
                        <Text>Email:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text>Password:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                        />
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity style={[styles.continueButton, { backgroundColor: '#81b29a' }]} onPress={handleLogin}>
                        <Text style={[styles.buttonText, { fontSize: 18, fontWeight: 'bold' }]}>Continue</Text>
                    </TouchableOpacity>

                    {/* OR */}
                    <View style={styles.orContainer}>
                        <Text style={[styles.orText, { fontSize: 18, fontWeight: 'bold' }]}>OR</Text>
                        {/* Image for Navigation */}
                        <TouchableWithoutFeedback onPress={handleGoogleSignIn}>
                            <Image source={require('../../../assets/google.png')} style={styles.imageButtonIcon} resizeMode="contain" />
                        </TouchableWithoutFeedback>
                    </View>

                    {/* Terms and Conditions */}
                    <Text style={styles.termsText}>
                        By continuing, you agree to GoGreen's terms and conditions
                    </Text>
                </View>

                {/* Signup Text */}
                <Text style={[styles.signupText, { fontSize: 18, fontWeight: 'bold' }]}>New to GoGreen?</Text>

                {/* New to GoGreen? Signup Button */}
                <TouchableOpacity
                    style={[styles.signupButton, { backgroundColor: '#81b29a', width: '70%' }]}
                    onPress={() => navigation.navigate('SellerSignup')}
                >
                    <Text style={[styles.buttonText, { fontSize: 18, fontWeight: 'bold' }]}>Signup</Text>
                </TouchableOpacity>
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
    enlargedLogo: {
        width: 200, // Increase the size of the logo
        height: 200, // Increase the size of the logo
        marginBottom: 0,
        marginTop: 0,
    },
    loginBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Lighten the background
        padding: 20,
        borderRadius: 10,
        width: '100%',
    },
    loginHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    centerText: {
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 10,
    },
    continueButton: {
        backgroundColor: '#81b29a',
        borderRadius: 5,
        paddingVertical: 10,
        marginBottom: 0,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    orText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 0,
    },
    termsText: {
        color: 'black',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    signupButton: {
        backgroundColor: '#81b29a',  // Adjust color accordingly
        borderRadius: 5,
        paddingVertical: 8, // Increase the size of the signup button
        alignItems: 'center',
        marginTop: 15,
    },
    input: {
        borderBottomWidth: 1,
        padding: 5,
        marginBottom: 5,
    },
    signupText: {
        fontSize: 30,
        marginTop: 20,
        fontWeight: 'bold',
        color: '#0b090a',
    },
    imageButtonIcon: {
        width: '20%', // Adjust the width of the image to 100%
        height: '20%', // Adjust the height of the image to 100%
    },
    orContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
    },
});

export default LoginScreen;