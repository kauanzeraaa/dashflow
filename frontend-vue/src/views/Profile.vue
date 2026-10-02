<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dados iniciais (substituir pelos dados reais do usuário vindos do backend)
const profile = reactive({
    name: 'Seu Nome',
    phone: '(00) 00000-0000',
    email: 'seu@email.com',
})

const password = reactive({
    current: '',
    next: '',
    confirm: '',
})

const profileMessage = ref('')
const passwordMessage = ref('')
const passwordError = ref('')

const inputClass =
    'h-11 w-full rounded-lg border border-[#d4dfda] bg-[#fbfcf9] px-3 text-sm text-[#203941] outline-none placeholder:text-sm placeholder:text-[#9aa8a5] focus:border-[#638b89] focus:ring-2 focus:ring-[#638b89]/20'

function saveProfile() {
    // TODO: enviar profile para o backend
    profileMessage.value = 'Dados atualizados com sucesso.'
    setTimeout(() => (profileMessage.value = ''), 4000)
}

function changePassword() {
    passwordMessage.value = ''
    passwordError.value = ''

    if (password.next.length < 6) {
        passwordError.value = 'A nova senha precisa ter no mínimo 6 caracteres.'
        return
    }
    if (password.next !== password.confirm) {
        passwordError.value = 'A confirmação não é igual à nova senha.'
        return
    }

    // TODO: enviar password.current e password.next para o backend
    password.current = ''
    password.next = ''
    password.confirm = ''
    passwordMessage.value = 'Senha alterada com sucesso.'
    setTimeout(() => (passwordMessage.value = ''), 4000)
}

function logout() {
    // TODO: limpar sessão/token
    router.push('/login')
}
</script>

