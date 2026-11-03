/**
 * PHUONG - Bento Grid Portfolio (Cyber Lo-Fi & Gruvbox Aesthetic)
 * Hanoi, Vietnam (UTC+7)
 * Retaining the authentic soul: Entry overlay, Oneko cat, 3D card tilt,
 * Gruvbox music deck, live Lanyard Discord presence, project & awards popups.
 */

document.addEventListener('DOMContentLoaded', () => {
  initEntryOverlay();
  initMusicPlayer();
  initLiveClocks();
  initDiscordPresence();
  initCardTilt();
  initTechFilter();
  initClipboardButtons();
  initModals();
});

/* ==========================================================================
   1. "[ Click Anywhere ]" Entry Overlay & Smooth Reveal
   ========================================================================== */
function initEntryOverlay() {
  const overlay = document.getElementById('entry-overlay');
  const wrapper = document.getElementById('portfolio-wrapper');

  if (!overlay) return;

  function handleEnter() {
    overlay.classList.add('faded-out');
    if (wrapper) wrapper.classList.add('revealed');

    // Auto-play audio on user gesture
    if (window.playAudioTrack) {
      window.playAudioTrack();
    }

    // Wake up Oneko Pixel Cat!
    initOneko();

    // Remove listener once entered
    overlay.removeEventListener('click', handleEnter);
  }

  overlay.addEventListener('click', handleEnter);
}

/* ==========================================================================
   2. Interactive Music Player (Gruvbox / Cyber Lo-Fi Theme)
   ========================================================================== */
