import { defineStore } from 'pinia'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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

  getters: {
    estatisticas: (state) => {
      const totalLinhas = state.dados.length
      if (totalLinhas === 0) {
        return null
      }

      const colunas = Object.keys(state.dados[0] || {}).filter(k => !k.startsWith('_'))
      const totalColunas = colunas.length

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

      const primeiraLinha = state.dados[0] || {}
      const colunasPresentes = colunasObrigatorias.filter(c => c in primeiraLinha)
      const colunasAusentes = colunasObrigatorias.filter(c => !(c in primeiraLinha))

      // Classificação de conflitos
      let conflitosDuplicidade = 0
      let conflitosCamposVazios = 0
      let conflitosNivelInvalido = 0
      let conflitosFaturamentoInvalido = 0

      for (const erro of state.errosValidacao) {
        if (erro.includes('duplicado')) conflitosDuplicidade++
        else if (erro.includes('é obrigatório')) conflitosCamposVazios++
        else if (erro.includes('nível') && erro.includes('inválido')) conflitosNivelInvalido++
        else if (erro.includes('faturamento') && erro.includes('inválido')) conflitosFaturamentoInvalido++
      }

      // Conflitos por linha
      let linhasComConflito = 0
      for (const reg of state.dados) {
        if (reg._problemas && reg._problemas.length > 0) {
          linhasComConflito++
        }
      }

      if (linhasComConflito === 0 && state.errosValidacao.length > 0) {
        const linhasComErro = new Set()
        for (const erro of state.errosValidacao) {
          const match = erro.match(/Linha (\d+):/)
          if (match) linhasComErro.add(match[1])
        }
        linhasComConflito = linhasComErro.size
      }

      const linhasValidas = Math.max(0, totalLinhas - linhasComConflito)
      const taxaConformidade = totalLinhas > 0 ? (linhasValidas / totalLinhas) * 100 : 100

      // Métricas de faturamento
      const faturamentos = state.dados
        .map(d => Number(d.faturamento_anual))
        .filter(f => !Number.isNaN(f) && f >= 0)

      const faturamentoTotal = faturamentos.reduce((acc, curr) => acc + curr, 0)
      const faturamentoMedio = faturamentos.length > 0 ? faturamentoTotal / faturamentos.length : 0
      const faturamentoMaximo = faturamentos.length > 0 ? Math.max(...faturamentos) : 0
      const faturamentoMinimo = faturamentos.length > 0 ? Math.min(...faturamentos) : 0

      // Distribuição por nível do cliente
      const contagemNivel = { A: 0, B: 0, C: 0, Outros: 0 }
      for (const reg of state.dados) {
        const n = String(reg.nivel_cliente || '').trim().toUpperCase()
        if (n === 'A') contagemNivel.A++
        else if (n === 'B') contagemNivel.B++
        else if (n === 'C') contagemNivel.C++
        else contagemNivel.Outros++
      }

      // Distribuição por segmento
      const contagemSegmento = {}
      for (const reg of state.dados) {
        const seg = reg.segmento || 'Não informado'
        contagemSegmento[seg] = (contagemSegmento[seg] || 0) + 1
      }

      // Distribuição por estado (UF)
      const contagemUF = {}
      for (const reg of state.dados) {
        const uf = reg.uf || 'Não informado'
        contagemUF[uf] = (contagemUF[uf] || 0) + 1
      }

      // Consultores distintos
      const consultores = new Set(
        state.dados
          .map(d => d.consultor)
          .filter(c => c && String(c).trim())
      )

      return {
        nomeArquivo: state.arquivo?.name || 'arquivo.xlsx',
        tamanhoArquivoBytes: state.arquivo?.size || 0,
        tamanhoArquivoFormatado: state.arquivo?.size
          ? `${(state.arquivo.size / 1024).toFixed(1)} KB`
          : '0 KB',
        dataProcessamento: new Date().toLocaleString('pt-BR'),
        totalLinhas,
        totalColunas,
        colunas,
        colunasObrigatoriasEsperadas: colunasObrigatorias.length,
        colunasPresentes: colunasPresentes.length,
        colunasAusentes,
        totalConflitos: state.errosValidacao.length,
        conflitosDuplicidade,
        conflitosCamposVazios,
        conflitosNivelInvalido,
        conflitosFaturamentoInvalido,
        linhasValidas,
        linhasComConflito,
        taxaConformidade: Number(taxaConformidade.toFixed(1)),
        faturamentoTotal,
        faturamentoMedio: Number(faturamentoMedio.toFixed(2)),
        faturamentoMaximo,
        faturamentoMinimo,
        contagemNivel,
        contagemSegmento,
        contagemUF,
        totalConsultores: consultores.size
      }
    }
  },

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
          const linha = index + 2
          registro._problemas = []

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
              const msg = `Linha ${linha}: ${coluna} é obrigatório.`
              this.errosValidacao.push(msg)
              registro._problemas.push(`Campo ${coluna} é obrigatório`)
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
            const msg = `Linha ${linha}: nível "${registro.nivel_cliente}" é inválido.`
            this.errosValidacao.push(msg)
            registro._problemas.push(`Nível "${registro.nivel_cliente}" inválido`)
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
            const msg = `Linha ${linha}: faturamento anual inválido.`
            this.errosValidacao.push(msg)
            registro._problemas.push('Faturamento anual inválido')
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
              const msg = `Linha ${linha}: código ${codigo} duplicado.`
              this.errosValidacao.push(msg)
              registro._problemas.push(`Código ${codigo} duplicado`)
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
            _problemas: registro._problemas || [],

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

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Título do relatório
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(15)
      doc.setTextColor(33, 37, 41)
      doc.text('Relatório de Processamento do Arquivo', 14, 16)

      // Linha divisória simples
      doc.setDrawColor(210, 215, 220)
      doc.setLineWidth(0.3)
      doc.line(14, 20, pageWidth - 14, 20)

      // Estatísticas básicas do arquivo
      const dataHora = new Date().toLocaleString('pt-BR')
      const totalLinhas = this.dados.length
      const colunas = Object.keys(this.dados[0] || {}).filter(k => !k.startsWith('_'))
      const totalConflitos = this.errosValidacao?.length || 0

      let linhasComProblema = 0
      this.dados.forEach(reg => {
        if (reg._problemas && reg._problemas.length > 0) {
          linhasComProblema++
        }
      })
      const linhasValidas = Math.max(0, totalLinhas - linhasComProblema)

      const dadosResumo = [
        [
          { content: 'Arquivo:', styles: { fontStyle: 'bold' } },
          this.arquivo?.name || 'arquivo.xlsx',
          { content: 'Total de linhas lidas:', styles: { fontStyle: 'bold' } },
          String(totalLinhas)
        ],
        [
          { content: 'Data da importação:', styles: { fontStyle: 'bold' } },
          dataHora,
          { content: 'Linhas sem problemas:', styles: { fontStyle: 'bold' } },
          `${linhasValidas} de ${totalLinhas}`
        ],
        [
          { content: 'Colunas carregadas:', styles: { fontStyle: 'bold' } },
          `${colunas.length} (${colunas.join(', ')})`,
          { content: 'Conflitos / problemas:', styles: { fontStyle: 'bold' } },
          totalConflitos > 0 ? `${totalConflitos} em ${linhasComProblema} linha(s)` : 'Nenhum'
        ]
      ]

      autoTable(doc, {
        startY: 23,
        margin: { left: 14, right: 14 },
        body: dadosResumo,
        theme: 'plain',
        styles: {
          fontSize: 8.5,
          cellPadding: 1.5,
          textColor: [45, 50, 55]
        },
        columnStyles: {
          0: { width: 38 },
          1: { width: 110 },
          2: { width: 44 },
          3: { width: 'auto' }
        }
      })

      let currentY = doc.lastAutoTable.finalY + 6

      // Tabela de Conflitos (se houver)
      if (totalConflitos > 0) {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10.5)
        doc.setTextColor(33, 37, 41)
        doc.text(`Problemas encontrados (${totalConflitos})`, 14, currentY)

        const conflitosBody = []
        this.dados.forEach((reg, index) => {
          if (reg._problemas && reg._problemas.length > 0) {
            reg._problemas.forEach(prob => {
              conflitosBody.push([
                index + 2,
                reg.codigo_cliente || '—',
                prob
              ])
            })
          }
        })

        if (conflitosBody.length === 0) {
          this.errosValidacao.forEach((erro, idx) => {
            conflitosBody.push([idx + 1, '—', erro])
          })
        }

        autoTable(doc, {
          startY: currentY + 2.5,
          margin: { left: 14, right: 14 },
          head: [['Linha', 'Código', 'Descrição do problema']],
          body: conflitosBody,
          theme: 'grid',
          headStyles: {
            fillColor: [240, 242, 245],
            textColor: [50, 50, 50],
            fontStyle: 'bold',
            fontSize: 7.5,
            cellPadding: 2,
            lineColor: [215, 220, 225]
          },
          styles: {
            fontSize: 7.5,
            cellPadding: 2,
            textColor: [50, 50, 50],
            lineColor: [225, 230, 235]
          },
          columnStyles: {
            0: { width: 16, halign: 'center' },
            1: { width: 30 },
            2: { width: 'auto' }
          }
        })

        currentY = doc.lastAutoTable.finalY + 8
      }

      // Se restar pouco espaço na folha, inicia a tabela de dados na próxima página
      if (currentY > pageHeight - 45) {
        doc.addPage()
        currentY = 16
      }

      // Tabela de Dados Processados
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(33, 37, 41)
      doc.text('Dados Processados', 14, currentY)

      const dadosBody = this.dados.map((registro, idx) => [
        idx + 1,
        registro.codigo_cliente || '—',
        registro.nome_cliente || '—',
        registro.consultor || '—',
        registro.segmento || '—',
        registro.nivel_cliente || '—',
        typeof registro.faturamento_anual === 'number'
          ? registro.faturamento_anual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : (registro.faturamento_anual || '—'),
        Array.isArray(registro.servicos_contratados)
          ? registro.servicos_contratados.join(', ')
          : (registro.servicos_contratados || '—'),
        [registro.cidade, registro.uf].filter(Boolean).join('/') || '—'
      ])

      autoTable(doc, {
        startY: currentY + 2.5,
        margin: { left: 14, right: 14, bottom: 12 },
        head: [['#', 'Código', 'Cliente', 'Consultor', 'Segmento', 'Nível', 'Faturamento (R$)', 'Serviços', 'Cidade/UF']],
        body: dadosBody,
        theme: 'grid',
        headStyles: {
          fillColor: [240, 242, 245],
          textColor: [40, 40, 40],
          fontStyle: 'bold',
          fontSize: 7.5,
          cellPadding: 2.5,
          lineColor: [210, 215, 220]
        },
        styles: {
          fontSize: 7.5,
          cellPadding: 2,
          textColor: [45, 50, 55],
          lineColor: [230, 232, 235]
        },
        alternateRowStyles: {
          fillColor: [250, 251, 252]
        },
        columnStyles: {
          0: { width: 10, halign: 'center' },
          1: { width: 24 },
          2: { width: 50 },
          3: { width: 36 },
          4: { width: 28 },
          5: { width: 14, halign: 'center' },
          6: { width: 32, halign: 'right' },
          7: { width: 45 },
          8: { width: 30 }
        }
      })

      // Numeração de páginas no rodapé
      const totalPaginas = doc.getNumberOfPages()
      for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(140, 140, 140)
        doc.text(`Página ${i} de ${totalPaginas}`, pageWidth - 14, pageHeight - 6, { align: 'right' })
      }

      const nomeBase = this.arquivo?.name
        ? this.arquivo.name.replace(/\.[^/.]+$/, '')
        : 'dados'
      const nomeArquivo = `relatorio_${nomeBase}.pdf`

      doc.save(nomeArquivo)
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