<template>
    <main class="min-h-dvh bg-white text-[#233f47]">
        <div class="mx-auto w-full max-w-2xl px-5 pb-12 pt-6 sm:px-8 sm:pt-8">
            <nav class="mb-8 flex items-center justify-between">
                <RouterLink class="inline-flex items-center gap-2 text-xs text-[#557174] no-underline transition-colors hover:text-[#233f47]" to="/dashboard">
                    <span class="text-base" aria-hidden="true">←</span>
                    Voltar ao dashboard
                </RouterLink>
            </nav>

            <header class="mb-6">
                <p class="mb-2 text-[0.58rem] font-bold tracking-[0.14em] text-[#6b8b8a]">MINHA CONTA</p>
                <h1 class="text-3xl font-extrabold tracking-tight text-[#284b50] sm:text-4xl">Perfil</h1>
                <p class="mt-2 text-sm text-[#6c7e7d]">Mantenha seus dados de acesso atualizados.</p>
            </header>

            <div class="flex flex-col gap-6">
                <!-- Dados pessoais -->
                <form class="w-full rounded-2xl border border-[#dfe7e1] bg-white p-6 shadow-[0_18px_50px_rgba(40,75,80,0.08)] sm:p-8" @submit.prevent="saveProfile">
                    <div class="mb-6">
                        <p class="mb-2 text-[0.58rem] font-bold tracking-[0.14em] text-[#6b8b8a]">DADOS PESSOAIS</p>
                        <h2 class="text-2xl font-semibold text-[#233f47]">Suas informações</h2>
                        <p class="mt-1.5 text-sm text-[#718281]">Esses dados são usados para identificar sua conta.</p>
                    </div>

                    <div class="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                        <div class="sm:col-span-2">
                            <label class="mb-1.5 block text-xs font-bold text-[#3d5558]" for="name">NOME</label>
                            <input id="name" v-model="profile.name" :class="inputClass" name="name" type="text" autocomplete="name" placeholder="Seu nome completo" required />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-xs font-bold text-[#3d5558]" for="phone">TELEFONE</label>
                            <input id="phone" v-model="profile.phone" :class="inputClass" name="phone" type="tel" autocomplete="tel" placeholder="(00) 00000-0000" required />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-xs font-bold text-[#3d5558]" for="email">EMAIL</label>
                            <input id="email" v-model="profile.email" :class="inputClass" name="email" type="email" autocomplete="email" placeholder="seu@email.com" required />
                        </div>
                    </div>

                    <p v-if="profileMessage" class="mt-4 rounded-lg border border-[#dfe7e1] bg-[#e8efea] px-3 py-2 text-xs font-semibold text-[#3d5558]" role="status">
                        {{ profileMessage }}
                    </p>

                    <button class="cursor-pointer mt-6 flex h-11 w-full items-center justify-between rounded-lg border-0 bg-[#284b50] px-4 text-sm font-bold text-white transition duration-200 hover:bg-[#1f3d42]" type="submit">
                        Salvar alterações
                        <span class="text-lg" aria-hidden="true">→</span>
                    </button>
                </form>

                <!-- Alterar senha -->
                <form class="w-full rounded-2xl border border-[#dfe7e1] bg-white p-6 shadow-[0_18px_50px_rgba(40,75,80,0.08)] sm:p-8" @submit.prevent="changePassword">
                    <div class="mb-6">
                        <p class="mb-2 text-[0.58rem] font-bold tracking-[0.14em] text-[#6b8b8a]">SEGURANÇA</p>
                        <h2 class="text-2xl font-semibold text-[#233f47]">Alterar senha</h2>
                        <p class="mt-1.5 text-sm text-[#718281]">Use uma senha com no mínimo 6 caracteres.</p>
                    </div>

                    <div class="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                        <div class="sm:col-span-2">
                            <label class="mb-1.5 block text-xs font-bold text-[#3d5558]" for="current-password">SENHA ATUAL</label>
                            <input id="current-password" v-model="password.current" :class="inputClass" name="current-password" type="password" autocomplete="current-password" placeholder="Digite sua senha atual" required />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-xs font-bold text-[#3d5558]" for="new-password">NOVA SENHA</label>
                            <input id="new-password" v-model="password.next" :class="inputClass" name="new-password" type="password" autocomplete="new-password" placeholder="Crie uma nova senha" minlength="6" required />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-xs font-bold text-[#3d5558]" for="confirm-password">CONFIRMAR NOVA SENHA</label>
                            <input id="confirm-password" v-model="password.confirm" :class="inputClass" name="confirm-password" type="password" autocomplete="new-password" placeholder="Repita a nova senha" minlength="6" required />
                        </div>
                    </div>

                    <p v-if="passwordError" class="mt-4 rounded-lg border border-[#e6c9c4] bg-[#fbf1ef] px-3 py-2 text-xs font-semibold text-[#8a3d33]" role="alert">
                        {{ passwordError }}
                    </p>
                    <p v-if="passwordMessage" class="mt-4 rounded-lg border border-[#dfe7e1] bg-[#e8efea] px-3 py-2 text-xs font-semibold text-[#3d5558]" role="status">
                        {{ passwordMessage }}
                    </p>

                    <button class="cursor-pointer mt-6 flex h-11 w-full items-center justify-between rounded-lg border-0 bg-[#284b50] px-4 text-sm font-bold text-white transition duration-200 hover:bg-[#1f3d42]" type="submit">
                        Atualizar senha
                        <span class="text-lg" aria-hidden="true">→</span>
                    </button>
                </form>

                <!-- Sair da conta -->
                <section class="flex w-full flex-col gap-4 rounded-2xl border border-[#dfe7e1] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div>
                        <h2 class="text-lg font-semibold text-[#233f47]">Sair da conta</h2>
                        <p class="mt-1 text-sm text-[#718281]">Encerre sua sessão neste dispositivo.</p>
                    </div>
                    <button class="cursor-pointer h-11 shrink-0 rounded-lg border border-[#d4dfda] bg-white px-5 text-sm font-bold text-[#284b50] transition duration-200 hover:bg-[#f7f8f3]" type="button" @click="logout">
                        Sair
                    </button>
                </section>
            </div>
        </div>
    </main>
</template>