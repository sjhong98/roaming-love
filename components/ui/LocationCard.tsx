import { forwardRef } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Image, ImageSource } from "expo-image";
import HeartActiveIcon from "@/assets/images/heartActive.svg";

export const LOCATION_CARD_MARKER_SIZE = 32;
export const LOCATION_CARD_FONT_SIZE = 18;

type LocationCardProps = {
    image: ImageSource;
    name: string;
    containerStyle?: StyleProp<ViewStyle>;
    showHeart?: boolean;
    markerSize?: number;
    titleFontSize?: number;
};

const LocationCard = forwardRef<View, LocationCardProps>(function LocationCard(
    {
        image,
        name,
        containerStyle,
        showHeart = true,
        markerSize = LOCATION_CARD_MARKER_SIZE,
        titleFontSize = LOCATION_CARD_FONT_SIZE,
    },
    ref
) {
    return (
        <View ref={ref} style={[styles.container, containerStyle]}>
            <Image source={image} style={styles.image} contentFit="cover" />
            {showHeart ? <HeartActiveIcon style={styles.heart} /> : null}
            <View style={styles.bottomInfo}>
                <View style={{ width: markerSize, height: markerSize }}>
                    <Image
                        source={require("@/assets/images/marker.png")}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="contain"
                    />
                </View>
                <Text
                    style={[
                        styles.name,
                        {
                            marginTop: 7,
                            fontSize: titleFontSize,
                        },
                    ]}
                >
                    {name}
                </Text>
            </View>
        </View>
    );
});

export default LocationCard;

const styles = StyleSheet.create({
    container: {
        width: 189,
        height: 261,
        borderRadius: 24,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0px 8px 20px 5px rgba(0, 0, 0, 0.2)",
    },
    image: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    },
    heart: {
        position: "absolute",
        top: 14,
        right: 19,
        width: 25,
        height: 25,
    },
    bottomInfo: {
        position: "absolute",
        bottom: 18,
        width: "100%",
        alignItems: "center",
    },
    name: {
        fontWeight: "600",
        color: "#FFF",
    },
});

