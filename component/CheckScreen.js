import AsyncStorage from '@react-native-async-storage/async-storage';
//  Expo includes icon
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
//  NativeBase
import { 
    //  Layout Typesetting
    VStack, HStack, Box, 
    //  Item Display
    Heading, Text, Input, Icon, IconButton, Button, 
    //  Effect React
    FormControl, Stagger, useDisclose, useToast, Pressable 
} from 'native-base';
import ToastAlert from '../component/ToastAlert';
import { useState, useRef } from 'react';
import { TextInput } from 'react-native';

export default function CheckScreen({ route, navigation }){
    /*
        Get user selected document 
    */
    const getSelectedDoc = async(life_time_doc) => {
        if(life_time_doc !== "") return life_time_doc;

        let local_doc = await AsyncStorage.getItem("selected_doc");

        return local_doc;
    }

    /*
        Change Quantity
    */
    const changeQuantity = (code, qty_str) => {
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
                .then(json => toast.show({
                    render: () => <ToastAlert id={0} {...toast_options} description={json['status_msg']} close={closeToastAlert} />, 
                }))
                .catch(err => toast.show({
                    render: () => <ToastAlert id={0} {...toast_options} description={err} close={closeToastAlert} />, 
                }));
        }
    }
    
    let { selected_doc, stock_list, detected_code, input_quantity } = route.params;
    const [stock_data, setStockData] = useState(route.params.stock_list);
    const code_list = stock_list.map(obj => obj["Stock Code"]) || [];
    const { isOpen, onToggle } = useDisclose();
    const toast = useToast();

    const [focus_item, setFocusItem] = useState({
        code: "", 
        index: -1, 
    });
    let inputQuantity = useRef(0);
    
    const focusInputQuantity = ({code, index}) => {
		inputQuantity.current.focus();
        
        setFocusItem({
            code: code, 
            index: index
        });
	}

    // useEffect(() => {
    //     alert(`useEffect`);

        // if(detected_code !== ""){
        //     for(let i=0; i<route.params.stock_list.length; i++)
        //         if(route.params.stock_list[i]['Stock Code'] === detected_code){
        //             route.params.stock_list[i]['Actual Qty'] = input_quantity;
        //             break;
        //         }
        // }
    // }, []);
    

    return (
        <VStack flex={1} space={4} px={5} alignContent="center" alignItems="center">
            <Text bold>Detected Code: {detected_code}</Text>
            <Text bold>Input Quantity: {input_quantity}</Text>
            
            {
                /* Table Data List */
            }
            <VStack space={2}>
                { /* Header */ }
                <HStack w="100%">
                    <Heading flex={1} size="sm">Line</Heading>
                    <Heading flex={4} size="sm">Stock Code</Heading>
                    <Heading flex={2} size="sm">Actual Qty</Heading>
                </HStack>
                <FormControl>
            { 
                /* Body */

                /*
                <Input flex={2} h={8} pr={5} textAlign="right" placeholder="Actual Qty"
                    onChangeText={new_qty => changeQuantity(row["Stock Code"], new_qty)} 
                    value={route.params.stock_list[i]["Actual Qty"]} />
                */

                (selected_doc === "")?
                    <Text size="lg" bold>
                        Please select your checking list first, before go in this screen.
                    </Text>:
                    // route.params.stock_list.map((row, i) => {
                    stock_data.map((row, i) => {
                        return (
                            <HStack w="100%" key={i} mt={2} alignContent="center" alignItems="center">
                                <Text flex={1}>{row["Line"]}</Text>
                                <Text flex={4}>{row["Stock Code"]}</Text>
                                
                                <Pressable flex={2} onPress={() => focusInputQuantity({
                                    code: row["Stock Code"], 
                                    index: i, 
                                })}>
                                    <Text>{ row["Actual Qty"] }</Text>
                                </Pressable>

                            </HStack>
                        )
                    })
            }
                </FormControl>
            </VStack>
            
            <Button w="50%" mt={5+5} px={5} fontWeight="bold">Submit</Button>
            {/* <Text>Focus Code: {focus_item.code}, Focus Index: {focus_item.index}</Text> */}
            <TextInput style={{ backfaceVisibility: "hidden" }} keyboardType={"numeric"} ref={inputQuantity} 
                defaultValue={0} 
                
                onChangeText={new_qty => {
                    let arr = [...route.params.stock_list];
                    arr[focus_item.index]["Actual Qty"] = new_qty;

                    setStockData(arr);
                    changeQuantity(focus_item.code, new_qty);
                }} />
            

            {
                /* Floating Sub Menu */
            }
            <VStack flex={1} mb={5} justifyContent="flex-end" alignSelf="flex-end">

                <Box alignItems="center" justifyContent="flex-end" minH="10">
                    <Stagger visible={isOpen} initial={{
                        opacity: 0,
                        scale: 0,
                        translateY: 0
                    }} animate={{
                        translateY: 0,
                        scale: 1,
                        opacity: 1,
                        transition: {
                            type: "spring",
                            mass: 0.8,
                            stagger: {
                                offset: 10,
                                reverse: true
                            }
                        }
                    }} exit={{
                        translateY: 0,
                        scale: 0.5,
                        opacity: 0,
                        transition: {
                        duration: 100,
                        stagger: {
                            offset: 10,
                            reverse: true
                        }
                        }
                    }}>
                    
                    <IconButton mb="4" bg="teal.400" colorScheme="teal" borderRadius="full" 
                        onPress={() => {
                            if(code_list.length)
                                navigation.navigate("Scan", {
                                    ...route.params, 
                                });
                            else
                                toast.show({
                                    description: "Not Stock Code Exist."
                                });
                            
                            onToggle();
                        }}
                        icon={<Icon as={MaterialIcons} name="qr-code-scanner" size="6" _dark={{ color: "warmGray.50" }} color="warmGray.50" />} />
                    <IconButton mb="4"bg="red.500" colorScheme="red" borderRadius="full" 
                        icon={<Icon as={MaterialIcons} name="photo-library" size="6" _dark={{ color: "warmGray.50" }} color="warmGray.50" />} />
                    </Stagger>
                </Box>
                
                <HStack justifyContent="flex-end">
                    <IconButton alignSelf="flex-end" borderRadius="full" size="lg" onPress={onToggle} bg="cyan.400" 
                        icon={<Icon as={MaterialCommunityIcons} size="6" name="dots-horizontal" color="warmGray.50" _dark={{ color: "warmGray.50" }} />} />
                </HStack>

            </VStack>
            {
                /* End of Floating Sub Menu */
            }


        </VStack>
    )
}