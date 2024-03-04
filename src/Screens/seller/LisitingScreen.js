import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';

const ListYourItemScreen = ({ navigation }) => {
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemImage, setItemImage] = useState(null);

    const handleChooseImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
            });

            setItemImage(image.path);
        } catch (error) {
            console.log('ImagePicker Error:', error);
        }
    };

    const uploadImageToStorage = async (imagePath, userId) => {
        try {
            const response = await fetch(imagePath);
            const blob = await response.blob();

            const storageRef = storage().ref();

            // Create a user-specific folder using the userId
            const userImageRef = storageRef.child(`user-images/${userId}`);

            // Generate a unique image name (you can use a timestamp or other unique identifier)
            const imageName = new Date().getTime() + '-item-image';

            const imageRef = userImageRef.child(imageName);

            await imageRef.put(blob);
            const imageUrl = await imageRef.getDownloadURL();

            return imageUrl;
        } catch (error) {
            console.log('Error uploading image:', error);
            return null;
        }
    };

    const handleListYourItem = async () => {
        try {
            if (!itemName.trim() || !itemDescription.trim() || !itemPrice.trim() || !itemImage) {
                Alert.alert('Error', 'Please fill in all fields and choose an image');
                return;
            }

            // Assuming the seller's ID is obtained from authentication
            const currentUser = auth().currentUser;
            const sellerId = currentUser.uid;

            const imageUrl = await uploadImageToStorage(itemImage, sellerId);

            if (!imageUrl) {
                Alert.alert('Error', 'Failed to upload image');
                return;
            }

            // Save the item details to Firestore
            await firestore().collection('items').add({
                itemName,
                itemDescription,
                itemPrice,
                sellerId,
                imageUrl,
            });

            // Navigate back to SellerHome to trigger a refresh
            navigation.replace('SellerTabNavigator'); // Replace with your actual screen name
        } catch (error) {
            console.log('Error listing the item:', error);
            Alert.alert('Error', 'Unable to list the item');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.heading, styles.centerText]}>List Your Item</Text>

            <TouchableOpacity style={styles.imagePickerButton} onPress={handleChooseImage}>
                <Text style={styles.buttonText}>Choose Image</Text>
            </TouchableOpacity>

            {itemImage && (
                <Image source={{ uri: itemImage }} style={styles.itemImage} />
            )}

            <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={itemName}
                onChangeText={(text) => setItemName(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Item Description"
                value={itemDescription}
                onChangeText={(text) => setItemDescription(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Item Price"
                value={itemPrice}
                onChangeText={(text) => setItemPrice(text)}
                keyboardType="numeric"
            />

            {/* Feature: List Your Item */}
            <TouchableOpacity style={styles.listItemButton} onPress={handleListYourItem}>
                <Text style={[styles.buttonText, { fontSize: 18, fontWeight: 'bold' }]}>List Item</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
        width: '100%',
    },
    listItemButton: {
        backgroundColor: '#81b29a',
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    imagePickerButton: {
        backgroundColor: '#81b29a',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    itemImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});

export default ListYourItemScreen;
