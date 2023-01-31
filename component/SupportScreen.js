//  Expo Includes Icon
import { FontAwesome, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons'; 
//  Native Base
import { 
    //  Layout Typesetting
    ScrollView, VStack, HStack, Flex, 
    //  Item Display
    Image, Text, 
    //  Effect React
    Link 
} from 'native-base';
//  React Native Chart Kit
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';


export default function SupportScreen(props){
    const help_support_img = require("../assets/component/setting/help-support-light.png");
    //  destruct props object to independent variables and re-build them
    let {whatsapp, phone, email} = props;

    
    const ds1 = new Array(6).fill(0).map((x, i) => ~~(Math.random() * 100));
    /*  
        Chart Custom bar color refer: 
            https://github.com/indiespirit/react-native-chart-kit/issues/161
        Color refer:
            https://nipponcolors.com/#rurikon
    */
    const custom_color = new Array(6).fill().map(() => () => "#0B346E");
    
    return (
        <VStack flex={1} alignContent="center" alignItems="center">
            <ScrollView w={"100%"} h={"100%"}>

            {
                /* Chart */
            }
            <Flex direction="column">
                <LineChart
                    data={{
                        labels: ["January", "February", "March", "April", "May", "June"],
                        datasets: [
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100
                                ]
                            }
                        ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={{
                    marginVertical: 8,
                    borderRadius: 16
                    }}
                />

                <BarChart
                    data={{
                        labels: ["January", "February", "March", "April", "May", "June"], 
                        datasets: [
                            { data: ds1, colors: custom_color}
                        ]
                    }}

                    width={Dimensions.get("window").width} // from react-native 
                    height={220} 
                    

                    chartConfig={{
                        backgroundColor: 'transparent',
                        backgroundGradientFrom: "white",
                        backgroundGradientTo: 'white',
                        backgroundGradientFromOpacity: 0, 
                        backgroundGradientToOpacity: 0, 

                        color:  () => 'black', 
                    }}

                    fromZero={true}
                    withCustomBarColorFromData={true}
                    flatColor={true}

                    withInnerLines={false}
                    showBarTops={true}
                />
            </Flex>

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

            </ScrollView>
        </VStack>
    );
}