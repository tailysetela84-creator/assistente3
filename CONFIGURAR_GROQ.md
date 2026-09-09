# Como Configurar Groq para Respostas Inteligentes

## 🚀 Passo 1: Obter API Key do Groq

1. Aceda a: https://console.groq.com
2. Clique em "Sign Up" ou "Login"
3. Crie uma conta gratuita
4. Vá a "API Keys" 
5. Clique em "Create API Key"
6. Copie a API key gerada

## 📝 Passo 2: Configurar no Projeto

### Opção A: Usar Variável de Ambiente (Recomendado)

1. **Criar arquivo .env:**
   - Copie `.env.example` para `.env`
   - Cole sua API key onde diz `sua_api_key_aqui`

2. **Ou definir no Windows:**
   ```powershell
   # PowerShell
   $env:GROQ_API_KEY="sua_api_key_aqui"
   
   # CMD
   set GROQ_API_KEY=sua_api_key_aqui
   ```

### Opção B: Modificar Diretamente no Código

1. Abra `app.py`
2. Procure a linha: `llm = get_llm("groq", api_key=os.environ.get("GROQ_API_KEY"))`
3. Substitua por: `llm = get_llm("groq", api_key="sua_api_key_aqui")`

## 🔧 Passo 3: Instalar Dependências

```powershell
cd "D:\P4oJ3C6T0xxs\P##ss0AisXXS\techstand\nova_cenas\whisper-chat"
pip install -r requirements.txt
```

## ▶️ Passo 4: Iniciar Aplicação

```powershell
python app.py
```

## 🎤 Passo 5: Testar

1. Abra http://127.0.0.1:5000
2. Conceda permissão do microfone
3. Fale: "Olá, como estás?"
4. **Resultado esperado:**
   - Transcrição: "Olá, como estás?"
   - Resposta: "Olá! Estou bem, e você?"
   - Áudio: Voz dizendo a resposta

## ✅ Verificar se Funciona

**Logs devem mostrar:**
```
[Groq] Disponível com modelo: llama3-8b-8192
[whisper-chat] Resposta LLM: Olá! Estou bem...
```

**Se não tiver API key:**
```
[Groq] Aviso: API key não fornecida
```

## 🔄 Voltar para Eco (Sem LLM)

Se quiser desativar o LLM temporariamente:

1. **No .env:**
   ```
   LLM_TYPE=none
   ```

2. **Ou no app.py:**
   ```python
   llm = None  # Comente a linha do get_llm
   ```

## 💡 Dicas

- **API key é gratuita:** Não precisa pagar
- **Limite generoso:** Bom para desenvolvimento
- **Muito rápido:** Respostas em milissegundos
- **Alta qualidade:** Llama 3 oficial da Meta

## 🆘 Problemas

**Erro: "Groq indisponível"**
- Verifique se a API key está correta
- Verifique se tem internet
- Verifique se a API key não expirou

**Erro: "Erro na API Groq"**
- Verifique seu limite de uso
- Tente novamente em alguns minutos
- Verifique se a API key está ativa

**Sistema repete o que você diz:**
- LLM não está disponível
- Verifique os logs para mais detalhes
- Confirme que a API key está configurada

---

**Pronto para usar!** 🚀