function initMusicPlayer() {
  const songs = [
    {
      title: "LIMBO",
      artist: "keshi",
      src: "./src/songs/keshi-LIMBO.mp3"
    },
    {
      title: "ghosts",
      artist: "Jeremy Zucker",
      src: "./src/songs/ghost-jeremy-zucker.mp3"
    },
    {
      title: "Goodbyes",
      artist: "Post Malone",
      src: "./src/songs/PostMalone-goodbyes.mp3"
    },
    {
      title: "Stargazing",
      artist: "Myles Smith",
      src: "./src/songs/mylessmith-stargazing.mp3"
    },
    {
      title: "I'd Rather Pretend",
      artist: "Bryant Barnes x D4vd",
      src: "./src/songs/Bryant%20Barnes%20x%20D4vd%20-%20I%20d%20Rather%20Pretend.mp3"
    },
    {
      title: "F#ck Yeah",
      artist: "Siver Revas",
      src: "./src/songs/F%23ck%20Yeah%20-%20Siver%20Revas.mp3"
    }
  ];

  // Random song from playlist when first entering web
  let currentTrackIndex = Math.floor(Math.random() * songs.length);
  let isPlaying = false;
  let isShuffle = false;
  let isRepeat = false;
  const audio = new Audio();
  audio.preload = "metadata";

  // Elements
  const songTitleEl = document.getElementById("player-song-title");
  const songArtistEl = document.getElementById("player-song-artist");
  const playPauseBtn = document.getElementById("player-play-pause-btn");
  const playIcon = document.getElementById("player-play-icon");
  const pauseIcon = document.getElementById("player-pause-icon");
  const prevBtn = document.getElementById("player-prev-btn");
  const nextBtn = document.getElementById("player-next-btn");
  const shuffleBtn = document.getElementById("player-shuffle-btn");
  const repeatBtn = document.getElementById("player-repeat-btn");
  const progressBarWrap = document.getElementById("player-progress-wrap");
  const progressBarFill = document.getElementById("player-progress-fill");
  const currentTimeEl = document.getElementById("player-current-time");
  const durationEl = document.getElementById("player-duration");
  const volumeSlider = document.getElementById("player-volume-slider");
  const muteBtn = document.getElementById("player-mute-btn");
  const vinylRecord = document.getElementById("player-vinyl-record");
  const equalizer = document.getElementById("player-equalizer");
  const playlistToggleBtn = document.getElementById("playlist-toggle-btn");
  const playlistDrawer = document.getElementById("playlist-drawer");
  const playlistListEl = document.getElementById("playlist-items-container");

  // Render Playlist Items
  if (playlistListEl) {
    playlistListEl.innerHTML = "";
    songs.forEach((song, index) => {
      const item = document.createElement("div");
      item.className = `playlist-item ${index === currentTrackIndex ? "active" : ""}`;
      item.setAttribute("data-index", index);
      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
          <span class="track-num" style="font-family:var(--font-mono); font-size:0.72rem; min-width:18px; color: ${index === currentTrackIndex ? 'var(--accent-orange)' : 'var(--text-muted)'};">${index === currentTrackIndex ? '▶' : `0${index + 1}`}</span>
          <span style="white-space:nowrap; text-overflow:ellipsis; overflow:hidden; font-weight:500;">${song.title}</span>
        </div>
        <span style="font-size:0.72rem; opacity:0.65; font-family:var(--font-mono); flex-shrink:0;">${song.artist}</span>
      `;
      item.addEventListener("click", () => {
        loadTrack(index);
        playAudio();
      });
      playlistListEl.appendChild(item);
    });
  }

  // Load initial track
  loadTrack(currentTrackIndex, false);

  function loadTrack(index, autoPlay = true) {
    currentTrackIndex = index;
    const song = songs[currentTrackIndex];
    audio.src = song.src;
    if (songTitleEl) songTitleEl.textContent = song.title;
    if (songArtistEl) songArtistEl.textContent = song.artist;

    // Update playlist highlight and active indicator
    if (playlistListEl) {
      const items = playlistListEl.querySelectorAll(".playlist-item");
      items.forEach((item, idx) => {
        const isActive = idx === currentTrackIndex;
        item.classList.toggle("active", isActive);
        const numEl = item.querySelector(".track-num");
        if (numEl) {
          numEl.textContent = isActive ? "▶" : `0${idx + 1}`;
          numEl.style.color = isActive ? "var(--accent-orange)" : "var(--text-muted)";
        }
      });

      // Ensure active track is scrolled into view in the queue
      const activeItem = playlistListEl.querySelector(".playlist-item.active");
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }

    if (progressBarFill) progressBarFill.style.width = "0%";
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (durationEl) durationEl.textContent = "--:--";

    if (autoPlay) {
      playAudio();
    }
  }

  function playAudio() {
    audio.play().then(() => {
      isPlaying = true;
      if (playIcon) playIcon.style.display = "none";
      if (pauseIcon) pauseIcon.style.display = "block";
      if (vinylRecord) vinylRecord.classList.add("spinning");
      if (equalizer) equalizer.classList.add("playing");
    }).catch(err => {
      console.warn("Autoplay was prevented by browser policy:", err);
      pauseAudio();
    });
  }

  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    if (playIcon) playIcon.style.display = "block";
    if (pauseIcon) pauseIcon.style.display = "none";
    if (vinylRecord) vinylRecord.classList.remove("spinning");
    if (equalizer) equalizer.classList.remove("playing");
  }

  // Expose global play function for entry overlay
  window.playAudioTrack = playAudio;

  function togglePlay() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function nextTrack() {
    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * songs.length);
      if (songs.length > 1 && randomIndex === currentTrackIndex) {
        randomIndex = (randomIndex + 1) % songs.length;
      }
      loadTrack(randomIndex);
    } else {
      let nextIndex = (currentTrackIndex + 1) % songs.length;
      loadTrack(nextIndex);
    }
  }

  function prevTrack() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    let prevIndex = (currentTrackIndex - 1 + songs.length) % songs.length;
    loadTrack(prevIndex);
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Event Listeners
  if (playPauseBtn) playPauseBtn.addEventListener("click", togglePlay);
  if (nextBtn) nextBtn.addEventListener("click", nextTrack);
  if (prevBtn) prevBtn.addEventListener("click", prevTrack);

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      isShuffle = !isShuffle;
      shuffleBtn.classList.toggle("active", isShuffle);
      showToast(isShuffle ? "Shuffle enabled" : "Shuffle disabled");
    });
  }

  if (repeatBtn) {
    repeatBtn.addEventListener("click", () => {
      isRepeat = !isRepeat;
      repeatBtn.classList.toggle("active", isRepeat);
      showToast(isRepeat ? "Repeat enabled" : "Repeat disabled");
    });
  }

  // Progress Bar Time Updates
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      if (progressBarFill) progressBarFill.style.width = `${progressPercent}%`;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    if (durationEl) durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("ended", () => {
    if (isRepeat) {
      audio.currentTime = 0;
      playAudio();
    } else {
      nextTrack();
    }
  });

  // Scrubber Seeking
  if (progressBarWrap) {
    progressBarWrap.addEventListener("click", (e) => {
      const rect = progressBarWrap.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const seekRatio = Math.max(0, Math.min(1, clickX / width));
      if (audio.duration) {
        audio.currentTime = seekRatio * audio.duration;
      }
    });
  }

  // --- Interactive Gruvbox Volume Controller ---
  const volumeBarArea = document.getElementById("volume-bar-area");
  const volumeBarFilled = document.getElementById("volume-bar-filled");
  const volumeBarIndicator = document.getElementById("volume-bar-indicator");
  const volumePercentLabel = document.getElementById("volume-percent-label");
  const volumeIconHigh = document.getElementById("volume-icon-high");
  const volumeIconLow = document.getElementById("volume-icon-low");
  const volumeIconMute = document.getElementById("volume-icon-mute");

  let currentVolume = 0.75;
  let previousVolume = 0.75;
  audio.volume = currentVolume;

  function updateVolumeUI(vol, isMuted = false) {
    const displayVol = isMuted ? 0 : vol;
    const percent = Math.round(displayVol * 100);

    if (volumeBarFilled) volumeBarFilled.style.width = `${percent}%`;
    if (volumeBarIndicator) volumeBarIndicator.style.left = `${percent}%`;
    if (volumePercentLabel) volumePercentLabel.textContent = `${percent}%`;

    if (isMuted || displayVol === 0) {
      if (volumeIconHigh) volumeIconHigh.style.display = "none";
      if (volumeIconLow) volumeIconLow.style.display = "none";
      if (volumeIconMute) volumeIconMute.style.display = "block";
    } else if (displayVol < 0.5) {
      if (volumeIconHigh) volumeIconHigh.style.display = "none";
      if (volumeIconLow) volumeIconLow.style.display = "block";
      if (volumeIconMute) volumeIconMute.style.display = "none";
    } else {
      if (volumeIconHigh) volumeIconHigh.style.display = "block";
      if (volumeIconLow) volumeIconLow.style.display = "none";
      if (volumeIconMute) volumeIconMute.style.display = "none";
    }
  }

  function setVolume(vol) {
    vol = Math.max(0, Math.min(1, vol));
    currentVolume = vol;
    audio.volume = currentVolume;
    audio.muted = false;
    updateVolumeUI(currentVolume, false);
  }

  // Initial volume UI setup
  updateVolumeUI(currentVolume, false);

  if (volumeBarArea) {
    let isDraggingVolume = false;

    const handleVolumeEvent = (e) => {
      const rect = volumeBarArea.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      if (clientX === undefined) return;
      const clickX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      setVolume(ratio);
    };

    volumeBarArea.addEventListener("mousedown", (e) => {
      isDraggingVolume = true;
      handleVolumeEvent(e);
    });

    window.addEventListener("mousemove", (e) => {
      if (isDraggingVolume) {
        handleVolumeEvent(e);
      }
    });

    window.addEventListener("mouseup", () => {
      isDraggingVolume = false;
    });

    // Touch support for mobile devices
    volumeBarArea.addEventListener("touchstart", (e) => {
      isDraggingVolume = true;
      handleVolumeEvent(e);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (isDraggingVolume) {
        handleVolumeEvent(e);
      }
    }, { passive: true });

    window.addEventListener("touchend", () => {
      isDraggingVolume = false;
    });

    // Mouse wheel scrolling on volume bar
    volumeBarArea.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      setVolume(audio.volume + delta);
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        if (currentVolume === 0) currentVolume = previousVolume || 0.75;
        audio.volume = currentVolume;
        updateVolumeUI(currentVolume, false);
        showToast(`Unmuted (${Math.round(currentVolume * 100)}%)`);
      } else {
        previousVolume = audio.volume;
        audio.muted = true;
        updateVolumeUI(currentVolume, true);
        showToast("Muted");
      }
    });
  }

  // Playlist drawer toggle
  if (playlistToggleBtn && playlistDrawer) {
    playlistToggleBtn.addEventListener("click", () => {
      playlistDrawer.classList.toggle("open");
    });
  }

  // Keyboard Shortcuts
  window.addEventListener("keydown", (e) => {
    if (["input", "textarea"].includes(document.activeElement.tagName.toLowerCase())) return;
    if (e.code === "Space") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "m" || e.key === "M") {
      if (muteBtn) muteBtn.click();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setVolume(audio.volume + 0.05);
      showToast(`Volume: ${Math.round(audio.volume * 100)}%`);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setVolume(audio.volume - 0.05);
      showToast(`Volume: ${Math.round(audio.volume * 100)}%`);
    }
  });
}

/* ==========================================================================
   3. Authentic 3D Card Tilt Effect (Only on Important Cards: Hero & Music)
   ========================================================================== */
function initCardTilt() {
  // Only tilt the primary important cards (Hero Profile and Music Player Deck)
  const tiltCards = document.querySelectorAll('.tilt-enabled');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      // Never tilt when a popup modal is open
      if (document.body.classList.contains('modal-open')) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

/* ==========================================================================
   4. Oneko Pixel Cat (Official Cursor Companion)
   ========================================================================== */
let onekoInitialized = false;
function initOneko() {
  if (onekoInitialized) return;
  onekoInitialized = true;

  const nekoEl = document.createElement("div");
  let nekoPosX = 32;
  let nekoPosY = 32;
  let mousePosX = window.innerWidth / 2;
  let mousePosY = window.innerHeight / 2;
  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;
  const nekoSpeed = 10;

  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratch: [[-5, 0], [-6, 0], [-7, 0]],
    tired: [[-3, -2]],
    sleeping: [[-2, 0], [-2, -1]],
    N: [[-1, -2], [-1, -3]],
    NE: [[0, -2], [0, -3]],
    E: [[-3, 0], [-3, -1]],
    SE: [[-5, -1], [-5, -2]],
    S: [[-6, -3], [-7, -2]],
    SW: [[-5, -3], [-6, -1]],
    W: [[-4, -2], [-4, -3]],
    NW: [[-1, 0], [-1, -1]],
  };

  nekoEl.id = "oneko";
  nekoEl.style.width = "32px";
  nekoEl.style.height = "32px";
  nekoEl.style.position = "fixed";
  nekoEl.style.backgroundImage = "url('./src/oneko.gif')";
  nekoEl.style.imageRendering = "pixelated";
  nekoEl.style.left = "16px";
  nekoEl.style.top = "16px";
  nekoEl.style.zIndex = "9999";
  nekoEl.style.pointerEvents = "none";

  document.body.appendChild(nekoEl);

  document.addEventListener("mousemove", (event) => {
    mousePosX = event.clientX;
    mousePosY = event.clientY;
  });

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;
    if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation == null) {
      idleAnimation = ["sleeping", "scratch"][Math.floor(Math.random() * 2)];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) resetIdleAnimation();
        break;
      case "scratch":
        setSprite("scratch", idleAnimationFrame);
        if (idleAnimationFrame > 9) resetIdleAnimation();
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  setInterval(frame, 100);
}

/* ==========================================================================
   5. Live Discord Presence & Avatar Decoration (Lanyard API Integration)
   ========================================================================== */
function initDiscordPresence() {
  // Discord User ID: ethandev17_
  const DISCORD_USER_ID = "957890904704815114";
  const DEFAULT_USERNAME = "ethandev17_";

  const avatarBadge = document.getElementById("avatar-status-badge");
  const discordStatusText = document.getElementById("discord-status-text");
  const discordTag = document.getElementById("discord-username-tag");
  const discordWidgetAvatar = document.getElementById("discord-widget-avatar");
  const discordWidgetDeco = document.getElementById("discord-widget-deco");
  const discordAvatarStatus = document.getElementById("discord-avatar-status");

  // Fallback to local image if network fails
  if (discordWidgetAvatar) {
    discordWidgetAvatar.onerror = () => {
      discordWidgetAvatar.src = "./src/discord_avatar.png";
    };
  }

  function applyLanyardData(data) {
    if (!data) return;

    // 1. Live Discord Avatar Sync inside Discord Widget
    if (data.discord_user && data.discord_user.avatar) {
      const isAnimated = data.discord_user.avatar.startsWith("a_");
      const ext = isAnimated ? "gif" : "png";
      const avatarUrl = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.${ext}?size=128`;
      if (discordWidgetAvatar && discordWidgetAvatar.src !== avatarUrl) {
        discordWidgetAvatar.src = avatarUrl;
      }
    }

    // 2. Avatar Decoration in Discord Widget (Shop / Nitro Deco)
    if (discordWidgetDeco) {
      const decoAsset = data.discord_user?.avatar_decoration_data?.asset;
      if (decoAsset) {
        discordWidgetDeco.src = `https://cdn.discordapp.com/avatar-decoration-presets/${decoAsset}.png?size=160&passthrough=true`;
        discordWidgetDeco.style.display = "block";
      } else {
        discordWidgetDeco.style.display = "none";
      }
    }

    // 3. Status indicator dots (Discord Widget dot & Hero badge)
    const status = data.discord_status || "dnd";
    const statusTitle = {
      online: "Discord: Online",
      idle: "Discord: Away (Idle)",
      dnd: "Discord: Do Not Disturb",
      offline: "Discord: Offline"
    };

    if (discordAvatarStatus) {
      discordAvatarStatus.className = `discord-status-dot ${status}`;
      discordAvatarStatus.title = statusTitle[status] || "Discord Status";
    }

    if (avatarBadge) {
      avatarBadge.className = `avatar-status-badge ${status}`;
      avatarBadge.title = statusTitle[status] || "Discord Status";
    }

    // 3. Activity / Status text (Custom Status, Spotify, Playing Game, or Status message)
    let activityText = "Developing & Exploring";

    // Check Spotify first
    if (data.listening_to_spotify && data.spotify) {
      activityText = `🎧 ${data.spotify.song} — ${data.spotify.artist}`;
    }
    // Check Activities (Playing game, VS Code, Custom Status)
    else if (data.activities && data.activities.length > 0) {
      // Type 4 is Custom Status
      const customStatus = data.activities.find(act => act.type === 4);
      // Type 0 is Game / Application
      const gameActivity = data.activities.find(act => act.type === 0);

      if (customStatus && customStatus.state) {
        const emoji = customStatus.emoji?.name ? `${customStatus.emoji.name} ` : "";
        activityText = `${emoji}${customStatus.state}`;
      } else if (gameActivity) {
        activityText = `🎮 Playing ${gameActivity.name}`;
      } else if (data.activities[0].name) {
        activityText = `${data.activities[0].name}`;
      }
    }
    // Fallback status text
    else if (status === "online") {
      activityText = "🟢 Online • In the Zone";
    } else if (status === "idle") {
      activityText = "🌙 Away from keyboard";
    } else if (status === "dnd") {
      activityText = "🔴 Do Not Disturb • Deep Flow";
    } else {
      activityText = "⚪ Offline • Coding offline";
    }

    if (discordStatusText) {
      discordStatusText.textContent = activityText;
    }

    // 4. Discord Tag / Username (Always display @ethandev17_)
    if (discordTag) {
      discordTag.innerHTML = `@ethandev17_ <span class="hypesquad-badge" title="HypeSquad Bravery">⚔️</span>`;
    }
  }

  // REST API fetch with automatic fallback
  async function fetchLanyardREST() {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      if (!res.ok) throw new Error("Lanyard API unreachable");
      const json = await res.json();
      if (json.success && json.data) {
        applyLanyardData(json.data);
      }
    } catch (err) {
      if (avatarBadge) avatarBadge.className = "avatar-status-badge dnd";
      if (discordStatusText) discordStatusText.textContent = "Do Not Disturb • Developing";
      if (discordTag) discordTag.innerHTML = `@ethandev17_ <span class="hypesquad-badge" title="HypeSquad Bravery">⚔️</span>`;
    }
  }

  // WebSocket for instant real-time live presence updates
  function connectLanyardWebSocket() {
    try {
      const socket = new WebSocket("wss://api.lanyard.rest/socket");
      let heartbeatInterval = null;

      socket.addEventListener("message", (event) => {
        try {
          const msg = JSON.parse(event.data);
          // Opcode 1: Hello from Lanyard
          if (msg.op === 1) {
            // Subscribe to user
            socket.send(JSON.stringify({
              op: 2,
              d: { subscribe_to_id: DISCORD_USER_ID }
            }));

            // Heartbeat
            const interval = msg.d.heartbeat_interval;
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            heartbeatInterval = setInterval(() => {
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ op: 3 }));
              }
            }, interval);
          }
          // Opcode 0: Event (INIT_STATE or PRESENCE_UPDATE)
          else if (msg.op === 0) {
            applyLanyardData(msg.d);
          }
        } catch (e) { }
      });

      socket.addEventListener("close", () => {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        setTimeout(connectLanyardWebSocket, 10000);
      });

      socket.addEventListener("error", () => {
        socket.close();
      });
    } catch (e) {
      fetchLanyardREST();
    }
  }

  fetchLanyardREST();
  connectLanyardWebSocket();
  setInterval(fetchLanyardREST, 30000);
}

