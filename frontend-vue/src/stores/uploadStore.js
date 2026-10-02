import { defineStore } from 'pinia'
import * as XLSX from 'xlsx'

export const useUploadStore = defineStore('upload', {
  state: () => ({
    arquivo: null,
    dados: [],
    etapa: 0,
    mensagem: 'Aguardando anexo do arquivo',
    erro: '',
    errosValidacao: []
  }),

  actions: {
    selecionarArquivo(arquivo) {
      this.limparArquivo()

      if (!arquivo) {
        return
      }

      // Verifica a extensão do arquivo
      const extensao = arquivo.name
        .split('.')
        .pop()
        .toLowerCase()

      if (extensao !== 'xlsx' && extensao !== 'xls') {
        this.erro = 'Selecione um arquivo Excel (.xlsx ou .xls).'
        return
      }

      // Limite de 10 MB
      const tamanhoMaximo = 10 * 1024 * 1024

      if (arquivo.size > tamanhoMaximo) {
        this.erro = 'O arquivo deve possuir no máximo 10 MB.'
        return
      }

      // Arquivo válido
      this.arquivo = arquivo
      this.etapa = 1
      this.mensagem = 'Arquivo selecionado e pronto para processamento.'
    },

    async processarArquivo() {
      if (!this.arquivo) {
        this.erro =
          'Selecione um arquivo antes de iniciar o processamento.'
        return
      }

      this.erro = ''
      this.errosValidacao = []

      try {
        // Etapa 2 - Captura
        this.etapa = 2
        this.mensagem = 'Capturando dados da planilha...'

        await this.aguardar(700)

        await this.lerPlanilha()
      } catch (erro) {
        console.error(
          'Erro durante o processamento:',
          erro
        )

        this.erro =
          erro.message ||
          'Não foi possível processar a planilha.'
      }
    },

    async lerPlanilha() {
      // Transforma o arquivo em ArrayBuffer
      const buffer =
        await this.arquivo.arrayBuffer()

      // Faz a leitura do Excel
      const workbook = XLSX.read(buffer, {
        type: 'array',
        cellDates: true
      })

      // Verifica se existe a aba esperada
      if (
        !workbook.SheetNames.includes(
          'upload_clientes'
        )
      ) {
        throw new Error(
          'A planilha deve possuir a aba upload_clientes.'
        )
      }

      const planilha =
        workbook.Sheets['upload_clientes']

      // Converte as linhas da planilha
      // para objetos JavaScript
      const dados =
        XLSX.utils.sheet_to_json(
          planilha,
          {
            defval: null
          }
        )

      if (dados.length === 0) {
        throw new Error(
          'A planilha não possui registros.'
        )
      }

      this.dados = dados

      this.mensagem =
        `${dados.length} registros capturados.`

      await this.aguardar(700)

      // Etapa 3 - Validação
      this.etapa = 3
      this.mensagem =
        'Validando os dados...'

      await this.aguardar(700)

      this.validarDados()
    },

    validarDados() {
      this.errosValidacao = []

      const colunasObrigatorias = [
        'codigo_cliente',
        'nome_cliente',
        'consultor',
        'segmento',
        'nivel_cliente',
        'faturamento_anual',
        'servicos_contratados',
        'data_contratacao'
      ]

      const primeiraLinha =
        this.dados[0]

      // Verifica se as colunas existem
      for (
        const coluna of colunasObrigatorias
      ) {
        if (!(coluna in primeiraLinha)) {
          this.errosValidacao.push(
            `Coluna obrigatória ausente: ${coluna}`
          )
        }
      }

      // Se a estrutura estiver errada,
      // não continua a validação
      if (
        this.errosValidacao.length > 0
      ) {
        this.etapa = 3
        this.erro =
          'A estrutura da planilha é inválida.'
        this.mensagem =
          'Validação concluída com erros.'
        return
      }

      const codigosEncontrados =
        new Set()

      // Valida cada registro
      this.dados.forEach(
        (registro, index) => {
          // Excel:
          // linha 1 = cabeçalho
          // dados começam na linha 2
          const linha = index + 2

          // Campos obrigatórios
          for (
            const coluna
            of colunasObrigatorias
          ) {
            const valor =
              registro[coluna]

            if (
              valor === null ||
              valor === undefined ||
              String(valor).trim() === ''
            ) {
              this.errosValidacao.push(
                `Linha ${linha}: ${coluna} é obrigatório.`
              )
            }
          }

          // Validação do nível
          const nivel = String(
            registro.nivel_cliente ?? ''
          )
            .trim()
            .toUpperCase()

          if (
            nivel &&
            !['A', 'B', 'C'].includes(
              nivel
            )
          ) {
            this.errosValidacao.push(
              `Linha ${linha}: nível "${registro.nivel_cliente}" é inválido.`
            )
          }

          // Validação do faturamento
          const faturamento =
            Number(
              registro.faturamento_anual
            )

          if (
            registro.faturamento_anual != null &&
            (
              Number.isNaN(
                faturamento
              ) ||
              faturamento < 0
            )
          ) {
            this.errosValidacao.push(
              `Linha ${linha}: faturamento anual inválido.`
            )
          }

          // Verificação de duplicidade
          const codigo = String(
            registro.codigo_cliente ?? ''
          )
            .trim()
            .toUpperCase()

          if (codigo) {
            if (
              codigosEncontrados.has(
                codigo
              )
            ) {
              this.errosValidacao.push(
                `Linha ${linha}: código ${codigo} duplicado.`
              )
            }

            codigosEncontrados.add(
              codigo
            )
          }
        }
      )

      // Se encontrou problemas,
      // interrompe o processamento
      if (
        this.errosValidacao.length > 0
      ) {
        this.etapa = 3

        this.erro =
          `Foram encontrados ${this.errosValidacao.length} problemas na planilha.`

        this.mensagem =
          'Validação concluída com erros.'

        return
      }

      // Nenhum erro encontrado
      this.etapa = 4
      this.mensagem =
        'Validação concluída. Tratando os dados...'

      this.tratarDados()
    },

    async tratarDados() {
      await this.aguardar(700)

      this.dados =
        this.dados.map(
          registro => ({
            ...registro,

            codigo_cliente:
              String(
                registro.codigo_cliente
              )
                .trim()
                .toUpperCase(),

            nome_cliente:
              this.formatarTexto(
                registro.nome_cliente
              ),

            consultor:
              this.formatarTexto(
                registro.consultor
              ),

            segmento:
              this.padronizarSegmento(
                registro.segmento
              ),

            nivel_cliente:
              String(
                registro.nivel_cliente
              )
                .trim()
                .toUpperCase(),

            faturamento_anual:
              Number(
                registro.faturamento_anual
              ),

            servicos_contratados:
              this.tratarServicos(
                registro.servicos_contratados
              ),

            cidade:
              registro.cidade
                ? this.formatarTexto(
                    registro.cidade
                  )
                : '',

            uf:
              registro.uf
                ? String(registro.uf)
                    .trim()
                    .toUpperCase()
                : ''
          })
        )

      // Etapa 5 - Finalizado
      this.etapa = 5

      this.mensagem =
        `${this.dados.length} registros processados com sucesso.`
    },

    formatarTexto(valor) {
      if (!valor) {
        return ''
      }

      return String(valor)
        .trim()
        .toLowerCase()
        .replace(
          /\b\w/g,
          letra =>
            letra.toUpperCase()
        )
    },

    padronizarSegmento(
      segmento
    ) {
      if (!segmento) {
        return ''
      }

      const valor =
        String(segmento)
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(
            /[\u0300-\u036f]/g,
            ''
          )

      const segmentos = {
        'ind.': 'Indústria',
        'industria': 'Indústria',
        'comercio': 'Comércio',
        'servico': 'Serviços',
        'servicos': 'Serviços',
        'saude': 'Saúde',
        'educacao': 'Educação',
        'tecnologia': 'Tecnologia'
      }

      return (
        segmentos[valor] ||
        this.formatarTexto(
          segmento
        )
      )
    },

    tratarServicos(
      servicos
    ) {
      if (!servicos) {
        return []
      }

      return String(servicos)
        .split(';')
        .map(
          servico =>
            servico.trim()
        )
        .filter(
          servico =>
            servico !== ''
        )
    },

    aguardar(tempo) {
      return new Promise(
        resolve => {
          setTimeout(
            resolve,
            tempo
          )
        }
      )
    },

    limparArquivo() {
      this.arquivo = null
      this.dados = []
      this.etapa = 0
      this.mensagem =
        'Aguardando anexo do arquivo'
      this.erro = ''
      this.errosValidacao = []
    }
  }
})