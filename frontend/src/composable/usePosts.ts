import type { FetchResponse, LoadItemsParams } from '@/types/data-table'
import { ref } from 'vue'
import api from '@/services/api'
import type { Post, UpsertPostResponse } from '@/types/posts'
import { normalizeTableOptions } from '@/utils/table'

export function usePosts() {
  const loadingPosts = ref(false)
  const postErrors = ref<Record<string, string[]>>({})
  const posts = ref<Post[]>([])
  const totalPosts = ref(0)
  const loadingUpsertPost = ref(false)
  const loadingDeletePost = ref(false)
  const page = ref(1)
  const itemsPerPage = ref(10)
  const lastOptions = ref<LoadItemsParams | null>(null)

  const fetchPosts = async (options: LoadItemsParams) => {
    loadingPosts.value = true
    lastOptions.value = options

    try {
      const res = await api.get<FetchResponse<Post>>('my-posts', {
        params: normalizeTableOptions(options),
      })
      posts.value = res.data.data
      totalPosts.value = res.data.total ?? 0
    } catch (err: any) {
      alert('The system encountered an error. Please refresh the page.')
    } finally {
      loadingPosts.value = false
    }
  }

  const createPost = async (payload: Partial<Post>): Promise<boolean> => {
    loadingUpsertPost.value = true
    postErrors.value = {}

    try {
      const { data } = await api.post<UpsertPostResponse>('posts', payload)

      totalPosts.value += 1
      if (page.value === 1) {
        posts.value.unshift(data.data)
        if (posts.value.length > itemsPerPage.value) {
          posts.value.pop()
        }
      }

      return true
    } catch (error: any) {
      if (error.response?.status === 422 && error.response.data?.errors) {
        postErrors.value = error.response.data.errors
      } else {
        alert('The system encountered an error. Please refresh the page.')
      }

      return false
    } finally {
      loadingUpsertPost.value = false
    }
  }

  const updatePost = async (id: number, payload: Partial<Post>): Promise<boolean> => {
    loadingUpsertPost.value = true
    postErrors.value = {}
    try {
      const { data } = await api.patch<UpsertPostResponse>(`posts/${id}`, payload)

      posts.value = [data.data, ...posts.value.filter((p) => p.id !== data.data.id)]

      return true
    } catch (error: any) {
      if (error.response.status === 422) {
        postErrors.value = error.response.data.errors
      } else {
        alert('The system encountered an error. Please refresh the page.')
      }

      return false
    } finally {
      loadingUpsertPost.value = false
    }
  }

  const deletePost = async (id: number): Promise<boolean> => {
    loadingDeletePost.value = true

    try {
      await api.delete(`posts/${id}`)

      posts.value = posts.value.filter((p) => p.id !== id)
      totalPosts.value -= 1

      return true
    } catch {
      alert('The system encountered an error. Please refresh the page.')

      return false
    } finally {
      loadingDeletePost.value = false
    }
  }
  return {
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
  }
}
