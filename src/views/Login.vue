<template>
  <div class="login-container">
    <Navbar />
    <div class="login-box">
      <form @submit.prevent="login" class="login-form">
        <h1 class="login-title">Login</h1>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            v-model.trim="email" 
            id="email" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-container">
            <input 
              :type="showPassword ? 'text' : 'password'"
              v-model.trim="password"
              id="password"
              required
            />
            <button type="button" class="toggle-password" @click="togglePassword">
              {{ showPassword ? "👁️" : "🙈" }}
            </button>
            
          </div>
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>

        <p class="forgot-password" @click="forgotPassword">Forgot password?</p>
      </form>
    </div>
    <p class="blink-coffee">Powered by Blink Coffee</p>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "Login",
  components: { Navbar },
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      showPassword: false, // Untuk toggle password visibility
    };
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        alert("Email dan password harus diisi!");
        return;
      }
      this.loading = true;
      try {
        const auth = getAuth();
        const db = getFirestore();
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const userId = userCredential.user.uid;
        
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          alert(`Login berhasil sebagai ${userData.role}!`);
          this.$router.push(userData.role === "admin" ? "/dashboard" : "/");
        } else {
          alert("Data pengguna tidak ditemukan!");
        }
      } catch (error) {
        alert("Login gagal: " + error.message);
      } finally {
        this.loading = false;
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async forgotPassword() {
      if (!this.email) {
        alert("Masukkan email terlebih dahulu untuk reset password.");
        return;
      }
      try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, this.email);
        alert("Email reset password telah dikirim!");
      } catch (error) {
        alert("Gagal mengirim reset password: " + error.message);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f4f4f4;
  padding: 20px;
}

.login-box {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px; /* Diperlebar agar navbar tidak keluar */
  text-align: center;
}

.login-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}
.form-group {
  margin-bottom: 15px;
  text-align: left;
}
.form-group input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}
.password-container {
  display: flex;
  align-items: center;
  position: relative;
}
.password-container input {
  width: 100%;
  padding-right: 40px;
}
.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}
.login-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}
.login-button:hover {
  background-color: #0056b3;
}
.login-button:disabled {
  background-color: #999;
  cursor: not-allowed;
}
.forgot-password {
  margin-top: 10px;
  font-size: 14px;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}
.forgot-password:hover {
  color: #0056b3;
}
.blink-coffee {
  margin-top: 20px;
  font-size: 14px;
  color: #777;
  animation: blink 1s infinite alternate;
}
@keyframes blink {
  from { opacity: 1; }
  to { opacity: 0.5; }
}
@media (max-width: 600px) {
  .login-box {
    width: 90%;
  }
}
</style>
