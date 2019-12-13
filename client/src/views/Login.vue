<template>
  <v-container>
    <!-- <v-row v-if="error">
      <v-col sm6 offset-sm3 class="mb-n8">
        <h1>{{ error.message }}</h1>
      </v-col>
    </v-row> -->
    <v-card color="secondary" max-width="400" class="mx-auto mt-5">
      <v-card-title>
        <h1
          v-if="!signup"
          class="display-1">Login</h1>
        <h1
          v-else
          class="display-1">Register</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          v-model="isFormValid"
            lazy-validation
            ref="form">
          <v-text-field
            placeholder="Username"
            v-model="username"
            prepend-icon="account_circle" />
          <v-expand-transition>
            <v-text-field
              v-if="signup"
              v-model="email"
              :autofocus="!!username ? true : false"
              prepend-icon="email" 
              placeholder="Email" />
          </v-expand-transition>
          <v-text-field 
            placeholder="Password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            prepend-icon="lock" 
            :append-icon="showPassword ? 'visibility' : 'visibility_off'"
            @click:append="showPassword =!showPassword" />
          <v-expand-transition>
            <v-text-field
              v-if="signup"
              v-model="passwordConfirmation"
              placeholder="Confirm Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-icon="gavel" 
              :append-icon="showPassword ? 'visibility' : 'visibility_off'"
              @click:append="showPassword =!showPassword" />
          </v-expand-transition>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              color="accent"
              v-on="on">
              <span
                v-if="!signup"
                @click="signup = true">Register</span>
              <span
                v-else
                @click="signup = false">Login</span>
            </v-btn>
          </template>
          <span v-if="!signup">Don't have an account? Register!</span>
          <span v-else>Already have an account? Login!</span>

        </v-tooltip>
        <v-spacer></v-spacer>
        <v-btn
          color="info"
          :loading="loading"
          :disabled="!isFormValid || loading"
        >
          <template v-slot="loader">
            <span class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
          </template>
          <span @click.prevent="handleSigninUser" v-if="!signup">Login</span>
          <span @click.prevent="handleSignupUser" v-else>Register</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Signup",
  data: () => ({
    isFormValid: true,
    showPassword: false,
    signup: false,
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  }),
  computed: {
    ...mapGetters(["user", "error", "loading"])
  },
  watch: {
    user(val) {
      val ? this.$router.push("/") : "";
    }
  },
  methods: {
    handleSignupUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signupUser", {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    },
    handleSigninUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          username: this.username,
          password: this.password
        });
      }
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>