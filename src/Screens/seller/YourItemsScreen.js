import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';

const SellerItemsScreen = ({ navigation }) => {
    const [sellerId, setSellerId] = useState('');
    const [sellerItems, setSellerItems] = useState([]);
    const [sortOption, setSortOption] = useState('name'); // Default sorting by name

    useEffect(() => {
        // Load seller's items when the component mounts
        loadSellerItems();
    }, [sortOption]);

    // Fetch seller's items from Firestore
    const loadSellerItems = async () => {
        try {
            const currentUser = auth().currentUser;

            if (currentUser) {
                const userId = currentUser.uid;
                setSellerId(userId);

                let itemsCollection = firestore().collection('items').where('sellerId', '==', userId);

                // Sort items based on the selected option
                if (sortOption === 'name') {
                    itemsCollection = itemsCollection.orderBy('itemName');
                } else if (sortOption === 'itemPrice') {
                    itemsCollection = itemsCollection.orderBy('itemPrice');
                } else if (sortOption === 'createdAt') {
                    itemsCollection = itemsCollection.orderBy('createdAt');
                }

                const itemsData = await itemsCollection.get();

                const itemsArray = itemsData.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setSellerItems(itemsArray);
            }
        } catch (error) {
            console.error('Error loading seller items:', error.message);
        }
    };

    const updateSortOption = (option) => {
        setSortOption(option);
    };

    const renderSellerItem = ({ item }) => (
        <TouchableOpacity style={styles.itemCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemDescription}>{item.itemDescription}</Text>
                <Text style={styles.itemPrice}>Price: ${item.itemPrice}</Text>
                <TouchableOpacity
                    style={styles.removeItemButton}
                    onPress={() => handleRemoveItem(item.id)}
                >
                    <Text style={styles.removeItemText}>Remove Item</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.editItemButton}
                    onPress={() => handleEditItem(item.id)}
                >
                    <Text style={styles.editItemText}>Edit Item</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const handleEditItem = (itemId) => {
        // Navigate to the item editing screen, passing the itemId as a parameter
        navigation.navigate('EditItemScreen', { itemId });
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await firestore().collection('items').doc(itemId).delete();
            // Refresh the item list after removal
            loadSellerItems();
        } catch (error) {
            console.error('Error removing item:', error.message);
        }
    };
    const Handleaddnewitem = () => {
        navigation.navigate('ListYourItem');
    }
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your Items</Text>

            {/* Dropdown for sorting options */}
            <View style={styles.sortDropdownContainer}>
                <Text style={styles.sortLabel}>Sort By:</Text>
                <Picker
                    style={styles.sortDropdown}
                    selectedValue={sortOption}
                    onValueChange={(value) => updateSortOption(value)}
                >
                    <Picker.Item label="Name" value="name" />
                    <Picker.Item label="Price" value="itemPrice" />
                    <Picker.Item label="Date Created" value="createdAt" />
                    {/* Add more sorting options as needed */}
                </Picker>
            </View>

            <FlatList
                data={sellerItems}
                renderItem={renderSellerItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
                style={styles.editItemButton}
                onPress={() => Handleaddnewitem()}
            >
                <Text style={styles.addItemText}>Add New Item</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
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
    itemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#81b29a',
    },
    removeItemButton: {
        backgroundColor: 'tomato',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    removeItemText: {
        color: 'white',
        fontWeight: 'bold',
    },
    editItemButton: {
        backgroundColor: '#81b29a',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    editItemText: {
        color: 'white',
        fontWeight: 'bold',
    },
    sortDropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sortLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    sortDropdown: {
        flex: 1,
        height: 40,
        borderColor: '#81b29a',
        borderWidth: 1,
        borderRadius: 8,
        padding: 5,
    },
    addItemButton: {
        backgroundColor: '#81b29a',
        borderRadius: 5,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    addItemText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SellerItemsScreen;
