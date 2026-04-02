import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

type Props = {
  size?: number;
};

export function WaitixLogo({ size = 120 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#D4FF00" />
          <Stop offset="0.5" stopColor="#B8E600" />
          <Stop offset="1" stopColor="#8FB300" />
        </LinearGradient>
        <LinearGradient id="grad2" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#D4FF00" />
          <Stop offset="0.5" stopColor="#C8F000" />
          <Stop offset="1" stopColor="#A0CC00" />
        </LinearGradient>
      </Defs>

      {/* Top bowl - wider at top, narrows to center */}
      <Path
        d="M55 40 L145 40 Q148 40 148 44 L148 50 Q148 55 143 60 L115 88 Q108 95 100 95 L100 95 Q105 95 100 100 L100 100"
        fill="none"
        stroke="url(#grad1)"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom bowl - narrows at center, wider at bottom */}
      <Path
        d="M100 100 L100 100 Q95 105 100 105 L100 105 Q92 105 85 112 L57 140 Q52 145 52 150 L52 156 Q52 160 55 160 L145 160"
        fill="none"
        stroke="url(#grad2)"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lightning accent in center */}
      <Path
        d="M105 85 L95 100 L105 100 L95 115"
        fill="none"
        stroke="#8FB300"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
