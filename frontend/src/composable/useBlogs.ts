import { ref } from 'vue'
import api from '@/services/api'
import type { Post } from '@/types/posts'

export function useBlogs() {
  const loading = ref(false)
  const posts = ref<Post[]>([])

  const fetchBlogs = async () => {
    loading.value = true

    try {
      const { data } = await api.get('posts')

      posts.value = data.data
    } catch (err: any) {
      alert('The system encountered an error. Please refresh the page.')
    } finally {
      loading.value = false
    }
  }

  const createBlog = async (id: number, payload: { content: string }): Promise<boolean> => {
    loading.value = true

    try {
      await api.post(`/posts/${id}/comments`, payload)
      await fetchBlogs()

      return true
    } catch (error: any) {
      alert('The system encountered an error. Please refresh the page.')

      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    posts,
    fetchBlogs,
    createBlog,
  }
}
