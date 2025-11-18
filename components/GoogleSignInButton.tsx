import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

interface GoogleSignInButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const GoogleIcon: React.FC<{ size?: number }> = ({ size = 50 }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <Image
      source={require('../assets/images/googleIcon.png')}
      style={{ width: size, height: size }}
      resizeMode="cover"
    />
  </View>
);

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  disabled = false,
  text = 'Sign in',
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
      // android_ripple={{ color: 'rgba(48, 48, 48, 0.12)' }}
    >
      <View style={styles.contentWrapper}>
        <GoogleIcon size={20} />
        <Text style={[styles.buttonText, disabled && styles.textDisabled, textStyle]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#747775',
    borderRadius: 4,
    height: 40,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
    maxWidth: 400,
    // iOS 그림자 효과
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2, // Android 그림자
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
    borderColor: 'rgba(31, 31, 31, 0.12)',
  },
  buttonPressed: {
    backgroundColor: 'rgba(48, 48, 48, 0.12)',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f1f1f',
    letterSpacing: 0.25,
    flex: 1,
    textAlign: 'center',
  },
  textDisabled: {
    opacity: 0.38,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    minWidth: 26,
    width: 26,
    height: 26,
  },
});

export default GoogleSignInButton;
