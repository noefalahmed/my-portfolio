// components/HeaderAnimation.tsx
import React from "react";
import "./HeaderAnimation.module.css"; // import CSS for animations

const HeaderAnimation: React.FC = () => {
  return (
    <div className="headerAnimationWrapper">
      <svg
        width="1141"
        height="224"
        viewBox="0 0 1141 224"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect className="pill" x="13.8311" y="0" width="439.129" height="205.013" rx="102.507" fill="#D83D3D"/>
        <circle className="circle1" cx="50.2329" cy="50.2329" r="50.2329" transform="matrix(1 0 0 -1 61.5205 154.242)" fill="#D83D3D"/>
        <circle className="circle2" cx="1046" cy="139" r="31" fill="#D83D3D"/>
        <path id="triangle" d="M834.841 54L892.327 153.569H777.355L834.841 54Z" fill="#D83D3D"/>
        <path id="motionPath" d="M834.841 54 C871 100 928 140 1026 159" stroke="transparent" fill="none"/>
        <circle className="movingRing" r="15" stroke="#D83D3D" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
};

export default HeaderAnimation;