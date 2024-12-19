import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageEdit, getFilePath } from 'truvideo-react-image-sdk';


function ImageScreen() {
    const [uploadImagePath, setUploadImagePath] = React.useState<any>();

    useEffect(() => {
        getMyObject();
    }, []);

    const getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('fileImageList');
            setUploadImagePath(jsonValue != null ? JSON.parse(jsonValue) : null);
        } catch (e) {
            // read error
        }
    };


    const __editImage = (selectedItems: string) => {

        getFilePath(`${Date.now()}-editImage.png`)
            .then((resulthPath) => {
                launchImageEdit(selectedItems, resulthPath)
                    .then((result) => {
                        console.log('Image edited successfully', result);
                    })
                    .catch((error) => {
                        console.error('error: while Image editing', error);
                    })
            })
            .catch((err) => {
                console.error('err', err);
            });
    };

    const renderItem = ({ item }) => (
        <View style={styles.checkBox}>
            <TouchableOpacity onPress={() => __editImage(item.filePath)}>
                    <Text style={{ marginRight: 10 }}>{item.filePath}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>

            <View style={styles.list}>
                <FlatList
                    data={uploadImagePath}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.createdAt}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    button: {
        marginTop: 12,
        alignItems: 'center',
        backgroundColor: '#3490CA',
        padding: 10,
        width: 300,
        borderRadius: 50,
    },
    text: {
        color: '#ffffff'
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        height: '80%',
        marginBottom: 15,
        padding: 10
    },
    checkBox:{
        padding: 10, 
        flexDirection: 'row', 
        alignItems: 'center', 
    }
});

export default ImageScreen;