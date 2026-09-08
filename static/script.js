(() => {
  "use strict";

  const MODEL_SPECS = {
    tiny:   { params: "39M",  speed: "~10x" },
    base:   { params: "74M",  speed: "~7x"  },
    small:  { params: "244M", speed: "~4x"  },
    medium: { params: "769M", speed: "~2x"  },
  };

  const els = {
    modelSelect: document.getElementById("model-select"),
    langSelect: document.getElementById("lang-select"),
    miParams: document.getElementById("mi-params"),
    miSpeed: document.getElementById("mi-speed"),
    miStatus: document.getElementById("mi-status"),
    clearBtn: document.getElementById("clear-btn"),
    messages: document.getElementById("messages"),
    emptyState: document.getElementById("empty-state"),
    composerStatus: document.getElementById("composer-status"),
    micBtn: document.getElementById("mic-btn"),
    micTimer: document.getElementById("mic-timer"),
    cancelBtn: document.getElementById("cancel-btn"),
    liveWave: document.getElementById("live-wave"),
    turnTemplate: document.getElementById("turn-template"),
    player: document.getElementById("player"),
  };

  let mediaRecorder = null;
  let audioChunks = [];
  let recording = false;
  let recordStart = 0;
  let timerInterval = null;
  let audioCtx, analyser, sourceNode, rafId;
  let cancelled = false;
  let currentlyPlayingBtn = null;

  // -------------------------------------------------------------------
  // Sidebar: modelo / idioma
  // -------------------------------------------------------------------
  function updateModelInfo(name) {
    const spec = MODEL_SPECS[name] || { params: "?", speed: "?" };
    els.miParams.textContent = spec.params;
    els.miSpeed.textContent = spec.speed;
  }

  updateModelInfo(els.modelSelect.value);

  // No arranque, o modelo por omissão carrega em segundo plano no servidor
  // (importante em Railway). Enquanto não estiver pronto, avisa na UI.
  async function pollModelStatus(name) {
    els.miStatus.textContent = "a preparar…";
    els.miStatus.className = "status-busy";
    els.composerStatus.textContent = `A preparar o modelo "${name}"…`;
    for (let i = 0; i < 150; i++) {
      try {
        const res = await fetch(`/model-status?model=${encodeURIComponent(name)}`);
        const data = await res.json();
        if (data.ready) break;
      } catch (e) {
        break;
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
    els.miStatus.textContent = "pronto";
    els.miStatus.className = "status-ready";
    els.composerStatus.textContent = "Pronto para ouvir";
  }
  pollModelStatus(els.modelSelect.value);

  els.modelSelect.addEventListener("change", async () => {
    const name = els.modelSelect.value;
    updateModelInfo(name);
    els.miStatus.textContent = "a carregar…";
    els.miStatus.className = "status-busy";
    els.composerStatus.textContent = `A preparar o modelo "${name}"…`;
    try {
      await fetch("/preload-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: name }),
      });
    } catch (e) {
      // ignora - erro será mostrado na próxima transcrição
    }
    els.miStatus.textContent = "pronto";
    els.miStatus.className = "status-ready";
    els.composerStatus.textContent = "Pronto para ouvir";
  });

  els.clearBtn.addEventListener("click", () => {
    els.messages.querySelectorAll(".turn").forEach((t) => t.remove());
    els.emptyState.style.display = "";
  });

  // -------------------------------------------------------------------
  // Gravação
  // -------------------------------------------------------------------
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  async function startRecording() {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      els.composerStatus.textContent =
        "Não foi possível aceder ao microfone. Verifica as permissões do browser.";
      return;
    }

    cancelled = false;
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.addEventListener("dataavailable", (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      stream.getTracks().forEach((t) => t.stop());
      stopWave();
      if (cancelled) return;
      const blob = new Blob(audioChunks, { type: "audio/webm" });
      const duration = (Date.now() - recordStart) / 1000;
      handleNewRecording(blob, duration);
    });

    mediaRecorder.start();
    recording = true;
    recordStart = Date.now();

    els.micBtn.classList.add("recording");
    els.cancelBtn.classList.add("visible");
    els.composerStatus.textContent = "A ouvir… fala à vontade";

    timerInterval = setInterval(() => {
      const elapsed = (Date.now() - recordStart) / 1000;
      els.micTimer.textContent = formatTime(elapsed);
    }, 200);

    startWave(stream);
  }

  function stopRecording(isCancel) {
    if (!mediaRecorder || !recording) return;
    cancelled = !!isCancel;
    recording = false;
    clearInterval(timerInterval);
    els.micBtn.classList.remove("recording");
    els.cancelBtn.classList.remove("visible");
    els.micTimer.textContent = "0:00";
    els.composerStatus.textContent = cancelled ? "Gravação cancelada" : "A transcrever…";
    mediaRecorder.stop();
  }

  els.micBtn.addEventListener("click", () => {
    if (recording) {
      stopRecording(false);
    } else {
      startRecording();
    }
  });

  els.cancelBtn.addEventListener("click", () => stopRecording(true));

  // -------------------------------------------------------------------
  // Visualização de onda ao vivo
  // -------------------------------------------------------------------
  function startWave(stream) {
    els.liveWave.classList.add("active");
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    sourceNode = audioCtx.createMediaStreamSource(stream);
    sourceNode.connect(analyser);

    const ctx = els.liveWave.getContext("2d");
    const data = new Uint8Array(analyser.frequencyBinCount);
    const W = els.liveWave.width, H = els.liveWave.height;

    function draw() {
      rafId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      ctx.clearRect(0, 0, W, H);
      const barCount = 28;
      const gap = 3;
      const barWidth = (W - gap * (barCount - 1)) / barCount;
      ctx.fillStyle = "#eda941";
      for (let i = 0; i < barCount; i++) {
        const v = data[Math.floor((i / barCount) * data.length)] / 255;
        const h = Math.max(3, v * H);
        const x = i * (barWidth + gap);
        const y = (H - h) / 2;
        ctx.fillRect(x, y, barWidth, h);
      }
    }
    draw();
  }

  function stopWave() {
    els.liveWave.classList.remove("active");
    if (rafId) cancelAnimationFrame(rafId);
    if (sourceNode) sourceNode.disconnect();
    if (audioCtx) audioCtx.close();
  }

  // -------------------------------------------------------------------
  // Envio para o backend + render da conversa
  // -------------------------------------------------------------------
  function randomBarHeights(n) {
    return Array.from({ length: n }, () => 4 + Math.round(Math.random() * 14));
  }

  function handleNewRecording(blob, duration) {
    els.emptyState.style.display = "none";

    const node = els.turnTemplate.content.cloneNode(true);
    const turn = node.querySelector(".turn");
    const playBtn = node.querySelector(".play-btn");
    const waveBars = node.querySelectorAll(".turn-wave i");
    const durationEl = node.querySelector(".turn-duration");
    const transcriptText = node.querySelector(".transcript-text");
    const transcriptMeta = node.querySelector(".transcript-meta");

    const heights = randomBarHeights(waveBars.length);
    waveBars.forEach((bar, i) => (bar.style.height = `${heights[i]}px`));
    durationEl.textContent = formatTime(duration);

    const objectUrl = URL.createObjectURL(blob);
    playBtn.addEventListener("click", () => togglePlay(playBtn, objectUrl));

    transcriptText.classList.add("pending");
    transcriptText.innerHTML =
      'a transcrever<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';

    els.messages.appendChild(node);
    els.messages.scrollTop = els.messages.scrollHeight;

    submitAudio(blob).then(({ ok, data }) => {
      transcriptText.classList.remove("pending");
      if (!ok) {
        transcriptText.textContent = `Não foi possível transcrever: ${data.error || "erro desconhecido"}`;
        transcriptMeta.textContent = "";
        els.composerStatus.textContent = "Pronto para ouvir";
        return;
      }
      transcriptText.textContent = data.text || "(sem fala detetada)";
      transcriptMeta.textContent =
        `${data.model} · ${data.language} · ${data.elapsed}s`;
      els.composerStatus.textContent = "Pronto para ouvir";
      els.messages.scrollTop = els.messages.scrollHeight;
      
      // Reproduzir áudio de resposta se disponível
      if (data.audio) {
        playResponseAudio(data.audio);
      }
    });
  }

  function togglePlay(btn, url) {
    const iconPlay = btn.querySelector(".icon-play");
    const iconPause = btn.querySelector(".icon-pause");

    if (currentlyPlayingBtn && currentlyPlayingBtn !== btn) {
      resetPlayIcon(currentlyPlayingBtn);
      els.player.pause();
    }

    if (els.player.src === url && !els.player.paused) {
      els.player.pause();
      resetPlayIcon(btn);
      currentlyPlayingBtn = null;
      return;
    }

    els.player.src = url;
    els.player.play();
    iconPlay.style.display = "none";
    iconPause.style.display = "";
    currentlyPlayingBtn = btn;

    els.player.onended = () => {
      resetPlayIcon(btn);
      currentlyPlayingBtn = null;
    };
  }

  function resetPlayIcon(btn) {
    btn.querySelector(".icon-play").style.display = "";
    btn.querySelector(".icon-pause").style.display = "none";
  }

  async function submitAudio(blob) {
    const form = new FormData();
    form.append("audio", blob, "recording.webm");
    form.append("model", els.modelSelect.value);
    form.append("language", els.langSelect.value);

    try {
      const res = await fetch("/transcribe", { method: "POST", body: form });
      const data = await res.json();
      return { ok: res.ok, data };
    } catch (err) {
      return { ok: false, data: { error: "Falha de ligação ao servidor." } };
    }
  }

  function playResponseAudio(audioDataUrl) {
    const audio = new Audio(audioDataUrl);
    audio.play().catch(err => {
      console.error("Erro ao reproduzir áudio de resposta:", err);
    });
  }
})();
