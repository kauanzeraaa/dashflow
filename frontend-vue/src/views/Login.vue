<template>
    <main class="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#f7f8f3] text-[#233f47]">
        <section class="relative flex w-full max-w-5xl flex-col items-center px-6 pb-8 pt-14" aria-label="Dashflow">
            <nav class="absolute left-6 right-6 top-6 z-10 flex items-center justify-between sm:left-10 sm:right-10">
                <RouterLink class="inline-flex items-center gap-2 text-[0.68rem] text-[#557174] no-underline transition-colors hover:text-[#233f47]" to="/">
                    <span class="text-base transition-transform duration-200 hover:-translate-x-1" aria-hidden="true">←</span>
                    Voltar para a home
                </RouterLink>
            </nav>

            <h1 class="mt-0 text-5xl font-extrabold tracking-tight text-[#284b50] sm:text-6xl">Dashflow</h1>
            <p class="mt-3 max-w-md text-center text-sm leading-6 text-[#6c7e7d]">Sua rotina de dados mais simples, organizada e inteligente.</p>
        </section>

        <section class="flex w-full flex-1 items-start justify-center px-6 pb-12">
            <form class="flex w-full max-w-md flex-col rounded-2xl border border-[#dfe7e1] bg-white p-7 shadow-[0_18px_50px_rgba(40,75,80,0.08)] sm:p-10" @submit.prevent="$router.push('/dashboard')">
                <p class="mb-2.5 text-[0.58rem] font-bold tracking-[0.14em] text-[#6b8b8a]">ACESSO À SUA CONTA</p>
                <h2 class="m-0 text-2xl font-semibold text-[#233f47]">Bem-vindo de volta!</h2>
                <p class="mb-7 mt-2.5 text-sm leading-6 text-[#718281]">Entre para continuar acompanhando seus dados.</p>

                <label class="mb-1.5 text-xs font-bold text-[#3d5558]" for="email">EMAIL</label>
                <input id="email" class="mb-5 h-11 w-full rounded-lg border border-[#d4dfda] bg-[#fbfcf9] px-3 text-[#203941] outline-none placeholder:text-sm placeholder:text-[#9aa8a5] focus:border-[#638b89] focus:ring-2 focus:ring-[#638b89]/20" name="email" type="email" autocomplete="email" placeholder="seu@email.com" />

                <label class="mb-1.5 text-xs font-bold text-[#3d5558]" for="password">SENHA</label>
                <input id="password" class="h-11 w-full rounded-lg border border-[#d4dfda] bg-[#fbfcf9] px-3 text-[#203941] outline-none placeholder:text-sm placeholder:text-[#9aa8a5] focus:border-[#638b89] focus:ring-2 focus:ring-[#638b89]/20" name="password" type="password" autocomplete="current-password" placeholder="Digite sua senha" />

                <div class="mt-4 flex items-center justify-between gap-3">
                    <label class="flex cursor-pointer items-center gap-2 text-xs text-[#718281]" for="remember">
                        <input id="remember" class="m-0 h-3.5 w-3.5 accent-[#638b89]" name="remember" type="checkbox" />
                        <span>Lembre de mim</span>
                    </label>
                    <a class="text-xs text-[#557174] no-underline hover:text-[#233f47] hover:underline" href="#">Esqueci a senha</a>
                </div>

                <button class="mt-7 flex h-11 w-full items-center justify-between rounded-lg border-0 bg-[#284b50] px-4 text-sm font-bold text-white transition duration-200 hover:bg-[#1f3d42]" type="submit">
                    Entrar
                    <span class="text-lg" aria-hidden="true">→</span>
                </button>

                <p class="mt-6 text-center text-xs text-[#718281]">
                    Ainda não tem uma conta?
                    <RouterLink class="font-bold text-[#284b50] no-underline hover:underline" to="/register">Criar cadastro</RouterLink>
                </p>
            </form>
        </section>
    </main>
</template>