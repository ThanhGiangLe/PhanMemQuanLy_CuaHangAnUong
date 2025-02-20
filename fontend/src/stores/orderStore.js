import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    selectedDishes: [], // Danh sách món ăn đã chọn
    tableOrders: {},    // Object chứa orders theo tableId
  }),

  actions: {
    // Lưu danh sách món ăn đã chọn
    setSelectedDishes(dishes) {
      this.selectedDishes = dishes;
    },

    // Lấy danh sách món ăn đã chọn
    getSelectedDishes() {
      return this.selectedDishes;
    },

    // Gán danh sách món ăn cho một bàn
    assignToTable(tableId) {
      if (!tableId || this.selectedDishes.length === 0) return;
      
      if (!this.tableOrders[tableId]) {
        this.tableOrders[tableId] = [];
      }
      this.tableOrders[tableId] = [...this.selectedDishes];
    },

    // Xóa danh sách món ăn đã chọn
    clearSelectedDishes() {
      this.selectedDishes = [];
    },

    // Xóa thông tin order của một bàn
    clearTableOrder(tableId) {
      if (tableId && this.tableOrders[tableId]) {
        delete this.tableOrders[tableId];
      }
    }
  }
});
