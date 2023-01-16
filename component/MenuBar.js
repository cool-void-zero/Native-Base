import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; 
import HomeScreen from '../component/HomeScreen';
import CheckScreen from '../component/CheckScreen';
import ScanCode from '../component/ScanCode';
import SupportScreen from '../component/SupportScreen';

/*
    Screen View Component
*/
const SettingScreen = () => {
    return <SupportScreen whatsapp="60182090748" phone="60362633933" email="admin@greenstem.com.my" />
}

/*
    Implement Menu Bar
*/
export default function MenuBar(){
    const Tab = createBottomTabNavigator();
    const Stack = createStackNavigator();

    const StackCheckScreen = () => {
        //  check screen default params
        let check_params = {
            selected_doc: "", 
            stock_list: [], 
            selected_doc: "SCCHECK000002", 
            stock_list: [{"Document No":"SCCHECK000002","Transaction Type":"SCCHECK","Line":1,"Stock Code":"0000-20018","Location":"TC","Bin / Shelf No":"1A-1-01-02-02","Computed Qty":10,"Actual Qty":15},{"Document No":"SCCHECK000002","Transaction Type":"SCCHECK","Line":2,"Stock Code":"0000-20020B","Location":"TC","Bin / Shelf No":"1A-1-01-02-02","Computed Qty":10,"Actual Qty":1}], 
            detected_code: "", 
            input_quantity: 0, 
        }

        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Check" component={CheckScreen} initialParams={ check_params } />
                <Stack.Screen name="Scan" component={ScanCode} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }

    /*
        Screen Options
    */
    const home_screen_options = {
        //  icon text
        tabBarLabel: "Home",
        //  screen header screen
        title: "Home Screen", 
        headerShown: true, 
        headerTitleAlign: "center", 
        tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />
    }
    const check_screen_options = {
        tabBarLabel: "Check",
        title: "Checking List", 
        headerShown: false, 
        headerTitleAlign: "center", 
        tabBarIcon: () => <MaterialCommunityIcons name="cube-scan" size={24} color="black" />
    }
    const setting_screen_options = {
        tabBarLabel: "Setting",
        title: "Setting Menu", 
        headerShown: false, 
        headerTitleAlign: "center", 
        tabBarIcon: () => <Ionicons name="settings" size={24} color="black" />
    }

    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Tab.Screen name="Home" component={HomeScreen} options={home_screen_options} />
                <Tab.Screen name="StackCheck" component={StackCheckScreen} options={check_screen_options} initialParams={{selected_doc: ""}} />
                <Tab.Screen name="Setting" component={SettingScreen} options={setting_screen_options} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}