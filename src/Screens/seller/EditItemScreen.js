import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const EditItemScreen = ({ route, navigation }) => {
    const { itemId } = route.params;
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemImages, setItemImages] = useState([]);

    useEffect(() => {
        // Load item details when the component mounts
        loadItemDetails();
    }, []);

    const loadItemDetails = async () => {
        try {
            const itemDocument = await firestore().collection('items').doc(itemId).get();

            if (itemDocument.exists) {
                const itemData = itemDocument.data();
                setItemName(itemData.itemName);
                setItemDescription(itemData.itemDescription);
                setItemPrice(itemData.itemPrice.toString()); // Convert to string for TextInput
                setItemImages(itemData.itemImages || []); // Set default value as an empty array
            }
        } catch (error) {
            console.error('Error loading item details:', error.message);
        }
    };

    const handleChooseImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
            });

            // Update item images state with the newly chosen image
            setItemImages([...itemImages, image.path]);
        } catch (error) {
            console.log('ImagePicker Error:', error);
        }
    };

    const handleEditItem = async () => {
        try {
            // Validate input fields
            if (!itemName.trim() || !itemDescription.trim() |x| !itemPrice.trim()) {
                Alert.alert('Error', 'Please fill in all fields');
                return;
            }

            // Update item details in Firestore
            await firestore().collection('items').doc(itemId).update({
                itemName,
                itemDescription,
                itemPrice: parseFloat(itemPrice), // Convert back to float
                itemImages,
            });

            // Navigate back to SellerItemsScreen
            navigation.goBack();
        } catch (error) {
            console.error('Error editing item:', error.message);
            Alert.alert('Error', 'Unable to edit the item');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Edit Item</Text>

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

            <TouchableOpacity style={styles.imagePickerButton} onPress={handleChooseImage}>
                <Text style={styles.buttonText}>Choose Additional Image</Text>
            </TouchableOpacity>

            {itemImages.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.itemImage} />
            ))}

            <TouchableOpacity style={styles.editItemButton} onPress={handleEditItem}>
                <Text style={styles.editItemText}>Save Changes</Text>
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
    input: {
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 15,
        width: '100%',
    },
    imagePickerButton: {
        backgroundColor: '#81b29a',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
    },
    editItemButton: {
        backgroundColor: '#81b29a',
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    editItemText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default EditItemScreen;
