import { ref } from "vue";
import axios from "axios";
import API_ENDPOINTS from "@/api/api.js";
import "underscore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default function useInventoryManagement() {
  const loading = shallowRef(true);
  const materials = ref([]);
  const materialsFilter = ref([]);

  const header = ref([
    { title: "Tên gọi", key: "materialName" },
    { title: "Số lượng", key: "quantity" },
    { title: "Đơn vị tính", key: "unit" },
    { title: "Ngày nhập", key: "importDate" },
    { title: "Ngày hết hạn", key: "expirationDate" },
    { title: "Nhập thêm", key: "added" },
    { title: "Hủy hàng", key: "cancel" },
  ]);

  async function init() {
    const response = await axios.get(API_ENDPOINTS.GET_ALL_MATERIALS);
    materials.value = response.data;
    materials.value = materials.value.map((item) => ({
      ...item,
      quantityAdded: 0,
      isEditing: false,
    }));
    materialsFilter.value = materials.value;
    console.log("Kiểm tra: ", materialsFilter.value);

    loading.value = false;
  }
  init();
  const formatDateFormApiToView = (inputDate) => {
    const date = new Date(inputDate);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  };

  const filterMaterialsOfFood = () => {
    materialsFilter.value = materials.value.filter(
      (item) => item.materialType.toLowerCase() === "thực phẩm"
    );
  };

  const filterMaterialsOfIngredient = () => {
    materialsFilter.value = materials.value.filter(
      (item) => item.materialType.toLowerCase() === "nguyên liệu"
    );
  };

  const filterMaterialsOfSpice = () => {
    materialsFilter.value = materials.value.filter(
      (item) => item.materialType.toLowerCase() === "gia vị"
    );
  };

  const filterMaterialsOfAlmostOver = () => {
    materialsFilter.value = materials.value.filter((item) => {
      const expirationDate = new Date(item.expirationDate);
      const now = new Date();

      // Tính số ngày còn lại trước khi hết hạn
      const timeDiff = expirationDate - now;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      return daysLeft <= 4 && daysLeft > 0; // Sản phẩm sắp hết hạn (còn từ 1-4 ngày)
    });
  };

  const filterMaterialsOfOver = () => {
    materialsFilter.value = materials.value.filter((item) => {
      const now = new Date();
      const expiration = new Date(item.expirationDate);

      const formatDate = (date) => date.toISOString();
      // .toISOString() tạo chuỗi dạng "YYYY-MM-DDTHH:mm:ss.sssZ".
      // .split("T")[0] lấy phần "YYYY-MM-DD" trước ký tự "T" (bỏ giờ phút giây).

      return formatDate(now) > formatDate(expiration);
    });
  };

  const filterMaterialsOfAlmostSoldOut = () => {
    materialsFilter.value = materials.value.filter(
      (item) => item.quantity <= item.minQuantity && item.quantity > 0
    );
  };

  const filterMaterialsOfSoldOut = () => {
    materialsFilter.value = materials.value.filter(
      (item) => item.quantity == 0
    );
  };

  function showDisplayInputAddedValues(item) {
    item.isEditing = !item.isEditing;
  }

  async function addQuantityInItemAndCallAPIUpdate(item) {
    try {
      if (item.quantityAdded <= 0) {
        toast.error("Vui lòng nhập giá trị lớn hơn 0!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false, // Hiện thanh tiến trình
          closeOnClick: true, // Đóng khi nhấp vào thông báo
          pauseOnHover: true, // Dừng khi di chuột lên thông báo
          draggable: true, // Kéo thông báo
          progress: undefined, // Tiến độ (nếu có)
        });
        item.isEditing = !item.isEditing;
        return;
      }
      const response = await axios.post(
        API_ENDPOINTS.UPDATE_QUANTITY_MATERIAL,
        {
          MaterialId: item.materialId,
          AddedQuantity: item.quantityAdded,
        }
      );

      console.log("Response:", response.data);
      if (response.data.message && response.data.message.trim() !== "") {
        item.quantity = item.quantity + item.quantityAdded;
        item.quantityAdded = 0;
        item.importDate = response.data.importDateRes;
        item.expirationDate = response.data.expirationDateRes;
        toast.success("Thêm thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false, // Hiện thanh tiến trình
          closeOnClick: true, // Đóng khi nhấp vào thông báo
          pauseOnHover: true, // Dừng khi di chuột lên thông báo
          draggable: true, // Kéo thông báo
          progress: undefined, // Tiến độ (nếu có)
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Thêm thất bại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false, // Hiện thanh tiến trình
        closeOnClick: true, // Đóng khi nhấp vào thông báo
        pauseOnHover: true, // Dừng khi di chuột lên thông báo
        draggable: true, // Kéo thông báo
        progress: undefined, // Tiến độ (nếu có)
      });
    }
    item.isEditing = !item.isEditing;
  }

  const resetTimeFillterRevenueOrder = () => {
    init();
  };

  function checkExpirationDate(item) {
    if (item.quantity === 0) return false;
    const now = new Date();
    const expiration = new Date(item.expirationDate);

    const formatDate = (date) => date.toISOString();
    // .toISOString() tạo chuỗi dạng "YYYY-MM-DDTHH:mm:ss.sssZ".
    // .split("T")[0] lấy phần "YYYY-MM-DD" trước ký tự "T" (bỏ giờ phút giây).

    return formatDate(now) > formatDate(expiration);
  }

  async function cancelAllGoods(item) {
    try {
      const response = await axios.post(API_ENDPOINTS.CANCEL_ALL_GOODS, {
        MaterialId: item.materialId,
      });
      if (response.data.message && response.data.message.trim() !== "") {
        toast.success("Hủy nguyên liệu thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false, // Hiện thanh tiến trình
          closeOnClick: true, // Đóng khi nhấp vào thông báo
          pauseOnHover: true, // Dừng khi di chuột lên thông báo
          draggable: true, // Kéo thông báo
          progress: undefined, // Tiến độ (nếu có)
        });
        item.quantity = 0;
        item.importDate = response.data.importDateRes;
        item.expirationDate = response.data.expirationDateRes;
      } else {
        toast.error("Hủy nguyên liệu thất bại!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false, // Hiện thanh tiến trình
          closeOnClick: true, // Đóng khi nhấp vào thông báo
          pauseOnHover: true, // Dừng khi di chuột lên thông báo
          draggable: true, // Kéo thông báo
          progress: undefined, // Tiến độ (nếu có)
        });
      }
    } catch (error) {
      toast.error("Lỗi call API!", {
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

  return {
    loading,
    materials,
    materialsFilter,
    header,

    formatDateFormApiToView,
    filterMaterialsOfFood,
    filterMaterialsOfIngredient,
    filterMaterialsOfSpice,
    filterMaterialsOfOver,
    filterMaterialsOfAlmostOver,
    filterMaterialsOfAlmostSoldOut,
    filterMaterialsOfSoldOut,
    showDisplayInputAddedValues,
    addQuantityInItemAndCallAPIUpdate,
    resetTimeFillterRevenueOrder,
    checkExpirationDate,
    cancelAllGoods,
  };
}