/* ==========================================================================
   6. Live Hanoi (ICT / UTC+7) & Local Dual Clocks
   ========================================================================== */
function initLiveClocks() {
  const hanoiTimeEl = document.getElementById("hanoi-time-display");
  const hanoiDateEl = document.getElementById("hanoi-date-display");
  const localTimeEl = document.getElementById("local-time-display");

  function updateTimes() {
    const now = new Date();

    try {
      const hanoiFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      const parts = hanoiFormatter.formatToParts(now);
      const hours = parts.find(p => p.type === 'hour')?.value || '00';
      const minutes = parts.find(p => p.type === 'minute')?.value || '00';
      const seconds = parts.find(p => p.type === 'second')?.value || '00';

      if (hanoiTimeEl) {
        hanoiTimeEl.innerHTML = `${hours}<span class="colon">:</span>${minutes}<span style="font-size:1.1rem; opacity:0.6; margin-left:4px;">:${seconds}</span>`;
      }

      const hanoiDateFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        weekday: "short",
        month: "short",
        day: "numeric"
      });
      if (hanoiDateEl) {
        hanoiDateEl.textContent = `Hanoi, Vietnam • ${hanoiDateFormatter.format(now)}`;
      }
    } catch (e) {
      console.error(e);
    }

    if (localTimeEl) {
      const localHrs = String(now.getHours()).padStart(2, '0');
      const localMins = String(now.getMinutes()).padStart(2, '0');
      localTimeEl.textContent = `Your Local: ${localHrs}:${localMins}`;
    }
  }

  updateTimes();
  setInterval(updateTimes, 1000);
}

