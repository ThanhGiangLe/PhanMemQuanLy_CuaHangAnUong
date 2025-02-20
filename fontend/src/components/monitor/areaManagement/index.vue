<template>
  <div class="areaManagement pa-3">
    <div class="areaManagement_item d-flex align-center rounded">
      <div
        class="areaManagement_item_tables d-flex flex-wrap py-2 justify-center "
        style="width: 100%"
      >
      <!-- @click="
            snackbar = !snackbar;
            setCurrentOrder(table.tableId);
          " -->
        <div
          v-for="table in tables"
          :key="table.tableId"
          size="large"
          class="areaManagement_item_tables_table d-flex flex-column ma-2 pa-2 rounded cursor-pointer"
          style="width: 200px; min-height: 80px"
          :type="table.isActive ? 'xanh' : 'den'"
          @click="handleConfirmDialog(table)"
        >
          <div class="d-flex justify-space-between">
            <h4>{{ table.tableName }}</h4>
            <span>09:37</span>
          </div>
          <div class="mt-5">No Order</div>
        </div>
      </div>
    </div>

    <v-dialog v-model="confirmDialog" max-width="300px" class="text-center">
      <v-card>
        <v-card-title class="text-h5 text-center">
          Xác nhận
        </v-card-title>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="chooseTableAndSetCurrentOrders">Đồng ý</v-btn>
          <v-btn color="error" @click="confirmDialog = false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="snackbar"
      location="center"
      max-width="55%"
      class="areaManagement_infoTable"
    >
      <v-card class="pa-2">
        <v-card-title class="d-flex align-center">
          <v-icon left>mdi-receipt</v-icon>
          <span class="headline ms-2">Thông tin bàn ăn</span>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-data-table
            :headers="headers"
            :items="desserts"
            :sort-by="[{ key: 'money', order: 'asc' }]"
            style="max-height: 350px; overflow-y: auto"
          >
            <template v-slot:top>
              <v-dialog v-model="dialogEdit" max-width="700px">
                <template v-slot:activator="{ props }">
                  <v-btn
                    class="mb-2"
                    color="primary"
                    dark
                    v-bind="props"
                    style="width: 120px; margin-left: 88%"
                  >
                    Thêm món
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Tên món"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="editedItem.unit"
                            label="Đơn vị"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="editedItem.quantity"
                            label="Số lượng"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="editedItem.unitPrice"
                            label="Đơn giá"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="editedItem.money"
                            label="Thành tiền"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="close"
                      >Hủy</v-btn
                    >
                    <v-btn color="blue-darken-1" variant="text" @click="save"
                      >Lưu</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Bạn chắc chắn muốn xóa?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="closeDelete"
                      >Đóng</v-btn
                    >
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="deleteItemConfirm"
                      >Xóa</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon class="me-2" size="small" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon class="ms-2" size="small" @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize"> Làm mới </v-btn>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-text>
          <v-row justify="end">
            <v-col cols="4" class="d-flex justify-space-between">
              <h4>Tổng tiền:</h4>
              <h4>{{ totalMoney }}</h4>
            </v-col>
          </v-row>
          <v-row justify="end" class="">
            <v-col cols="4" class="d-flex justify-end align-center pa-0">
              <v-text-field
                label="Giảm giá (%)"
                v-model="discount"
                type="number"
                class="text-right"
                variant="solo-filled"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="end" class="mt-0">
            <v-col cols="4" class="d-flex justify-space-between">
              <h4>Tổng tiền thanh toán:</h4>
              <h4>{{ totalPayment }}</h4>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmPayment"
            >Xác nhận thanh toán</v-btn
          >
          <v-btn color="red darken-1" text @click="snackbar = !snackbar"
            >Đóng</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref, defineEmits } from "vue";
import axios from "axios";
import API_ENDPOINTS from "@/api/api.js";
import { useOrderStore } from "@/stores/orderStore.js";
import { useUserStore } from "@/stores/user.js";
import { toast } from "vue3-toastify";

const emit = defineEmits(['closeAndReset']);

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
const desserts = computed(() => 
  storeOrder.getDishesForTable(tableId.value)
);

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
  tables.value = response.data.map(table => ({
    ...table,
    isActive: false
  }));
  console.log("tables.value", tables.value);
}

init();
const handleConfirmDialog = (table) => {
  confirmDialog.value = true;
  currentTableId.value = table.tableId;
  console.log("Selected tableId:", currentTableId.value);
}
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
      tables.value = tables.value.map(table => ({
        ...table,
        isActive: table.tableId == currentTableId.value
      }));
      console.log("Updated tables:", tables.value);
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
      emit('closeAndReset');
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
</script>
