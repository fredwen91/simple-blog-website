<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import formRules from '@/helpers/formRules'
import type { RegisterPayload } from '@/types/auth'

const auth = useAuthStore()

const rules = reactive(formRules)
const formRef = ref()
const form = reactive<RegisterPayload>({
  name: '',
  email: '',
  password: '',
})
const showPassword = ref(false)
const successDialog = ref(false)

const submit = async () => {
  const { valid } = await formRef.value!.validate()
  if (!valid) return

  const success = await auth.register(form)

  if (success) {
    successDialog.value = true
  }
}
</script>

<template>
  <div class="register-container">
    <v-card max-width="400" :disabled="auth.loading">
      <v-card-title class="font-weight-black d-flex justify-center mb-2"> Register </v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="submit" validate-on="submit">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Name"
                color="primary"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="auth.errors.name"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                label="Email"
                color="primary"
                hide-details="auto"
                :rules="[rules.required, rules.validEmail]"
                :error-messages="auth.errors.email"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                label="Password"
                color="primary"
                hide-details="auto"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append-inner="showPassword = !showPassword"
                :rules="[rules.required]"
                :error-messages="auth.errors.password"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-btn type="submit" color="primary" :loading="auth.loading" block> Register </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <div class="text-center">
          <p>Already have an account?</p>
          <v-btn color="primary" variant="text" :to="{ name: 'login' }" density="compact">
            Login
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>

  <v-dialog v-model="successDialog" width="auto" persistent>
    <v-card
      width="410"
      prepend-icon="mdi-check-circle"
      text="Registration successful. You can now log in."
      title="Registered Successfully"
    >
      <template v-slot:prepend>
        <v-icon color="success" size="x-large"></v-icon>
      </template>

      <template v-slot:actions>
        <v-btn class="ms-auto" variant="tonal" text="GO TO LOGIN" :to="{ name: 'login' }"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 50px;
}

.v-card {
  width: 400px;
  padding: 10px;
}
</style>
