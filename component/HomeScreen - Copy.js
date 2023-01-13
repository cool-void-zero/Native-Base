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

    const getStockList = (doc) => {
        let stock_list_1 = [{"Document No":"SCCHECK00001","Transaction Type":"SCCHECK","Line":1,"Stock Code":"0000-00010Z","Location":"L1","Bin / Shelf No":"1A-1-01-02-01","Computed Qty":1,"Actual Qty":0},{"Document No":"SCCHECK00001","Transaction Type":"SCCHECK","Line":2,"Stock Code":"0000-10906A","Location":"L1","Bin / Shelf No":"1A-1-01-02-01","Computed Qty":4,"Actual Qty":0}];
        let stock_list_2 = [{"Document No":"SCCHECK00002","Transaction Type":"SCCHECK","Line":1,"Stock Code":"0000-20018","Location":"TC","Bin / Shelf No":"1A-1-01-02-02","Computed Qty":10,"Actual Qty":0},{"Document No":"SCCHECK00002","Transaction Type":"SCCHECK","Line":2,"Stock Code":"0000-20020B","Location":"TC","Bin / Shelf No":"1A-1-01-02-02","Computed Qty":10,"Actual Qty":0}];

        return (doc === "SCCHECK00001")?
            stock_list_1: 
            stock_list_2;
    }

    const selectDoc = async(doc) => {
        setSelectedDoc(doc);

        try{
            await AsyncStorage.setItem("selected_doc", doc);
            
            let list = getStockList(doc);
            
            navigation.navigate("Check", {
                selected_doc: doc, 
                stock_list: list 
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
    // let [main_list, setMainList] = useState([]);
    let [main_list, setMainList] = useState([{"Document No":"SCCHECK000001","Transaction Type":"SCCHECK","Document Date":"2023-01-12T09:30:28.780Z","Issue Time":"Jan 12 2023  9:30AM","Status":"NS","Location":"L1","Bin / Shelf No":"1A-1-01-02-01","Issue By":"CO","Taken By":"","Check By":""},{"Document No":"SCCHECK000002","Transaction Type":"SCCHECK","Document Date":"2023-01-12T09:33:07.377Z","Issue Time":"Jan 12 2023  9:33AM","Status":"NS","Location":"L1","Bin / Shelf No":"1A-1-01-02-02","Issue By":"CO","Taken By":"","Check By":""},{"Document No":"SCCHECK000003","Transaction Type":"SCCHECK","Document Date":"2023-01-12T09:33:07.377Z","Issue Time":"Jan 12 2023  9:33AM","Status":"NS","Location":"L1","Bin / Shelf No":"1A-1-01-02-03","Issue By":"GREEN","Taken By":"","Check By":""}]);
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
