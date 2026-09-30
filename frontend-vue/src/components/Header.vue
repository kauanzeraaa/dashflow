<template>
    <header class="border-b border-[#dfe7e1] bg-[#f7f8f3]/95 px-6 py-5 backdrop-blur sm:px-10">
        <nav class="mx-auto flex max-w-6xl items-center justify-between" aria-label="Navegação principal">
            <RouterLink class="font-baloo text-3xl font-bold tracking-tight text-[#284b50] no-underline" to="/">Dashflow</RouterLink>
            <div class="flex items-center gap-3 sm:gap-6">
                <RouterLink class="hidden text-sm font-medium text-[#557174] no-underline transition-colors hover:text-[#284b50] sm:block" to="/#servicos">Serviços</RouterLink>
                <RouterLink class="rounded-lg px-3 py-2 text-sm font-semibold text-[#557174] no-underline transition-colors hover:bg-[#e8efea] hover:text-[#284b50] sm:px-4" to="/login">Entrar</RouterLink>
                <RouterLink class="rounded-lg bg-[#284b50] px-3 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#1f3d42] sm:px-4" to="/register">Criar conta</RouterLink>
            </div>
        </nav>
    </header>
</template>