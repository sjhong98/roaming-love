import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

export interface CustomTextProps extends RNTextProps {
  children?: React.ReactNode;
}

// fontWeight에 따라 적절한 폰트 선택
const getFontFamily = (fontWeight?: string | number): string => {
  const weight = typeof fontWeight === 'string' ? fontWeight.toLowerCase() : String(fontWeight);
  
  // 숫자로 변환 시도
  const numericWeight = typeof fontWeight === 'number' ? fontWeight : 
    weight === 'normal' ? 400 : 
    weight === 'bold' ? 700 : 
    parseInt(weight) || 400;
  
  if (numericWeight <= 300) {
    return 'NanumSquareNeo-Light';
  } else if (numericWeight <= 500) {
    return 'NanumSquareNeo-Regular';
  } else if (numericWeight < 700) {
    return 'NanumSquareNeo-Bold';
  } else if (numericWeight < 800) {
    return 'NanumSquareNeo-ExtraBold';
  } else {
    return 'NanumSquareNeo-Heavy';
  }
};

export const CustomText = React.forwardRef<any, CustomTextProps>((props, ref) => {
  const { style, ...restProps } = props;
  
  // 스타일에서 fontWeight 추출
  let fontWeight: string | number | undefined = '400';
  if (Array.isArray(style)) {
    const flatStyle = style.flat();
    for (const s of flatStyle) {
      if (s && typeof s === 'object' && 'fontWeight' in s) {
        fontWeight = s.fontWeight;
        break;
      }
    }
  } else if (style && typeof style === 'object' && 'fontWeight' in style) {
    fontWeight = style.fontWeight;
  }
  
  const fontFamily = getFontFamily(fontWeight);
  
  // 커스텀 폰트를 사용할 때는 fontWeight를 제거 (폰트 패밀리 자체가 굵기를 결정)
  const baseStyle = { fontFamily };
  
  // 폰트를 적용하고, 사용자 스타일과 병합
  const fontStyle = Array.isArray(style)
    ? [baseStyle, ...style]
    : style
    ? [baseStyle, style]
    : baseStyle;
  
  return (
    <RNText {...restProps} style={fontStyle} ref={ref} />
  );
});

CustomText.displayName = 'CustomText';

// Text의 모든 정적 속성을 CustomText에 복사
Object.keys(RNText).forEach((key) => {
  try {
    (CustomText as any)[key] = (RNText as any)[key];
  } catch (e) {
    // 읽기 전용 속성은 무시
  }
});

export default CustomText;

