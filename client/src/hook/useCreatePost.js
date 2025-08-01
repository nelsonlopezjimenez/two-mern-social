import { useState, useTransition } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function useCreatePost() {
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: async (postData) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(postData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create post')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post created successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create post')
    },
  })
  
  const createPost = async (postData) => {
    // Using React 19 Actions with useTransition
    startTransition(() => {
      mutation.mutate(postData)
    })
  }
  
  return {
    createPost,
    isPending: isPending || mutation.isPending,
    error: mutation.error,
  }
}