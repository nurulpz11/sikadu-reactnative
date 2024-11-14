import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const handleDeepLink = (event) => {
    let url = event.url;
    if (url.startsWith('yourapp://reset-password')) {
        let token = url.split('token=')[1];
        navigation.navigate('ResetPasswordScreen', { token: token });
    }
};

useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);

    // Cleanup
    return () => {
        Linking.removeEventListener('url', handleDeepLink);
    };
}, []);
