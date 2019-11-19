<template>
  <v-container class="text-center mt-4 pt-4">
    <v-row>
      <v-col sm6 offset-sm3>
        <h1>Get Started Here</h1>
      </v-col>
    </v-row>
    <!-- error -->
    <v-row v-if="error">
      <v-col sm6 offset-sm3 class="mb-n8">
        <!-- create form-alert -->
        <h1>{{ error.message }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm6 offset-sm3>
        <v-card color="primary">
          <v-container>
            <v-form
              v-model="isFormValid"
              lazy-validation
              ref="form"
              @submit.prevent="handleSignupUser"
            >
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="username"
                    prepend-icon="face"
                    placeholder="Username"
                    type="text"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-text-field
                    v-model="email"
                    prepend-icon="email"
                    placeholder="Email"
                    type="email"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-text-field
                    v-model="password"
                    prepend-icon="extension"
                    placeholder="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-text-field
                    v-model="passwordConfirmation"
                    prepend-icon="gavel"
                    placeholder="Confirm password"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-btn
                    :loading="loading"
                    :disabled="!isFormValid || loading"
                    color="info"
                    type="submit"
                  >
                    <template v-slot="loader">
                      <span class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </template>
                    Sign up
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Signup",
  data: () => ({
    isFormValid: true,
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