import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//  Native Base
import { 
    //  Layout Typesetting
    Flex, VStack, HStack, 
    //  Item Display
    Image, Text, Input, Icon, Heading, 
    //  Effect Reaction
    Pressable
} from 'native-base';
//  Expo Includes Icon
import { FontAwesome } from '@expo/vector-icons'; 
//  Custom Backend API
import { getMainListAPI, getStockListAPI } from './Api';

export default function HomeScreen({ navigation }){
    /*
        Get & Set LocalStorage
    */
    const getLocalStorage = async() => {
        let local_search = await AsyncStorage.getItem("search_field");

        return local_search? local_search: "Search Default";
    }

    const saveSearchField = async(text) => {
        setSearchField(text);

        try{
            await AsyncStorage.setItem("search_field", text);
        }
        catch(err){
            alert(err);
        }
    }

    const selectDoc = async(doc_no) => {
        setSelectedDoc(doc_no);

        try{
            let list = await getStockListAPI(doc_no);
            await AsyncStorage.setItem("selected_doc", doc_no);
            
            navigation.navigate("StackCheck", {
                screen: "Check", 
                params: {
                    selected_doc: doc_no, 
                    stock_list: list, 
                    detected_code: "", 
                    input_quantity: 0, 
                }
            });
        }
        catch(err){
            alert(err);
        }
    }
    
    /*
        Initial Variables
    */
    const logo_name_img = require("../assets/component/home/logo-name.png");
    let [search_field, setSearchField] = useState("");
    //  Data List of "SC_Check_Pre_Main" ([Status] = 'NS') not start
    let [main_list, setMainList] = useState([]);
    let [selected_doc, setSelectedDoc] = useState(null);

    useEffect(() => {
        getLocalStorage().then(val => setSearchField(val));
        getMainListAPI()
            .then(json_data => setMainList(json_data))
            .catch(err => {
                if(err){
                    alert(err);
                    alert(`Can't request to server.`);
                }
            });
    }, []);

    /*
        Component
    */
    return (
        <VStack flex={1} space={4} px={5} alignContent="center" alignItems="center">
            <Flex direction="column">
                <Image source={logo_name_img} alt="Logo Name" resizeMode="contain" />
                {
                    /* Search Bar */
                }
                <Input onChange={(new_text) => saveSearchField(new_text)} InputLeftElement={
                    <Icon ml={4} as={<FontAwesome name="search" size={24} color="black" />} />
                } placeholder={search_field} />
            </Flex>

            {
                /* Table Data List */
            }
            <VStack>
                { /* Header */ }
                <HStack w="100%">
                    <Heading flex={4} size="sm">Doc No</Heading>
                    <Heading flex={4} size="sm">Date</Heading>
                    <Heading flex={2} size="sm">Status</Heading>
                </HStack>
                <HStack w="100%">
                    <Heading flex={4} size="sm">Location</Heading>
                    <Heading flex={6} size="sm">Bin / Shelf No</Heading>
                </HStack>
                {
                    /* Body */

                    main_list.map((row, i) => {
                        let doc_no = row['Document No'];

                        return <Pressable key={i} onPress={() => selectDoc(doc_no)}>
                            <HStack w="100%">
                                <Text flex={4}>{doc_no}</Text>
                                <Text flex={4}>{row['Document Date'].substring(0, 10)}</Text>
                                <Text flex={2}>{row['Status']}</Text>
                            </HStack>
                            <HStack w="100%">
                                <Text flex={4}>{row['Location']}</Text>
                                <Text flex={6}>{row['Bin / Shelf No']}</Text>
                            </HStack>
                        </Pressable>
                    })
                }
                <Text mt={5}>Selected Job: {selected_doc}</Text>
            </VStack>
        </VStack>
    )
}
