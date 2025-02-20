<template>
  <div class="d-flex align-center justify-center" style="min-height: 100vh">
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      min-width="448"
      rounded="lg"
    >
      <div v-if="visibleFillMail">
        <div class="text-subtitle-1 text-medium-emphasis">Email</div>
        <v-text-field
          density="compact"
          placeholder="Email Address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="email"
        ></v-text-field>

        <router-link
          class="text-caption text-decoration-none text-blue"
          to="/login"
        >
          <v-icon>mdi-arrow-left</v-icon>
          Back to Login
        </router-link>

        <v-btn
          class="mb-8 mt-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="sendOTP()"
        >
          Send OTP
        </v-btn>
      </div>

      <div v-else>
        <div v-if="visibleFillPassword">
          <div class="text-subtitle-1 text-medium-emphasis">OTP</div>
          <v-text-field
            density="compact"
            placeholder="Enter OTP"
            prepend-inner-icon="mdi-key"
            variant="outlined"
            v-model="enteredOtp"
          ></v-text-field>

          <v-btn
            class="mb-4 mt-4"
            color="blue"
            size="large"
            variant="tonal"
            block
            @click="verifyOTP()"
          >
            Verify OTP
          </v-btn>
          <v-btn
            color="blue"
            size="large"
            variant="tonal"
            block
            @click="sendOTP()"
            v-if="visibleResendOtp == true"
          >
            Resend OTP
          </v-btn>
        </div>

        <div v-else>
          <div
            class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
          >
            Password
          </div>
          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Enter your new password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            v-model="password"
            @click:append-inner="visible = !visible"
          ></v-text-field>

          <div
            class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
          >
            Confirm Password
          </div>
          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Enter your new password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            v-model="confirmPassword"
            @click:append-inner="visible = !visible"
          ></v-text-field>

          <v-btn
            class="mb-8 mt-8"
            color="blue"
            size="large"
            variant="tonal"
            block
            @click="UpdatePassword()"
          >
            Update Password
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import emailjs from "emailjs-com";
import API_ENDPOINTS from "@/api/api.js";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const router = useRouter();
const visible = ref(false); // Dùng để hiển thị mật khẩu...
const email = ref(""); // email để đăng nhập hoặc xác thực
const password = ref(""); // Mật khẩu
const confirmPassword = ref(""); // confirm mật khẩu
const enteredOtp = ref("");
const otp = ref("");

const visibleFillMail = ref(true);
const visibleFillPassword = ref(true);

// Thông tin tài khoản EmailJS
const serviceID = "service_cojqzzb";
const templateID = "template_bql1hr5";
const publicKey = "YVFyP3Zy91mr0Jc5W";

emailjs.init(publicKey);

const otpSentTime = ref(null); // Lưu thời gian lúc gửi OTP
const otpTimeout = 0.5 * 60 * 1000; // Thời gian 5 phút
const visibleResendOtp = ref(false);

async function sendOTP() {
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Mã OTP 6 chữ số
  }
  otpSentTime.value = new Date().getTime(); // dùng để xác định thời gian gửi mã OTP đến người dùng
  if (!email.value) {
    toast.warn("Please enter a valid email address!", {
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

  const response = await axios.post(API_ENDPOINTS.CHECK_EMAIL_EXISTS, {
    email: email.value,
  });

  try {
    if (response.data.exists) {
      otp.value = generateOTP();
      const templateParams = {
        email: email.value,
        otp_code: otp.value,
      };

      emailjs
        .send(serviceID, templateID, templateParams)
        .then((response) => {
          toast.success("Send OTP successful!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false, // Hiện thanh tiến trình
            closeOnClick: true, // Đóng khi nhấp vào thông báo
            pauseOnHover: true, // Dừng khi di chuột lên thông báo
            draggable: true, // Kéo thông báo
            progress: undefined, // Tiến độ (nếu có)
          });
          visibleFillMail.value = false;
        })
        .catch((err) => {
          toast.warn("Failed to send OTP. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false, // Hiện thanh tiến trình
            closeOnClick: true, // Đóng khi nhấp vào thông báo
            pauseOnHover: true, // Dừng khi di chuột lên thông báo
            draggable: true, // Kéo thông báo
            progress: undefined, // Tiến độ (nếu có)
          });
        });
    } else {
      toast.error("Email does not exist.", {
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
    toast.error(`Error checking email ${error}`, {
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

function verifyOTP() {
  if (!enteredOtp.value) {
    toast.warn("Please enter a valid OTP.", {
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
  let currentTime = new Date().getTime();
  if (currentTime - otpSentTime.value > otpTimeout) {
    visibleResendOtp.value = true;
    otp.value = "";
    toast.error("The OTP code has expired.", {
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
  if (enteredOtp.value === otp.value) {
    visibleFillPassword.value = false;
    otp.value = ""; // Reset mã OTP
  } else {
    toast.warn("OTP does not match.", {
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

async function UpdatePassword() {
  if (password.value.trim() == "" || confirmPassword.value.trim() == "") {
    toast.warn("Please enter a valid Password.", {
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
  if (password.value !== confirmPassword.value) {
    toast.warn("Passwords do not match. Please try again.", {
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
    console.log("email.value", email.value);
    console.log("confirmPassword.value", confirmPassword.value);
    const response = await axios.post(API_ENDPOINTS.UPDATE_PASSWORD, {
      Email: email.value,
      NewPassword: confirmPassword.value,
    });

    if (response.data.success) {
      toast.success("Password updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false, // Hiện thanh tiến trình
        closeOnClick: true, // Đóng khi nhấp vào thông báo
        pauseOnHover: true, // Dừng khi di chuột lên thông báo
        draggable: true, // Kéo thông báo
        progress: undefined, // Tiến độ (nếu có)
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      toast.error("Failed to update password. Please check your OTP.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false, // Hiện thanh tiến trình
        closeOnClick: true, // Đóng khi nhấp vào thông báo
        pauseOnHover: true, // Dừng khi di chuột lên thông báo
        draggable: true, // Kéo thông báo
        progress: undefined, // Tiến độ (nếu có)
      });
    }
  } catch (error) {
    toast.error(
      "An error occurred while updating the password. Please try again.",
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false, // Hiện thanh tiến trình
        closeOnClick: true, // Đóng khi nhấp vào thông báo
        pauseOnHover: true, // Dừng khi di chuột lên thông báo
        draggable: true, // Kéo thông báo
        progress: undefined, // Tiến độ (nếu có)
      }
    );
  }
}
</script>
