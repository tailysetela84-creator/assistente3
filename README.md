# Whisper Chat — dashboard de transcrição por voz

Uma interface de chat local (estilo conversa, semelhante ao fluxo do
character.ai) para o [Whisper](https://github.com/openai/whisper) da OpenAI:
falas para o microfone e a transcrição aparece na conversa como resposta,
com o histórico das tuas gravações (podes voltar a ouvi-las).

Tudo corre no teu computador — nenhum áudio é enviado para fora da tua
máquina.

## 1. Requisitos

- Python 3.9–3.11
- [`ffmpeg`](https://ffmpeg.org/) instalado no sistema
- Um microfone e um browser moderno (Chrome, Edge ou Firefox)

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# macOS (Homebrew)
brew install ffmpeg

# Windows (Chocolatey)
choco install ffmpeg
```

## 2. Instalação

Coloca esta pasta (`whisper-chat`) ao lado da pasta `whisper-main` que já
tinhas, ou em qualquer lugar — não é preciso estarem juntas, basta que o
pacote `whisper` esteja instalado no teu ambiente Python.

```bash
cd whisper-chat
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

Isto instala o Flask e o pacote `openai-whisper` (via PyPI). Se preferires
usar exatamente o código-fonte que já descarregaste em `whisper-main/`
(por exemplo porque o alteraste), instala-o a partir de lá em vez do PyPI:

```bash
pip install flask
pip install -e ../whisper-main
```

## 3. Arrancar

```bash
python app.py
```

Na primeira vez que um modelo é usado, o Whisper descarrega os pesos
automaticamente (precisa de internet nesse momento; depois fica em cache
local em `~/.cache/whisper`). Isto pode demorar alguns minutos consoante o
modelo escolhido.

Abre depois:

```
http://localhost:5000
```

O browser vai pedir permissão para usar o microfone — aceita.

> Nota: a captura de microfone só funciona em `localhost` ou em páginas
> HTTPS. Se acederes de outro dispositivo na rede (ex.: telemóvel), vais
> precisar de HTTPS ou de um túnel (ex. `ngrok`).

## 4. Como usar

1. Escolhe o modelo (`tiny` é o mais rápido, `medium` o mais preciso) e o
   idioma da fala na barra lateral.
2. Prime o botão circular do microfone para começar a gravar — vais ver a
   onda a reagir à tua voz.
3. Prime outra vez para parar. A tua gravação aparece na conversa e, em
   poucos segundos, a transcrição surge por baixo.
4. Podes voltar a ouvir qualquer gravação clicando no botão de reprodução
   ao lado da onda.
5. "Limpar conversa" apaga o histórico visível (não apaga nada em disco).

## 5. Personalizar

- **Modelos disponíveis**: edita `ALLOWED_MODELS` em `app.py`. Modelos
  maiores (`small`, `medium`) são mais precisos mas mais lentos sem GPU.
- **Idiomas do seletor**: edita a lista `<select id="lang-select">` em
  `templates/index.html`.
- **Aparência**: cores e tipografia estão centralizadas em `:root` no
  topo de `static/style.css`.

## 6. Problemas comuns (local)

| Sintoma | Causa provável |
|---|---|
| "Não foi possível aceder ao microfone" | Permissão negada no browser, ou não estás em `localhost`/HTTPS |
| Erro a transcrever mencionando `ffmpeg` | `ffmpeg` não está instalado ou não está no `PATH` |
| Primeira transcrição muito lenta | O modelo está a ser descarregado/carregado — as seguintes são rápidas |
| Fica lento em cada gravação | Modelo grande a correr em CPU — experimenta `tiny` ou `base` |

## 7. Publicar no GitHub e no Railway

O projeto já vem pronto para deploy: `Procfile` (comando de arranque com
`gunicorn`), `nixpacks.toml` (garante que o `ffmpeg` é instalado no
servidor) e `requirements.txt` com tudo o que é preciso.

### 7.1 GitHub

```bash
cd whisper-chat
git init
git add .
git commit -m "Whisper Chat dashboard"
git branch -M main
git remote add origin https://github.com/<o-teu-utilizador>/whisper-chat.git
git push -u origin main
```

### 7.2 Railway

1. Em [railway.app](https://railway.app), **New Project → Deploy from GitHub
   repo** e escolhe o repositório que acabaste de criar.
2. O Railway deteta automaticamente que é uma app Python (Nixpacks) e usa o
   `Procfile` para arrancar com `gunicorn`. Não precisas de configurar mais
   nada para o build funcionar.
3. Em **Settings → Networking**, gera um domínio público (*Generate
   Domain*). O Railway dá-te sempre HTTPS, o que é importante: o browser só
   deixa gravar do microfone em `localhost` ou em páginas HTTPS.
4. (Opcional) Em **Variables**, podes definir:
   - `WHISPER_MODEL` — `tiny` (omissão, mais leve), `base`, `small` ou
     `medium`. Fica atento à memória do plano que estás a usar (ver abaixo).
5. Faz deploy. No separador **Deployments → Logs** vais ver as linhas
   `[whisper-chat] A carregar o modelo...` — é normal demorar um pouco na
   primeira vez, o modelo é descarregado no servidor nesse momento.

### 7.3 Notas importantes sobre o plano Railway

- **Memória**: o Whisper corre em CPU no Railway (sem GPU). Os requisitos
  de RAM seguem aproximadamente os "VRAM" indicados no repositório
  original: `tiny` (~1GB), `base` (~1GB), `small` (~2GB), `medium` (~5GB).
  Começa com `tiny` ou `base` para caberes confortavelmente num plano
  gratuito/starter; só sobe de modelo se tiveres um plano com mais RAM.
- **Armazenamento**: o Railway usa disco efémero — os pesos do modelo
  descarregados ficam em cache só até ao próximo deploy/reinício, altura
  em que são descarregados de novo automaticamente. Isto é normal e não
  precisa de nenhuma ação da tua parte.
- **Um único worker**: o `Procfile` usa `--workers 1` de propósito, para o
  modelo ficar carregado só uma vez em memória. Se precisares de mais
  capacidade, aumenta antes `--threads` ou o plano do Railway, em vez do
  número de workers.
- **Tempo de arranque**: o modelo carrega em segundo plano (não bloqueia o
  health check), mas a *primeira* transcrição depois de um deploy pode
  demorar mais enquanto o carregamento termina — a interface mostra
  "a preparar…" nesse período.
