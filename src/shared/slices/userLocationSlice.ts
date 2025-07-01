import { INVALID_COORDS } from "../lib/consts";
import { ICoords } from "../lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserLocationState {
  coords: ICoords;
  coordsLabel: string;
}

const initialState: UserLocationState = {
  coords: INVALID_COORDS,
  coordsLabel: "",
};

const userLocationSlice = createSlice({
  name: "userLocation",
  initialState,
  reducers: {
    setUserCoords(state, action: PayloadAction<ICoords>) {
      state.coords = action.payload;
    },
    setUserCoordsLabel(state, action: PayloadAction<string>) {
      state.coordsLabel = action.payload;
    },
    resetUserLocation() {
      return initialState;
    },
  },
});

export const { setUserCoords, setUserCoordsLabel, resetUserLocation } =
  userLocationSlice.actions;

export default userLocationSlice.reducer;
