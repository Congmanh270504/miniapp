import { createSlice } from "@reduxjs/toolkit";
interface ModifyItemProps {
  activeDropdown: string;
}
const initialState: ModifyItemProps = {
  activeDropdown: "",
};
export const modifyItemSlice = createSlice({
  name: "modifyItem",
  initialState,
  reducers: {
    setActiveDropdown: (state, action) => {
      state.activeDropdown = action.payload;
    },
    handleClickOutside: (state) => {
      if (state.activeDropdown !== "") {
        state.activeDropdown = "";
      }
    },
    toggleDropdown: (state, action) => {
      state.activeDropdown = state.activeDropdown === action.payload ? "" : action.payload;
    },
  },
});
export const { setActiveDropdown, handleClickOutside, toggleDropdown } = modifyItemSlice.actions;
// Export the reducer, which will be used in the store
export default modifyItemSlice.reducer;
