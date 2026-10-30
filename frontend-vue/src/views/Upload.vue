<script setup>
import { computed, ref } from 'vue'
import { useUploadStore } from '../stores/uploadStore'

const uploadStore = useUploadStore()

const inputArquivo = ref(null)
const arrastando = ref(false)

const etapas = [
  'Envio',
  'Captura',
  'Validação',
  'Tratamento',
  'Visualização'
]

const colunasPrevia = computed(() =>
  uploadStore.dados.length
    ? Object.keys(uploadStore.dados[0]).filter(c => !c.startsWith('_'))
    : []
)

const registrosPrevia = computed(() =>
  uploadStore.dados.slice(0, 8)
)

function abrirSeletor() {
  if (uploadStore.processando) return
  inputArquivo.value?.click()
}

async function selecionarArquivo(event) {
  const arquivo = event.target.files?.[0]

  if (arquivo) {
    uploadStore.selecionarArquivo(arquivo)
    if (!uploadStore.erro && uploadStore.arquivo) {
      await uploadStore.processarArquivo()
    }
  }

  // Permite selecionar novamente o mesmo arquivo
  event.target.value = ''
}

async function soltarArquivo(event) {
  arrastando.value = false
  if (uploadStore.processando) return

  const arquivo = event.dataTransfer?.files?.[0]

  if (arquivo) {
    uploadStore.selecionarArquivo(arquivo)
    if (!uploadStore.erro && uploadStore.arquivo) {
      await uploadStore.processarArquivo()
    }
  }
}

function baixarRelatorio() {
  uploadStore.baixarRelatorio()
}

function removerArquivo() {
  uploadStore.limparArquivo()
  if (inputArquivo.value) {
    inputArquivo.value.value = ''
  }
}

function formatarNomeColuna(coluna) {
  return coluna
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letra => letra.toUpperCase())
}

function formatarValor(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return '—'
  }

  if (Array.isArray(valor)) {
    return valor.length ? valor.join(', ') : '—'
  }

  if (valor instanceof Date) {
    return valor.toLocaleDateString('pt-BR')
  }

  if (typeof valor === 'number') {
    return valor.toLocaleString('pt-BR')
  }

  return String(valor)
}
</script>

