import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { CustomText as Text } from '@/components/CustomText';

interface LiquidGlassButtonProps extends TouchableOpacityProps {
  text: string;
  backgroundColor?: string;
}

const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({ 
  text, 
  backgroundColor = '#FF5878',
  style,
  ...touchableProps 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.buttonLiquidGlassText, styles.textFlexBox, { backgroundColor }, style]}
      {...touchableProps}
    >
      <View style={[styles.bg, styles.bgPosition]}>
        <View style={[styles.tint, styles.bgPosition]} />
        <View style={[styles.glassEffect, styles.bgPosition]} />
      </View>
      <View style={[styles.safeareaviewText, styles.textFlexBox]}>
        <Text style={[styles.symbol, styles.symbolTypo]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textFlexBox: {
    justifyContent: "center",
    alignItems: "center"
  },
  bgPosition: {
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    position: "absolute"
  },
  symbolTypo: {
    textAlign: "center",
    fontSize: 17
  },
  buttonLiquidGlassText: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 4,
    flexDirection: "row",
    height: 52,
    width: 334,
    borderRadius: 1000,
  },
  bg: {
    zIndex: 0,
    height: 52,
    width: 334
  },
  tint: {
    // boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.1)",
    elevation: 2,
    backgroundColor: "transparent",
    borderRadius: 1000
  },
  glassEffect: {
    borderRadius: 296,
    backgroundColor: "rgba(0, 0, 0, 0)"
  },
  safeareaviewText: {
    height: 36,
    zIndex: 1,
    borderRadius: 100,
    flexDirection: "row"
  },
  symbol: {
    fontWeight: "500",
    color: "#fff"
  }
});

export default LiquidGlassButton;
