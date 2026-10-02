<script setup>
// Mock data for insights
const overview = [
  { id: 1, title: 'Faturamento Previsto', value: 'R$ 1.2M', trend: '+15%', isPositive: true },
  { id: 2, title: 'Novos Contratos', value: '48', trend: '+8%', isPositive: true },
  { id: 3, title: 'Taxa de Churn', value: '2.4%', trend: '-1.1%', isPositive: true },
  { id: 4, title: 'Ticket Médio', value: 'R$ 8.5K', trend: '+5%', isPositive: true },
]

const clientTiers = [
  { tier: 'A', clients: 45, opportunity: 'R$ 500K', description: 'Up-sell em consultoria premium e serviços dedicados. Alto engajamento.', color: 'bg-[#284b63]' },
  { tier: 'B', clients: 120, opportunity: 'R$ 850K', description: 'Cross-sell de módulos adicionais e renovação antecipada. Boa margem.', color: 'bg-[#3c6e71]' },
  { tier: 'C', clients: 300, opportunity: 'R$ 320K', description: 'Automação de atendimento e pacotes de entrada. Foco em volume.', color: 'bg-[#353535]' },
]

const hiringPatterns = [
  { service: 'Implementação de Software', percentage: 45, trend: 'Alta' },
  { service: 'Consultoria Estratégica', percentage: 30, trend: 'Estável' },
  { service: 'Treinamento e Capacitação', percentage: 15, trend: 'Baixa' },
  { service: 'Suporte Dedicado', percentage: 10, trend: 'Alta' },
]
</script>

<template>
  <div class="min-h-screen bg-[#FFFF] text-[#353535] flex flex-col">
    <div class="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 flex-grow">

      <!-- KPI Overview -->
      <section class="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in overview" :key="item.id" class="rounded-2xl bg-[#FFFFFF] p-6 shadow-[0_4px_20px_rgba(40,75,80,0.05)] border border-[#d9d9d9] transition-transform hover:-translate-y-1">
          <h3 class="text-sm font-semibold text-[#353535]/70">{{ item.title }}</h3>
          <div class="mt-3 flex items-baseline gap-3">
            <p class="text-3xl font-bold text-[#284b63]">{{ item.value }}</p>
            <span :class="['text-sm font-bold', item.isPositive ? 'text-[#3c6e71]' : 'text-[#353535]']">
              {{ item.trend }}
            </span>
          </div>
        </div>
      </section>

      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Oportunidades por Nível de Cliente -->
        <section class="rounded-2xl bg-[#FFFFFF] p-8 shadow-[0_4px_20px_rgba(40,75,80,0.05)] border border-[#d9d9d9]">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-[#284b63]">Oportunidades por Nível</h2>
            <p class="mt-1 text-sm text-[#353535]/70">Análise de clientes ativos segmentados na Curva ABC.</p>
          </div>
          
          <div class="space-y-8">
            <div v-for="tier in clientTiers" :key="tier.tier" class="flex gap-5 group">
              <div :class="['flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl font-black text-[#FFFFFF] shadow-sm transition-transform group-hover:scale-105', tier.color]">
                {{ tier.tier }}
              </div>
              <div class="flex-1 border-b border-[#d9d9d9] pb-6 last:border-0 last:pb-0">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-lg font-bold text-[#284b63]">Clientes Tier {{ tier.tier }}</h3>
                  <span class="rounded-full bg-[#F7F8F3] border border-[#d9d9d9] px-3 py-1 text-xs font-bold text-[#3c6e71]">{{ tier.clients }} ativos</span>
                </div>
                <p class="mt-2 text-sm leading-relaxed text-[#353535]/80">{{ tier.description }}</p>
                <div class="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#F7F8F3] px-3 py-1.5 border border-[#d9d9d9]">
                  <span class="text-xs font-bold text-[#353535]/60">Potencial Identificado:</span>
                  <span class="text-sm font-bold text-[#3c6e71]">{{ tier.opportunity }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Padrões de Contratação e Tendências -->
        <section class="flex flex-col gap-8">
          <!-- Padrões -->
          <div class="rounded-2xl bg-[#FFFFFF] p-8 shadow-[0_4px_20px_rgba(40,75,80,0.05)] border border-[#d9d9d9] flex-1">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-[#284b63]">Padrões de Contratação</h2>
              <p class="mt-1 text-sm text-[#353535]/70">Distribuição dos serviços no portfólio atual.</p>
            </div>
            
            <div class="space-y-6">
              <div v-for="pattern in hiringPatterns" :key="pattern.service">
                <div class="flex justify-between items-end mb-2">
                  <span class="font-semibold text-[#353535]">{{ pattern.service }}</span>
                  <span class="text-[#3c6e71] font-bold text-lg">{{ pattern.percentage }}%</span>
                </div>
                <div class="h-2.5 w-full overflow-hidden rounded-full bg-[#F7F8F3] border border-[#d9d9d9]">
                  <div class="h-full bg-[#3c6e71] rounded-full transition-all duration-1000 ease-out" :style="{ width: pattern.percentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tendências de Faturamento (Mock visual) -->
          <div class="rounded-2xl bg-[#284b63] p-8 shadow-lg text-[#FFFFFF] flex-1 relative overflow-hidden">
            <!-- Decorative background element -->
            <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#3c6e71]/30 blur-2xl"></div>
            
            <div class="relative z-10">
              <h2 class="text-2xl font-bold">Tendência de Faturamento</h2>
              <p class="text-sm text-[#d9d9d9] mt-2 mb-8 max-w-[90%]">Projeção do pipeline analítico baseada no histórico de conversão e sazonalidade.</p>
              
              <div class="flex items-end gap-3 h-32 mt-4 border-b border-[#3c6e71] pb-2">
                <!-- Mock bars for chart -->
                <div class="w-1/6 bg-[#3c6e71] rounded-t-md h-[40%] transition-all hover:bg-[#353535] cursor-pointer"></div>
                <div class="w-1/6 bg-[#3c6e71] rounded-t-md h-[55%] transition-all hover:bg-[#353535] cursor-pointer"></div>
                <div class="w-1/6 bg-[#3c6e71] rounded-t-md h-[45%] transition-all hover:bg-[#353535] cursor-pointer"></div>
                <div class="w-1/6 bg-[#3c6e71] rounded-t-md h-[70%] transition-all hover:bg-[#353535] cursor-pointer"></div>
                <div class="w-1/6 bg-[#3c6e71] rounded-t-md h-[85%] transition-all hover:bg-[#353535] cursor-pointer"></div>
                <div class="w-1/6 bg-[#F7F8F3] rounded-t-md h-[100%] transition-all hover:opacity-90 relative group cursor-pointer shadow-[0_0_15px_rgba(247,248,243,0.3)]">
                  <span class="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#353535] text-[#FFFFFF] text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">Meta Atingida</span>
                </div>
              </div>
              <div class="flex justify-between text-xs font-bold tracking-wider text-[#d9d9d9] mt-3">
                <span>JUL</span>
                <span>AGO</span>
                <span>SET</span>
                <span>OUT</span>
                <span>NOV</span>
                <span>DEZ</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>