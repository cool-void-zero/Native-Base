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

    /*
        Get Server Database "SC_Check_Pre_Main" Data
    */
    const getMainList = async() => {
        return new Promise((resolve, reject) => {
            // let url = `http://192.168.80.140:1111/stock-check-main`;
            let url = `http://greenstem.dyndns.org:1111/stock-check-main`;

            fetch(url)
                .then(res => res.json())
                .then(json => resolve(json))
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    /**
     * Get checking of stock code list
     * 
     * @param {String} doc_no ([Document No])
     * 
     */
    const getStockList = (doc_no) => {
        return new Promise((resolve, reject) => {
            // let url =  `http://192.168.80.140:1111/stock-check-detail?doc_no=${doc_no}`;
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

    const selectDoc = async(doc_no) => {
        setSelectedDoc(doc_no);

        try{
            let list = await getStockList(doc_no);
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
    // let [main_list, setMainList] = useState([{"Document No":"SCCHECK000001","Transaction Type":"SCCHECK","Document Date":"2023-01-12T09:30:28.780Z","Issue Time":"Jan 12 2023  9:30AM","Status":"NS","Location":"L1","Bin / Shelf No":"1A-1-01-02-01","Issue By":"CO","Taken By":"","Check By":""},{"Document No":"SCCHECK000002","Transaction Type":"SCCHECK","Document Date":"2023-01-12T09:33:07.377Z","Issue Time":"Jan 12 2023  9:33AM","Status":"NS","Location":"L1","Bin / Shelf No":"1A-1-01-02-02","Issue By":"CO","Taken By":"","Check By":""},{"Document No":"SCCHECK000003","Transaction Type":"SCCHECK","Document Date":"2023-01-12T09:33:07.377Z","Issue Time":"Jan 12 2023  9:33AM","Status":"NS","Location":"L1","Bin / Shelf No":"1A-1-01-02-03","Issue By":"GREEN","Taken By":"","Check By":""}]);
    let [selected_doc, setSelectedDoc] = useState(null);

    useEffect(() => {
        getLocalStorage().then(val => setSearchField(val));
        getMainList()
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
