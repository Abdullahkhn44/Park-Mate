import { Stack } from 'expo-router/stack';
import store from '../Redux/Store/store'
import { Provider } from 'react-redux';
export default function Layout() {
  return (
    <Provider store={store}>
    <Stack  screenOptions={{
        headerShown:false,
        
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Map" options={{ title:'Car Location' }} />
    </Stack>
    </Provider>
  );
}
