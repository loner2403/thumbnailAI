import { useReducer } from "react";

const initialImageFilters = {
  selectedFilter: "none",
  filterIntensity: 100,
  filterBrightness: 100,
  filterContrast: 100,
  filterSaturation: 100,
};

type ImageFiltersAction =
  | { type: "SET_FILTER"; value: string }
  | { type: "SET_INTENSITY"; value: number }
  | { type: "SET_BRIGHTNESS"; value: number }
  | { type: "SET_CONTRAST"; value: number }
  | { type: "SET_SATURATION"; value: number };

function reducer(state: typeof initialImageFilters, action: ImageFiltersAction) {
  switch (action.type) {
    case "SET_FILTER": return { ...state, selectedFilter: action.value };
    case "SET_INTENSITY": return { ...state, filterIntensity: action.value };
    case "SET_BRIGHTNESS": return { ...state, filterBrightness: action.value };
    case "SET_CONTRAST": return { ...state, filterContrast: action.value };
    case "SET_SATURATION": return { ...state, filterSaturation: action.value };
    default: return state;
  }
}

export default function useImageFilters() {
  const [state, dispatch] = useReducer(reducer, initialImageFilters);
  return { state, dispatch };
} 