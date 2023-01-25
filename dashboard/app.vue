<template>
  <div>
    <h1 class="bg-slate-500">Dashboard</h1>
    <p>Here is the dashboard</p>
    <p>Count: {{ data }}</p>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData("count", () => $fetch("/api/example"));
debugger;
</script>
