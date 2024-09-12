import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CustomBtn from '../components/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVideoInfo, mergeVideos, getResultPath, editVideo, compareVideos, concatVideos, encodeVideo, generateThumbnail, cleanNoise } from 'truvideo-react-video-sdk';

const Checkbox = ({ checked, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
                style={{
                    height: 20,
                    width: 20,
                    borderWidth: 2,
                    borderColor: '#000',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                }}
            >
                {checked ? (
                    <View
                        style={{
                            height: 14,
                            width: 14,
                            backgroundColor: '#2196F3',
                        }}
                    />
                ) : null}
            </View>
        </TouchableOpacity>
    );
};

function VideoScreen() {
    const [uploadPath, setUploadPath] = React.useState<any>();
    const [selectedItems, setSelectedItems] = React.useState([]);

    useEffect(() => {
        getMyObject();
    }, []);

    const getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('fileList');
            setUploadPath(jsonValue != null ? JSON.parse(jsonValue) : null);
        } catch (e) {
            // read error
        }
    };

    const toggleSelect = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((item) => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.checkBox}>

            <Checkbox
                checked={selectedItems.includes(item.filePath)}
                onPress={() => toggleSelect(item.filePath)}
            />
            <Text style={{ marginRight: 10 }}>{item.filePath}</Text>
        </View>
    );

    const __concatVideos = () => {

        getResultPath(`${Date.now()}-concatVideo.mp4`)
            .then((resulthPath) => {
                concatVideos(selectedItems, resulthPath)
                    .then((result) => {
                        console.log('video concat successfully', result);
                    })
                    .catch((error) => {
                        console.error('error: while video concat', error);
                    })
            })
            .catch((err) => {
                console.error('err', err);
            });

    };

    const __mergeVideos = () => {

        const config = {
            height: "640",
            width: "480",
            framesRate: "twentyFourFps",
            videoCodec: "h264",
        };

        getResultPath(`${Date.now()}-example.mp4`)
            .then((resulthPath) => {
                mergeVideos(selectedItems, resulthPath, JSON.stringify(config))
                    .then((res) => {
                        console.log('res', res);
                    })
                    .catch((err) => {
                        console.error('err', err);
                    })
            })
            .catch((err) => {
                console.error('err', err);
            });
    };

    const __encodeVideo = () => {

        const config = {
            height: "640",
            width: "480",
            framesRate: "thirtyFps",
            videoCodec: "libx264",
        };

        getResultPath(`${Date.now()}-encodeVideo.mp4`).then((resulthPath) => {
            encodeVideo(selectedItems[0], resulthPath, JSON.stringify(config))
                .then((result) => {
                    console.log('video encoded successfully', result);
                })
                .catch((error) => {
                    console.error('error: while video encoding', error);
                });
        });

    };


    const __generateThumbnail = () => {
        getResultPath(`${Date.now()}-thumbnail.png`).then((resultPath) => {
            generateThumbnail(selectedItems[0], resultPath, '1000', '640', '480').then((res) => {
                console.log("Thumbnail path", res);
            }).catch((err) => {
                console.error("Error in generating thumbnail", err)
            })
        }).catch((err) => {
            console.error("error in file path", err)
        });

    };

    const __editVideo = () => {

        getResultPath(`${Date.now()}-editVideo.mp4`)
            .then((resulthPath) => {
                editVideo(selectedItems[0], resulthPath)
                    .then((result) => {
                        console.log('video edited successfully', result);
                    })
                    .catch((error) => {
                        console.error('error: while video editing', error);
                    })
            })
            .catch((err) => {
                console.error('err', err);
            });
    };

    const __cleanNoise = () => {

        getResultPath(`${Date.now()}-cleanNoise.mp4`).then((resultPath) => {
            cleanNoise(selectedItems[0], resultPath)
                .then((res) => {
                    console.log("res", res);
                })
                .catch((err) => {
                    console.error("err", err);
                });
        });
    };

    const __compareVideos = () => {
        compareVideos(selectedItems).then((result) => {
            console.log('result', result);
        }).catch((error) => {
            console.error('error', error);
        });
    };

    const __getVideoInfo = () => {
        getVideoInfo(selectedItems[0])
            .then((videoInfo) => {
                console.log('videoInfo', videoInfo);
            })
            .catch((err) => {
                console.error('videoInfo err', err);
            });
    };


    return (
        <View style={styles.container}>

            <View style={styles.list}>
                <FlatList
                    data={uploadPath}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.createdAt}
                />
            </View>
            <View style={styles.row}>
                <CustomBtn
                    onPress={() => { __concatVideos() }}
                    title="Concat"
                />
                <CustomBtn
                    onPress={() => { __mergeVideos() }}
                    title="Merge"
                />
                <CustomBtn
                    onPress={() => { __encodeVideo() }}
                    title="Encode"
                />
                <CustomBtn
                    onPress={() => { __generateThumbnail() }}
                    title="Thumbnail"
                />
                <CustomBtn
                    onPress={() => { __editVideo() }}
                    title="Edit"
                />
                <CustomBtn
                    onPress={() => { __cleanNoise() }}
                    title="Clear Noise"
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

export default VideoScreen;