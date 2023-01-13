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
    Stagger, Actionsheet, useDisclose, useToast 
} from 'native-base';
import ToastAlert from '../component/ToastAlert';

//  Plugin Scan QR Code
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScanCode from '../component/ScanCode';


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
        let url = `http://192.168.80.140:1111/update-quantity?document_no=${selected_doc}&stock_code=${code}&quantity=${qty}`;
        // let url = `http://greenstem.dyndns.org:1111/update-quantity?document_no=${selected_doc}&stock_code=${code}&quantity=${qty}`;

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
    
    let { selected_doc, stock_list } = route.params;
    const { isOpen, onToggle } = useDisclose();
    const toast = useToast();
    
    /*
        build-up stack to Scan QR Screen and back;
    
    const Stack = createStackNavigator();
    const sub_stack = () => {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Scan">
                    <Stack.Screen name="Scan" component={ScanCode} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
    */
    
    
    


    return (
        <VStack flex={1} space={4} px={5} alignContent="center" alignItems="center">
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
            { 
                /* Body */

                (selected_doc === "")?
                    <Text size="lg" bold>
                        Please select your checking list first, before go in this screen.
                    </Text>:
                    stock_list.map((row, i) => {
                        
                        return (
                            <HStack w="100%" key={i}  alignContent="center" alignItems="center">
                                <Text flex={1}>{row["Line"]}</Text>
                                <Text flex={4}>{row["Stock Code"]}</Text>
                                <Input flex={2} h={8} pr={5} textAlign="right" placeholder="Actual Qty"
                                    onChangeText={new_qty => changeQuantity(row["Stock Code"], new_qty)} 
                                    value={row["Actual Qty"]} />
                            </HStack>
                        )
                    })
            }
            </VStack>
            
            <Button w="50%" mt={5+5} px={5} fontWeight="bold">Submit</Button>
            

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