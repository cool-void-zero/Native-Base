//  Expo Includes Icon
import { FontAwesome, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons'; 
//  Native Base
import { 
    //  Layout Typesetting
    VStack, HStack, Flex, 
    //  Item Display
    Image, Text, 
    //  Effect React
    Link 
} from 'native-base';

export default function SupportScreen(props){
    const help_support_img = require("../assets/component/setting/help-support-light.png");
    //  destruct props object to independent variables and re-build them
    let {whatsapp, phone, email} = props;

    return (
        <VStack flex={1} alignContent="center" alignItems="center">
            <Flex direction="column" px={5}>
                <Image maxH={400} source={help_support_img} alt="We are here to help you." />
                <Text mt={5} fontSize={20} bold textAlign="center">How can we help you today?</Text>
                <Text mt={4} textAlign="center" color="muted.500">
                    It looks like you are experiencing some probkem. 
                    We are here to help you. Please get in touch with us!
                </Text>
            </Flex>

            <Flex direction="column" w="100%" mt={5} px={5} textAlign="start" alignContent="center" alignItems="center">
                {
                    /* WhatsApp Support */
                }
                <Flex direction="row" w="100%" mt={5} px={5}>
                    <Link href={`https://wa.me/${whatsapp}`}>
                        <HStack width="95%">
                            <Entypo name="chat" size={24} color="green" />
                            <Text fontSize="md" ml={8}>WhatsApp Support</Text>
                        </HStack>
                        <FontAwesome name="chevron-right" size={20} color="black" />
                    </Link>
                </Flex>
                {
                    /* Phone Support */
                }
                <Flex direction="row" w="100%" mt={5} px={5}>
                    <Link href={`tel:${phone}`}>
                        <HStack width="95%">
                            <MaterialIcons name="record-voice-over" size={24} color="green" />
                            <Text fontSize="md" ml={8}>Phone Support</Text>
                        </HStack>
                        <FontAwesome name="chevron-right" size={20} color="black" />
                    </Link>
                </Flex>
                {
                    /* Email Support */
                }
                <Flex direction="row" w="100%" mt={5} px={5}>
                    <Link href={`mailto:${email}`}>
                        <HStack width="95%">
                            <Ionicons name="mail" size={24} color="green" />
                            <Text fontSize="md" ml={8}>Email Support</Text>
                        </HStack>
                        <FontAwesome name="chevron-right" size={20} color="black" />
                    </Link>
                </Flex>

            </Flex>
        </VStack>
    );
}