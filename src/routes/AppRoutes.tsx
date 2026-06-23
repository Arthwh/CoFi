import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { CustomAddButton } from '../components/CustomAddButton';

const Tab = createBottomTabNavigator();

export default function AppRoutes() {
        return (
                <Tab.Navigator
                        screenOptions={{
                                headerShown: false,
                                tabBarShowLabel: false,
                                tabBarActiveTintColor: theme.colors.primary,
                                tabBarInactiveTintColor: theme.colors.textLight,
                                tabBarStyle: {
                                        backgroundColor: theme.colors.surface,
                                        borderTopWidth: 0,
                                        height: 70,
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        elevation: 20,
                                        shadowColor: '#000',
                                        shadowOpacity: 0.1,
                                        shadowRadius: 10,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                },
                                tabBarItemStyle: {
                                        height: 70,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                }
                        }}
                >
                        <Tab.Screen
                                name="Home"
                                component={HomeScreen}
                                options={{
                                        tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={28} />
                                }}
                        />
                        <Tab.Screen
                                name="Extrato"
                                component={HomeScreen}
                                options={{
                                        tabBarIcon: ({ color }) => <Ionicons name="list" color={color} size={28} />
                                }}
                        />

                        <Tab.Screen
                                name="Adicionar"
                                component={HomeScreen}
                                options={{
                                        tabBarButton: (props) => <CustomAddButton {...props} />,
                                }}
                        />

                        <Tab.Screen
                                name="Dashboard"
                                component={HomeScreen}
                                options={{
                                        tabBarIcon: ({ color }) => <Entypo name="bar-graph" color={color} size={26} />
                                }}
                        />
                        <Tab.Screen
                                name="Perfil"
                                component={ProfileScreen}
                                options={{
                                        tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={28} />
                                }}
                        />
                </Tab.Navigator>
        );
}