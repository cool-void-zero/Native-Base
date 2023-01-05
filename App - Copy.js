import { 
  NativeBaseProvider, 
  FormControl, 
  Stack, Input, 
  WarningOutlineIcon, 
  Text, Box, Button, Toast,
  Alert, 
  Center, VStack, Progress } from "native-base";
import { useState } from "react";
import { RNCamera } from "react-native-camera";
// import { ProductScanRNCamera  } from './component/ProductScanRNCamera';

export default function App() {
  /*
  let [state_barcodes, setBarCodes] = useState(null);

  const barcodeRecognized = ({barcodes}) => {
    let str = "";

    for(let barcode of barcodes)
        str += `Code: ${barcode.data}\n`;

    setBarCodes(str);

    barcodes.forEach(barcode => {
      console.log(barcode.data);
      alert(barcode.data);
    })
  }
  */

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
        <Text>Scan QR or bar code - testing</Text>
      </Box>
    </NativeBaseProvider>
  )
}

/*
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

  onGoogleVisionBarcodesDetected={barcodeRecognized}>
</RNCamera>

<Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
  <Text>Confirm Your Fill in value.</Text>
  <Button onPress={() => {
    Toast.show({
      description: "Form Submit!"
    })
  }}>Submit</Button>

</Box>
*/