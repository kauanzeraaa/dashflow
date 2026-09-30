<template>
    <main class="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f7f8f3] px-5 py-6 text-[#233f47] sm:px-8">
        <RouterLink class="absolute left-6 top-6 inline-flex items-center gap-2 text-xs text-[#557174] no-underline transition-colors hover:text-[#233f47] sm:left-10 sm:top-8" to="/">
            <span class="text-base transition-transform duration-200 hover:-translate-x-1" aria-hidden="true">←</span>
            Voltar para a home
        </RouterLink>

        <section class="w-full max-w-2xl">
            <div class="mb-5 text-center">
                <h1 class="text-4xl font-extrabold tracking-tight text-[#284b50] sm:text-5xl">Dashflow</h1>
                <p class="mt-2 text-sm text-[#6c7e7d]">Comece a transformar seus dados em decisões.</p>
            </div>

            <form class="mx-auto w-full rounded-2xl border border-[#dfe7e1] bg-white p-6 shadow-[0_18px_50px_rgba(40,75,80,0.08)] sm:p-8" @submit.prevent="$router.push('/dashboard')">
                <div class="mb-6">
                    <p class="mb-2 text-[0.58rem] font-bold tracking-[0.14em] text-[#6b8b8a]">NOVO ACESSO</p>
                    <h2 class="text-2xl font-semibold text-[#233f47]">Crie sua conta</h2>
                    <p class="mt-1.5 text-sm text-[#718281]">Preencha seus dados para começar no Dashflow.</p>
                </div>

                <div class="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                    <div>
                        <label class="mb-1.5 block text-xs font-bold text-[#3d5558]" for="name">NOME</label>
                        <input id="name" class="h-11 w-full rounded-lg border border-[#d4dfda] bg-[#fbfcf9] px-3 text-sm text-[#203941] outline-none placeholder:text-sm placeholder:text-[#9aa8a5] focus:border-[#638b89] focus:ring-2 focus:ring-[#638b89]/20" name="name" type="text" autocomplete="name" placeholder="Seu nome completo" required />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-bold text-[#3d5558]" for="phone">TELEFONE</label>
                        <input id="phone" class="h-11 w-full rounded-lg border border-[#d4dfda] bg-[#fbfcf9] px-3 text-sm text-[#203941] outline-none placeholder:text-sm placeholder:text-[#9aa8a5] focus:border-[#638b89] focus:ring-2 focus:ring-[#638b89]/20" name="phone" type="tel" autocomplete="tel" placeholder="(00) 00000-0000" required />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-bold text-[#3d5558]" for="email">EMAIL</label>
                        <input id="email" class="h-11 w-full rounded-lg border border-[#d4dfda] bg-[#fbfcf9] px-3 text-sm text-[#203941] outline-none placeholder:text-sm placeholder:text-[#9aa8a5] focus:border-[#638b89] focus:ring-2 focus:ring-[#638b89]/20" name="email" type="email" autocomplete="email" placeholder="seu@email.com" required />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-bold text-[#3d5558]" for="password">SENHA</label>
                        <input id="password" class="h-11 w-full rounded-lg border border-[#d4dfda] bg-[#fbfcf9] px-3 text-sm text-[#203941] outline-none placeholder:text-sm placeholder:text-[#9aa8a5] focus:border-[#638b89] focus:ring-2 focus:ring-[#638b89]/20" name="password" type="password" autocomplete="new-password" placeholder="Crie uma senha" minlength="6" required />
                    </div>
                </div>

                <button class="mt-6 flex h-11 w-full items-center justify-between rounded-lg border-0 bg-[#284b50] px-4 text-sm font-bold text-white transition duration-200 hover:bg-[#1f3d42]" type="submit">
                    Criar minha conta
                    <span class="text-lg" aria-hidden="true">→</span>
                </button>

                <p class="mt-5 text-center text-xs text-[#718281]">
                    Já possui uma conta?
                    <RouterLink class="font-bold text-[#284b50] no-underline hover:underline" to="/login">Entrar</RouterLink>
                </p>
            </form>
        </section>
    </main>
</template>