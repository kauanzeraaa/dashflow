import { defineStore } from 'pinia'
import * as XLSX from 'xlsx'

export const useUploadStore = defineStore('upload', {
  state: () => ({
    arquivo: null,
    dados: [],
    etapa: 0,
    mensagem: 'Aguardando anexo do arquivo',
    erro: '',
    errosValidacao: [],
    processando: false
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

      this.processando = true
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
      } finally {
        this.processando = false
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

      await this.validarDados()
    },

    async validarDados() {
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
        this.dados[0] || {}

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

      // Etapa 4 - Tratamento (continua mesmo com problemas encontrados na validação)
      this.etapa = 4
      this.mensagem =
        this.errosValidacao.length > 0
          ? `Validação com ${this.errosValidacao.length} problema(s). Tratando os dados...`
          : 'Validação concluída. Tratando os dados...'

      await this.tratarDados()
    },

    async tratarDados() {
      await this.aguardar(700)

      this.dados =
        this.dados.map(
          registro => ({
            ...registro,

            codigo_cliente:
              registro.codigo_cliente !== null && registro.codigo_cliente !== undefined
                ? String(
                    registro.codigo_cliente
                  )
                    .trim()
                    .toUpperCase()
                : '',

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
              registro.nivel_cliente !== null && registro.nivel_cliente !== undefined
                ? String(
                    registro.nivel_cliente
                  )
                    .trim()
                    .toUpperCase()
                : '',

            faturamento_anual:
              registro.faturamento_anual !== null &&
              registro.faturamento_anual !== undefined &&
              !Number.isNaN(Number(registro.faturamento_anual))
                ? Number(
                    registro.faturamento_anual
                  )
                : (registro.faturamento_anual ?? ''),

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
              registro.uf !== null && registro.uf !== undefined
                ? String(registro.uf)
                    .trim()
                    .toUpperCase()
                : ''
          })
        )

      // Etapa 5 - Finalizado / Visualização
      this.etapa = 5

      if (this.errosValidacao.length > 0) {
        this.erro = ''
        this.mensagem = `${this.dados.length} registros processados com ${this.errosValidacao.length} problema(s) encontrado(s).`
      } else {
        this.erro = ''
        this.mensagem =
          `${this.dados.length} registros processados com sucesso.`
      }
    },

    baixarRelatorio() {
      if (!this.dados || !this.dados.length) {
        return
      }

      const wb = XLSX.utils.book_new()

      // 1. Aba Dados Processados
      const dadosExportacao = this.dados.map((registro, idx) => {
        const item = {
          '#': idx + 1,
          'Código': registro.codigo_cliente ?? '',
          'Nome do Cliente': registro.nome_cliente ?? '',
          'Consultor': registro.consultor ?? '',
          'Segmento': registro.segmento ?? '',
          'Nível': registro.nivel_cliente ?? '',
          'Faturamento Anual':
            typeof registro.faturamento_anual === 'number'
              ? registro.faturamento_anual
              : (registro.faturamento_anual ?? ''),
          'Serviços Contratados': Array.isArray(registro.servicos_contratados)
            ? registro.servicos_contratados.join(', ')
            : (registro.servicos_contratados ?? ''),
          'Cidade': registro.cidade ?? '',
          'UF': registro.uf ?? ''
        }

        // Preserva colunas extras se houverem
        const chavesPadrao = new Set([
          'codigo_cliente',
          'nome_cliente',
          'consultor',
          'segmento',
          'nivel_cliente',
          'faturamento_anual',
          'servicos_contratados',
          'cidade',
          'uf'
        ])

        for (const [chave, valor] of Object.entries(registro)) {
          if (!chavesPadrao.has(chave)) {
            item[chave] = Array.isArray(valor) ? valor.join(', ') : (valor ?? '')
          }
        }

        return item
      })

      const wsDados = XLSX.utils.json_to_sheet(dadosExportacao)
      XLSX.utils.book_append_sheet(wb, wsDados, 'Dados Processados')

      // 2. Aba Resumo
      const resumo = [
        { Propriedade: 'Arquivo de Origem', Valor: this.arquivo?.name || 'arquivo.xlsx' },
        { Propriedade: 'Data/Hora do Processamento', Valor: new Date().toLocaleString('pt-BR') },
        { Propriedade: 'Total de Registros', Valor: this.dados.length },
        { Propriedade: 'Status da Validação', Valor: this.errosValidacao.length > 0 ? 'Concluído com apontamentos' : 'Concluído com sucesso' },
        { Propriedade: 'Total de Problemas Encontrados', Valor: this.errosValidacao.length }
      ]
      const wsResumo = XLSX.utils.json_to_sheet(resumo)
      XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo')

      // 3. Aba Problemas Encontrados (se houver)
      if (this.errosValidacao.length > 0) {
        const erros = this.errosValidacao.map((erro, index) => ({
          '#': index + 1,
          'Problema / Apontamento': erro
        }))
        const wsErros = XLSX.utils.json_to_sheet(erros)
        XLSX.utils.book_append_sheet(wb, wsErros, 'Problemas Encontrados')
      }

      const nomeBase = this.arquivo?.name
        ? this.arquivo.name.replace(/\.[^/.]+$/, '')
        : 'dados'
      const nomeArquivo = `relatorio_${nomeBase}_processado.xlsx`

      XLSX.writeFile(wb, nomeArquivo)
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
      this.processando = false
    }
  }
})
