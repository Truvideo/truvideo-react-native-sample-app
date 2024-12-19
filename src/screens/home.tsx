import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authentication, clearAuthentication } from 'truvideo-react-core-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    initCameraScreen,
    LensFacing,
    FlashMode,
    Orientation,
    Mode,
} from 'truvideo-react-camera-sdk';
import { uploadMedia } from 'truvideo-react-media-sdk';
function HomeScreen() {
    const navigation = useNavigation();
    const [configuration, setConfiguration] = React.useState<any>();
    const [uploadPath, setUploadPath] = React.useState<any>();

    const [tag, setTag] = React.useState<any>(undefined);
    const [metaData, setMetaData] = React.useState<any>(undefined);
    useEffect(() => {

        authentication('EPhPPsbv7e', '9lHCnkfeLl', "")
            .then((res) => {
                //handle response
                console.log('res', res);
            })
            .catch((err) => {
                //handle error
                console.error('err', err);
            });


        setConfiguration({
            lensFacing: LensFacing.Back,
            flashMode: FlashMode.Off,
            orientation: Orientation.Portrait,
            outputPath: '',
            frontResolutions: [],
            frontResolution: 'nil',
            backResolutions: [],
            backResolution: 'nil',
            mode: Mode.VideoAndPicture,
        });
        setTag({
            key: "value",
            color: "red",
            orderNumber: "123"
        });
        setMetaData({
            key: "value",
            key1: 1,
            key2: [4, 5, 6]
        });
    }, []);

    const inItCamera = async () => {
        await AsyncStorage.removeItem('fileList');
        initCameraScreen(configuration)
            .then((res) => {
                let obj = JSON.parse(res);

                setUploadPath(obj);
                upload(obj);
                setObjectValue(obj);

            })
            .catch((err) => {
                console.log('err', err);
            });
    };

    const upload = (data: any) => {
        if (tag && metaData) {
            for (let item of data) {
                uploadMedia(item.filePath, tag, metaData)
                    .then((res) => {
                        console.log('Upload successful:', res);
                    })
                    .catch((err) => {
                        console.log('Upload error:', err);
                    })
            }
        }
    };

    const setObjectValue = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('fileList', jsonValue)
        } catch (e) {
            // save error
        }
    };

    const __clearAuth = () => {
        clearAuthentication()
            .then((setResult) => {
                console.log(setResult, 'setResult');
            })
            .catch((err) => {
                console.error('err', err);
            });

    };

    return (
        <View style={styles.container}>
            <Image
                style={{ width: 300, height: 70, }}
                source={require('../../img/appstore.png')} />
            <View style={{ marginTop: 30 }}>
                <TouchableOpacity style={styles.button} onPress={() => inItCamera()}>
                    <Text style={styles.text}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Video', { uploadPath })}>
                    <Text style={styles.text}>Video</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
    }
});

export default HomeScreen;