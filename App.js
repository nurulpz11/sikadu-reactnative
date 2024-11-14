import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Onboarding1 from './App/Screens/OnboardingScreen/Onboarding1';
import FormLogin from './App/Screens/LoginScreen/FormLogin';
import RegisterScreen from './App/Screens/RegisterScreen/RegisterScreen';
import HomeScreen from './App/Screens/Home/HomeScreen';
import KategoriScreen from './App/Screens/PengaduanScreen/KategoriScreen';
import NotifikasiScreen from './App/AnotherScreen/NotifikasiScreen';
import PengaduanScreen from './App/Screens/PengaduanScreen/LaporanScreen';
import BeritaScreen from './App/AnotherScreen/BeritaScreen';
import JenisKategoriScreen from './App/Screens/PengaduanScreen/JenisKategoriScreen';
import FormPengaduanScreen from './App/Screens/PengaduanScreen/FormPengaduanScreen'; // Pastikan impor benar
import Colors from './App/Utils/Color';
import DetailBeritaScreen from './App/AnotherScreen/DetailBeritaScreen';
import PemadamanScreen from './App/AnotherScreen/PemadamanScreen';
import AktivitasScreen from './App/Screens/Aktivitas/AktivitasScreen';
import RuangKaduScreen from './App/Screens/RuangKadu/RuangKaduScreen';
import DetailRuangKaduScreen from './App/Screens/RuangKadu/DetailRuangKaduScreen';
import ProfileScreen from './App/Screens/ProfileScreen/ProfileScreen';
import EditProfileScreen from './App/Screens/ProfileScreen/EditProfileScreen';
import LayananScreen from './App/AnotherScreen/LayananScreen';
import KontakScreen from './App/AnotherScreen/KontakScreen';
import DetailAktivitasScreen from './App/Screens/Aktivitas/DetailAktivitasScreen';
import ForgotPassword from './App/Screens/LoginScreen/ForgotPassword';
import FormAspirasiScreen from './App/Screens/PengaduanScreen/FormAspirasiScreen';
import FaqScreen from './App/AnotherScreen/FaqScreen';
import LaporanScreen from './App/Screens/PengaduanScreen/LaporanScreen';
import AnotherScreen from './App/AnotherScreen/AnotherScreen';
import ResetPassword from './App/Screens/LoginScreen/ResetPassword';
import * as Linking from 'expo-linking';
import TentangScreen from './App/Screens/ProfileScreen/TentangScreen';
import SyaratScreen from './App/Screens/ProfileScreen/SyaratScreen';

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      Onboarding1: '',
      Register: 'register',
      FormLogin: 'login',
      MainTabs: 'main',
      ResetPassword: 'reset-password/:token', // Sesuaikan dengan struktur URL reset password Anda
    },
  },
};


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CustomTabBarButton({ children, onPress }) {
  return (
    <TouchableOpacity
      style={{
        top: -10,
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 53,
          height: 53,
          borderRadius: 35,
          backgroundColor: '#359FAD',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: -20
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}

function Main() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#969595',
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Beranda') {
            iconName = focused
              ? require('./assets/images/home1.png')
              : require('./assets/images/home2.png');
          } else if (route.name === 'Laporan ') {
            iconName = focused
              ? require('./assets/images/complain2.png')
              : require('./assets/images/complain3.png');
          } else if (route.name === 'Laporan Saya') {
            iconName = focused
              ? require('./assets/images/aktivitas1.png')
              : require('./assets/images/aktivitas2.png');
          } else if (route.name === 'Notifikasi') {
              iconName = focused
                ? require('./assets/images/notif1.png')
                : require('./assets/images/notif2.png');
          } else if (route.name === 'Profil') {
            iconName = focused
              ? require('./assets/images/profile.png')
              : require('./assets/images/profile2.png');
          }

          return <Image source={iconName} style={styles.icon} />;
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500'
        }
      })}
    >
      <Tab.Screen 
        name="Beranda" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
     <Tab.Screen name="Laporan Saya" component={AktivitasScreen} />

      <Tab.Screen 
        name="Laporan" 
        component={LaporanScreen} 
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props}>
              <Image
                source={require('./assets/images/complain3.png')}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: '#EEEEEE'
                }}
              />
            </CustomTabBarButton>
          )
        }}
      />
      <Tab.Screen name="Notifikasi" component={NotifikasiScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Onboarding1">
        <Stack.Screen name="Onboarding1" component={Onboarding1} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FormLogin" component={FormLogin} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        <Stack.Screen name="Jenis Kategori" component={JenisKategoriScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Form Pengaduan" component={FormPengaduanScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Detail Berita" component={DetailBeritaScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Ruang Kadu" component={RuangKaduScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Detail Ruang Kadu" component={DetailRuangKaduScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Ubah Profil" component={EditProfileScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Layanan" component={LayananScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Berita" component={BeritaScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Kontak" component={KontakScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Pemadaman" component={PemadamanScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Detail Laporan" component={DetailAktivitasScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Lupa Password" component={ForgotPassword} options={{ headerShown: true }} />
        <Stack.Screen name="PengaduanScreen" component={PengaduanScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Kategori" component={KategoriScreen} options={{ headerShown: true }} />
        <Stack.Screen name="FormAspirasiScreen" component={FormAspirasiScreen} options={{ headerShown: true }} />
        <Stack.Screen name="FAQ" component={FaqScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Profil" component={ProfileScreen} options={{ headerShown: true }} />
        <Stack.Screen name="AnotherScreen" component={AnotherScreen} options={{ headerShown: true }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: true }} />
        <Stack.Screen name="Tentang" component={TentangScreen} options={{ headerShown: true }} />
        <Stack.Screen name="SnK" component={SyaratScreen} options={{ headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  }
});