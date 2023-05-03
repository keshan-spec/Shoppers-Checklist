import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';
import * as cheerio from 'cheerio';


interface ProductList {
    name: string;
    image: string;
}
interface SearchFieldProps {
    onSearch: (props: ProductList[]) => void;
}

export default function SearchField({ onSearch }: SearchFieldProps) {
    const [search, setSearch] = useState('');

    const onsubmit = () => {
        fetch('https://www.bestwaywholesale.co.uk/search?w=' + search)
            .then((response) => response.text())
            .then((html) => {
                console.log('https://www.bestwaywholesale.co.uk/search?w=' + search);
                const $ = cheerio.load(html);
                const productList = $('#shop-products li');

                let products: ProductList[] = [];
                productList.each((index, element) => {
                    const productName = $(element).find('.prodname a').text().trim();
                    const imageSrc = $(element).find('div.prodimageinner img').attr('src');

                    if (productName != ''){
                        products.push({
                            name: productName,
                            image: imageSrc!,
                        });
                    }

                });
                
                onSearch(products);
            })
            .catch((error) => console.log(error));
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="web-search"
                onChangeText={(text) => setSearch(text)}
                value={search}
            />
            <TouchableOpacity style={styles.button} onPress={onsubmit}>
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});
