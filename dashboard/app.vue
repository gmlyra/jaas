<template>
  <div>
    <h1 class="bg-slate-500">Dashboard</h1>
    <p>Here is the dashboard</p>
    <router-link to="/dashboard/profile">Profile</router-link>
    <router-link to="/dashboard/posts">Posts</router-link>
    <router-view></router-view>
  </div>
</template>
