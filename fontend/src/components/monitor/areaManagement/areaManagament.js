import { computed, ref, defineEmits } from "vue";
import axios from "axios";
import API_ENDPOINTS from "@/api/api.js";
import { useOrderStore } from "@/stores/orderStore.js";
import { useUserStore } from "@/stores/user.js";
import { toast } from "vue3-toastify";

export default function useAreaManagement() {
  const emit = defineEmits(["closeAndReset"]);

  const storeOrder = useOrderStore();
  const userStore = useUserStore();

  const tables = ref([]);
  const snackbar = ref(false);
  const discount = ref(0);
  const user = computed(() => userStore.user);

  const dialogEdit = ref(false);
  const dialogDelete = ref(false);

  const confirmDialog = ref(false);
  const currentTableId = ref(0);
  const currentOrder = ref({});
  const isActive = ref(false);

  const tableId = ref("");
  const desserts = computed(() => storeOrder.getDishesForTable(tableId.value));
  const headers = [
    { title: "Tên món", align: "start", sortable: false, key: "name" },
    { title: "Đơn vị", key: "unit" },
    { title: "Số lượng", key: "quantity" },
    { title: "Đơn giá", key: "unitPrice" },
    { title: "Thành tiền", key: "money" },
    { title: "Actions", key: "actions", sortable: false },
  ];

  const editedIndex = ref(-1);

  async function init() {
    const response = await axios.get(API_ENDPOINTS.GET_ALL_TABLE);
    tables.value = response.data.map((table) => ({
      ...table,
      isActive: false,
    }));
  }

  init();
  const handleConfirmDialog = (table) => {
    snackbar.value = true;
    currentTableId.value = table.tableId;
  };
  function getCurrentDateTimeForSQL() {
    const now = new Date();
    const localOffset = 7 * 60; // Phút (GMT+7)
    const localTime = new Date(now.getTime() + localOffset * 60 * 1000);
    return localTime.toISOString(); // Format: YYYY-MM-DDTHH:MM:SS.SSSZ
  }
  const resultTotalAmount = computed(() => {
    const discountAmount =
      (currentOrder.value.total_amount * (currentOrder.value.discount || 0)) /
      100;
    const taxAmount =
      (currentOrder.value.total_amount * (currentOrder.value.tax || 0)) / 100;
    return currentOrder.value.total_amount + taxAmount - discountAmount;
  });
  const resetCurrentOrder = () => {
    currentOrder.value = {
      user_id: user.value.userId,
      order_time: getCurrentDateTimeForSQL(),
      table_id: 1,
      total_amount: 0, // Reset lại tổng thanh toán
      status: "Paid", // Trạng thái mặc định
      discount: 12, // Reset giảm giá
      tax: 6, // Reset thuế
      items: [], // Reset danh sách các món ăn
    };
  };
  async function chooseTableAndSetCurrentOrders() {
    let orderTimeCurrent = getCurrentDateTimeForSQL();
    currentOrder.value = storeOrder.getSelectedDishes();
    try {
      const orderResponse = await axios.post(API_ENDPOINTS.ADD_ORDER, {
        userId: currentOrder.value.user_id,
        orderTime: orderTimeCurrent,
        tableId: currentTableId.value,
        totalAmount: resultTotalAmount.value,
        status: currentOrder.value.status,
        discount: currentOrder.value.discount,
        tax: currentOrder.value.tax,
      });

      const orderId = orderResponse.data.data.orderId;

      // Gửi cả món chính và món phụ trong cùng một request
      await Promise.all(
        currentOrder.value.items.map(async (item) => {
          // Gửi món chính
          const mainItemResponse = await axios.post(
            API_ENDPOINTS.ADD_ORDER_ITEM,
            {
              orderId: orderId,
              foodItemId: item.FoodItemId,
              foodName: item.FoodName,
              quantity: item.Quantity,
              price: item.Price,
              isMainItem: 1,
              unit: item.Unit,
              note: item.Note,
              categoryId: item.CategoryId,
              orderTime: orderTimeCurrent,
            }
          );
          // Gửi các món phụ với parentItemId là mainItemId
          await Promise.all(
            item.ListAdditionalFood.map(async (addFood) => {
              await axios.post(API_ENDPOINTS.ADD_ORDER_ITEM, {
                orderId: orderId,
                foodItemId: addFood.id,
                foodName: addFood.foodName,
                quantity: addFood.quantity, // Số lượng mặc định là 1 nếu không chọn khác
                price: addFood.price,
                isMainItem: 0,
                unit: addFood.unit,
                note: "",
                categoryId: 0,
                orderTime: orderTimeCurrent,
              });
            })
          );
        })
      );

      // Kiểm tra phản hồi từ server
      if (orderResponse.data.success === -1) {
        toast.warn("Please provide all required information!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false, // Hiện thanh tiến trình
          closeOnClick: true, // Đóng khi nhấp vào thông báo
          pauseOnHover: true, // Dừng khi di chuột lên thông báo
          draggable: true, // Kéo thông báo
          progress: undefined, // Tiến độ (nếu có)
        });
      } else if (orderResponse.data.success === 1) {
        confirmDialog.value = false;
        tables.value = tables.value.map((table) => ({
          ...table,
          isActive: table.tableId == currentTableId.value,
        }));
        toast.success("Add order successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false, // Hiện thanh tiến trình
          closeOnClick: true, // Đóng khi nhấp vào thông báo
          pauseOnHover: true, // Dừng khi di chuột lên thông báo
          draggable: true, // Kéo thông báo
          progress: undefined, // Tiến độ (nếu có)
        });
        // Emit event để đóng component và reset
        emit("closeAndReset");
      } else {
        console.error("Failed to add order", orderResponse.data.message);
      }
    } catch (error) {
      toast.error(`Error adding employee: ${error}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false, // Hiện thanh tiến trình
        closeOnClick: true, // Đóng khi nhấp vào thông báo
        pauseOnHover: true, // Dừng khi di chuột lên thông báo
        draggable: true, // Kéo thông báo
        progress: undefined, // Tiến độ (nếu có)
      });
    }
  }

  const defaultItem = {
    name: "",
    unit: "",
    quantity: 0,
    unitPrice: 0,
    money: 0,
  };

  const editedItem = ref({ ...defaultItem });

  const formTitle = computed(() => {
    return editedIndex.value === -1 ? "Thông tin món" : "Thay đổi thông tin";
  });

  // Watchers
  watch(dialogEdit, (val) => {
    if (!val) close();
  });

  watch(dialogDelete, (val) => {
    if (!val) closeDelete();
  });

  // Methods
  const initialize = () => {
    desserts.value = [
      {
        name: "Gà ủ muối",
        unit: "Con",
        quantity: 1,
        unitPrice: 190000.0,
        money: 190000.0,
      },
      {
        name: "Cá hồi nướng",
        unit: "Kg",
        quantity: 2,
        unitPrice: 250000.0,
        money: 500000.0,
      },
      {
        name: "Bò sốt vang",
        unit: "Phần",
        quantity: 3,
        unitPrice: 120000.0,
        money: 360000.0,
      },
      {
        name: "Tôm hùm hấp",
        unit: "Con",
        quantity: 1,
        unitPrice: 750000.0,
        money: 750000.0,
      },
      {
        name: "Gỏi cuốn",
        unit: "Phần",
        quantity: 5,
        unitPrice: 50000.0,
        money: 250000.0,
      },
      {
        name: "Bánh xèo",
        unit: "Cái",
        quantity: 10,
        unitPrice: 25000.0,
        money: 250000.0,
      },
    ];
  };

  const editItem = (item) => {
    editedIndex.value = desserts.value.indexOf(item);
    editedItem.value = { ...item };
    dialogEdit.value = true;
  };

  const deleteItem = (item) => {
    editedIndex.value = desserts.value.indexOf(item);
    editedItem.value = { ...item };
    dialogDelete.value = true;
  };

  const deleteItemConfirm = () => {
    desserts.value.splice(editedIndex.value, 1);
    closeDelete();
  };

  const close = () => {
    dialogEdit.value = false;
    nextTick(() => {
      editedItem.value = { ...defaultItem };
      editedIndex.value = -1;
    });
  };

  const closeDelete = () => {
    dialogDelete.value = false;
    nextTick(() => {
      editedItem.value = { ...defaultItem };
      editedIndex.value = -1;
    });
  };

  const save = () => {
    if (editedIndex.value > -1) {
      Object.assign(desserts.value[editedIndex.value], editedItem.value);
    } else {
      desserts.value.push(editedItem.value);
    }
    close();
  };

  const totalMoney = computed(() => {
    return desserts.value.reduce((acc, item) => acc + item.money, 0);
  });

  const totalPayment = computed(() => {
    return totalMoney.value - (totalMoney.value * discount.value) / 100;
  });
  return {
    storeOrder,
    userStore,
    tables,
    snackbar,
    discount,
    user,
    dialogEdit,
    dialogDelete,
    confirmDialog,
    currentTableId,
    currentOrder,
    isActive,
    tableId,
    desserts,
    headers,
    editedIndex,

    handleConfirmDialog,
    getCurrentDateTimeForSQL,
    resultTotalAmount,
    resetCurrentOrder,
    chooseTableAndSetCurrentOrders,
    defaultItem,
    editedItem,
    formTitle,
    initialize,
    editItem,
    deleteItem,
    deleteItemConfirm,
    close,
    closeDelete,
    save,
    totalMoney,
    totalPayment,
  };
}
