import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
// import { addToCart } from '../redux/actions/cartActions';
import { Picker } from '@react-native-picker/picker';

const ItemDetailsScreen = ({ route }) => {
    const { itemId } = route.params;
    const [itemDetails, setItemDetails] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Load item details when the component mounts
        loadItemDetails();
    }, []);

    const loadItemDetails = async () => {
        try {
            const itemDocument = await firestore().collection('items').doc(itemId).get();

            if (itemDocument.exists) {
                const itemData = itemDocument.data();
                setItemDetails(itemData);
            }
        } catch (error) {
            console.error('Error loading item details:', error.message);
        }
    };

    const handleBuyItem = () => {
        // Implement the logic to handle the buying process
        // For now, let's add the item to the shopping cart
        console.log('buyed');
    };

    if (!itemDetails) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.itemName}>{itemDetails.itemName}</Text>

            <ScrollView horizontal pagingEnabled style={styles.imageSlider}>
                {itemDetails.itemImages && itemDetails.itemImages.length > 0 ? (
                    itemDetails.itemImages.map((image, index) => (
                        <Image key={index} source={{ uri: image }} style={styles.itemImage} />
                    ))
                ) : (
                    <Text>No images available</Text>
                )}
            </ScrollView>

            <Text style={styles.itemDescription}>{itemDetails.itemDescription}</Text>
            <Text style={styles.itemPrice}>Price: ${itemDetails.itemPrice}</Text>

            <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <Picker
                    style={styles.quantityPicker}
                    selectedValue={quantity}
                    onValueChange={(value) => setQuantity(value)}
                >
                    {[...Array(10).keys()].map((value) => (
                        <Picker.Item key={value} label={`${value + 1}`} value={value + 1} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.buyButton} onPress={handleBuyItem}>
                <Text style={styles.buyButtonText}>Add to Cart</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imageSlider: {
        height: 200,
    },
    itemImage: {
        width: 300,
        height: 200,
        borderRadius: 8,
        marginRight: 10,
    },
    itemDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#81b29a',
        marginBottom: 20,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    quantityLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    quantityPicker: {
        flex: 1,
        height: 40,
        borderColor: '#81b29a',
        borderWidth: 1,
        borderRadius: 8,
    },
    buyButton: {
        backgroundColor: '#81b29a',
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
    },
    buyButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ItemDetailsScreen;
