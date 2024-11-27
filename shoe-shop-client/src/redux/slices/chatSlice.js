import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    isOpen: false,
    chatHistoryLoaded: false,
    isLoading: false,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      const messageExists = state.messages.some(
        (msg) =>
          msg.content === action.payload.content &&
          msg.sender === action.payload.sender &&
          new Date(msg.timestamp).getTime() ===
            new Date(action.payload.timestamp).getTime()
      );

      if (!messageExists) {
        state.messages.push(action.payload);
        state.messages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter((msg) => msg !== action.payload);
    },
    setChatOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setChatHistoryLoaded: (state, action) => {
      state.chatHistoryLoaded = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  removeMessage,
  setChatOpen,
  setChatHistoryLoaded,
  setLoading,
} = chatSlice.actions;
export default chatSlice.reducer;
