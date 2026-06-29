import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/providers/AppProvider';
import { NavigationContainer } from '@react-navigation/native'

export default function App() {
        return (
                <NavigationContainer>
                        <StatusBar style="auto" />
                        <AppProvider />
                </NavigationContainer>
        );
}