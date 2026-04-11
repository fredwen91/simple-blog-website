<script setup lang="ts">
import { usePosts } from '@/composable/usePosts'
import type { Post } from '@/types/posts'
import { ref } from 'vue'
import type { DataTableHeader } from 'vuetify'
import formatDate from '@/helpers/formatDate'
import UpsertPostDialog from '@/components/UpsertPostDialog.vue'
import Snackbar from '@/components/Snackbar.vue'

const {
  loadingPosts,
  loadingUpsertPost,
  loadingDeletePost,
  postErrors,
  posts,
  totalPosts,
  page,
  itemsPerPage,
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} = usePosts()

const search = ref('')
const itemsPerPageOptions = ref([10, 25, 50, 100])
const headers = ref<DataTableHeader[]>([
  { title: 'Action', key: 'actions', align: 'center', sortable: false },
  { title: 'Title', key: 'title', align: 'start' },
  { title: 'Content', key: 'content', align: 'start' },
  { title: 'Date Created', key: 'created_at', align: 'start' },
  { title: 'Date Updated', key: 'updated_at', align: 'start' },
])
const selectedPost = ref<Post | null>(null)
const dialogOpen = ref(false)
const resMessage = ref('')
const snackbarRef = ref<InstanceType<typeof Snackbar> | null>(null)
const confirmDeleteDialog = ref(false)

const dateFormatted = (date: string) => formatDate(date)

const openDialog = (post: Post) => {
  if (postErrors.value) postErrors.value = {}
  if (post) selectedPost.value = post
  dialogOpen.value = true
}

const confirmDelete = (post: Post) => {
  selectedPost.value = post
  confirmDeleteDialog.value = true
}

const deleteConfirmed = async () => {
  if (!selectedPost.value) return

  const res = await deletePost(selectedPost.value.id)

  if (res) {
    confirmDeleteDialog.value = false
    selectedPost.value = null
    snackbarRef.value?.show({
      message: 'Deleted successfully',
      type: 'success',
      timeout: 3000,
    })
  }
}

const savePost = async (data: Partial<Post>) => {
  resMessage.value = ''
  if (selectedPost.value?.id) {
    const res = await updatePost(selectedPost.value.id, data)
    if (res) {
      resMessage.value = 'Updated successfully'
    }
  } else {
    const res = await createPost(data)
    if (res) {
      resMessage.value = 'Created successfully.'
    }
  }

  if (resMessage.value) {
    dialogOpen.value = false
    snackbarRef.value?.show({
      message: resMessage.value,
      type: 'success',
      timeout: 3000,
    })
  }
}

const clearError = (field: string) => {
  delete postErrors.value[field]
}
</script>

<template>
  <v-container>
    <h3 class="mb-2">{{ $route.meta.title }}</h3>

    <v-card class="mb-5">
      <v-card-title class="d-flex align-center pb-4">
        <v-tooltip text="Create" location="right">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :disabled="loadingPosts"
              density="compact"
              icon="mdi-plus"
              color="success"
              @click="openDialog"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-data-table-server
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          :headers="headers"
          :items="posts"
          :items-length="totalPosts"
          :loading="loadingPosts"
          :search="search"
          item-value="id"
          @update:options="fetchPosts"
          density="comfortable"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip text="Edit" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="flat"
                  icon
                  @click="openDialog(item)"
                  density="compact"
                  class="mr-1"
                >
                  <v-icon size="small" color="primary"> mdi-pencil </v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Delete" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="flat"
                  icon
                  @click="confirmDelete(item)"
                  density="compact"
                  class="mr-1"
                >
                  <v-icon size="small" color="error"> mdi-delete </v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </template>
          <template v-slot:[`item.created_at`]="{ item }">
            <span>{{ dateFormatted(item.created_at) }}</span>
          </template>
          <template v-slot:[`item.updated_at`]="{ item }">
            <span>{{ dateFormatted(item.updated_at) }}</span>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-container>

  <UpsertPostDialog
    v-model="dialogOpen"
    :loading="loadingUpsertPost"
    :errors="postErrors"
    :post="selectedPost"
    @save="savePost"
    @clear-error="clearError"
  />

  <v-dialog v-model="confirmDeleteDialog" max-width="400">
    <v-card :disabled="loadingDeletePost" :loading="loadingDeletePost">
      <v-card-title class="text-h6">Confirm Delete</v-card-title>
      <v-card-text>
        Are you sure you want to delete <strong>{{ selectedPost?.title }}</strong
        >?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="tonal" @click="confirmDeleteDialog = false">Cancel</v-btn>
        <v-btn color="red" variant="flat" @click="deleteConfirmed" :loading="loadingDeletePost"
          >Delete</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <Snackbar ref="snackbarRef" />
</template>
