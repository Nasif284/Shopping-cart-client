import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalOpen: false,
  id: null,
  params: { page: 1, perPage: 12 },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setModalOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
    setProductId: (state, action) => {
      state.id = action.payload;
    },
    setParams: (state, action) => {
      state.params = { ...state.params, ...action.payload };
    },
  },
});

export const { setModalOpen, setProductId, setParams } = uiSlice.actions;
export default uiSlice.reducer;
