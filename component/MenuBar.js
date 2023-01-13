import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; 
import HomeScreen from '../component/HomeScreen';
import CheckScreen from '../component/CheckScreen';
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
        headerShown: true, 
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
            <Tab.Navigator screenOptions={{ headerShown: false }}>
                <Tab.Screen name="Home" component={HomeScreen} options={home_screen_options} />
                <Tab.Screen name="Check" component={CheckScreen} options={check_screen_options} initialParams={{selected_doc: ""}} />
                <Tab.Screen name="Setting" component={SettingScreen} options={setting_screen_options} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}