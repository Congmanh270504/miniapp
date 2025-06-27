import { createSlice } from "@reduxjs/toolkit";

interface PlaySongState {
  id: string;
  isPlaying: boolean;
}
const initialState: PlaySongState = {
  id: "",
  isPlaying: false,
};
export const playSongSlice = createSlice({
  name: "playSong",
  initialState,
  reducers: {
    setPlaySong: (state, action) => {
      state.id = action.payload.id;
      state.isPlaying = action.payload.isPlaying;
    },
    togglePlaySong: (state) => {
      state.isPlaying = !state.isPlaying;
    },
  },
});
export const { setPlaySong, togglePlaySong } = playSongSlice.actions;
export default playSongSlice.reducer;
