import { 
	NativeBaseProvider, 
	Box, ScrollView, 
	Text, Button, Input 
} from "native-base";
import { useState } from "react";
import { RNCamera } from "react-native-camera";
import MenuBar from "./component/MenuBar";

export default function App(){

	return (
		<NativeBaseProvider>
			<MenuBar />
		</NativeBaseProvider>
	)
}

/*
export default function App() {
  let [detect_code, setDetectCode] = useState("*** not selected ***");
  let [input_quantity, setInputQuantity] = useState(0);
  
  const showDetectCode = (e) => {
    alert(`Barcode value is ${e.data}, type is ${e.type}`);

    setDetectCode(e.data);
  }

  const updateQuantity = () => {
    let url = `http://greenstem.dyndns.org:1111/update-quantity?stock_code=${detect_code}&quantity=${input_quantity}`;

    fetch(url)
      .then(res => res.json())
      .then(json => {
        let msg = json.status_msg;

        alert(msg);
      })
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

        onBarCodeRead={showDetectCode}>
      </RNCamera>
      
      <Box flex={0.2} bg="#fff" alignItems="center" justifyContent="center">
        <ScrollView>
          <Text>Scan QR Code / Barcode</Text>
          <Text>Detected Stock Code: {detect_code}</Text>
          <Input size="md" placeholder="Input Quantity" 
            onChangeText={new_qty => setInputQuantity(new_qty)}
          />

          <Button mt={5} size="sm" onPress={updateQuantity}>Update</Button>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  )
}
*/