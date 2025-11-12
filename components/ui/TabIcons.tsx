import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface TabIconProps {
  focused: boolean;
  size?: number;
}

export const HomeIcon: React.FC<TabIconProps> = ({ focused, size = 35 }) => {
  const strokeColor = focused ? '#FF2D55' : '#444444';
  const strokeWidth = focused ? '4' : '2';

  return (
    <Svg width={size} height={size} viewBox="0 0 35 35" fill="none">
      <Path
        d="M13.125 32.0833V17.5H21.875V32.0833M4.375 13.125L17.5 2.91663L30.625 13.125V29.1666C30.625 29.9402 30.3177 30.682 29.7707 31.229C29.2237 31.776 28.4819 32.0833 27.7083 32.0833H7.29167C6.51812 32.0833 5.77625 31.776 5.22927 31.229C4.68229 30.682 4.375 29.9402 4.375 29.1666V13.125Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const TripIcon: React.FC<TabIconProps> = ({ focused, size = 35 }) => {
  const strokeColor = focused ? '#FF2D55' : '#444444';
  const strokeWidth = focused ? '4' : '2';

  return (
    <Svg width={size} height={size} viewBox="0 0 35 35" fill="none">
      <Path
        d="M11.6667 26.25L1.45834 32.0833V8.74996L11.6667 2.91663M11.6667 26.25L23.3333 32.0833M11.6667 26.25V2.91663M23.3333 32.0833L33.5417 26.25V2.91663L23.3333 8.74996M23.3333 32.0833V8.74996M23.3333 8.74996L11.6667 2.91663"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const ExploreIcon: React.FC<TabIconProps> = ({ focused, size = 35 }) => {
  const strokeColor = focused ? '#FF2D55' : '#444444';
  const strokeWidth = focused ? '4' : '2';

  return (
    <Svg width={size} height={size} viewBox="0 0 35 35" fill="none">
      <Path
        d="M17.5 32.0833C25.5542 32.0833 32.0833 25.5541 32.0833 17.5C32.0833 9.44581 25.5542 2.91663 17.5 2.91663C9.44585 2.91663 2.91667 9.44581 2.91667 17.5C2.91667 25.5541 9.44585 32.0833 17.5 32.0833Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23.6833 11.3166L20.5917 20.5916L11.3167 23.6833L14.4083 14.4083L23.6833 11.3166Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const ChatIcon: React.FC<TabIconProps> = ({ focused, size = 35 }) => {
  const strokeColor = focused ? '#FF2D55' : '#444444';
  const strokeWidth = focused ? '4' : '2';

  return (
    <Svg width={size} height={size} viewBox="0 0 35 35" fill="none">
      <Path
        d="M30.625 16.7709C30.63 18.6957 30.1803 20.5945 29.3125 22.3125C28.2835 24.3713 26.7017 26.103 24.7442 27.3136C22.7867 28.5241 20.5308 29.1658 18.2292 29.1667C16.3044 29.1717 14.4056 28.722 12.6875 27.8542L4.375 30.625L7.14583 22.3125C6.27802 20.5945 5.82831 18.6957 5.83333 16.7709C5.83422 14.4693 6.47589 12.2134 7.68647 10.2558C8.89704 8.29832 10.6287 6.71649 12.6875 5.68754C14.4056 4.81973 16.3044 4.37002 18.2292 4.37504H18.9583C21.998 4.54274 24.869 5.82574 27.0217 7.97838C29.1743 10.131 30.4573 13.002 30.625 16.0417V16.7709Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const MyIcon: React.FC<TabIconProps> = ({ focused, size = 35 }) => {
  const strokeColor = focused ? '#FF2D55' : '#444444';
  const strokeWidth = focused ? '4' : '2';

  return (
    <Svg width={size} height={size} viewBox="0 0 35 35" fill="none">
      <Path
        d="M29.1667 30.625V27.7083C29.1667 26.1612 28.5521 24.6775 27.4581 23.5835C26.3642 22.4896 24.8804 21.875 23.3333 21.875H11.6667C10.1196 21.875 8.63585 22.4896 7.54189 23.5835C6.44792 24.6775 5.83334 26.1612 5.83334 27.7083V30.625M23.3333 10.2083C23.3333 13.43 20.7217 16.0417 17.5 16.0417C14.2783 16.0417 11.6667 13.43 11.6667 10.2083C11.6667 6.98667 14.2783 4.375 17.5 4.375C20.7217 4.375 23.3333 6.98667 23.3333 10.2083Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

