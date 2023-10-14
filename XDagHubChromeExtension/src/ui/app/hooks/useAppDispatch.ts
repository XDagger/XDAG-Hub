import { useDispatch } from "react-redux";
import type { AppDispatch } from "_store";

export default function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
