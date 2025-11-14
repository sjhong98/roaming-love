import { Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChangeEachOtherIcon from '@/assets/images/changeEachOther.svg';
import CalendarIcon from '@/assets/images/calendarRed.svg';
import { useEffect, useRef, useState } from "react";
import { Image, ImageSource } from "expo-image";
import LocationCard from "@/components/ui/LocationCard";
import SearchRedIcon from '@/assets/images/searchRed.svg';
import LocationSelect from "@/components/trip/LocationSelect";
import DateSelect from "@/components/trip/DateSelect";
import { changeToThreeLetter } from "@/utils/changeToThreeLetter";
import dayjs from "dayjs";
import SettingIcon from '@/assets/images/settingIcon.svg';
import TypeSelect from "@/components/trip/TypeSelect";
import UserDummy from "@/constants/UserDummy";
import CreateIcon from '@/assets/images/createIcon.svg';
import SendIcon from '@/assets/images/sendIcon.svg';
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArrowGray from '@/assets/images/arrowGray.svg';

export default function Explore() {
    return (
        <View>
            <Text>Explore</Text>
        </View>
    );
}