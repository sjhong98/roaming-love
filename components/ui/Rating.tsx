import { memo, useMemo } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import ActiveStarIcon from "@/assets/images/starActive.svg";
import InactiveStarIcon from "@/assets/images/starInactive.svg";

type RatingProps = {
  rating: number;
  maxRating?: number;
  onChange?: (value: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  isInteractive?: boolean;
};

const RatingComponent = ({
  rating,
  maxRating = 5,
  onChange,
  containerStyle,
  isInteractive = !!onChange,
}: RatingProps) => {
  const clampedRating = Math.max(0, Math.min(rating, maxRating));
  const stars = useMemo(() => Array.from({ length: maxRating }, (_, index) => index + 1), [maxRating]);

  return (
    <View style={[styles.container, containerStyle]}>
      {stars.map((value) => {
        const Icon = value <= clampedRating ? ActiveStarIcon : InactiveStarIcon;

        if (isInteractive) {
          return (
            <Pressable
              key={value}
              style={styles.starWrapper}
              onPress={() => onChange?.(value)}
              hitSlop={8}
            >
              <Icon width={16} height={16} />
            </Pressable>
          );
        }

        return (
          <View key={value} style={styles.starWrapper}>
            <Icon width={16} height={16} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 108,
    height: 28,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 12,
  },
  starWrapper: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const Rating = memo(RatingComponent);

export default Rating;

