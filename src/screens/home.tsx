import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    authentication,
    clearAuthentication,
} from 'truvideo-react-core-sdk';
import {
    initCameraScreen,
    LensFacing,
    FlashMode,
    Orientation,
    Mode,
} from 'truvideo-react-camera-sdk';
import { uploadMedia } from 'truvideo-react-media-sdk';

type MediaItem = {
    cameraLensFacing: string;
    createdAt: number;
    duration: number;
    filePath: string;
    id: string;
    resolution: {
        height: number;
        width: number;
    };
    rotation: string;
    type: 'VIDEO' | 'PICTURE';
};

type Configuration = {
    lensFacing: LensFacing;
    flashMode: FlashMode;
    orientation: Orientation;
    outputPath: string;
    frontResolutions: string[];
    frontResolution: string;
    backResolutions: string[];
    backResolution: string;
    mode: Mode;
};

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const [configuration, setConfiguration] = useState<Configuration | null>(null);
    const [uploadPath, setUploadPath] = useState<MediaItem[] | null>(null);
    const [uploadImagePath, setUploadImagePath] = useState<MediaItem[] | null>(null);
    const [tag, setTag] = useState<Record<string, string | number> | undefined>(undefined);
    const [metaData, setMetaData] = useState<Record<string, any> | undefined>(undefined);

    useEffect(() => {
        authentication('EPhPPsbv7e', '9lHCnkfeLl', '')
            .then((res) => console.log('Authentication successful:', res))
            .catch((err) => console.error('Authentication error:', err));

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

        setTag({ key: 'value', color: 'red', orderNumber: 123 });
        setMetaData({ key: 'value', key1: 1, key2: [4, 5, 6] });
    }, []);

    const initCamera = async () => {
        try {
            await AsyncStorage.multiRemove(['fileList', 'fileImageList']);

            if (configuration) {
                const response = await initCameraScreen(configuration);
                const mediaItems: MediaItem[] = JSON.parse(response);
                const videos = mediaItems.filter((item) => item.type === 'VIDEO');
                const pictures = mediaItems.filter((item) => item.type === 'PICTURE');

                setUploadPath(videos);
                setUploadImagePath(pictures);

                await uploadMediaItems(mediaItems);
                await saveToStorage('fileList', videos);
                await saveToStorage('fileImageList', pictures);
                
            }
        } catch (error) {
            console.error('Camera initialization error:', error);
        }
    };

    const uploadMediaItems = async (mediaItems: MediaItem[]) => {
        if (tag && metaData) {
            for (const item of mediaItems) {
                try {
                    const result = await uploadMedia(item.filePath, tag, metaData);
                    console.log('Upload successful:', result);
                } catch (error) {
                    console.error('Upload error:', error);
                }
            }
        }
    };

    const saveToStorage = async (key: string, value: any) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error('Storage save error:', error);
        }
    };

    const clearAuth = async () => {
        try {
            const result = await clearAuthentication();
            console.log('Clear authentication successful:', result);
        } catch (error) {
            console.error('Clear authentication error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../../img/appstore.png')}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={initCamera}>
                    <Text style={styles.buttonText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Video', { uploadPath })}
                >
                    <Text style={styles.buttonText}>Video</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Image', { uploadImagePath })}
                >
                    <Text style={styles.buttonText}>Image</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 300,
        height: 70,
    },
    buttonContainer: {
        marginTop: 30,
    },
    button: {
        marginTop: 12,
        alignItems: 'center',
        backgroundColor: '#3490CA',
        padding: 10,
        width: 300,
        borderRadius: 50,
    },
    buttonText: {
        color: '#ffffff',
    },
});

export default HomeScreen;
