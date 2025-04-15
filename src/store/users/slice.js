import { createSlice } from "@reduxjs/toolkit";
import { banUser, toggleUserRole, searchUsers } from "./operations";

const initialState = {
  items: [],
  isLoading: false,
  is_active: true,
  banMessage: "",
  error: null,
  totalPages: 1,
  currentPage: 0, // Додано поточну сторінку
  usersPerPage: 8, // Кількість користувачів на сторінці
  filters: {
    search: "",
    role: "",
    reg_date_from: null,
    reg_date_to: null,
    sort_by: "name",
    sort_order: "asc",
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload; // Оновлення поточної сторінки
    },
    resetFilters: () => initialState,
    setFilters(state, action) {
      state.filters = action.payload; // Оновлення фільтрів
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, { payload }) => {
        const totalUsers = payload.length; // Загальна кількість користувачів
        const totalPages = Math.ceil(totalUsers / state.usersPerPage); // Обчислення кількості сторінок

        state.isLoading = false;
        state.items = payload || [];
        state.totalPages = totalPages; // Якщо totalPages не вказано, ставимо 1
      })
      .addCase(searchUsers.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(banUser.fulfilled, (state, { payload }) => {
        const user = state.items.find((u) => u.id === payload.userId);
        if (user) user.is_active = false;
        user.banMessage = payload.message;
      })
      .addCase(toggleUserRole.fulfilled, (state, { payload }) => {
        const user = state.items.find((u) => u.id === payload.userId);
        if (user) {
          user.type = user.type === "admin" ? "user" : "admin";
        }
      });
  },
});

export const { setCurrentPage, setFilters, resetFilters } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
