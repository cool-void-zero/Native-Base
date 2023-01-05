import { 
  NativeBaseProvider, 
  Text, Box, 
} from "native-base";
import { RNCamera } from "react-native-camera";

export default function App() {
  const showDetectCode = (e) => {
    alert(`Barcode value is ${e.data}, type is ${e.type}`);
  }

  return (
    <NativeBaseProvider>
      <RNCamera 
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 0.8,
          width: '100%',
        }}

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

        onBarCodeRead={showDetectCode}

        >
      </RNCamera>
      
      <Box flex={0.2} bg="#fff" alignItems="center" justifyContent="center">
        <Text>Scan QR or bar code</Text>
      </Box>
    </NativeBaseProvider>
  )
}