/* ==========================================================================
   7. Tech Stack Category Filter
   ========================================================================== */
function initTechFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const badges = document.querySelectorAll('.tech-badge');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      badges.forEach(badge => {
        if (filter === 'all') {
          badge.style.display = 'inline-flex';
        } else {
          const category = badge.getAttribute('data-category');
          badge.style.display = category === filter ? 'inline-flex' : 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. Clipboard & Gruvbox Toast Notifications
   ========================================================================== */
function initClipboardButtons() {
  const copyDiscordBtn = document.getElementById('copy-discord-btn');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  if (copyDiscordBtn) {
    copyDiscordBtn.addEventListener('click', () => {
      copyToClipboard('ethandev17_', 'Copied Discord tag (@ethandev17_)');
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      copyToClipboard('kaz442197@gmail.com', 'Copied email (kaz442197@gmail.com) to clipboard!');
    });
  }
}

function copyToClipboard(text, successMessage) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMessage);
  }).catch(() => {
    showToast("Copied to clipboard!");
  });
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* ==========================================================================
   9. Interactive Modals (Project Case Studies & All Awards)
   ========================================================================== */
function initModals() {
  const projectsData = {
    greenmap: {
      title: "GreenMap: Smart Urban Environmental Platform & Linked Open Data",
      badge: "Giải Nhì Olympic PMNM Toàn Quốc • 83.5 Điểm",
      desc: "Nền tảng quản trị và giám sát môi trường đô thị thông minh theo chuẩn quốc tế NGSI-LD và Dữ liệu Mở Liên kết (Linked Open Data). Đoạt Giải Nhì khối Phần mềm Nguồn Mở tại Olympic Tin học Sinh viên Toàn quốc (đội thi HouHackathon-CQP, Đại học Mở Hà Nội, xếp hạng #4/28 đội thi toàn quốc).",
      highlights: [
        "Tích hợp Context Broker quốc tế Orion-LD + MongoDB theo chuẩn mở ETSI NGSI-LD (FIWARE / EU) phục vụ kiến trúc Smart City và cảm biến IoT thời gian thực.",
        "Hệ thống Core Backend bằng Python FastAPI và PostgreSQL + PostGIS (asyncpg) phục vụ xác thực người dùng, xử lý báo cáo sự cố và truy vấn không gian địa lý tốc độ cao.",
        "Giao diện Web GIS Portal phát triển bằng React 18, Vite và MapLibre GL kết xuất bản đồ nhiệt (Heatmap AQI) và trực quan hoá các chỉ số chất lượng môi trường mượt mà.",
        "Ứng dụng Native Mobile bằng Kotlin Android hỗ trợ người dân tra cứu thông tin môi trường và đóng góp dữ liệu cộng đồng (Crowdsourcing) kèm định vị GPS.",
        "Quy chuẩn mã nguồn mở quốc tế: Đóng gói Docker Compose, tài liệu kiến trúc MkDocs toàn diện và phát hành theo giấy phép Apache 2.0 / MIT."
      ],
      chips: ["FastAPI", "Python", "Orion-LD", "NGSI-LD", "PostgreSQL", "PostGIS", "React 18", "MapLibre GL", "Kotlin", "Docker", "Linked Data"],
      demoUrl: "https://vfossa.vn/tin-tuc/cong-bo-ket-qua-phan-thi-phan-mem-nguon-mo-753.html",
      repoUrl: "https://github.com/HouHackathon-CQP"
    },
    pmovies: {
      title: "pMovies: Ad-Free Streaming & Realtime Synchronized Watch Party",
      badge: "Realtime Platform • Full-Stack",
      desc: "Nền tảng xem phim trực tuyến hiệu năng cao không quảng cáo, tích hợp phòng xem chung thời gian thực (Watch Party) đồng bộ khung hình phát giữa các người xem và hệ thống Cloudflare Stream Relay bảo vệ luồng dữ liệu.",
      highlights: [
        "Phòng xem chung thời gian thực (Watch Party): Đồng bộ trạng thái Play/Pause/Seek và tập phim tức thời giữa Host và các thành viên qua Supabase Realtime Channels (WebSocket Broadcast).",
        "Hệ thống Live Chat & Room Presence: Chat tương tác trực tiếp trong phòng xem với cơ chế tự động dọn dẹp tin nhắn cũ (TTL cleanup) và quản lý định danh Host/Guest bảo mật với Row Level Security (RLS).",
        "Cloudflare Worker Stream Relay: Xây dựng reverse proxy trung chuyển luồng HLS (.m3u8 & .ts segments), tự động rewrite headers (Referer, Origin), bypass cơ chế chặn CORS và triệt tiêu toàn bộ quảng cáo độc hại/popups.",
        "Trình phát đa phương tiện tối ưu: Tích hợp Hls.js kết hợp Plyr Engine, hỗ trợ chọn độ phân giải thích ứng (Adaptive Bitrate), ghi nhớ tiến độ xem và tính năng Skip Intro/Outro tự động qua markers.",
        "Kiến trúc hiện đại & Hiệu năng cao: Xây dựng trên Next.js (App Router), React 19, TypeScript, Supabase PostgreSQL, Framer Motion và Tailwind CSS v4."
      ],
      chips: ["Next.js", "React 19", "TypeScript", "Supabase", "WebSocket", "HLS.js", "Plyr", "Cloudflare Workers", "Tailwind CSS", "Vercel"],
      images: [
        {
          src: "./src/assets/pmovies/43b441453b87bbd9e296.jpg",
          alt: "pMovies Home Portal",
          badge: "Portal & Khám Phá Phim",
          caption: "Trang chủ & Khám Phá Phim: Banner 'Khải Huyền Z: Thế Giới Mới' với nút Xem Phim Ngay & Khởi tạo phòng Xem Chung (Watch Party)."
        },
        {
          src: "./src/assets/pmovies/6adeb922dce05cbe05f1.jpg",
          alt: "pMovies Watch Party Room",
          badge: "Phòng Xem Chung Realtime",
          caption: "Phòng Xem Chung Realtime: Đồng bộ Play/Pause khung hình, thông báo Host Controls Permission & Live Chat thời gian thực."
        }
      ],
      demoUrl: "https://pmovies-zeta.vercel.app",
      repoUrl: "https://github.com/ourstorycomic/pmovies"
    },
    mcpvp: {
      title: "MCPVPRanked: Serverless P2P Duel Matchmaking & Replay Engine",
      badge: "Minecraft Modding • P2P Networking",
      desc: "Hệ sinh thái mod thi đấu đối kháng Minecraft (1v1 Duel) đột phá với cơ chế ghép trận Peer-to-Peer (P2P) hoàn toàn không cần cụm server trung gian qua tunnel E4MC & Quic relay. Tích hợp trọn gói hệ thống tính điểm Elo thời gian thực, bảng xếp hạng toàn cầu, phòng chat, profile cá nhân, bộ tùy biến ngoại trang cao cấp (Cosmetics) và trình xem phát lại trận đấu điện ảnh (POV Replay Viewer).",
      highlights: [
        "Kiến trúc P2P Tunneling Serverless: Ghép trận 1v1 trực tiếp giữa 2 client qua giao thức E4MC & Quic relay, triệt tiêu 100% chi phí vận hành máy chủ dedicated server đắt đỏ.",
        "Hệ thống Xếp hạng Elo & Matchmaking: Tự động tìm trận, ghép cặp cân bằng trình độ theo Elo, đồng bộ trạng thái phiên đấu, phát hiện AFK và quản lý Leaderboard toàn cầu qua Firebase Realtime Database.",
        "Cosmetics & Custom 3D Animation Pipeline: Tích hợp hệ thống áo choàng tùy biến (Capes), hiệu ứng hoạt ảnh hạ gục 3D độc quyền (Kill Animations) và Banner Profile động.",
        "In-Engine Cinematic Replay Recorder: Ghi lại toàn bộ trận đấu (POV Replay) với thuật toán làm mịn đường curve camera (Replay Spline) và bộ đệm khung hình phục vụ phân tích chiến thuật.",
        "Tối ưu hóa sâu Bytecode ASM & Render Loop: Can thiệp runtime Sponge Mixin và Blaze3D/OpenGL, giảm thiểu độ trễ gói tin đầu vào và đảm bảo FPS cực kỳ ổn định trong các pha giao tranh tốc độ cao."
      ],
      chips: ["Java", "E4MC P2P Relay", "Sponge Mixin", "OpenGL / Blaze3D", "Bytecode ASM", "Firebase", "Gradle"],
      videoBadge: "Video Demo Showcase",
      videoTitle: "MCPVPRanked - Showcase Ghép trận Duel P2P không cần Server, Cosmetics & Gameplay",
      youtubeId: "9Lo612RItXU",
      images: [
        {
          src: "./src/assets/MCPVPRanked/a175020d63cfe391bade.jpg",
          alt: "Tactical Overview & Player Profile Dashboard",
          badge: "Dashboard & Profile",
          caption: "Overview Dashboard & Profile: Thống kê thành tích cá nhân (Win/Loss, Elo 1000, Winrate 79%), Changelog v2.5.0 và tin tức cộng đồng."
        },
        {
          src: "./src/assets/MCPVPRanked/efcae7d4861606485f07.jpg",
          alt: "Custom Kit Layout & Presets Editor",
          badge: "Kit Layout Editor",
          caption: "Bộ công cụ Chỉnh sửa Bộ trang bị (Kit Editor): Tùy biến trang bị theo từng thể thức (UHC, Pot, NethOP, Axe, Mace, Spear) lưu theo profile."
        },
        {
          src: "./src/assets/MCPVPRanked/2370d524b4e634b86df7.jpg",
          alt: "Matchmaking Lobby & Match History",
          badge: "Matchmaking Lobby",
          caption: "Giao diện Ghép trận & Lịch sử Đấu: Lựa chọn chế độ (UHC, Vanilla), kiểm tra nhật ký đối đầu trực tiếp và bảng trạng thái người chơi."
        },
        {
          src: "./src/assets/MCPVPRanked/cbdb222b43e9c3b79af8.jpg",
          alt: "P2P Match Found & Handshake",
          badge: "P2P Match Found",
          caption: "Cơ chế Tìm trận P2P Realtime: Bắt cặp tự động 'Match Found - Accept in 25s' giữa 2 người chơi qua E4MC relay không cần server trung gian."
        },
        {
          src: "./src/assets/MCPVPRanked/4b5b0df96c3bec65b52a.jpg",
          alt: "In-Game Duel Arena & Victory Screen",
          badge: "1v1 Arena Victory",
          caption: "Chiến trường 1v1 & Màn hình Kết thúc trận: Hiệu ứng hạ gục 3D (Kill Animation), tính toán cộng/trừ điểm Elo và thống kê chỉ số sau trận."
        }
      ],
      demoUrl: "https://www.youtube.com/watch?v=9Lo612RItXU",
      repoUrl: "https://github.com/ourstorycomic/MCPVPRanked"
    }
  };

  const projectModal = document.getElementById("project-modal");
  const closeProjectBtn = document.getElementById("close-project-modal-btn");
  const modalProjectBadge = document.getElementById("modal-project-badge");
  const modalProjectTitle = document.getElementById("modal-project-title");
  const modalProjectDesc = document.getElementById("modal-project-desc");
  const modalProjectHighlights = document.getElementById("modal-project-highlights");
  const modalProjectChips = document.getElementById("modal-project-chips");
  const modalProjectDemoBtn = document.getElementById("modal-project-demo-btn");
  const modalProjectRepoBtn = document.getElementById("modal-project-repo-btn");

  const awardsModal = document.getElementById("awards-modal");
  const openAwardsBtn = document.getElementById("open-all-awards-btn");
  const closeAwardsBtn = document.getElementById("close-awards-modal-btn");

  const allProjectsModal = document.getElementById("all-projects-modal");
  const openAllProjectsBtn = document.getElementById("open-all-projects-btn");
  const closeAllProjectsBtn = document.getElementById("close-all-projects-modal-btn");

  const olpModal = document.getElementById("olp-greenmap-modal");
  const closeOlpBtn = document.getElementById("close-olp-modal-btn");
  const openOlpCard = document.getElementById("open-olp-card");
  const openOlpDetailBtn = document.getElementById("open-olp-detail-btn");
  const awardsModalOlpItem = document.getElementById("awards-modal-olp-item");
  const awardsModalOlpBtn = document.getElementById("awards-modal-olp-btn");

  const nckhModal = document.getElementById("nckh-paper-modal");
  const closeNckhBtn = document.getElementById("close-nckh-modal-btn");
  const openNckhCard = document.getElementById("open-nckh-card");
  const awardsModalNckhItem = document.getElementById("awards-modal-nckh-item");

  function resetCardTilts() {
    document.querySelectorAll('.tilt-enabled').forEach(c => {
      c.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

  function openProjectModal(projectKey, initialSlideIndex = 0) {
    const data = projectsData[projectKey];
    if (!data || !projectModal) return;

    if (modalProjectBadge) modalProjectBadge.textContent = data.badge;
    if (modalProjectTitle) modalProjectTitle.textContent = data.title;
    if (modalProjectDesc) modalProjectDesc.textContent = data.desc;

    if (modalProjectHighlights) {
      modalProjectHighlights.innerHTML = "";
      data.highlights.forEach(h => {
        const li = document.createElement("li");
        li.textContent = h;
        modalProjectHighlights.appendChild(li);
      });
    }

    if (modalProjectChips) {
      modalProjectChips.innerHTML = "";
      data.chips.forEach(c => {
        const chip = document.createElement("span");
        chip.className = "tech-chip";
        chip.textContent = c;
        modalProjectChips.appendChild(chip);
      });
    }

    if (modalProjectDemoBtn) {
      modalProjectDemoBtn.href = data.demoUrl;
      const isYoutube = data.demoUrl && (data.demoUrl.includes("youtube.com") || data.demoUrl.includes("youtu.be"));
      if (isYoutube) {
        modalProjectDemoBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          <span>Xem Video Demo trên YouTube</span>
        `;
        modalProjectDemoBtn.style.background = "#cc241d";
        modalProjectDemoBtn.style.color = "#fbf1c7";
      } else {
        modalProjectDemoBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          <span>Khám phá Live Demo</span>
        `;
        modalProjectDemoBtn.style.background = "";
        modalProjectDemoBtn.style.color = "";
      }
    }
    if (modalProjectRepoBtn) modalProjectRepoBtn.href = data.repoUrl;

    // Render Project Media Slider (Unified with Awards Case Study Slider)
    const galleryEl = document.getElementById("modal-project-gallery");
    const galleryTrack = document.getElementById("modal-gallery-track");
    const galleryDots = document.getElementById("modal-gallery-dots");
    const galleryCounter = document.getElementById("modal-gallery-counter");
    const galleryPrevBtn = document.getElementById("modal-gallery-prev");
    const galleryNextBtn = document.getElementById("modal-gallery-next");

    const slides = [];

    // 1. YouTube Video Demo as Slide 1 (at the very beginning of the slider)
    if (data.youtubeId) {
      slides.push({
        type: "video",
        youtubeId: data.youtubeId,
        badge: data.videoBadge || "Video Demo Showcase",
        title: data.videoTitle || data.title,
        caption: `${data.videoTitle || data.title} (Showcase Ghép trận Duel P2P & Cosmetics)`
      });
    }

    // 2. High-Res In-Game Screenshots as following slides
    if (data.images && data.images.length > 0) {
      data.images.forEach(imgObj => {
        slides.push({
          type: "image",
          src: imgObj.src,
          alt: imgObj.alt || data.title,
          badge: imgObj.badge || "Giao diện In-game",
          caption: imgObj.caption || ""
        });
      });
    }

    if (slides.length > 0 && galleryEl && galleryTrack) {
      galleryEl.style.display = "block";
      galleryTrack.innerHTML = "";
      if (galleryDots) galleryDots.innerHTML = "";
      let galleryIndex = 0;
      const totalSlides = slides.length;

      const isFileProtocol = window.location.protocol === "file:";

      slides.forEach((item, idx) => {
        const slide = document.createElement("div");
        slide.className = "case-slide";
        slide.setAttribute("data-slide", idx);

        if (item.type === "video") {
          slide.classList.add("modal-slide-video");
          const videoWrap = document.createElement("div");
          videoWrap.className = "slider-video-wrapper";

          if (isFileProtocol) {
            // Friendly Façade Cover for local file:// protocol where YouTube server blocks embeds with Error 153
            videoWrap.innerHTML = `
              <div class="slider-video-facade" style="background-image: url('https://i.ytimg.com/vi/${item.youtubeId}/maxresdefault.jpg');">
                <div class="slider-facade-overlay">
                  <div class="slider-facade-center">
                    <a href="https://www.youtube.com/watch?v=${item.youtubeId}" target="_blank" rel="noopener noreferrer" class="slider-play-btn" title="Phát trên YouTube">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="#fbf1c7"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                    </a>
                    <span class="slider-facade-hint">Bấm để xem video demo trên YouTube ↗</span>
                  </div>
                  <div class="slider-facade-notice">
                    <div class="slider-notice-tag">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#fb4934"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      <span>YouTube chặn nhúng trên file:// (Lỗi 153). Trên GitHub Pages / Web Server sẽ nhúng trực tiếp!</span>
                    </div>
                    <button type="button" class="slider-try-embed-btn" id="btn-force-embed-${idx}">Thử mở Iframe</button>
                  </div>
                </div>
              </div>
            `;
            setTimeout(() => {
              const tryBtn = slide.querySelector(`#btn-force-embed-${idx}`);
              if (tryBtn) {
                tryBtn.addEventListener("click", (e) => {
                  e.stopPropagation();
                  videoWrap.innerHTML = `
                    <iframe src="https://www.youtube.com/embed/${item.youtubeId}?rel=0&enablejsapi=1" title="${item.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  `;
                });
              }
            }, 0);
          } else {
            // Live Server / GitHub Pages / Vercel: Standard direct responsive embed
            videoWrap.innerHTML = `
              <iframe src="https://www.youtube.com/embed/${item.youtubeId}?rel=0&enablejsapi=1" title="${item.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              <a href="https://www.youtube.com/watch?v=${item.youtubeId}" target="_blank" rel="noopener noreferrer" class="slider-video-floating-btn" title="Mở trên YouTube">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span>YouTube ↗</span>
              </a>
            `;
          }

          slide.appendChild(videoWrap);

          // Sleek overlay on video slide
          const overlay = document.createElement("div");
          overlay.className = "case-slide-overlay";
          overlay.innerHTML = `
            <span class="slide-badge" style="background: rgba(204, 36, 29, 0.22); color: #fb4934; border-color: rgba(204, 36, 29, 0.45);">▶ ${item.badge}</span>
            <p class="slide-desc">${item.caption}</p>
          `;
          slide.appendChild(overlay);
        } else {
          const img = document.createElement("img");
          img.src = item.src;
          img.alt = item.alt || data.title;
          img.loading = "lazy";
          slide.appendChild(img);

          // Sleek overlay on image slide (matches awards case study)
          const overlay = document.createElement("div");
          overlay.className = "case-slide-overlay";
          overlay.innerHTML = `
            <span class="slide-badge">${item.badge}</span>
            <p class="slide-desc">${item.caption}</p>
          `;
          slide.appendChild(overlay);
        }

        galleryTrack.appendChild(slide);

        if (galleryDots) {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = `slider-dot-btn ${idx === 0 ? "active" : ""} ${item.type === "video" ? "video-dot" : ""}`;
          dot.setAttribute("data-index", idx);
          dot.setAttribute("aria-label", item.type === "video" ? "Video Demo" : `Slide ${idx + 1}`);
          dot.setAttribute("title", item.type === "video" ? "Xem Video Demo" : `${item.badge}`);
          if (item.type === "video") {
            dot.textContent = "▶";
          }
          dot.addEventListener("click", (e) => {
            e.stopPropagation();
            setGallerySlide(idx);
          });
          galleryDots.appendChild(dot);
        }
      });

      function setGallerySlide(idx) {
        galleryIndex = (idx + totalSlides) % totalSlides;
        galleryTrack.style.transform = `translateX(-${galleryIndex * 100}%)`;
        if (galleryDots) {
          const dots = galleryDots.querySelectorAll(".slider-dot-btn");
          dots.forEach((d, i) => d.classList.toggle("active", i === galleryIndex));
        }
        if (galleryCounter) {
          galleryCounter.textContent = `${galleryIndex + 1} / ${totalSlides}`;
        }
        // Pause iframe video when moving away from video slide
        if (galleryIndex !== 0) {
          const iframes = galleryTrack.querySelectorAll("iframe");
          iframes.forEach(f => {
            try {
              f.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            } catch (e) { }
          });
        }
      }

      setGallerySlide(initialSlideIndex || 0);

      if (galleryPrevBtn) {
        galleryPrevBtn.onclick = (e) => {
          e.stopPropagation();
          setGallerySlide(galleryIndex - 1);
        };
      }
      if (galleryNextBtn) {
        galleryNextBtn.onclick = (e) => {
          e.stopPropagation();
          setGallerySlide(galleryIndex + 1);
        };
      }
    } else if (galleryEl) {
      galleryEl.style.display = "none";
    }

    projectModal.classList.add("active");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    resetCardTilts();
  }

  function closeAllModals() {
    if (projectModal) projectModal.classList.remove("active");
    if (awardsModal) awardsModal.classList.remove("active");
    if (allProjectsModal) allProjectsModal.classList.remove("active");
    if (olpModal) olpModal.classList.remove("active");
    if (nckhModal) nckhModal.classList.remove("active");
    // Pause any playing YouTube iframe in gallery
    const galleryTrack = document.getElementById("modal-gallery-track");
    if (galleryTrack) {
      const iframes = galleryTrack.querySelectorAll("iframe");
      iframes.forEach(f => {
        try {
          f.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          f.src = f.src; // stops audio/video playback immediately
        } catch (e) { }
      });
    }
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    resetCardTilts();
  }

  function openOlpModal() {
    closeAllModals();
    if (olpModal) {
      olpModal.classList.add("active");
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      resetCardTilts();
    }
  }

  function openNckhModal() {
    closeAllModals();
    if (nckhModal) {
      nckhModal.classList.add("active");
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      resetCardTilts();
    }
  }

  // Open OLP GreenMap modal from homepage award item
  if (openOlpCard) openOlpCard.addEventListener("click", openOlpModal);
  if (openOlpDetailBtn) {
    openOlpDetailBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openOlpModal();
    });
  }

  // Open OLP GreenMap modal from Awards Modal item
  if (awardsModalOlpItem) awardsModalOlpItem.addEventListener("click", openOlpModal);
  if (awardsModalOlpBtn) {
    awardsModalOlpBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openOlpModal();
    });
  }

  // Open NCKH Paper modal from homepage award item
  if (openNckhCard) openNckhCard.addEventListener("click", openNckhModal);

  // Open NCKH Paper modal from Awards Modal item
  if (awardsModalNckhItem) awardsModalNckhItem.addEventListener("click", openNckhModal);

  // Open individual project modal from preview list
  document.querySelectorAll(".project-preview-item").forEach(item => {
    item.addEventListener("click", () => {
      const key = item.getAttribute("data-project");
      openProjectModal(key);
    });
  });

  // Open All Projects Modal
  if (openAllProjectsBtn && allProjectsModal) {
    openAllProjectsBtn.addEventListener("click", () => {
      closeAllModals();
      allProjectsModal.classList.add("active");
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      resetCardTilts();
    });
  }

  // Open All Awards Modal (shows both awards)
  if (openAwardsBtn && awardsModal) {
    openAwardsBtn.addEventListener("click", () => {
      closeAllModals();
      awardsModal.classList.add("active");
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      resetCardTilts();
    });
  }

  // Close buttons
  if (closeProjectBtn) closeProjectBtn.addEventListener("click", closeAllModals);
  if (closeAwardsBtn) closeAwardsBtn.addEventListener("click", closeAllModals);
  if (closeAllProjectsBtn) closeAllProjectsBtn.addEventListener("click", closeAllModals);
  if (closeOlpBtn) closeOlpBtn.addEventListener("click", closeAllModals);
  if (closeNckhBtn) closeNckhBtn.addEventListener("click", closeAllModals);

  // Cards inside allProjectsModal that switch to detail case study
  if (allProjectsModal) {
    allProjectsModal.querySelectorAll(".all-project-card").forEach(card => {
      card.addEventListener("click", (e) => {
        // If clicking on direct anchor links inside card, let them open external link
        if (e.target.closest("a")) return;
        const key = card.getAttribute("data-project");
        if (key) {
          if (allProjectsModal) allProjectsModal.classList.remove("active");
          setTimeout(() => {
            if (key === "greenmap") {
              openOlpModal();
            } else {
              openProjectModal(key);
            }
          }, 120);
        }
      });
    });
  }

  // Click outside to close
  [projectModal, awardsModal, allProjectsModal, olpModal, nckhModal].forEach(modal => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeAllModals();
        }
      });
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // Initialize Screenshot Sliders
  initGreenMapSlider();
  initNckhSlider();
}

