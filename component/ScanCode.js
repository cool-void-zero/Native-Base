import { useState, useEffect } from "react";
import { RNCamera } from "react-native-camera";
import { 
	VStack, 
	Text, Input, Button, FormControl, 
	Modal, AlertDialog, useToast, 
} from 'native-base';
import ToastAlert from '../component/ToastAlert';
//	custom component
import { checkStockMasterAPI, addNewStockAPI } from './Api';

export default function ScanCode({ route, navigation }){
	const { selected_doc } = route.params;
	
	const [showModal, setShowModal] = useState(false);
	let [detect_code, setDetectCode] = useState("");
	let [detect_index, setDetectIndex] = useState(-1);
	let [detect_type, setDetectType] = useState("");
	let [input_quantity, setInputQuantity] = useState(0);
	const toast = useToast();

	//	check is the detect code exits in the "stock_list"
	//	index: -1 = not exist
	const indexStockCode = (code) => {
		for(let i=0; i<route.params.stock_list.length; i++)
			if(code === route.params.stock_list[i]['Stock Code'])
				return i;
		return -1;
	}

	//	Testing
	useEffect(() => {
		
	}, []);

    const detectedCode = async(e) => {
        if(detect_code !== "" || is_dialog_open) return;

		let code = e.data;
		let idx = indexStockCode(code);

		if(idx !== -1){
			setDetectCode(code);
			setDetectType(e.type);
			setDetectIndex(idx);
			//	show the input modal
			setShowModal(true);
		}
		//	stock code not in "document", request to backend check is it exist in stock master
		else{
			checkStockMasterAPI(code)
				.then(json => {
					setDetectCode(code);
					setDetectType(e.type);
					setIsDialogOpen(true);
				})
				.catch(err => alert(err));
		}
    }

	const saveInputQuantity = () => {
		// if(detect_index === -1) return alert("Error index value");

		//	change the quantity (before back to previous screen for trigger useEffect)
		if(detect_index !== -1)
			route.params.stock_list[detect_index]['Actual Qty'] = input_quantity;

		navigation.navigate("Check", {
			...route.params,
			
			detected_code: detect_code, 
			input_quantity: input_quantity
		});

		resetDetect();
	}
    
	const resetDetect = () => {
		setDetectCode("");
		setDetectType("");
		setDetectIndex(-1);
		setShowModal(false); 
		setIsDialogOpen(false);
	}


	const [is_dialog_open, setIsDialogOpen] = useState(false);
	const closeDialog = () => setIsDialogOpen(false);

	const insertStock = () => {
		addNewStockAPI(selected_doc, detect_code)
			.then(json => {
				let { status, status_message, new_data } = json;

				//	successful insert new stock, push it to route.params also
				if(status === 1)
					route.params.stock_list.push(new_data);
				
				toast.show({
					title: status_message
				});
			})
			.catch(err => toast.show({
				title: err
			}));
	}

	/*
		Return Component
	*/
    return (
		<VStack flex={1} w="100%">
			{ /* React Native Camera */}
			<RNCamera 
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
	
				onBarCodeRead={detectedCode}>
			</RNCamera>
			
			{ /* Modal: Input Quantity */ }
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
					<Button flex={2.5} colorScheme="danger" onPress={() => resetDetect}>Cancel</Button>
					<Text flex={5}></Text>
					<Button flex={2.5} onPress={() => saveInputQuantity()}>Save</Button>
				</Modal.Footer>
				</Modal.Content>
			</Modal>

			{ 
			/* 	[AlertDialog: Confirm Insert]
				
				Detected code not in the current document, 
				but exist in Stock Master. 
			*/
			}
			<AlertDialog isOpen={is_dialog_open} onClose={closeDialog}>
				<AlertDialog.Content>
				<AlertDialog.CloseButton />
				<AlertDialog.Header>Add New Stock</AlertDialog.Header>
				<AlertDialog.Body mt={5} mb={5} justifyContent={"center"} alignItems={"center"}>
					<Text textAlign={"center"}>
						<Text bold>"{detect_code}"</Text> not exist in this <Text bold>"{selected_doc}"</Text> document.
					</Text>
					<Text textAlign={"center"}>
						Confirm add this code into document?
					</Text>
				</AlertDialog.Body>
				<AlertDialog.Footer>
					<Button.Group flex={1} space={2}>
					<Button flex={1} variant={"ghost"} colorScheme={"danger"} onPress={resetDetect}>
						Cancel
					</Button>
					<Text flex={1} />
					<Button flex={1} colorScheme="success" onPress={() => {
						insertStock();
						// closeDialog();
						resetDetect();
					}}>
						Confirm
					</Button>
					</Button.Group>
				</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>

		</VStack>
	)
}