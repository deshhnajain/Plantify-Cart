import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CartScreen = () => {
    const [cartItems, setCartItems] = useState([]);
    const currentUser = auth().currentUser;

    useEffect(() => {
        if (currentUser) {
            const userId = currentUser.uid;

            const unsubscribe = firestore()
                .collection('users')
                .doc(userId)
                .collection('cart')
                .onSnapshot((snapshot) => {
                    const items = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setCartItems(items);
                });

            return () => unsubscribe();
        }
    }, [currentUser]);

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.itemPrice * item.quantity, 0);
    };

    const handlePurchase = () => {
        // Implement logic to handle the purchase
        console.log('Purchase button clicked');
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemPrice}>Price: ${item.itemPrice}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Shopping Cart</Text>
            {cartItems.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <MaterialIcons name="remove-shopping-cart" size={100} color="#ccc" />
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                </View>
            ) : (
                <FlatList
                    data={cartItems}
                    renderItem={renderCartItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                />
            )}
            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <Text style={styles.totalPrice}>Total Price: ${calculateTotalPrice().toFixed(2)}</Text>
                    <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
                        <Text style={styles.purchaseButtonText}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
        elevation: 3,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e53935',
        marginBottom: 8,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    purchaseButton: {
        backgroundColor: '#e53935',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    purchaseButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CartScreen;
