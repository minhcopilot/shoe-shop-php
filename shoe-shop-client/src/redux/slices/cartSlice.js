import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        item => 
          item.product.id === newItem.product.id && 
          item.chooseSize.id === newItem.chooseSize.id
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },
    removeFromCart: (state, action) => {
      const { productId, sizeId } = action.payload;
      state.items = state.items.filter(
        item => 
          !(item.product.id === productId && item.chooseSize.id === sizeId)
      );
    },
    updateQuantity: (state, action) => {
      const { productId, sizeId, quantity } = action.payload;
      const item = state.items.find(
        item => 
          item.product.id === productId && 
          item.chooseSize.id === sizeId
      );
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 