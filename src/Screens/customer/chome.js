import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, FlatList, Image, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SearchScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [address, setAddress] = useState('Sign in ;) ');
    const [offers, setOffers] = useState([]);
    const [secondaryOffers, setSecondaryOffers] = useState([]);
    const [items, setItems] = useState([]);

    // Use window dimensions to dynamically set card width and height
    const windowWidth = useWindowDimensions().width;

    useEffect(() => {
        // Load user's address, offers, and secondary offers when the component mounts
        loadUserAddress();
        loadOffers();
        loadSecondaryOffers();
        loadItems();
    }, []);
    const loadItems = async () => {
        try {
            // Fetch items data from Firestore or any other source
            const itemsCollection = await firestore().collection('items').get();

            const itemsData = itemsCollection.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setItems(itemsData);
        } catch (error) {
            console.error('Error loading items:', error.message);
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

    const loadOffers = async () => {
        try {
            // Fetch offers data from Firestore or any other source
            const offersData = [
                {
                    id: '1',
                    title: '40% OFF',
                    description: '',
                    imageUrl: 'https://www.vedantu.com/seo/content-images/3c3c6f07-d69f-4ff2-ad49-70ba39d25599.png', // Replace with actual image URL
                },
                {
                    id: '2',
                    title: '50 % OFF',
                    description: '',
                    imageUrl: 'https://www.vedantu.com/seo/content-images/3c3c6f07-d69f-4ff2-ad49-70ba39d25599.png', // Replace with actual image URL
                },
                // Add more offers as needed
            ];

            setOffers(offersData);
        } catch (error) {
            console.error('Error loading offers:', error.message);
        }
    };

    const loadSecondaryOffers = async () => {
        try {
            // Fetch secondary offers data from Firestore or any other source
            const secondaryOffersData = [
                {
                    id: '3',
                    title: 'plant 1',
                    description: 'description',
                    imageUrl: 'https://www.vedantu.com/seo/content-images/3c3c6f07-d69f-4ff2-ad49-70ba39d25599.png', // Replace with actual image URL
                },
                {
                    id: '4',
                    title: 'plant 2',
                    description: 'description',
                    imageUrl: 'https://www.vedantu.com/seo/content-images/3c3c6f07-d69f-4ff2-ad49-70ba39d25599.png', // Replace with actual image URL
                },
                {
                    id: '5',
                    title: 'Plant 3',
                    description: 'description',
                    imageUrl: 'https://www.vedantu.com/seo/content-images/3c3c6f07-d69f-4ff2-ad49-70ba39d25599.png', // Replace with actual image URL
                },
                {
                    id: '6',
                    title: 'Plant 4',
                    description: 'description',
                    imageUrl: 'https://www.vedantu.com/seo/content-images/3c3c6f07-d69f-4ff2-ad49-70ba39d25599.png', // Replace with actual image URL
                },
                {
                    id: '7',
                    title: 'Plant 5',
                    description: 'description',
                    imageUrl: 'https://www.vedantu.com/seo/content-images/3c3c6f07-d69f-4ff2-ad49-70ba39d25599.png', // Replace with actual image URL
                },
                {
                    id: '8',
                    title: 'Plant 6',
                    description: 'description',
                    imageUrl: 'https://www.vedantu.com/seo/content-images/3c3c6f07-d69f-4ff2-ad49-70ba39d25599.png', // Replace with actual image URL
                },
                {
                    id: '9',
                    title: 'Plant 7',
                    description: 'description',
                    imageUrl: 'https://www.vedantu.com/seo/content-images/3c3c6f07-d69f-4ff2-ad49-70ba39d25599.png', // Replace with actual image URL
                },
                // Add more secondary offers as needed
            ];

            setSecondaryOffers(secondaryOffersData);
        } catch (error) {
            console.error('Error loading secondary offers:', error.message);
        }
    };

    const updateSearch = (text) => {
        setSearchText(text);
        console.log(text);
    };

    const openDrawer = () => {
        console.log('Drawer opened');
    };

    const openShoppingCart = () => {
        console.log('Shopping cart opened');
    };

    // Render each card in the FlatList
    const renderOfferCard = ({ item }) => (
        <View style={{ ...styles.offerCard, width: windowWidth - 40, height: windowWidth * 0.7 }}>
            {/* Add Image component with the source prop pointing to the item's imageUrl */}
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.offerImage}
            />
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text style={styles.offerDescription}>{item.description}</Text>
        </View>
    );

    // Render each card in the second FlatList (3 cards at a time)
    const renderSecondaryOfferCard = ({ item }) => (
        <View style={{ ...styles.secondaryOfferCard, width: (windowWidth - 40) / 3, height: (windowWidth - 40) / 3 }}>
            {/* Add Image component with the source prop pointing to the item's imageUrl */}
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.secondaryOfferImage}
            />
            <Text style={styles.secondaryOfferTitle}>{item.title}</Text>
            <Text style={styles.secondaryOffeerDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header Section */}
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

            {/* Address Section */}
            <View style={styles.addressContainer}>
                <MaterialIcons name="location-on" size={30} color="black" style={styles.locationIcon} />
                <Text style={styles.address}>{address}</Text>
            </View>

            {/* Offers Section */}
            <View style={styles.offersContainer}>
                {/* <MaterialIcons name="star" size={24} color="black" style={styles.locationIcon} /> */}
                <Text style={styles.offers}>Offers</Text>
            </View>

            {/* Scrollable Card Section */}
            <FlatList
                data={offers}
                renderItem={renderOfferCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={true}
                snapToInterval={windowWidth - 16}  // Ensure one card is visible at a time
                decelerationRate="fast"  // Adjust the deceleration rate as needed
                contentContainerStyle={styles.flatListContent}
            />

            <Text style={styles.secondaryOfferstext}>Plants</Text>
            {/* Second Scrollable Card Section (3 cards at a time) */}
            <FlatList
                data={secondaryOffers}
                renderItem={renderSecondaryOfferCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={true}
                decelerationRate="fast"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '5%',
    },
    icon: {
        marginTop: '30%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
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
    // Styles for the first horizontal scroll (single card)
    offerCard: {
        backgroundColor: '#eee',
        borderRadius: 8,
        padding: 0,
        marginHorizontal: 8,
    },
    offerImage: {
        width: '100%',
        aspectRatio: 3 / 2, // Adjust the aspect ratio based on your image dimensions
        borderRadius: 8,
        marginBottom: '5%',
    },
    offerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    offerDescription: {
        fontSize: 14,
        color: 'gray',
    },
    offersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingBottom: '1%',
    },
    offers: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'monospace',
    },
    flatListContent: {
        marginTop: 10,
    },
    // Styles for the second horizontal scroll (3 cards at a time)
    secondaryOffers: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 0,
    },
    secondaryOfferCard: {
        backgroundColor: '#eee',
        borderRadius: 8,
        padding: 8,
        marginHorizontal: 8,
        marginBottom: '10%',
    },
    secondaryOfferImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        marginBottom: 8,
    },
    secondaryOfferTitle: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    },
    secondaryOfferstext: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'monospace',
        marginBottom: '5%',
    }
});

export default SearchScreen;