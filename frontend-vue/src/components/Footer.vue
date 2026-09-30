<template>
    <footer class="border-t border-[#dfe7e1] bg-[#eef3ed] px-6 py-10 text-[#557174] sm:px-10">
        <div class="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <RouterLink class="font-baloo text-2xl font-bold text-[#284b50] no-underline" to="/">Dashflow</RouterLink>
                <p class="mt-2 max-w-xs text-sm leading-6">Dados organizados para decisões mais simples e confiáveis.</p>
            </div>
            <div class="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <RouterLink class="no-underline transition-colors hover:text-[#284b50]" to="/#servicos">Serviços</RouterLink>
                <RouterLink class="no-underline transition-colors hover:text-[#284b50]" to="/login">Entrar</RouterLink>
                <RouterLink class="no-underline transition-colors hover:text-[#284b50]" to="/register">Criar conta</RouterLink>
            </div>
        </div>
        <div class="mx-auto mt-8 max-w-6xl border-t border-[#d2dfd7] pt-5 text-xs text-[#718281]">
            © 2026 Dashflow. Organização que acompanha suas decisões.
        </div>
    </footer>
</template>
