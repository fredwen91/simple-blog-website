<script setup lang="ts">
import formRules from '@/helpers/formRules'
import { computed, reactive, ref, watch } from 'vue'
import type { Post } from '@/types/posts'

const props = defineProps<{
  modelValue: boolean
  loading: boolean
  errors: Record<string, string[]>
  post: Partial<Post> | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: Partial<Post>): void
  (e: 'clear-error', field: string): void
}>()

const rules = reactive(formRules)
const formRef = ref()
const form = ref<Partial<Post>>({
  title: '',
  content: '',
  ...props.post,
})

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const close = () => emit('update:modelValue', false)

const onSubmit = async () => {
  const { valid } = await formRef.value!.validate()
  if (!valid) return
  emit('save', form.value)
}

watch(
  () => props.post,
  (post) => {
    if (post) {
      form.value = {
        title: post.title,
        content: post.content,
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <v-dialog v-model="modelValue" max-width="500">
    <v-card :disabled="loading" :loading="loading">
      <v-card-title class="d-flex align-center mx-2">
        <div class="me-auto">
          {{ post?.id ? 'Edit' : 'Create' }}
        </div>
        <v-btn icon variant="flat" size="small" @click="close">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-form ref="formRef" @submit.prevent="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.title"
                label="Title"
                color="primary"
                hide-details="auto"
                :rules="[rules.required, rules.minimum(2), rules.maximum(255)]"
                :error-messages="props.errors.title"
                @update:model-value="emit('clear-error', 'title')"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.content"
                label="Content"
                color="primary"
                hide-details="auto"
                :rules="[rules.required, rules.minimum(2), rules.maximum(255)]"
                :error-messages="props.errors.content"
                @update:model-value="emit('clear-error', 'content')"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="ms-auto px-4 py-3">
            <v-btn variant="tonal" text="Cancel" @click="close" class="mr-2"></v-btn>
            <v-btn
              :color="post?.id ? 'primary' : 'success'"
              variant="flat"
              :text="post?.id ? 'Update' : 'Create'"
              type="submit"
              :loading="loading"
            ></v-btn>
          </div>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
