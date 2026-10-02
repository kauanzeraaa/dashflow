<template>
  <div class="min-h-screen bg-[#f7f8f3] text-[#233f47] font-sans antialiased pb-12">
    <main class="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
      <!-- Boas-vindas e Filtro de Data -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-normal text-[#284b50]">
            <span class="font-bold underline decoration-[#284b50] underline-offset-8">Bem Vindo,</span>
            <span class="font-light text-[#4a686c]"> Kauan Magalhães</span>
          </h1>
        </div>

        <!-- Seletor de Data -->
        <div class="inline-flex items-center gap-2 bg-white border border-[#dfe7e1] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#557174] shadow-sm self-start sm:self-auto">
          <svg class="w-4 h-4 text-[#6b8b8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6" stroke-width="2"></line>
            <line x1="8" y1="2" x2="8" y2="6" stroke-width="2"></line>
            <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"></line>
          </svg>
          <span>01 Ago, 2026 - 28 Ago, 2026</span>
          <svg class="w-4 h-4 text-[#6b8b8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      <!-- Grid Principal do Dashboard -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        <!-- Coluna Esquerda: Cards de Métricas Rápidas -->
        <div class="lg:col-span-4 flex flex-col gap-4">
          <!-- Card 1 -->
          <div class="bg-white p-4 rounded-2xl border border-[#dfe7e1] shadow-sm flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-[#284b50] flex items-center justify-center text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <span class="font-semibold text-[#284b50] text-sm">Total de Clientes</span>
            </div>
            <span class="text-2xl font-bold text-[#284b50]">1.248</span>
          </div>

          <!-- Card 2 -->
          <div class="bg-white p-4 rounded-2xl border border-[#dfe7e1] shadow-sm flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-[#284b50] flex items-center justify-center text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <circle cx="12" cy="12" r="3" stroke-width="1.8"></circle>
                </svg>
              </div>
              <span class="font-semibold text-[#284b50] text-sm">Serviços Contratados</span>
            </div>
            <span class="text-2xl font-bold text-[#284b50]">1.248</span>
          </div>

          <!-- Card 3 -->
          <div class="bg-white p-4 rounded-2xl border border-[#dfe7e1] shadow-sm flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-[#284b50] flex items-center justify-center text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                </svg>
              </div>
              <span class="font-semibold text-[#284b50] text-sm">Segmentos Atendidos</span>
            </div>
            <span class="text-2xl font-bold text-[#284b50]">12</span>
          </div>

          <!-- Card 4 -->
          <div class="bg-white p-4 rounded-2xl border border-[#dfe7e1] shadow-sm flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-[#284b50] flex items-center justify-center text-white">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
              <span class="font-semibold text-[#284b50] text-sm">Clientes Nível A</span>
            </div>
            <span class="text-2xl font-bold text-[#284b50]">326</span>
          </div>
        </div>

        <!-- Coluna Centro: Faturamento Médio + Gráfico de Onda -->
        <div class="lg:col-span-4 bg-white rounded-2xl border border-[#dfe7e1] shadow-sm p-5 flex flex-col justify-between relative overflow-hidden min-h-[300px]">
          <div>
            <h3 class="text-center text-base font-bold text-[#284b50]">Faturamento Médio</h3>
            <p class="text-center text-3xl font-extrabold text-[#284b50] mt-2">R$ 2,4 m</p>
          </div>

          <!-- Gráfico de Onda em SVG -->
          <div class="relative w-full h-44 mt-4">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 300 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#284b50" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="#6b8b8a" stop-opacity="0.1" />
                </linearGradient>
              </defs>
              <path 
                d="M 0 110 Q 20 70, 40 90 T 80 70 T 120 50 T 160 80 T 200 30 T 240 70 T 280 40 L 300 60 L 300 150 L 0 150 Z" 
                fill="url(#waveGradient)" 
              />
              <path 
                d="M 0 110 Q 20 70, 40 90 T 80 70 T 120 50 T 160 80 T 200 30 T 240 70 T 280 40 L 300 60" 
                fill="none" 
                stroke="#284b50" 
                stroke-width="2.5" 
              />
            </svg>

            <!-- Badge/Pílula Flutuante de Legenda -->
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#284b50] text-white text-[10px] px-3 py-1 rounded-full shadow flex items-center gap-1">
              <span class="font-bold">Lucro &uparrow;</span>
              <span class="text-gray-300">Perda &downarrow;</span>
            </div>
          </div>
        </div>

        <!-- Coluna Direita: Serviços e Barras -->
        <div class="lg:col-span-4 bg-white rounded-2xl border border-[#dfe7e1] shadow-sm p-5 flex flex-col justify-between">
          <h3 class="text-center text-base font-bold text-[#284b50] mb-4">Serviços</h3>

          <div class="space-y-4">
            <!-- Item 1 -->
            <div>
              <div class="flex justify-between text-xs font-semibold text-[#284b50] mb-1">
                <span>Consultoria</span>
                <span>720</span>
              </div>
              <div class="w-full bg-[#e8efea] h-3 rounded-full overflow-hidden">
                <div class="bg-[#284b50] h-full rounded-full" style="width: 85%"></div>
              </div>
            </div>

            <!-- Item 2 -->
            <div>
              <div class="flex justify-between text-xs font-semibold text-[#284b50] mb-1">
                <span>Auditoria</span>
                <span>580</span>
              </div>
              <div class="w-full bg-[#e8efea] h-3 rounded-full overflow-hidden">
                <div class="bg-[#284b50] h-full rounded-full" style="width: 70%"></div>
              </div>
            </div>

            <!-- Item 3 -->
            <div>
              <div class="flex justify-between text-xs font-semibold text-[#284b50] mb-1">
                <span>Treinamento</span>
                <span>420</span>
              </div>
              <div class="w-full bg-[#e8efea] h-3 rounded-full overflow-hidden">
                <div class="bg-[#284b50] h-full rounded-full" style="width: 52%"></div>
              </div>
            </div>

            <!-- Item 4 -->
            <div>
              <div class="flex justify-between text-xs font-semibold text-[#284b50] mb-1">
                <span>Acessoria</span>
                <span>310</span>
              </div>
              <div class="w-full bg-[#e8efea] h-3 rounded-full overflow-hidden">
                <div class="bg-[#284b50] h-full rounded-full" style="width: 38%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Banner Informativo -->
      <div class="bg-white rounded-2xl border border-[#dfe7e1] shadow-sm p-4 text-center mb-6">
        <p class="text-sm font-semibold text-[#284b50]">
          O segmento Indústria possui maior concentração de clientes classificados como B.
        </p>
      </div>

      <!-- Seção Inferior: Gráfico de Pizza + Tabela de Segmentos -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Gráfico de Pizza (Níveis de Clientes) -->
        <div class="lg:col-span-5 bg-white rounded-2xl border border-[#dfe7e1] shadow-sm p-5 flex flex-col justify-between">
          <h3 class="text-lg font-bold text-[#284b50] mb-4 leading-tight">
            Níveis de Clientes<br />Atendidos
          </h3>

          <div class="flex items-center justify-between gap-4">
            <!-- Legenda -->
            <div class="space-y-3 text-xs font-semibold">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-sm bg-[#8cb3ad] inline-block"></span>
                <span class="text-[#557174]">Clientes A <strong class="text-[#284b50] ml-1">32%</strong></span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-sm bg-[#527d80] inline-block"></span>
                <span class="text-[#557174]">Clientes B <strong class="text-[#284b50] ml-1">45%</strong></span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-sm bg-[#284b50] inline-block"></span>
                <span class="text-[#557174]">Clientes C <strong class="text-[#284b50] ml-1">23%</strong></span>
              </div>
            </div>

            <!-- SVG Pie Chart -->
            <div class="w-32 h-32 sm:w-40 sm:h-40 relative">
              <svg class="w-full h-full" viewBox="0 0 100 100" role="img" aria-label="Clientes A: 32%, Clientes B: 45%, Clientes C: 23%">
                <path d="M 50 50 L 50 2 A 48 48 0 0 1 93.44 70.42 Z" fill="#8cb3ad" stroke="white" stroke-width="1.5" />
                <path d="M 50 50 L 93.44 70.42 A 48 48 0 0 1 2.38 43.99 Z" fill="#527d80" stroke="white" stroke-width="1.5" />
                <path d="M 50 50 L 2.38 43.99 A 48 48 0 0 1 50 2 Z" fill="#284b50" stroke="white" stroke-width="1.5" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Tabela de Segmentos -->
        <div class="lg:col-span-7 bg-white rounded-2xl border border-[#dfe7e1] shadow-sm p-5 overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-[#dfe7e1] text-[#8a9e9c] font-medium text-xs">
                <th class="pb-3 font-normal">Segmento</th>
                <th class="pb-3 text-center font-normal">Nível A</th>
                <th class="pb-3 text-center font-normal">Nível B</th>
                <th class="pb-3 text-center font-normal">Nível C</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#f0f4f1] text-[#284b50] font-semibold">
              <tr>
                <td class="py-4">Indústria</td>
                <td class="py-4 text-center">120</td>
                <td class="py-4 text-center">180</td>
                <td class="py-4 text-center">50</td>
              </tr>
              <tr>
                <td class="py-4">Comércio</td>
                <td class="py-4 text-center">80</td>
                <td class="py-4 text-center">150</td>
                <td class="py-4 text-center">70</td>
              </tr>
              <tr>
                <td class="py-4">Serviços</td>
                <td class="py-4 text-center">126</td>
                <td class="py-4 text-center">210</td>
                <td class="py-4 text-center">95</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
</script>