<template>
  <section
    class="mx-auto w-full max-w-6xl px-6 pb-10 sm:px-10"
  >

    <!-- Área de upload -->
    <div
      @click="abrirSeletor"
      @dragover.prevent="arrastando = true"
      @dragleave.prevent="arrastando = false"
      @drop.prevent="soltarArquivo"
      class="flex min-h-32 cursor-pointer
             items-center justify-center gap-5
             rounded-2xl border bg-white px-6
             transition-all
             shadow-[0_10px_35px_rgba(40,75,99,0.08)]"
      :class="[
        arrastando
          ? 'border-[#284b63] bg-[#f7f8f3]'
          : 'border-[#e4e4e4] hover:border-[#557174]',
        uploadStore.processando ? 'pointer-events-none opacity-85' : ''
      ]"
    >

      <input
        ref="inputArquivo"
        type="file"
        accept=".xlsx,.xls"
        class="hidden"
        @change="selecionarArquivo"
      />

      <!-- Ícone ou Spinner -->
      <svg
        v-if="!uploadStore.processando"
        class="h-10 w-10 shrink-0 text-[#b7b7b7]"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        stroke-width="1.3"
      >
        <path
          d="M5 8a3 3 0 0 1 3-3h13l6 6v16a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8Z"
        />
        <path d="M21 5v6h6" />
        <path d="M16 25V15" />
        <path d="m12 19 4-4 4 4" />
        <path d="M8 12h5" />
      </svg>

      <svg
        v-else
        class="h-10 w-10 shrink-0 animate-spin text-[#284b63]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>

      <div>
        <p
          class="text-sm font-medium text-[#4d4d4d]"
        >
          {{
            uploadStore.processando
              ? 'Processando arquivo...'
              : uploadStore.arquivo
                ? uploadStore.arquivo.name
                : 'Selecione o Arquivo para o Processamento'
          }}
        </p>

        <p
          class="mt-1 text-xs text-[#9a9a9a]"
        >
          {{
            uploadStore.processando
              ? 'Aguarde a validação e tratamento dos dados...'
              : 'Clique ou arraste um arquivo XLS/XLSX'
          }}
        </p>
      </div>
    </div>

    <!-- Etapas -->
    <div
      class="mx-auto mt-10 max-w-3xl"
    >

      <div
        class="relative grid grid-cols-5"
      >

        <!-- Linha -->
        <div
          class="absolute left-[10%]
                 right-[10%] top-[36px]
                 h-px bg-[#dedede]"
        ></div>

        <div
          v-for="(etapa, index) in etapas"
          :key="etapa"
          class="relative flex
                 flex-col items-center"
        >

          <span
            class="mb-4 text-center
                   text-xs"
            :class="
              index < uploadStore.etapa
                ? 'font-semibold text-[#284b63]'
                : 'text-[#777777]'
            "
          >
            {{ etapa }}
          </span>

          <span
            class="z-10 h-3 w-3
                   rounded-full
                   transition-colors"
            :class="
              index < uploadStore.etapa
                ? 'bg-[#284b63]'
                : 'bg-[#d9d9d9]'
            "
          ></span>

        </div>
      </div>
    </div>

    <!-- Status -->
    <div
      class="mt-12 flex justify-center"
    >

      <div
        class="min-w-80 rounded-xl
               px-8 py-3 text-center
               text-xs transition-colors"
        :class="
          uploadStore.erro
            ? 'bg-red-50 text-red-600'
            : uploadStore.errosValidacao?.length && uploadStore.etapa === 5
              ? 'border border-amber-200 bg-amber-50 text-amber-700'
              : uploadStore.etapa === 5
                ? 'bg-green-50 text-green-700'
                : uploadStore.arquivo
                  ? 'bg-[#edf3f1] text-[#284b63]'
                  : 'bg-[#e8e8e8] text-[#666666]'
        "
      >
        {{
          uploadStore.erro ||
          uploadStore.mensagem
        }}
      </div>

    </div>

    <!-- Erros da validação (exibidos mesmo com os dados processados) -->
    <div
      v-if="
        uploadStore.errosValidacao?.length
      "
      class="mx-auto mt-6 max-w-3xl
             rounded-xl border
             border-red-200
             bg-red-50 p-5"
    >

      <h3
        class="mb-3 text-sm
               font-semibold text-red-700"
      >
        Problemas encontrados
      </h3>

      <p
        class="mb-4 text-xs text-red-600"
      >
        Foram encontrados
        {{ uploadStore.errosValidacao.length }}
        problemas durante a validação.
      </p>

      <ul
        class="max-h-56 space-y-1
               overflow-y-auto
               text-xs text-red-600"
      >

        <li
          v-for="(erro, index)
          in uploadStore.errosValidacao"
          :key="index"
        >
          • {{ erro }}
        </li>

      </ul>
    </div>

    <!-- Sucesso (quando sem erros de validação) -->
    <div
      v-if="
        uploadStore.etapa === 5 &&
        !uploadStore.erro &&
        !uploadStore.errosValidacao?.length
      "
      class="mx-auto mt-6 max-w-3xl
             rounded-xl border
             border-green-200
             bg-green-50 p-5
             text-center"
    >

      <h3
        class="text-sm font-semibold
               text-green-700"
      >
        Processamento concluído
      </h3>

      <p
        class="mt-2 text-xs
               text-green-600"
      >
        {{
          uploadStore.dados.length
        }}
        registros foram processados
        com sucesso.
      </p>

    </div>

    <!-- Resumo rápido dos dados processados -->
    <div
      v-if="uploadStore.etapa === 5 && uploadStore.estatisticas"
      class="mx-auto mt-6 flex max-w-6xl flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dfe7e1] bg-white px-5 py-3 text-xs text-[#557174] shadow-sm"
    >
      <div class="flex items-center gap-1.5">
        <span class="font-semibold text-[#284b50]">Linhas lidas:</span>
        <span>{{ uploadStore.estatisticas.totalLinhas }}</span>
      </div>
      <div class="hidden h-3 w-px bg-[#e4e4e4] sm:block"></div>
      <div class="flex items-center gap-1.5">
        <span class="font-semibold text-[#284b50]">Colunas:</span>
        <span>{{ uploadStore.estatisticas.totalColunas }}</span>
      </div>
      <div class="hidden h-3 w-px bg-[#e4e4e4] sm:block"></div>
      <div class="flex items-center gap-1.5">
        <span class="font-semibold text-[#284b50]">Linhas sem erros:</span>
        <span class="text-green-700 font-medium">{{ uploadStore.estatisticas.linhasValidas }}</span>
      </div>
      <div class="hidden h-3 w-px bg-[#e4e4e4] sm:block"></div>
      <div class="flex items-center gap-1.5">
        <span class="font-semibold text-[#284b50]">Conflitos:</span>
        <span :class="uploadStore.estatisticas.totalConflitos > 0 ? 'font-medium text-amber-700' : 'text-[#777]'">
          {{ uploadStore.estatisticas.totalConflitos }}
        </span>
      </div>
      <div class="hidden h-3 w-px bg-[#e4e4e4] sm:block"></div>
      <div class="flex items-center gap-1.5">
        <span class="font-semibold text-[#284b50]">Faturamento:</span>
        <span>{{ uploadStore.estatisticas.faturamentoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) }}</span>
      </div>
    </div>

    <!-- Prévia dos dados tratados -->
    <section
      v-if="
        uploadStore.etapa === 5 &&
        uploadStore.dados.length
      "
      class="mx-auto mt-6 max-w-6xl overflow-hidden
             rounded-2xl border border-[#dfe7e1]
             bg-white shadow-[0_10px_35px_rgba(40,75,99,0.06)]"
    >
      <div
        class="flex flex-col gap-3 border-b
               border-[#edf0ed] px-5 py-5
               sm:flex-row sm:items-center
               sm:justify-between sm:px-6"
      >
        <div>
          <h3
            class="text-base font-bold text-[#284b50]"
          >
            Prévia dos dados tratados
          </h3>
          <p
            class="mt-1 text-xs text-[#718281]"
          >
            Confira os primeiros registros processados.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <span
            class="w-fit rounded-full bg-[#f7f8f3]
                   px-3 py-1.5 text-xs font-semibold
                   text-[#557174]"
          >
            {{ registrosPrevia.length }} de {{ uploadStore.dados.length }} registros
          </span>

          <!-- Botão para Baixar Relatório em PDF -->
          <button
            type="button"
            @click="baixarRelatorio"
            class="inline-flex cursor-pointer items-center gap-2
                   rounded-full bg-[#284b63] px-4 py-1.5
                   text-xs font-semibold text-white
                   shadow-sm transition-all
                   hover:bg-[#1f3a4d] hover:shadow-md"
          >
            <svg
              class="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 11v6m0 0l-2.5-2.5M12 17l2.5-2.5"
              />
            </svg>
            Baixar Relatório (PDF)
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-left">
          <thead class="bg-[#f7f8f3]">
            <tr>
              <!-- Coluna de Status da Linha -->
              <th
                scope="col"
                class="whitespace-nowrap border-b
                       border-[#dfe7e1] px-5 py-3
                       text-[10px] font-bold uppercase
                       tracking-wide text-[#557174]"
              >
                Status
              </th>

              <th
                v-for="coluna in colunasPrevia"
                :key="coluna"
                scope="col"
                class="whitespace-nowrap border-b
                       border-[#dfe7e1] px-5 py-3
                       text-[10px] font-bold uppercase
                       tracking-wide text-[#557174]"
              >
                {{ formatarNomeColuna(coluna) }}
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-[#edf0ed]">
            <tr
              v-for="(registro, index) in registrosPrevia"
              :key="index"
              class="transition-colors hover:bg-[#fbfcfa]"
            >
              <!-- Indicador de Status por Linha -->
              <td class="whitespace-nowrap px-5 py-3 text-xs">
                <span
                  v-if="registro._problemas && registro._problemas.length > 0"
                  :title="registro._problemas.join('; ')"
                  class="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  Alerta ({{ registro._problemas.length }})
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[10px] font-semibold text-green-700"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  OK
                </span>
              </td>

              <td
                v-for="coluna in colunasPrevia"
                :key="`${index}-${coluna}`"
                class="max-w-56 whitespace-nowrap
                       px-5 py-3 text-xs text-[#4d4d4d]"
              >
                {{ formatarValor(registro[coluna]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Ações de rodapé -->
    <div
      v-if="uploadStore.arquivo"
      class="mt-6 flex flex-wrap items-center justify-center gap-3"
    >
      <button
        v-if="uploadStore.etapa === 5 && uploadStore.dados.length"
        type="button"
        @click="baixarRelatorio"
        class="inline-flex cursor-pointer items-center gap-2
               rounded-full bg-[#284b63] px-6 py-2.5
               text-xs font-semibold text-white
               shadow-[0_4px_12px_rgba(40,75,99,0.15)]
               transition-all hover:bg-[#1f3a4d] hover:shadow-md"
      >
        <svg
          class="h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 11v6m0 0l-2.5-2.5M12 17l2.5-2.5"
          />
        </svg>
        Baixar relatório dos dados processados (PDF)
      </button>

      <button
        type="button"
        @click="removerArquivo"
        class="cursor-pointer rounded-full border
               border-[#d7dfdc]
               bg-white px-5 py-2.5
               text-xs font-medium
               text-[#557174]
               transition-colors
               hover:bg-[#f1f4f2]"
      >
        Remover arquivo
      </button>

    </div>

  </section>
</template>
