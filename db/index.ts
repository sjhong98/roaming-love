import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseUrl = 'https://paskgkdsuwcdiqytcvka.supabase.co'
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// 플랫폼별 스토리지 어댑터
const AsyncStorageAdapter = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      // 웹에서는 localStorage 사용
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key)
      }
      return null
    }
    // 네이티브 (iOS, Android)에서는 AsyncStorage 사용
    return await SecureStore.getItemAsync(key)
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      // 웹에서는 localStorage 사용
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value)
      }
      return
    }
    // 네이티브 (iOS, Android)에서는 AsyncStorage 사용
    await SecureStore.setItemAsync(key, value)
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      // 웹에서는 localStorage 사용
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
      return
    }
    // 네이티브 (iOS, Android)에서는 AsyncStorage 사용
    await SecureStore.deleteItemAsync(key)
  },
}

const supabase = createClient(supabaseUrl, supabaseKey || '', {
  auth: {
    // storage: AsyncStorageAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // React Native에서는 false로 설정
  },
})

export default supabase
export { AsyncStorageAdapter };
