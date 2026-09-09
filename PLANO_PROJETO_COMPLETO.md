# Whisper Chat - Plano de Projeto Completo

**Projeto:** Sistema de Transcrição por Voz com IA Conversacional e Suporte Changana  
**Caminho do Projeto:** `D:\P4oJ3C6T0xxs\P##ss0AisXXS\techstand\nova_cenas\whisper-chat`  
**Data Inicial:** 07/09/2026  
**Última Atualização:** 09/09/2026

---

## 📋 Índice

1. [Resumo Executivo](#resumo-executivo)
2. [O Que Já Foi Feito](#o-que-já-foi-feito)
3. [O Que Ainda Deve Ser Feito](#o-que-ainda-deve-ser-feito)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Cronograma de Implementação](#cronograma-de-implementação)
6. [Recursos e Documentação](#recursos-e-documentação)

---

## 🎯 Resumo Executivo

### Objetivo do Projeto
Criar um sistema de transcrição por voz que:
- Transcreve áudio em português usando Whisper
- Responde com voz usando TTS
- Funciona 100% offline com modelos locais
- Suporta língua Changana (Tsonga) de Moçambique
- Usa documentos personalizados como base de conhecimento (RAG)
- Permite tradução entre português e Changana

### Status Atual
- ✅ **Funcionalidades básicas implementadas** (transcrição + TTS)
- ✅ **Deploy no Railway configurado**
- ✅ **Estrutura para TTS Changana criada**
- 🔄 **Em desenvolvimento:** Sistema RAG + LLM local
- ⏳ **Pendente:** Treino de modelo TTS Changana

---

## ✅ O Que Já Foi Feito

### 1. Sistema Básico de Transcrição (Implementado)

#### Funcionalidades Ativas
- ✅ **Transcrição por voz** usando Whisper da OpenAI
- ✅ **Resposta de voz** usando gTTS (Google Text-to-Speech)
- ✅ **Interface web** estilo chat
- ✅ **Suporte multilíngue** (português, inglês, etc.)
- ✅ **Histórico de gravações** com reprodução
- ✅ **Deploy no Railway** configurado

#### Arquivos Modificados/Criados
- `app.py` - Aplicação Flask principal com TTS
- `requirements.txt` - Dependências atualizadas (inclui gtts)
- `static/script.js` - Frontend atualizado para reproduzir áudio
- `nixpacks.toml` - Configuração Railway com ffmpeg
- `Procfile` - Configuração gunicorn para produção
- `README.md` - Documentação original
- `DOCUMENTACAO.md` - Documentação completa em português

#### Deploy
- ✅ Repositório GitHub: https://github.com/tailysetela84-creator/assistente3
- ✅ Railway configurado para deploy automático
- ✅ FFmpeg configurado para instalação automática no Railway
- ✅ Sistema funcional localmente (após configuração ffmpeg)

### 2. Documentação Técnica (Criada)

#### Documentos Disponíveis
- ✅ `DOCUMENTACAO.md` - Guia completo de instalação e uso
- ✅ `PLANO_PROJETO_COMPLETO.md` - Este documento
- ✅ Documentação de tecnologias utilizadas
- ✅ Guias de instalação local e Railway

#### Conteúdo da Documentação
- Requisitos do sistema
- Instalação local (Windows, macOS, Linux)
- Instalação do FFmpeg
- Como usar a aplicação
- Funcionalidades disponíveis
- Deploy no Railway
- Personalização
- Solução de problemas
- Estrutura do projeto
- Tecnologias utilizadas (detalhado)

### 3. Estrutura para TTS Changana (Criada)

#### Diretórios Criados
```
tts_changana/
├── dataset/
│   └── fase1_basico/
│       ├── audio/              # Pronto para receber áudios .wav
│       └── transcriptions/     # Pronto para receber frases.txt e metadata.csv
├── models/                     # Pronto para modelos treinados
├── scripts/                    # Pronto para scripts Python
├── config/                     # Pronto para configurações
└── results/
    ├── audio_samples/          # Pronto para amostras geradas
    └── evaluations/            # Pronto para avaliações
```

#### Status
- ✅ Estrutura de diretórios criada
- ⏳ Arquivos de dados ainda não criados
- ⏳ Scripts de treino ainda não criados
- ⏳ Modelos ainda não treinados

### 4. Planejamento de Arquitetura (Definido)

#### Sistema Planeado
- ✅ **LLM Local:** Ollama + Llama 3 (gratuito, offline)
- ✅ **Sistema RAG:** LangChain + ChromaDB (baseado em documentos)
- ✅ **Tradução Changana:** Sistema híbrido (dicionário + LLM)
- ✅ **TTS Changana:** Modelo próprio treinado incrementalmente

#### Tecnologias Definidas
- **LLM:** Ollama com Llama 3 8B
- **RAG:** LangChain + ChromaDB + Sentence Transformers
- **TTS:** Coqui TTS (para treino modelo Changana)
- **Processamento de documentos:** PyPDF, python-docx
- **Embeddings:** paraphrase-multilingual-MiniLM-L12-v2

### 5. Análise de Requisitos (Concluída)

#### Hardware Identificado
- **Mínimo:** 4 cores CPU, 8GB RAM, 20GB armazenamento
- **Recomendado:** 8+ cores CPU, 16GB+ RAM, 50GB armazenamento
- **Ideal:** 16+ cores CPU, 32GB+ RAM, GPU NVIDIA 8GB+, 100GB SSD

#### Software Necessário
- Python 3.9-3.12
- FFmpeg (já configurado localmente)
- Ollama (para LLM local)
- Dependências Python (definidas)

---

## 🔄 O Que Ainda Deve Ser Feito

### Fase 1: Preparação do Dataset Changana (Imediato)

#### 1.1 Criar Arquivos de Dados
- ⏳ Criar `frases.txt` com 50 frases básicas em Changana
- ⏳ Criar template de `metadata.csv`
- ⏳ Criar scripts de validação

#### 1.2 Gravação de Áudios
- ⏳ Instalar Audacity (ou usar software existente)
- ⏳ Gravar 50 frases básicas em Changana
- ⏳ Salvar como .wav (44100 Hz, 16-bit, Mono)
- ⏳ Organizar na pasta `tts_changana/dataset/fase1_basico/audio/`

#### 1.3 Validação do Dataset
- ⏳ Verificar qualidade dos áudios
- ⏳ Criar arquivo metadata.csv com durações
- ⏳ Validar correspondência áudio-transcrição
- ⏳ Garantir 50 frases completas

### Fase 2: Sistema RAG + LLM Local (Curto Prazo)

#### 2.1 Instalação de Dependências
- ⏳ Instalar Ollama
- ⏳ Baixar modelo Llama 3 8B
- ⏳ Instalar dependências Python (LangChain, ChromaDB, etc.)
- ⏳ Testar LLM básico

#### 2.2 Sistema RAG Básico
- ⏳ Criar scripts de processamento de documentos
- ⏳ Implementar sistema ChromaDB
- ⏳ Criar scripts de geração de embeddings
- ⏳ Testar com documentos de exemplo

#### 2.3 Integração no App Principal
- ⏳ Modificar `app.py` para integrar LLM
- ⏳ Implementar sistema de tradução
- ⏳ Atualizar frontend para mostrar transcrição + resposta
- ⏳ Testar fluxo completo

#### 2.4 Documentos de Conhecimento
- ⏳ Coletar documentos Changana (cultura, história, etc.)
- ⏳ Preparar documentos em PDF/DOCX/TXT
- ⏳ Processar e indexar no ChromaDB
- ⏳ Testar consultas RAG

### Fase 3: Treino TTS Changana (Médio Prazo)

#### 3.1 Preparação para Treino
- ⏳ Completar dataset de 50 frases (Fase 1)
- ⏳ Preparar dataset para treino Coqui TTS
- ⏳ Criar arquivos de configuração
- ⏳ Instalar Coqui TTS e dependências

#### 3.2 Treino Inicial (Fase 1)
- ⏳ Treinar modelo básico com 50 frases
- ⏳ Avaliar qualidade do modelo
- ⏳ Testar geração de áudio
- ⏳ Ajustar parâmetros se necessário

#### 3.3 Expansão do Dataset (Fase 2)
- ⏳ Gravar 150 frases adicionais (total: 200)
- ⏳ Combinar datasets Fase 1 + Fase 2
- ⏳ Continuar treino do modelo existente
- ⏳ Avaliar melhorias

#### 3.4 Modelo Completo (Fase 3)
- ⏳ Gravar 300+ frases avançadas (total: 500+)
- ⏳ Treinar modelo completo
- ⏳ Otimizar performance
- ⏳ Integrar no sistema principal

### Fase 4: Sistema de Tradução (Integrado)

#### 4.1 Dicionário Changana
- ⏳ Criar dicionário estruturado JSON
- ⏳ Adicionar vocabulário básico (50-100 palavras)
- ⏳ Implementar classe ChanganaDictionary
- ⏳ Testar traduções básicas

#### 4.2 Sistema Híbrido
- ⏳ Implementar HybridTranslator
- ⏳ Integrar dicionário + LLM
- ⏳ Criar prompts de tradução
- ⏳ Testar tradução bidirecional

#### 4.3 Interface de Configuração
- ⏳ Adicionar settings no frontend
- ⏳ Implementar preferências de idioma
- ⏳ Testar diferentes modos de resposta
- ⏳ Documentar opções

### Fase 5: Otimização e Melhoria (Longo Prazo)

#### 5.1 Performance
- ⏳ Otimizar velocidade de resposta
- ⏳ Melhorar qualidade de áudio
- ⏳ Reduzir uso de memória
- ⏳ Otimizar para diferentes hardwares

#### 5.2 Funcionalidades Avançadas
- ⏳ Implementar memória de conversação
- ⏳ Adicionar personalidade ao assistente
- ⏳ Suporte a múltiplos usuários
- ⏳ Sistema de feedback

#### 5.3 Expansão de Documentos
- ⏳ Coletar mais documentos Changana
- ⏳ Adicionar documentos de outros tópicos
- ⏳ Melhorar qualidade do corpus
- ⏳ Atualizar base de conhecimento regularmente

---

## 📁 Estrutura do Projeto

### Estrutura Atual
```
whisper-chat/
├── app.py                          # ✅ Aplicação Flask principal
├── requirements.txt                # ✅ Dependências Python
├── Procfile                        # ✅ Configuração Railway
├── nixpacks.toml                  # ✅ Configuração build Railway
├── README.md                       # ✅ Documentação original
├── DOCUMENTACAO.md                 # ✅ Documentação completa
├── PLANO_PROJETO_COMPLETO.md       # ✅ Este documento
├── .gitignore                      # ✅ Ficheiros ignorados
├── static/                         # ✅ Ficheiros estáticos
│   ├── style.css                   # ✅ Estilos CSS
│   └── script.js                   # ✅ JavaScript frontend
├── templates/                      # ✅ Templates HTML
│   └── index.html                  # ✅ Página principal
└── tts_changana/                   # ✅ Estrutura TTS Changana
    ├── dataset/                    # ✅ Dataset de treino
    │   └── fase1_basico/           # ✅ Fase 1 básica
    │       ├── audio/              # ✅ Pasta para áudios
    │       └── transcriptions/     # ✅ Pasta para transcrições
    ├── models/                     # ✅ Pasta para modelos
    ├── scripts/                    # ✅ Pasta para scripts
    ├── config/                     # ✅ Pasta para configurações
    └── results/                    # ✅ Pasta para resultados
        ├── audio_samples/          # ✅ Amostras de áudio
        └── evaluations/            # ✅ Avaliações
```

### Estrutura Planeada (Futuro)
```
whisper-chat/
├── app.py                          # Modificado para LLM + RAG
├── requirements.txt                # Atualizado com novas dependências
├── tts_changana/                   # Expandido
│   ├── dataset/                    # Com dados
│   │   ├── fase1_basico/           # ✅ Criado, pendente dados
│   │   ├── fase2_expandido/        # ⏳ Criar
│   │   └── fase3_completo/         # ⏳ Criar
│   ├── models/                     # Com modelos treinados
│   │   ├── fase1_model.pth         # ⏳ Treinar
│   │   ├── fase2_model.pth         # ⏳ Treinar
│   │   └── fase3_model.pth         # ⏳ Treinar
│   ├── scripts/                    # Com scripts Python
│   │   ├── prepare_dataset.py      # ⏳ Criar
│   │   ├── train_tts.py           # ⏳ Criar
│   │   ├── test_tts.py            # ⏳ Criar
│   │   ├── rag_system.py          # ⏳ Criar
│   │   └── llm_integration.py      # ⏳ Criar
│   ├── config/                     # Com configurações
│   │   ├── config_fase1.json      # ⏳ Criar
│   │   ├── config_fase2.json      # ⏳ Criar
│   │   └── config_fase3.json      # ⏳ Criar
│   └── results/                    # Com resultados
│       ├── audio_samples/          # Com amostras
│       └── evaluations/            # Com avaliações
├── documents/                     # ⏳ Criar - Base de conhecimento
│   ├── changana/                   # ⏳ Criar
│   │   ├── cultura.pdf
│   │   ├── historia.docx
│   │   └── vocabulario.txt
│   └── portugues/                 # ⏳ Criar
│       └── gramatica.pdf
└── knowledge_base/                 # ⏳ Criar - ChromaDB
    └── chroma.sqlite3
```

---

## 📅 Cronograma de Implementação

### Semana 1-2: Preparação Dataset Changana
- ✅ Criar estrutura de diretórios
- ⏳ Criar arquivo frases.txt (50 frases)
- ⏳ Instalar Audacity
- ⏳ Gravar 50 áudios em Changana
- ⏳ Criar metadata.csv
- ⏳ Validar dataset

### Semana 3-4: Setup LLM Local
- ⏳ Instalar Ollama
- ⏳ Baixar Llama 3 8B
- ⏳ Instalar dependências Python
- ⏳ Testar LLM básico
- ⏳ Criar estrutura de documentos

### Semana 5-6: Sistema RAG Básico
- ⏳ Implementar processamento de documentos
- ⏳ Criar sistema ChromaDB
- ⏳ Implementar geração de embeddings
- ⏳ Testar RAG básico
- ⏳ Integrar no app.py

### Semana 7-8: Treino TTS Fase 1
- ⏳ Preparar dataset para treino
- ⏳ Instalar Coqui TTS
- ⏳ Treinar modelo básico (50 frases)
- ⏳ Avaliar qualidade
- ⏳ Testar integração

### Semana 9-10: Sistema de Tradução
- ⏳ Criar dicionário Changana
- ⏳ Implementar tradutor híbrido
- ⏳ Testar traduções
- ⏳ Integrar no sistema

### Semana 11-12: Expansão e Otimização
- ⏳ Gravar 150 frases adicionais
- ⏳ Retreinar modelo TTS
- ⏳ Otimizar performance
- ⏳ Documentar sistema completo

### Mês 3-6: Melhoria Contínua
- ⏳ Gravar 300+ frases avançadas
- ⏳ Treinar modelo completo
- ⏳ Adicionar mais documentos
- ⏳ Melhorar qualidade
- ⏳ Coletar feedback

---

## 📚 Recursos e Documentação

### Documentos Disponíveis
- ✅ `README.md` - Documentação original do projeto
- ✅ `DOCUMENTACAO.md` - Guia completo em português
- ✅ `PLANO_PROJETO_COMPLETO.md` - Este documento (guia geral)

### Recursos Externos
- **Whisper OpenAI:** https://github.com/openai/whisper
- **Railway:** https://railway.app
- **Ollama:** https://ollama.ai
- **Coqui TTS:** https://github.com/coqui-ai/TTS
- **LangChain:** https://langchain.com
- **ChromaDB:** https://docs.trychroma.com

### GitHub
- **Repositório:** https://github.com/tailysetela84-creator/assistente3
- **Branch:** main
- **Status:** Ativo e funcional

### Links Úteis
- **Documentação Whisper:** https://github.com/openai/whisper/blob/main/README.md
- **Guia FFmpeg:** https://ffmpeg.org/documentation.html
- **Instalação Ollama:** https://ollama.ai/download
- **Documentação LangChain:** https://python.langchain.com

---

## 🎯 Próximos Passos Imediatos

### Hoje (Ação Imediata)
1. ⏳ Criar arquivo `frases.txt` com 50 frases Changana
2. ⏳ Instalar Audacity (se necessário)
3. ⏳ Começar gravação dos primeiros áudios

### Esta Semana
1. ⏳ Completar gravação das 50 frases
2. ⏳ Criar metadata.csv
3. ⏳ Validar dataset completo
4. ⏳ Preparar para instalação Ollama

### Próxima Semana
1. ⏳ Instalar Ollama e Llama 3
2. ⏳ Instalar dependências Python para RAG
3. ⏳ Criar primeiros scripts de processamento
4. ⏳ Testar LLM básico

---

## 📊 Status por Componente

| Componente | Status | Progresso | Próxima Ação |
|------------|--------|-----------|--------------|
| **Transcrição Whisper** | ✅ Completo | 100% | - |
| **TTS Básico (gTTS)** | ✅ Completo | 100% | - |
| **Interface Web** | ✅ Completo | 100% | - |
| **Deploy Railway** | ✅ Completo | 100% | - |
| **Documentação** | ✅ Completo | 100% | - |
| **Estrutura TTS Changana** | ✅ Completo | 100% | - |
| **Dataset Changana Fase 1** | ⏳ Iniciado | 10% | Gravar áudios |
| **LLM Local (Ollama)** | ⏳ Pendente | 0% | Instalar Ollama |
| **Sistema RAG** | ⏳ Pendente | 0% | Implementar |
| **Tradução Changana** | ⏳ Pendente | 0% | Criar dicionário |
| **Treino TTS Fase 1** | ⏳ Pendente | 0% | Preparar dataset |
| **Integração Completa** | ⏳ Pendente | 0% | Implementar |

---

## 🎯 Objetivos por Fase

### Fase 1: Fundação (Concluída)
- ✅ Sistema básico de transcrição funcional
- ✅ TTS básico implementado
- ✅ Deploy na nuvem configurado
- ✅ Documentação completa

### Fase 2: Inteligência (Em Progresso)
- ⏳ LLM local funcional
- ⏳ Sistema RAG implementado
- ⏳ Respostas baseadas em documentos
- ⏳ Tradução básica

### Fase 3: Changana (Planeado)
- ⏳ Dataset Changana completo
- ⏳ Modelo TTS Changana treinado
- ⏳ Tradução Changana ↔ Português
- ⏳ Suporte cultural específico

### Fase 4: Excelência (Futuro)
- ⏳ Modelo TTS Changana avançado
- ⏳ Sistema otimizado
- ⏳ Funcionalidades avançadas
- ⏳ Expansão contínua

---

## 📝 Notas Importantes

### Decisões Técnicas
- **LLM Local:** Escolhido Ollama + Llama 3 por ser gratuito e offline
- **RAG:** LangChain + ChromaDB por ser open source e eficiente
- **TTS Changana:** Coqui TTS por ser melhor para línguas específicas
- **Abordagem Incremental:** Treino TTS em fases para gerir complexidade

### Limitações Atuais
- ⚠️ gTTS não tem suporte nativo para Changana
- ⚠️ Whisper não transcreve Changana bem
- ⚠️ Requer hardware potente para modelos locais
- ⚠️ Treino TTS requer tempo e recursos

### Soluções Planeadas
- ✅ Fallback para português no TTS
- ✅ Sistema híbrido de tradução
- ✅ Dataset incremental para TTS
- ✅ Uso de GPU se disponível

---

## 🚀 Conclusão

Este projeto representa um sistema completo de transcrição por voz com IA conversacional, com foco especial na língua Changana de Moçambique. A abordagem incremental permite começar com funcionalidades básicas e expandir gradualmente para capacidades avançadas.

### Pontos Fortes
- ✅ Sistema funcional e testado
- ✅ Documentação completa
- ✅ Arquitetura escalável
- ✅ Foco em línguas africanas sub-representadas
- ✅ Abordagem offline para privacidade

### Desafios
- ⚠️ Requer recursos computacionais significativos
- ⚠️ Treino de modelos TTS é complexo
- ⚠️ Escassez de recursos para Changana
- ⚠️ Tempo de implementação extenso

### Próximos Passos Imediatos
1. Completar dataset Changana Fase 1
2. Instalar e configurar Ollama
3. Implementar sistema RAG básico
4. Iniciar treino TTS Changana

---

**Documento atualizado em:** 09/09/2026  
**Versão:** 1.0  
**Status:** Em desenvolvimento ativo