<template>
  <div class="d-flex align-center justify-center" style="min-height: 100vh">
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
      @keydown.enter="verifyLoginAccount"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Phone</div>

      <v-text-field
        density="compact"
        placeholder="Phone Number"
        prepend-inner-icon="mdi-phone-outline"
        variant="outlined"
        v-model="phone"
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Password

        <router-link
          class="text-caption text-decoration-none text-blue"
          to="/forgotpassword"
        >
          Forgot login password?
        </router-link>
      </div>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        v-model="password"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-card class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          Warning: After 3 consecutive failed login attempts, your account will
          be temporarily locked for three hours. If you must login now, you can
          also click "Forgot login password?" below to reset the login password.
        </v-card-text>
      </v-card>

      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="verifyLoginAccount()"
      >
        Đăng nhập
      </v-btn>

      <v-alert v-if="errorMessage" type="error" outlined>
        {{ errorMessage }}
      </v-alert>
    </v-card>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import API_ENDPOINTS from "@/api/api.js";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const userStore = useUserStore();
const router = useRouter();

const visible = ref(false);
const phone = ref("");
const password = ref("");
const errorMessage = ref("");

async function verifyLoginAccount() {
  if (!phone.value || !password.value) {
    toast.warn("Please enter a valid phone address!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false, // Hiện thanh tiến trình
      closeOnClick: true, // Đóng khi nhấp vào thông báo
      pauseOnHover: true, // Dừng khi di chuột lên thông báo
      draggable: true, // Kéo thông báo
      progress: undefined, // Tiến độ (nếu có)
    });
    return;
  }
  try {
    const response = await axios.post(API_ENDPOINTS.LOGIN, {
      Phone: phone.value,
      Password: password.value,
    });

    // Lấy thông tin người dùng trả về từ server nếu đăng nhập thành công
    const user = response.data;
    console.log("User logged in:", user);

    // Lưu thông tin người dùng vào store
    userStore.setUser(user);

    toast.success("Login successful!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false, // Hiện thanh tiến trình
      closeOnClick: true, // Đóng khi nhấp vào thông báo
      pauseOnHover: true, // Dừng khi di chuột lên thông báo
      draggable: true, // Kéo thông báo
      progress: undefined, // Tiến độ (nếu có)
    });

    setTimeout(() => {
      router.push("/monitor");
    }, 2000);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error("Invalid phone or password!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false, // Hiện thanh tiến trình
        closeOnClick: true, // Đóng khi nhấp vào thông báo
        pauseOnHover: true, // Dừng khi di chuột lên thông báo
        draggable: true, // Kéo thông báo
        progress: undefined, // Tiến độ (nếu có)
      });
    } else {
      toast.error("An error occurred during login. Please try again.", {
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
}
</script>
