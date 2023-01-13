import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
//  Expo includes icon
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
//  NativeBase
import { 
    //  Layout Typesetting
    VStack, HStack, Box, 
    //  Item Display
    Heading, Text, Input, Icon, IconButton, 
    //  Effect React
    Stagger, useDisclose
} from 'native-base';


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
    
    /**
     * Get checking of stock code list
     * 
     * @param {String} doc_no ([Document No])
     * 
     */
    const getStockList = async(doc_no) => {
        return new Promise((resolve, reject) => {
            let url =  `http://greenstem.dyndns.org:1111/stock-check-detail?doc_no=${doc_no}`;

            fetch(url)
                .then(res => res.json())
                .then(json => resolve(json))
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    let [selected_doc, setSelectedDoc] = useState(route.params.selected_doc);
    let [stock_list, setStockList] = useState([]);
    // let [stock_list, setStockList] = useState([{"Document No":"SCCHECK00001","Transaction Type":"SCCHECK","Line":1,"Stock Code":"0000-00010Z","Location":"L1","Bin / Shelf No":"1A-1-01-02-01","Computed Qty":1,"Actual Qty":0},{"Document No":"SCCHECK00001","Transaction Type":"SCCHECK","Line":2,"Stock Code":"0000-10906A","Location":"L1","Bin / Shelf No":"1A-1-01-02-01","Computed Qty":4,"Actual Qty":0}]);
    // let [is_submenu_open, toggleSubMenu] = useState(false);
    const { isOpen, onToggle } = useDisclose();

    const constructor = () => {
        getSelectedDoc(route.params.selected_doc)
            .then(doc => {
                setSelectedDoc(doc);

                // alert(doc);
                getStockList(doc)
                    .then(json_data => setStockList(json_data));
            });
    }

    constructor();


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
                        
                        return <>
                            <HStack w="100%" key={i}  alignContent="center" alignItems="center">
                                <Text flex={1}>{row["Line"]}</Text>
                                <Text flex={4}>{row["Stock Code"]}</Text>
                                <Input flex={2} h={8} pr={5} textAlign="right"
                                    value="0" placeholder="Actual Qty" />
                            </HStack>
                        </>
                    })
            }
            </VStack>

            

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


            {/*sub_stack*/}

        </VStack>
    )
}