import { useReducer } from "react";

const initialTextEffects = {
  textShadow: false,
  shadowBlur: 5,
  shadowColor: "rgba(0, 0, 0, 0.7)",
  textOutline: false,
  outlineWidth: 2,
  outlineColor: "#000000",
  useGradient: false,
  gradientColor1: "#ff0000",
  gradientColor2: "#0000ff",
  gradientDirection: 90,
  textOpacity: 100,
};

type TextEffectsAction =
  | { type: "SET_SHADOW"; value: boolean }
  | { type: "SET_SHADOW_BLUR"; value: number }
  | { type: "SET_SHADOW_COLOR"; value: string }
  | { type: "SET_OUTLINE"; value: boolean }
  | { type: "SET_OUTLINE_WIDTH"; value: number }
  | { type: "SET_OUTLINE_COLOR"; value: string }
  | { type: "SET_GRADIENT"; value: boolean }
  | { type: "SET_GRADIENT_COLOR1"; value: string }
  | { type: "SET_GRADIENT_COLOR2"; value: string }
  | { type: "SET_GRADIENT_DIRECTION"; value: number }
  | { type: "SET_TEXT_OPACITY"; value: number };

function reducer(state: typeof initialTextEffects, action: TextEffectsAction) {
  switch (action.type) {
    case "SET_SHADOW": return { ...state, textShadow: action.value };
    case "SET_SHADOW_BLUR": return { ...state, shadowBlur: action.value };
    case "SET_SHADOW_COLOR": return { ...state, shadowColor: action.value };
    case "SET_OUTLINE": return { ...state, textOutline: action.value };
    case "SET_OUTLINE_WIDTH": return { ...state, outlineWidth: action.value };
    case "SET_OUTLINE_COLOR": return { ...state, outlineColor: action.value };
    case "SET_GRADIENT": return { ...state, useGradient: action.value };
    case "SET_GRADIENT_COLOR1": return { ...state, gradientColor1: action.value };
    case "SET_GRADIENT_COLOR2": return { ...state, gradientColor2: action.value };
    case "SET_GRADIENT_DIRECTION": return { ...state, gradientDirection: action.value };
    case "SET_TEXT_OPACITY": return { ...state, textOpacity: action.value };
    default: return state;
  }
}

export default function useTextEffects() {
  const [state, dispatch] = useReducer(reducer, initialTextEffects);
  return { state, dispatch };
} 