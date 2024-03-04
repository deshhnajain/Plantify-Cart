// QuickViewScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const QuickViewScreen = ({ route }) => {
    const { itemId } = route.params;
    const [itemDetails, setItemDetails] = useState(null);

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

    return (
        <View style={styles.container}>
            {itemDetails && (
                <>
                    <Image source={{ uri: itemDetails.imageUrl }} style={styles.itemImage} />
                    <View style={styles.itemDetailsContainer}>
                        <Text style={styles.itemName}>{itemDetails.itemName}</Text>
                        <Text style={styles.itemDescription}>{itemDetails.itemDescription}</Text>
                        <Text style={styles.itemPrice}>Price: ${itemDetails.itemPrice}</Text>
                        <Text style={styles.itemRating}>Rating: {itemDetails.itemRating || 'N/A'}</Text>
                        {/* Add any other details you want to display */}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    itemImage: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginBottom: 16,
    },
    itemDetailsContainer: {
        flex: 1,
        width: '100%',
    },
    itemName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    itemDescription: {
        fontSize: 16,
        marginBottom: 8,
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e53935',
        marginBottom: 8,
    },
    itemRating: {
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
});

export default QuickViewScreen;
