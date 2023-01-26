<template>
  <div>
    <h1 class="bg-slate-500">Dashboard</h1>
    <p v-if="status === 'authenticated' && data?.user">
      Welcome {{ data.user.email }}!
      <button @click="signOut()">Sign Out</button>
    </p>
    <p>Here is the dashboard</p>
  </div>
</template>

<script setup lang="ts">
const { status, data, signIn, signOut } = useSession();
</script>
