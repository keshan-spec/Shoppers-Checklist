import React from 'react';
import { View, Text, Image, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ProductCardProps {
    name: string;
    imageUri: string;
    onAdd: (name: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({name, imageUri, onAdd}) => {
    if (!name) {
        return (
            <View style={styles.container}>
                <Text>No product found</Text>
            </View>
        )
    }

    const onPress = () => {
        Alert.alert('Added to cart');
        onAdd(name);
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
            </View>
            <Text style={styles.name}>{name}</Text>
            <TouchableOpacity style={styles.plusButton} onPress={onPress}>
                <FontAwesome name="plus" size={10} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 20,
        margin: 10,
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 10,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    name: {
        flex: 1,
        fontWeight: 'bold',
    },
    plusButton: {
        backgroundColor: '#007AFF',
        borderRadius: 50,
        width: 30,
        height: 30,
        alignItems: 'center',
        padding: 10,
    },
});

export default ProductCard;

// const styles = StyleSheet.create({
//     container: {
//         maxHeight: '40%',
//         // backgroundColor: '#000',
//         padding: 10,
//         display: 'flex',
//         alignItems: 'center',
//         maxWidth: '50%',
//         overflow: 'hidden',
//         margin: 10,
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover',
//     },
//     name: {
//         fontWeight: 'bold',
//         marginTop: 5,
//     },
//     imageContainer: {
//         maxWidth: 250,
//         maxHeight: 250,
//         padding: 10,
//     },
//     button: {
//         backgroundColor: '#007aff',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 4,
//         marginTop: 8,
//     },
//     buttonText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#fff',
//     },
// });

// export default ProductCard;
