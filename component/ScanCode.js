import { useState } from "react";
import { RNCamera } from "react-native-camera";
import { 
	VStack, 
	Text, Input, Button, FormControl, 
	Modal, useToast
} from 'native-base';
import ToastAlert from '../component/ToastAlert';

export default function ScanCode({ route, navigation }) {
	const changeQuantity = async(code, qty_str) => {
		// return new Promise((resolve, reject => {
			let qty = Number(qty_str);
			// let url = `http://192.168.80.140:1111/update-quantity?document_no=${selected_doc}&stock_code=${code}&quantity=${qty}`;
			let url = `http://greenstem.dyndns.org:1111/update-quantity?document_no=${selected_doc}&stock_code=${code}&quantity=${qty}`;

			for(let i=0; i<route.params.stock_list.length; i++)
				if(route.params.stock_list[i]['Stock Code'] === code){
					route.params.stock_list[i]['Actual Qty'] = qty;
					break;
				}
			
			if(typeof(qty) === "number" && qty > 0){
				let toast_options = {
					title: `Execute Update Quantity of "${code}"`,
					variant: "left-accent",
					isClosable: true 
				}
				
				const closeToastAlert = (id) => toast.close(id);

				fetch(url)
					.then(res => res.json())
					.then(json => {
						toast.show({
							render: () => <ToastAlert id={0} {...toast_options} description={json['status_msg']} close={closeToastAlert} />, 
						});
						// resolve(null);

						return new Promise((resolve, _) => resolve);
					})
					.catch(err => {
						toast.show({
							render: () => <ToastAlert id={0} {...toast_options} description={err} close={closeToastAlert} />, 
						});
						// reject(err);

						return new Promise((_, reject) => reject(err));
					});
			}
		// }));
    }

    const { selected_doc, stock_list } = route.params;

	/*
	const [showModal, setShowModal] = useState(true);
	let [detect_code, setDetectCode] = useState("0000-20018");
	let [detect_index, setDetectIndex] = useState(0);
	*/
	
	const [showModal, setShowModal] = useState(false);
	let [detect_code, setDetectCode] = useState("");
	let [detect_type, setDetectType] = useState("");
	let [detect_index, setDetectIndex] = useState(-1);
	let [input_quantity, setInputQuantity] = useState(0);
	const toast = useToast();

	//	check is the detect code exits in the "stock_list"
	//	index: -1 = not exist
	const indexStockCode = (code) => {
		for(let i=0; i<stock_list.length; i++)
			if(code === stock_list[i]['Stock Code'])
				return i;
		return -1;
	}

    const showDetectCode = (e) => {
        if(detect_code !== "") return;

		let idx = indexStockCode(e.data);

		if(idx !== -1){
			setDetectCode(e.data);
			setDetectType(e.type);
			setDetectIndex(idx);
			//	show the input modal
			setShowModal(true);
		}
		else
			alert(`This stock code "${e.data}" not exist in document "${selected_doc}".`);
    }

	const resetDetect = () => {
		setDetectCode("");
		setDetectType("");
		setDetectIndex(-1);
		setShowModal(false); 
	}

	const saveInputQuantity = () => {
		if(detect_index === -1) return alert("Error index value");

		changeQuantity(detect_code, input_quantity)
			.then(() => {
				let list = [...stock_list];

				list[detect_index]['Actual Qty'] = input_quantity;
				
				navigation.navigate("Check", {
					...route.params,
					
					stock_list: list, 
					detected_code: detect_code, 
					input_quantity: input_quantity
				});

				resetDetect();
			})
			.catch(err => alert(err));
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
			
			{/* <Button flex={0.1} onPress={() => setShowModal(true)}>Detected</Button> */}
			
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
					<Button flex={2.5} onPress={() => { 
						saveInputQuantity();
						// resetDetect();
					}}>Save</Button>
				</Modal.Footer>
				</Modal.Content>
			</Modal>
		</VStack>
	)
}