<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  // Simulando logout enviando o usuário para a página de login
  router.push('/')
}
</script>

<template>
  <header class="w-full px-6 py-8 sm:px-10 bg-transparent">
    <div class="mx-auto max-w-6xl flex items-center justify-between">
      <!-- Logo (Left) -->
      <RouterLink class="font-baloo text-4xl font-extrabold tracking-tight text-[#284b63] no-underline" to="/dashboard">
        Dashflow
      </RouterLink>

      <!-- Navigation Pill (Right) -->
      <nav class="hidden md:flex items-center gap-0.5 rounded-full bg-[#FFFFFF] px-1.5 py-2 shadow-[0_4px_20px_rgba(40,75,80,0.06)] border border-[#d9d9d9]/60">
        <RouterLink 
          to="/dashboard" 
          class="nav-link px-4 py-2 rounded-full text-sm font-medium transition-all text-[#353535] hover:bg-[#F7F8F3]"
        >
          Dashboard
        </RouterLink>
        <RouterLink 
          to="/upload" 
          class="nav-link px-4 py-2 rounded-full text-sm font-medium transition-all text-[#353535] hover:bg-[#F7F8F3]"
        >
          Upload
        </RouterLink>
        <RouterLink 
          to="/insights" 
          class="nav-link px-4 py-2 rounded-full text-sm font-medium transition-all text-[#353535] hover:bg-[#F7F8F3]"
        >
          Insights
        </RouterLink>
        <RouterLink 
          to="/historic" 
          class="nav-link px-4 py-2 rounded-full text-sm font-medium transition-all text-[#353535] hover:bg-[#F7F8F3]"
        >
          Histórico
        </RouterLink>
        <RouterLink 
          to="/profile" 
          class="nav-link px-4 py-2 rounded-full text-sm font-medium transition-all text-[#353535] hover:bg-[#F7F8F3]"
        >
          Perfil
        </RouterLink>
        
        <!-- Sair (Logout) -->
        <button 
          @click="handleLogout" 
          class="px-4 py-2 rounded-full text-sm font-medium transition-all text-[#353535] hover:bg-red-50 hover:text-red-600"
        >
          Sair
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* Classe injetada automaticamente pelo Vue Router para a rota ativa */
.nav-link.router-link-active {
  background-color: #284b63;
  color: #ffffff;
}

.nav-link.router-link-active:hover {
  background-color: #1f3d42;
}
</style>

