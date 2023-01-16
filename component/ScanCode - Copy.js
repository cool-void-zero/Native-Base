import { useState, useEffect } from "react";
import { RNCamera } from "react-native-camera";
import { 
	VStack, HStack, 
	Text, Input, Button, FormControl, 
	Modal 
} from 'native-base';

/*
function ProfileScreen({ navigation, route }) {
  const [value, onChangeText] = React.useState(route.params.title);

  React.useEffect(() => {
    navigation.setOptions({
      title: value === '' ? 'No title' : value,
    });
  }, [navigation, value]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(text) => onChangeText(text)}
        value={value}
      />
      <Button title="Go back" onPress={() => {
        // navigation.goBack()

        navigation.navigate("Home", {
          title: value
        });
      }} />
    </View>
  );
}
*/

export default function ScanCode({ route, navigation }) {
    // const { selected_doc, code_list } = route.params;
	const { selected_doc, stock_list } = route.params;
	const [showModal, setShowModal] = useState(true);
	let [detect_code, setDetectCode] = useState("0000-20018");
	let [input_quantity, setInputQuantity] = useState(0);

    const showDetectCode = (e) => {
        // alert(`Barcode value is ${e.data}, type is ${e.type}`);

		//	this stock code is exits in the "stock_list"
		let is_exist = false;

		for(let i=0; i<stock_list.length; i++)
			if(detect_code === stock_list[i]['Stock Code']){
				stock_list[i]['Stock Code'] = stock_list[i]['Stock Code'] + "@@?";
				stock_list[i]['Actual Qty'] = input_quantity;

				is_exist = true;
				break;
			}
		
		if(is_exist){
		// for(let code of code_list)
        //   	if(code === e.data)

			

			navigation.navigate("Check", {
				...route.params,
				
				stock_list: stock_list, 
				detected_code: "0000-20018", 
				input_quantity: input_quantity
			});
		}
		else
			alert(`This stock code "${detect_code}" not exist in document "${selected_doc}".`);
        
        // setDetectCode(e.data);
    }
    
    return (
		<VStack flex={1} w="100%">
			<RNCamera 
				// ref={ref => {
				// 	this.camera = ref;
				// }}
				style={{
					flex: 1
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
			
			<Button flex={0.1} onPress={() => setShowModal(true)}>Detected</Button>

			{/* <VStack flex={0.2}>
				<Text>Detected: </Text>
				<Input onChangeText={new_text => setInputQuantity(Number(new_text))} textAlign={"center"}  />
				<Button onPress={showDetectCode}>Go back</Button>
			</VStack> */}

			<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
				<Modal.Content maxWidth="500px" justifyContent={"center"} textAlign={"center"}>
				<Modal.CloseButton />
				<Modal.Header>{selected_doc}</Modal.Header>
				<Modal.Body>
					<FormControl backgroundColor={"dark.800"}>
						<FormControl.Label>Stock Code</FormControl.Label>
						<Input value={detect_code} isReadOnly={true} />
					</FormControl>
					<FormControl mt="3">
						<FormControl.Label>Input Quantity</FormControl.Label>
						<Input onChangeText={new_text => setInputQuantity(Number(new_text))} textAlign={"center"}  />
					</FormControl>
				</Modal.Body>
				<Modal.Footer>
					<Button flex={2.5} colorScheme="danger"
						onPress={() => { setShowModal(false); }}>Cancel</Button>
					<Text flex={5}></Text>
					<Button flex={2.5} onPress={() => { 
						setShowModal(false);
						showDetectCode();
					}}>Save</Button>
				</Modal.Footer>
				</Modal.Content>
			</Modal>
		</VStack>
	)
}