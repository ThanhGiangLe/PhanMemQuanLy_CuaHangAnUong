<template>
  <div class="areaManagement pa-3">
    <div class="areaManagement_item d-flex align-center rounded">
      <div
        class="areaManagement_item_tables d-flex flex-wrap py-2 justify-center"
        style="width: 100%"
      >
        <div
          v-for="table in tables"
          :key="table.tableId"
          size="large"
          class="areaManagement_item_tables_table d-flex flex-column ma-2 pa-2 rounded cursor-pointer justify-space-between"
          style="width: 250px; min-height: 100px"
          :type="table.isActive ? 'do' : 'den'"
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
        <v-card-title class="text-h5 text-center"> Xác nhận </v-card-title>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="chooseTableAndSetCurrentOrders"
            >Đồng ý</v-btn
          >
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
import useAreaManagement from "./areaManagament";

const {
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
} = useAreaManagement();
</script>
