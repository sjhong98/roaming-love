import CalendarInactiveIcon from '@/assets/images/calendarLightGray.svg';
import CalendarActiveIcon from '@/assets/images/calendarDarkGray.svg';
import ChangeEachOtherIcon from '@/assets/images/changeEachOther.svg';
import DateSelect from "@/components/trip/DateSelect";
import LocationSelect from "@/components/trip/LocationSelect";
import TypeSelect from "@/components/trip/TypeSelect";
import LocationCard from "@/components/ui/LocationCard";
import UserDummy from "@/constants/UserDummy";
import { changeToThreeLetter } from "@/utils/changeToThreeLetter";
import dayjs from "dayjs";
import { Image, ImageSource } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsyncStorageAdapter } from '@/db';
import { router } from 'expo-router';

export default function My() {
    
    const handleLogOut = async () => {
        await AsyncStorageAdapter.removeItem('userInfo');
        router.replace('/login');
    }

    return (
        <SafeAreaView style={{}}>
            <TouchableOpacity onPress={handleLogOut}>
                <Text>Log out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}