<template>
  <div
    class="relative font-sans bg-red-200 text-center h-full flex items-center justify-center"
  >
    <div class="container max-w-sm mx-auto py-12 px-4 rounded-lg shadow-md">
      <h1 class="text-3xl font-medium text-red-500">{{ error?.message }}</h1>
      <p class="text-lg text-gray-600">There was an error 😱</p>
      <div class="my-6">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
          @click="handleError"
        >
          Clear error
        </button>
      </div>
      <div class="my-6">
        <NuxtLink
          class="px-4 py-2 rounded-full text-blue-500 hover:underline"
          to="/404"
          >Trigger another error</NuxtLink
        >
      </div>
      <div class="my-6">
        <NuxtLink
          class="px-4 py-2 rounded-full text-blue-500 hover:underline"
          to="/"
          >Navigate home</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  error: Object,
});

const handleError = () => clearError({ redirect: "/" });
</script>
