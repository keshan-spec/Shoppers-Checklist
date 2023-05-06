import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, Image, Modal, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as cheerio from 'cheerio';

// Components
import ProductCard from './components/ProductList';
import ModernButton from './components/Button';
import SearchField from './components/Search';

// Utils
import { fetchBarCode } from './utils/api';
import { PList } from './utils/types';

const { height } = Dimensions.get('window');

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [productList, setProductList] = useState<PList[]>([]);
  const [loading, setLoading] = useState(false);

  const [barcode, setBarcode] = useState('');
  const [data, setData] = useState<[PList]>([{ name: '', image: '', supplier: '' }]);

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
      setLoading(true);
      fetchBarCode(barcode).then((response: string) => {
        const $ = cheerio.load(response);
        const productName = $('#shop-products li:nth-child(1) .prodname a').text().trim();

        const imageSrc = $('li div.prodimageinner img').attr('src');

        setData([{
          name: productName,
          image: imageSrc!,
          supplier: 'Bestway'
        }]);

        setLoading(false);
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
    setProductList([...productList!, data]);
  };

  const showProductList = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Image source={require('./assets/loading.gif')} style={{ width: 100, height: 100 }} />
        </View>
      )
    }

    if (!loading) {
      return (
        <ScrollView style={{ height: '40%', backgroundColor: 'white' }}>
          {data.map((product, index) => (
            <ProductCard key={index} data={product} onAdd={onAdd} />
          ))}
        </ScrollView>
      )
    }
  }

  return (
    <>
      <View style={styles.maincontainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ width: '100%', height: '40%', backgroundColor: 'black', padding: 0, margin: 0 }}
        />
        <SearchField onSearch={setData} onLoading={setLoading} />
        {showProductList()}
        {scanned && <ModernButton title={'Scan Again'} onPress={() => setScanned(false)} />}
        <ModernButton title={'View Basket'} onPress={handlePress} />
      </View>

      {/* Modal for added shopping list */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {productList?.length === 0 && (
            <View style={[styles.loadingContainer]}>
              <Image source={require('./assets/empty-basket.png')} style={{ width: 300, height: 300 }} />
            </View>
          )}
          {productList?.length > 0 && (
            <>
            <Text style={styles.loading}>Your Shopping List</Text>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {productList?.map((product, index) => (
                <ProductCard key={index} data={product} />
              ))}
            </ScrollView>
            </>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Add</Text>
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
    backgroundColor: '#fff',
  },
  modalContent: {
    flexGrow: 1,
    paddingBottom: 100, // set paddingBottom to the height of the closeButton
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    bottom: 5,
    left: 10,
    right: 10,
    borderRadius: 15,
    height: 55,
    backgroundColor: '#4681f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
