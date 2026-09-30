<script setup>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import heroImage from '../assets/hero.png'
</script>

<template>
    <div class="min-h-screen bg-[#f7f8f3] text-[#233f47]">
        <Header />

        <main>
            <section class="mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1.55fr_0.95fr] mb-8 lg:gap-16 lg:py-15">
                <div>
                    <p class="mb-5 text-xs font-bold tracking-[0.16em] text-[#6b8b8a]">DADOS QUE TRABALHAM POR VOCÊ</p>
                    <h1 class="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#284b50] sm:text-6xl">
                        Clareza para transformar dados em <span class="text-[#638b89]">decisões.</span> 
                    </h1>
                    <p class="mt-6 max-w-xl text-base leading-8 text-[#6c7e7d] sm:text-lg">
                        Faça upload das suas planilhas, trate as informações e encontre os insights que ajudam seu negócio a avançar.
                    </p>
                    <div class="mt-8 flex flex-wrap items-center gap-4">
                        <RouterLink class="inline-flex items-center gap-4 rounded-lg bg-[#284b50] px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-[#1f3d42]" to="/register">
                            Começar agora
                            <span class="text-lg" aria-hidden="true">→</span>
                        </RouterLink>
                        <a class="text-sm font-semibold text-[#557174] no-underline hover:text-[#284b50] hover:underline" href="#servicos">Conheça os serviços</a>
                    </div>
                    <div class="mt-12 flex flex-wrap gap-8 border-t border-[#dfe7e1] pt-5 text-sm text-[#718281]">
                        <p><strong class="block text-xl text-[#284b50]">3 etapas</strong>do dado ao insight</p>
                        <p><strong class="block text-xl text-[#284b50]">1 lugar</strong>para sua análise</p>
                        <p><strong class="block text-xl text-[#284b50]">+ clareza</strong>nas decisões</p>
                    </div>
                </div>

                <div class="relative">
                    <div class="absolute -inset-4 bg-[#e7eee8]"></div>
                    <div class="relative overflow-hidden rounded-2xl border border-[#dfe7e1] bg-white p-3 shadow-[0_18px_50px_rgba(40,75,80,0.1)]">
                        <img class=" w-full rounded-xl object-cover" :src="heroImage" alt="Visualização de dados do Dashflow" />
                        <div class="flex items-center justify-between px-2 pb-1 pt-4">
                            <div>
                                <p class="text-[0.65rem] font-bold tracking-[0.12em] text-[#6b8b8a]">VISÃO GERAL</p>
                                <p class="mt-1 text-sm font-semibold text-[#284b50]">Seus dados, em perspectiva.</p>
                            </div>
                            <span class="rounded-full bg-[#e8efea] px-3 py-1 text-xs font-semibold text-[#557174]">Atualizado</span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="servicos" class="border-y border-[#dfe7e1] bg-white px-6 py-16 sm:px-10 lg:py-20">
                <div class="mx-auto max-w-6xl">
                    <div class="max-w-xl">
                        <p class="mb-4 text-xs font-bold tracking-[0.16em] text-[#6b8b8a]">COMO O DASHFLOW AJUDA</p>
                        <h2 class="text-3xl font-bold tracking-tight text-[#284b50] sm:text-4xl">Do arquivo bruto ao próximo passo.</h2>
                        <p class="mt-4 text-base leading-7 text-[#6c7e7d]">Uma jornada objetiva para você gastar menos tempo limpando dados e mais tempo entendendo o que eles dizem.</p>
                    </div>

                    <div class="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-0">
                        <article class="border-t border-[#cbdad2] pt-5 lg:mr-10">
                            <span class="font-baloo text-3xl text-[#9bb6b0]">01</span>
                            <h3 class="mt-4 text-xl font-semibold text-[#284b50]">Upload simples</h3>
                            <p class="mt-3 text-sm leading-7 text-[#718281]">Envie planilhas de forma rápida e centralize os arquivos que sua equipe precisa acompanhar.</p>
                            <RouterLink class="mt-5 inline-block text-sm font-bold text-[#557174] no-underline hover:text-[#284b50] hover:underline" to="/register">Começar a enviar →</RouterLink>
                        </article>
                        <article class="border-t border-[#cbdad2] pt-5 lg:mr-10">
                            <span class="font-baloo text-3xl text-[#9bb6b0]">02</span>
                            <h3 class="mt-4 text-xl font-semibold text-[#284b50]">Tratamento inteligente</h3>
                            <p class="mt-3 text-sm leading-7 text-[#718281]">Organize e prepare os dados para reduzir inconsistências e deixar a análise mais segura.</p>
                            <RouterLink class="mt-5 inline-block text-sm font-bold text-[#557174] no-underline hover:text-[#284b50] hover:underline" to="/login">Acessar plataforma →</RouterLink>
                        </article>
                        <article class="border-t border-[#cbdad2] pt-5">
                            <span class="font-baloo text-3xl text-[#9bb6b0]">03</span>
                            <h3 class="mt-4 text-xl font-semibold text-[#284b50]">Insights visuais</h3>
                            <p class="mt-3 text-sm leading-7 text-[#718281]">Enxergue tendências e oportunidades em uma visão clara, feita para apoiar decisões.</p>
                            <RouterLink class="mt-5 inline-block text-sm font-bold text-[#557174] no-underline hover:text-[#284b50] hover:underline" to="/login">Ver meu dashboard →</RouterLink>
                        </article>
                    </div>
                </div>
            </section>
        </main>

        <Footer />
    </div>
</template>