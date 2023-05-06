import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';
import * as cheerio from 'cheerio';

// Utils
import { fetchQuery, fetchBarCode } from '../utils/api';

import { PList } from '../utils/types';
interface SearchFieldProps {
    onSearch: (props: PList[]) => void;
    onLoading: (props: boolean) => void;
}

export default function SearchField({ onSearch, onLoading }: SearchFieldProps) {
    const [search, setSearch] = useState('');

    const onsubmit = async () => {
        let products: PList[] = [];
        onLoading(true);

        let supplier1 = await fetchQuery(search);

        let $ = cheerio.load(supplier1);
        $('div.col-sm-3').each((i, el) => {
            const productName = $(el).find('.lst-txt-box span.listing-title').text().trim();
            const productImage = $(el).find('img').attr('src');

            if (productName) {
                products.push({
                    name: productName,
                    image: productImage!,
                    supplier: 'Dhamecha'
                });
            }
        });

        let supplier2 = await fetchBarCode(search)

        $ = cheerio.load(supplier2);
        const productList = $('#shop-products li');

        productList.each((_, element) => {
            const productName = $(element).find('.prodname a').text().trim();
            const imageSrc = $(element).find('div.prodimageinner img').attr('src');

            if (productName != '') {
                products.push({
                    name: productName,
                    image: imageSrc!,
                    supplier: 'Bestway'
                });
            }
        });

        if (products.length == 0) {
            products.push({
                name: '',
                image: '',
            });
        }

        onLoading(false);
        onSearch(products);
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
