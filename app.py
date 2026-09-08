import os
import tempfile
import time

from flask import Flask, render_template, request, jsonify

import whisper

app = Flask(__name__)

# --------------------------------------------------------------------------
# Configuração do modelo
# --------------------------------------------------------------------------
ALLOWED_MODELS = ["tiny", "base", "small", "medium"]
# Em produção (Railway) usa "tiny" por omissão: menos RAM, arranque mais
# rápido. Muda com a variável de ambiente WHISPER_MODEL se tiveres mais
# memória disponível.
CURRENT_MODEL_NAME = os.environ.get("WHISPER_MODEL", "tiny")

_model_cache = {}


def get_model(name: str):
    """Carrega o modelo pedido, reaproveitando modelos já carregados."""
    if name not in _model_cache:
        print(f"[whisper-chat] A carregar o modelo '{name}'... "
              f"(a primeira vez descarrega o modelo da internet)")
        _model_cache[name] = whisper.load_model(name)
        print(f"[whisper-chat] Modelo '{name}' pronto.")
    return _model_cache[name]


# NOTA: o modelo NÃO é carregado aqui no arranque (import) de propósito.
# Em Railway, o health check corre logo após o processo arrancar; se o
# download/carregamento do modelo demorar, o deploy pode ser marcado como
# falhado. O modelo carrega-se sozinho, em segundo plano, mal a app arranca
# (ver bloco no fim do ficheiro) e também fica disponível para pedidos
# feitos entretanto (o primeiro pedido apenas espera se ainda não acabou).


# --------------------------------------------------------------------------
# Rotas
# --------------------------------------------------------------------------
@app.route("/health")
def health():
    """Endpoint simples para o health check do Railway."""
    return jsonify({"status": "ok"})


@app.route("/")
def index():
    return render_template(
        "index.html",
        current_model=CURRENT_MODEL_NAME,
        models=ALLOWED_MODELS,
    )


@app.route("/transcribe", methods=["POST"])
def transcribe():
    global CURRENT_MODEL_NAME

    if "audio" not in request.files:
        return jsonify({"error": "Nenhum áudio foi recebido."}), 400

    audio_file = request.files["audio"]
    language = request.form.get("language") or None
    if language in ("auto", ""):
        language = None

    model_name = request.form.get("model", CURRENT_MODEL_NAME)
    if model_name not in ALLOWED_MODELS:
        model_name = CURRENT_MODEL_NAME

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
            audio_file.save(tmp.name)
            tmp_path = tmp.name

        model = get_model(model_name)

        start = time.time()
        result = model.transcribe(tmp_path, language=language, fp16=False)
        elapsed = time.time() - start

        return jsonify(
            {
                "text": result["text"].strip(),
                "language": result.get("language", "?"),
                "elapsed": round(elapsed, 2),
                "model": model_name,
            }
        )
    except Exception as exc:  # noqa: BLE001
        return jsonify({"error": str(exc)}), 500
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.route("/model-status")
def model_status():
    name = request.args.get("model", CURRENT_MODEL_NAME)
    return jsonify({"model": name, "ready": name in _model_cache})


@app.route("/preload-model", methods=["POST"])
def preload_model():
    """Permite à interface pré-carregar um modelo ao mudar de seletor."""
    data = request.get_json(silent=True) or {}
    name = data.get("model")
    if name not in ALLOWED_MODELS:
        return jsonify({"error": "Modelo inválido."}), 400
    get_model(name)
    return jsonify({"status": "ok", "model": name})


def _warm_up_in_background():
    """Carrega o modelo por omissão numa thread, sem bloquear o arranque
    do servidor (importante para o health check do Railway não expirar)."""
    import threading

    def _load():
        try:
            get_model(CURRENT_MODEL_NAME)
        except Exception as exc:  # noqa: BLE001
            print(f"[whisper-chat] Falha ao pré-carregar o modelo: {exc}")

    threading.Thread(target=_load, daemon=True).start()


_warm_up_in_background()


if __name__ == "__main__":
    # Em local: python app.py -> http://localhost:5000
    # Em Railway, quem arranca o processo é o gunicorn (ver Procfile),
    # este bloco só corre quando executas o ficheiro diretamente.
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)
