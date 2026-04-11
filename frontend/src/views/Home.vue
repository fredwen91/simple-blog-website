<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useBlogs } from '@/composable/useBlogs'

const auth = useAuthStore()

const { loading, posts, fetchBlogs, createBlog } = useBlogs()

const commentInputs = ref({})
const snackbar = ref(false)
const snackbarText = ref('')

const submitComment = async (postId) => {
  if (!commentInputs.value[postId]) return

  const res = await createBlog(postId, { content: commentInputs.value[postId] })

  if (res) {
    commentInputs.value[postId] = ''
    snackbarText.value = 'Comment added!'
    snackbar.value = true
  }
}

onMounted(fetchBlogs)
</script>

<template>
  <v-app>
    <v-main>
      <v-container max-width="800">
        <div class="d-flex align-center">
          <h1 class="text-h5 font-weight-bold">Latest Posts</h1>
        </div>

        <div v-if="loading" class="text-center my-10">
          <v-progress-circular indeterminate size="50" color="primary" />
        </div>

        <v-sheet v-if="!loading && posts.length === 0" class="text-center pa-10" elevation="1">
          <v-icon size="50" class="mb-2">mdi-post-outline</v-icon>
          <div>No posts yet</div>
        </v-sheet>

        <v-row>
          <v-col cols="12" v-for="post in posts" :key="post.id">
            <v-card elevation="3" class="px-2 py-4 mb-6">
              <v-card-text class="mb-5">
                <div class="d-flex align-center">
                  <v-avatar color="primary" class="mr-3">
                    {{ post.author?.name?.charAt(0) || '?' }}
                  </v-avatar>

                  <div>
                    <div class="font-weight-bold">
                      {{ post.author?.name || 'Unknown' }}
                    </div>
                    <small class="text-grey">
                      {{ new Date(post.created_at).toLocaleString() }}
                    </small>
                  </div>
                </div>

                <div>
                  <h2 class="text-h6 mb-2">{{ post.title }}</h2>
                  <div class="text-body-2">{{ post.content }}</div>
                </div>
              </v-card-text>

              <v-divider />

              <v-card-text>
                <div class="mb-2 font-weight-medium">Comments</div>

                <v-list density="compact">
                  <v-list-item v-for="comment in post.comments" :key="comment.id">
                    <template #prepend>
                      <v-avatar size="45" color="grey-lighten-2">
                        {{ comment.user?.name?.charAt(0) }}
                      </v-avatar>
                    </template>
                    <v-card rounded="xl" variant="tonal">
                      <v-card-text class="py-2">
                        <div class="text-grey font-weight-bold">
                          <small>{{ comment.user?.name }}</small>
                        </div>
                        <div>
                          <small>{{ comment.content }}</small>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </v-list>

                <div v-if="!post.comments?.length" class="text-grey text-sm">No comments yet</div>
              </v-card-text>

              <!-- Add Comment -->
              <v-card-actions v-if="auth.user">
                <v-text-field
                  color="primary"
                  v-model="commentInputs[post.id]"
                  placeholder="Write a comment..."
                  density="compact"
                  variant="outlined"
                  hide-details
                  :disabled="loading"
                />

                <v-tooltip text="Send" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :disabled="loading"
                      icon="mdi-send"
                      color="primary"
                      @click="submitComment(post.id)"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar" timeout="2000" location="top right" color="success">
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>