/* ==========================================================================
   10. GreenMap Screenshot Slider Controller
   ========================================================================== */
function initGreenMapSlider() {
  const track = document.getElementById("greenmap-slider-track");
  const prevBtn = document.getElementById("slider-prev-btn");
  const nextBtn = document.getElementById("slider-next-btn");
  const dots = document.querySelectorAll(".slider-dot-btn");
  const counter = document.getElementById("slider-counter");
  const container = document.getElementById("greenmap-slider");
  if (!track) return;

  let current = 0;
  const total = 4;
  let autoTimer = null;

  function goToSlide(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === current);
    });
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function prevSlide() {
    goToSlide(current - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      nextSlide();
      resetAuto();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prevSlide();
      resetAuto();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute("data-index"), 10);
      goToSlide(idx);
      resetAuto();
    });
  });

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener("touchstart", (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextSlide();
      else prevSlide();
      resetAuto();
    }
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, 5000);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  if (container) {
    container.addEventListener("mouseenter", stopAuto);
    container.addEventListener("mouseleave", startAuto);
  }

  startAuto();
}

/* ==========================================================================
   11. NCKH & Journal Publication Screenshot Slider Controller
   ========================================================================== */
function initNckhSlider() {
  const track = document.getElementById("nckh-slider-track");
  const prevBtn = document.getElementById("nckh-slider-prev-btn");
  const nextBtn = document.getElementById("nckh-slider-next-btn");
  const dots = document.querySelectorAll("#nckh-slider-dots-container .slider-dot-btn");
  const counter = document.getElementById("nckh-slider-counter");
  const container = document.getElementById("nckh-slider");
  if (!track) return;

  let current = 0;
  const slides = track.querySelectorAll(".case-slide");
  const total = slides.length || 6;
  let autoTimer = null;

  function goToSlide(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === current);
    });
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function prevSlide() {
    goToSlide(current - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      nextSlide();
      resetAuto();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prevSlide();
      resetAuto();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute("data-index"), 10);
      goToSlide(idx);
      resetAuto();
    });
  });

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener("touchstart", (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextSlide();
      else prevSlide();
      resetAuto();
    }
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, 5000);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  if (container) {
    container.addEventListener("mouseenter", stopAuto);
    container.addEventListener("mouseleave", startAuto);
  }

  startAuto();
}
