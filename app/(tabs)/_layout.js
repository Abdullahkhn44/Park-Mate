import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'white', tabBarInactiveTintColor: 'grey', tabBarStyle: {
                backgroundColor: 'black',
            },
            tabBarShowLabel: false,
        }}>
            <Tabs.Screen
                name="History"
                options={{

                    headerShown: false,
                    title: 'History',
                    tabBarIcon: ({ color }) => <FontAwesome size={28}  name="history" color={color} />,
                }}
            />
            <Tabs.Screen

                name="Home"
                options={{

                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="Settings"
                options={{

                    headerShown: false,
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                }}
            />

        </Tabs>
    );
}
