import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

// Definição dos nomes das telas para o TypeScript
export type AuthStackParamList = {
        Login: undefined;
        Register: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthRoutes() {
        return (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Navigator>
        );
}