import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
    const navigation = useNavigation();

    const handleCustomerPress = () => {
        navigation.navigate('Login');
    };

    const handleSupplierPress = () => {
        navigation.navigate('SLogin');
    };

    useEffect(() => {
        fadeInDownBigLogo();
    }, []);

    const fadeInDownBigLogo = () => {
        this.logoView.fadeInDownBig(1000);
    };

    return (
        <ImageBackground
            source={require('../../../assets/bg.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Animatable.View
                    ref={(ref) => (this.logoView = ref)}
                    style={styles.logoContainer}
                    animation="fadeInDownBig"
                    duration={1500}
                    delay={100}
                >
                    <Image
                        source={require('../../../assets/gglogo.png')}
                        style={styles.logo}
                    />
                </Animatable.View>
                <TouchableOpacity onPress={handleCustomerPress}>
                    <Button
                        title="Start shopping"
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}  // Add titleStyle for font customization
                        onPress={handleCustomerPress}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Button
                        title="Supplier Hub"
                        onPress={handleSupplierPress}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}  // Add titleStyle for font customization
                    />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        width: 300,
        height: 300,
    },
    button: {
        marginVertical: 15,
        width: 300,
        height: 60,
        borderRadius: 30,  // Make the button a little curvy
        backgroundColor: '#81b29a',  // Change the button color
    },
    buttonTitle: {
        fontSize: 20,
        fontWeight: 'bold',  // Add fontWeight for font customization
        color: 'white',  // Change the font color
        fontStyle: 'italic',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
});

export default WelcomeScreen;