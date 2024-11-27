import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: {}, // Lưu tin nhắn theo userId
    chats: [], // Danh sách chat
  },
  reducers: {
    setMessages: (state, action) => {
      const { userId, messages } = action.payload;
      state.messages[userId] = messages;
    },
    addMessage: (state, action) => {
      const { userId, message } = action.payload;
      if (!state.messages[userId]) {
        state.messages[userId] = [];
      }
      state.messages[userId].push(message);
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    updateChat: (state, action) => {
      const { userId, lastMessage, timestamp } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === userId);
      if (chatIndex !== -1) {
        state.chats[chatIndex] = {
          ...state.chats[chatIndex],
          lastMessage,
          timestamp,
        };
      }
    },
  },
});

export const { setMessages, addMessage, setChats, updateChat } =
  chatSlice.actions;
export default chatSlice.reducer;
