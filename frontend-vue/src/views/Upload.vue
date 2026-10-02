<script setup>
import { ref } from 'vue'
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

function abrirSeletor() {
  inputArquivo.value?.click()
}

function selecionarArquivo(event) {
  const arquivo =
    event.target.files[0]

  if (arquivo) {
    uploadStore.selecionarArquivo(
      arquivo
    )
  }

  // Permite selecionar novamente
  // o mesmo arquivo
  event.target.value = ''
}

function soltarArquivo(event) {
  arrastando.value = false

  const arquivo =
    event.dataTransfer.files[0]

  if (arquivo) {
    uploadStore.selecionarArquivo(
      arquivo
    )
  }
}

async function iniciarProcessamento() {
  await uploadStore.processarArquivo()
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
      :class="
        arrastando
          ? 'border-[#284b63] bg-[#f7f8f3]'
          : 'border-[#e4e4e4] hover:border-[#557174]'
      "
    >

      <input
        ref="inputArquivo"
        type="file"
        accept=".xlsx,.xls"
        class="hidden"
        @change="selecionarArquivo"
      />

      <!-- Ícone -->
      <svg
        class="h-10 w-10 shrink-0
               text-[#b7b7b7]"
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

      <div>
        <p
          class="text-sm font-medium
                 text-[#4d4d4d]"
        >
          {{
            uploadStore.arquivo
              ? uploadStore.arquivo.name
              : 'Selecione o Arquivo para o Processamento'
          }}
        </p>

        <p
          class="mt-1 text-xs
                 text-[#9a9a9a]"
        >
          Clique ou arraste um arquivo
          XLS/XLSX
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
               text-xs"
        :class="
          uploadStore.erro
            ? 'bg-red-50 text-red-600'
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

    <!-- Botão Processar -->
    <div
      v-if="
        uploadStore.arquivo &&
        uploadStore.etapa === 1
      "
      class="mt-5 flex justify-center"
    >
      <button
        type="button"
        @click="iniciarProcessamento"
        class="rounded-full
               bg-[#284b63]
               px-8 py-3
               text-xs font-semibold
               text-white
               transition-all
               hover:bg-[#1f3a4d]
               hover:shadow-md"
      >
        Processar arquivo
      </button>
    </div>

    <!-- Erros da validação -->
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

    <!-- Sucesso -->
    <div
      v-if="
        uploadStore.etapa === 5 &&
        !uploadStore.erro
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

    <!-- Remover arquivo -->
    <div
      v-if="uploadStore.arquivo"
      class="mt-5 flex justify-center"
    >

      <button
        type="button"
        @click="
          uploadStore.limparArquivo()
        "
        class="rounded-full border
               border-[#d7dfdc]
               bg-white px-5 py-2
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