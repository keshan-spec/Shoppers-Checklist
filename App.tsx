import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, Alert, Image, Modal, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as cheerio from 'cheerio';

// Components
import ProductCard from './components/ProductList';
import ModernButton from './components/Button';
import SearchField from './components/Search';

// Utils
import { fetchBarCode } from './utils/api';


const { height } = Dimensions.get('window');


export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [productList, setProductList] = useState<{ name: string, image: string, supplier?: string }[]>([]);

  const [barcode, setBarcode] = useState('');
  const [data, setData] = useState<[{name: string, image: string, supplier?: string}]>([{
    name: '',
    image: '',
  }]);

  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };


  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    if (scanned && barcode) {
        fetchBarCode(barcode).then((response: string) => {
          const $ = cheerio.load(response);
          const productName = $('#shop-products li:nth-child(1) .prodname a').text().trim();

          const imageSrc = $('li div.prodimageinner img').attr('src');

          setData([{
            name: productName,
            image: imageSrc!,
            supplier: 'Bestway'
          }]);
        });
    }
  }, [scanned, barcode]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcode(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const onAdd = (data: { name: string, image: string, supplier?: string }) => {
    setProductList([...productList!,  data]);
  };

  return (
    <>
      <View style={styles.maincontainer}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ width: '100%', height: '50%', backgroundColor: 'black', padding: 0, margin: 0 }}
        />
      <SearchField onSearch={setData} />
      <ScrollView style={{ height: '40%', backgroundColor: 'white' }}>
      {data.map((product, index) => (
        <ProductCard key={index} name={product.name} imageUri={product.image} supplier={product.supplier} onAdd={onAdd} />
      ))}
      </ScrollView>
      {scanned && <ModernButton title={'Scan Again'} onPress={() => setScanned(false)} />}
      <ModernButton title={'View Basket'} onPress={handlePress} />
    </View>


      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {productList?.map((product, index) => (
              <ProductCard key={index} name={product.name} imageUri={product.image} supplier={product.supplier} />
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 0,
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    height: height- 100,
    backgroundColor: '#fff',
  },
  modalContent: {
    flexGrow: 1,
    paddingBottom: 100, // set paddingBottom to the height of the closeButton
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
