import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import { FontAwesome } from '@expo/vector-icons';

const ItemListScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [address, setAddress] = useState('Sign in ;) ');
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        // Load items when the component mounts
        loadUserAddress();
        loadItems();
    }, []);


    const handleAddToCart = async (item) => {
        try {
            const currentUser = auth().currentUser;

            if (currentUser) {
                const userId = currentUser.uid;

                // Check if the item already exists in the user's cart
                const existingCartItem = await firestore()
                    .collection('users')
                    .doc(userId)
                    .collection('cart')
                    .doc(item.id)
                    .get();

                if (existingCartItem.exists) {
                    // Item already exists, update the quantity
                    await existingCartItem.ref.update({ quantity: existingCartItem.data().quantity + 1 });
                } else {
                    // Item does not exist, add it to the cart
                    await firestore()
                        .collection('users')
                        .doc(userId)
                        .collection('cart')
                        .doc(item.id)
                        .set({
                            ...item,
                            quantity: 1,
                        });
                }

                console.log(`Added ${item.itemName} to Cart`);
            } else {
                console.log('User not logged in. Cannot add to cart.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error.message);
        }
    };

    const loadItems = async () => {
        try {
            setIsLoading(true);
            const itemsCollection = await firestore().collection('items').get();
            const itemsData = itemsCollection.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setItems(itemsData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading items:', error.message);
            setIsLoading(false);
            setIsError(true);
        }
    };
    const loadUserAddress = async () => {
        try {
            const currentUser = auth().currentUser;

            if (currentUser) {
                const userId = currentUser.uid;
                const userDocument = await firestore().collection('users').doc(userId).get();

                if (userDocument.exists) {
                    const userData = userDocument.data();
                    setAddress(userData.address || 'You are not logged in :(');
                }
            }
        } catch (error) {
            console.error('Error loading user address:', error.message);
        }
    };

    const renderListItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemCard}
            onPress={() => navigation.navigate('BuyScreen', { itemId: item.id })}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemDescription}>{item.itemDescription}</Text>
                <View style={styles.priceAndRating}>
                    <Text style={styles.itemPrice}>Price: ${item.itemPrice}</Text>
                    <View style={styles.ratingContainer}>
                        <FontAwesome name="star" size={14} color="#333" />
                        <Text style={styles.itemRating}>{item.itemRating || 'N/A'}</Text>
                    </View>
                </View>
                <View style={styles.discountContainer}>
                    <Text style={styles.discountText}>{item.discountPercentage}% OFF</Text>
                </View>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => handleAddToCart(item)}
                >
                    <FontAwesome name="cart-plus" size={18} color="white" />
                    <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderItemImage = ({ item }) => (
        <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('BuyScreen', { itemId: item.id })}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.scrollImage} />
                <Text style={styles.itemNameText}>{item.itemName}</Text>
            </View>
        </TouchableOpacity>
    );

    const updateSearch = (text) => {
        setSearchText(text);
        console.log(text);
    };

    const openDrawer = () => {
        console.log('Drawer opened');
    };

    const openShoppingCart = () => {
        navigation.navigate('CartScreen');
    };

    return (
        <FlatList
            style={styles.container}
            data={items}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={openDrawer}>
                            <MaterialIcons name="menu" size={32} color="black" style={styles.icon} />
                        </TouchableOpacity>
                        <View style={styles.searchContainer}>
                            <MaterialIcons name="search" size={24} color="black" style={styles.searchIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Type Here..."
                                onChangeText={updateSearch}
                                value={searchText}
                            />
                        </View>
                        <TouchableOpacity onPress={openShoppingCart}>
                            <MaterialIcons name="shopping-cart" size={32} color="black" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.addressContainer}>
                        <MaterialIcons name="location-on" size={30} color="black" style={styles.locationIcon} />
                        <Text style={styles.address}>{address}</Text>
                    </View>
                    <Text style={styles.galleryHeading}>Offers</Text>
                    <FlatList
                        data={items}
                        horizontal
                        pagingEnabled
                        snapToAlignment="center"
                        decelerationRate="fast"
                        renderItem={renderItemImage}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                    />
                </>
            }
            ListFooterComponent={() => {
                if (isLoading) {
                    return <ActivityIndicator size="large" color="#e53935" />;
                } else if (isError) {
                    return <Text style={{ color: 'red', textAlign: 'center' }}>Error loading items.</Text>;
                } else if (items.length === 0) {
                    return <Text style={{ color: '#777', textAlign: 'center' }}>No items available.</Text>;
                } else {
                    return null;
                }
            }}
        />
    );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '5%',
    },
    icon: {
        marginTop: '20%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 0,
        flex: 1,
        marginHorizontal: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingBottom: '5%',
    },
    locationIcon: {
        marginRight: 8,
    },
    address: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    galleryHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    itemCard: {
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
        width: 100,
        height: 100,
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
    priceAndRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e53935',
        marginRight: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemRating: {
        fontSize: 14,
        color: '#333',
        marginLeft: 4,
    },
    addToCartButton: {
        flexDirection: 'row',
        backgroundColor: '#e53935',
        borderRadius: 5,
        padding: 8,
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    itemNameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
    },
    scrollImage: {
        width: windowWidth,
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
});


export default ItemListScreen;