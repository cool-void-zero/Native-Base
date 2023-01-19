import { Image } from 'react-native';
import { RNCamera } from "react-native-camera";
import { Button, HStack, VStack } from "native-base";
import { useRef, useState } from 'react';
//  custom backend api
import { uploadImageAPI } from './Api';

export default function TakeImage({ route, navigation }){
    const camera = useRef();
    const [images, setImage] = useState([]);
    
    const takePicture = async(camera) => {
        try{
            const options = { quality: 0.5, base64: true };
            const data = await camera.takePictureAsync(options);
            
            let arr = [...images];
            arr.push(data.uri);
            setImage(arr);

            uploadImageAPI(data.base64)
                .then(json => {
                    alert(JSON.stringify(json));
                })
                .catch(err => {
                    alert(err);
                });
        }
        catch(err){
            alert(err);
        }
    }

    return (
        <VStack flex={1} w="100%">
            <RNCamera 
                ref={camera}
                style={{ flex: 5 }}
                
                androidCameraPermissionOptions={{
					title: 'Permission to use camera',
					message: 'We need your permission to use your camera',
					buttonPositive: 'Ok',
					buttonNegative: 'Cancel',
				}}
		
				androidRecordAudioPermissionOptions={{
					title: 'Permission to use audio',
					message: 'We need your permission to use your audio for record',
					buttonPositive: 'Ok',
					buttonNegative: 'Cancel',
				}}
            />
            <HStack flex={5} mt={10}>
            {
                images.map((img, i) => 
                    <Image key={i} source={{ uri: img }} style={{ flex: 1, marginRight: 10, resizeMode: "contain" }} alt="Taken Image" />
                )
            }
            </HStack>
            <Button minH={30} onPress={() => takePicture(camera.current)}>Snap</Button>
        </VStack>
    )

}
