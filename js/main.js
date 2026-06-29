if (typeof CONFIG === 'undefined') {
    alert("Aviso: Arquivo 'config.js' não encontrado!");
    window.CONFIG = { startDate: '2000-01-01T00:00:00', title: "...", music: {audioSrc: ""}, slides: [], loveReasons: [], milestones: [] };
}

const audio = document.getElementById('ambient-audio');
const musicMode = CONFIG.musicMode || 'player1';
const musicDelay = CONFIG.musicDelay || 0;
let currentTrackIndex = 0;
let playlist = [];
let isDelaying = false;
let hasInteracted = false;
let isAudioError = false;

// Inicializar playlist
if (CONFIG.musicPlaylist && CONFIG.musicPlaylist.length > 0) {
    playlist = CONFIG.musicPlaylist;
} else if (CONFIG.music && CONFIG.music.audioSrc) {
    playlist = [CONFIG.music];
}

function disablePlayerCompletely() {
    isAudioError = true;
    const unknown = "Desconhecido";
    updateUI(unknown, unknown);
    
    const allBtns = [
        document.getElementById('prev-btn'),
        document.getElementById('next-btn'),
        document.getElementById('play-pause-btn'),
        document.getElementById('floating-prev-btn'),
        document.getElementById('floating-next-btn'),
        document.getElementById('floating-play-pause-btn')
    ];
    
    allBtns.forEach(btn => {
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.4';
            btn.style.cursor = 'not-allowed';
            btn.onclick = null;
        }
    });
}

function updateControlsState(disabled) {
    if (isAudioError) return;
    
    const btns = [
        document.getElementById('prev-btn'),
        document.getElementById('next-btn'),
        document.getElementById('floating-prev-btn'),
        document.getElementById('floating-next-btn')
    ];
    btns.forEach(btn => {
        if (btn) {
            btn.disabled = disabled;
            btn.style.opacity = disabled ? '0.4' : '1';
            btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
        }
    });

    const playPauseBtns = [
        document.getElementById('play-pause-btn'),
        document.getElementById('floating-play-pause-btn')
    ];
    
    playPauseBtns.forEach(btn => {
        if (btn) {
            const playIcon = btn.querySelector('svg[id$="play-icon"]');
            const pauseIcon = btn.querySelector('svg[id$="pause-icon"]');
            const spinner = btn.querySelector('.loading-spinner');
            
            if (disabled) {
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = 'none';
                if (spinner) spinner.style.display = 'block';
            } else {
                if (spinner) spinner.style.display = 'none';
                syncIcons();
            }
        }
    });
}

function loadTrack(index, autoPlay = false) {
    if (playlist.length === 0) {
        disablePlayerCompletely();
        return;
    }
    
    const track = playlist[index];
    audio.src = track.audioSrc;
    updateUI(track.title, track.artist);
    updatePlaylistButtons();

    if (autoPlay && hasInteracted) {
        if (musicDelay > 0) {
            isDelaying = true;
            updateControlsState(true);
            setTimeout(() => {
                isDelaying = false;
                updateControlsState(false);
                audio.play().catch(() => {});
            }, musicDelay);
        } else {
            audio.play().catch(() => {});
        }
    }
}

// Verificação de erro de áudio (arquivo não encontrado ou erro de carregamento)
audio.addEventListener('error', function() {
    disablePlayerCompletely();
});

function updateUI(title, artist) {
    const ids = ['music-track-name', 'floating-track-name'];
    const artistIds = ['music-artist-name', 'floating-artist-name'];
    
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = title;
    });
    artistIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = artist;
    });
}

function updatePlaylistButtons() {
    if (isAudioError) return;
    
    const prevBtns = [document.getElementById('prev-btn'), document.getElementById('floating-prev-btn')];
    const nextBtns = [document.getElementById('next-btn'), document.getElementById('floating-next-btn')];
    
    const isSingleTrack = playlist.length === 1;
    
    const setBtnIcon = (btn, isReset) => {
        if (!btn) return;
        if (isReset) {
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>';
            btn.title = "Reiniciar";
            btn.onclick = (e) => {
                e.stopPropagation();
                audio.currentTime = 0;
                if (hasInteracted) audio.play().catch(() => {});
            };
        }
    };

    if (isSingleTrack) {
        prevBtns.forEach(btn => { if(btn) btn.style.display = 'none'; });
        nextBtns.forEach(btn => { if(btn) setBtnIcon(btn, true); });
    }
}

function syncIcons() {
    if (isAudioError) return;
    const playing = !audio.paused;
    const playIcons = [document.getElementById('play-icon'), document.getElementById('floating-play-icon')];
    const pauseIcons = [document.getElementById('pause-icon'), document.getElementById('floating-pause-icon')];
    const equalizers = [document.getElementById('eq-widget'), document.getElementById('floating-eq-widget')];

    playIcons.forEach(icon => { if(icon) icon.style.display = playing ? 'none' : 'block'; });
    pauseIcons.forEach(icon => { if(icon) icon.style.display = playing ? 'block' : 'none'; });
    equalizers.forEach(eq => { if(eq) eq.classList.toggle('active', playing); });
}

loadTrack(currentTrackIndex);

audio.addEventListener('play', syncIcons);
audio.addEventListener('pause', syncIcons);
audio.addEventListener('ended', function() {
    if (playlist.length === 1) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex, true);
    }
});

// Player 1 Controls
const playPauseBtn = document.getElementById('play-pause-btn');
if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function() {
        if (isAudioError) return;
        hasInteracted = true;
        if (audio.paused) { audio.play().catch(() => {}); } 
        else { audio.pause(); }
    });
}

const prevBtn = document.getElementById('prev-btn');
if (prevBtn) {
    prevBtn.addEventListener('click', function() {
        if (isAudioError || isDelaying) return;
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex, true);
    });
}

const nextBtn = document.getElementById('next-btn');
if (nextBtn) {
    nextBtn.addEventListener('click', function() {
        if (isAudioError || isDelaying) return;
        if (playlist.length > 1) {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(currentTrackIndex, true);
        }
    });
}

// Player 2 Controls
if (musicMode === 'player2') {
    document.getElementById('sec-music-player').style.display = 'none';
    const bubble = document.getElementById('floating-music-bubble');
    const floatingPlayer = document.getElementById('floating-player');
    const floatingCloseBtn = document.getElementById('floating-player-close');
    const floatingPlayPauseBtn = document.getElementById('floating-play-pause-btn');
    const floatingPrevBtn = document.getElementById('floating-prev-btn');
    const floatingNextBtn = document.getElementById('floating-next-btn');

    bubble.style.display = 'flex';
    bubble.addEventListener('click', () => {
        if (isAudioError) {
            floatingPlayer.classList.add('open');
            return;
        }
        if (!hasInteracted) {
            hasInteracted = true;
            audio.play().catch(() => {});
        }
        floatingPlayer.classList.add('open');
    });
    
    floatingCloseBtn.addEventListener('click', () => floatingPlayer.classList.remove('open'));

    if (floatingPlayPauseBtn) {
        floatingPlayPauseBtn.addEventListener('click', function() {
            if (isAudioError) return;
            hasInteracted = true;
            if (audio.paused) { audio.play().catch(() => {}); } 
            else { audio.pause(); }
        });
    }

    if (floatingPrevBtn) {
        floatingPrevBtn.addEventListener('click', function() {
            if (isAudioError || isDelaying) return;
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrackIndex, true);
        });
    }

    if (floatingNextBtn) {
        floatingNextBtn.addEventListener('click', function() {
            if (isAudioError || isDelaying) return;
            if (playlist.length > 1) {
                currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
                loadTrack(currentTrackIndex, true);
            }
        });
    }
}

// Resto do script (contador, galeria, etc)
if (CONFIG.slides && CONFIG.slides.length > 0) {
    CONFIG.slides.forEach(slideData => {
        const preloadedImg = new Image();
        preloadedImg.src = slideData.img;
    });
}

document.getElementById('main-title').innerText = CONFIG.title;
document.getElementById('main-subtitle').innerText = CONFIG.subtitle;
document.getElementById('footer-brand-val').innerText = CONFIG.footerBrand;
document.getElementById('counter-title').innerText = CONFIG.counterTitle || "Nos amamos há:";
document.getElementById('counter-suffix').innerText = CONFIG.counterSuffix || "dias";

const f = CONFIG.features || {};
if (f.showTotalDays === false) document.getElementById('sec-total-days').style.display = 'none';
if (f.showCounterGrid === false) document.getElementById('sec-counter-grid').style.display = 'none';
if (f.showLiveClock === false) document.getElementById('sec-live-clock').style.display = 'none';
if (f.showMusicPlayer === false) document.getElementById('sec-music-player').style.display = 'none';
if (f.showGallery === false) document.getElementById('sec-gallery').style.display = 'none';
if (f.showLoveReasons === false) document.getElementById('sec-love-reasons').style.display = 'none';
if (f.showMilestones === false) document.getElementById('sec-milestones').style.display = 'none';

if (f.showGallery !== false) {
    const track = document.getElementById('slider-track');
    const dotsContainer = document.getElementById('slider-dots-container');
    CONFIG.slides.forEach((slideData, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('slide');
        slideDiv.innerHTML = `<img src="${slideData.img}" alt="Momento ${idx + 1}" loading="eager"><div class="slide-caption">${slideData.caption}</div>`;
        track.appendChild(slideDiv);
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if(idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => jumpToSlide(idx));
        dotsContainer.appendChild(dot);
    });
}

if (f.showMilestones !== false) {
    const timelineContainer = document.getElementById('timeline-container');
    CONFIG.milestones.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('timeline-item');
        itemDiv.innerHTML = `<div class="timeline-badge">${item.icon}</div><div class="timeline-content"><div class="timeline-title">${item.title}</div><div class="timeline-date">${item.date}</div></div>`;
        timelineContainer.appendChild(itemDiv);
    });
}

const startDateTime = new Date(CONFIG.startDate);
function liveChronometer() {
    const now = new Date();
    let years = now.getFullYear() - startDateTime.getFullYear();
    let months = now.getMonth() - startDateTime.getMonth();
    let days = now.getDate() - startDateTime.getDate();
    if (days < 0) { months--; const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0); days += previousMonth.getDate(); }
    if (months < 0) { years--; months += 12; }
    if (f.showCounterGrid !== false) {
        document.getElementById('years-val').innerText = String(years).padStart(2, '0');
        document.getElementById('months-val').innerText = String(months).padStart(2, '0');
        document.getElementById('days-val').innerText = String(days).padStart(2, '0');
    }
    if (f.showTotalDays !== false) {
        const msDifference = Math.abs(now - startDateTime);
        const totalDaysCount = Math.floor(msDifference / (1000 * 60 * 60 * 24));
        document.getElementById('total-days-val').innerText = totalDaysCount.toLocaleString('pt-BR');
    }
    if (f.showLiveClock !== false) {
        document.getElementById('live-clock-val').innerText = `${String(now.getHours()).padStart(2, '0')} : ${String(now.getMinutes()).padStart(2, '0')} : ${String(now.getSeconds()).padStart(2, '0')}`;
    }
}
liveChronometer();
setInterval(liveChronometer, 1000);

let currentSlideIdx = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const sliderWrapperEl = document.querySelector('.slider-wrapper');

function adjustSliderHeight() {
    if (!sliderWrapperEl || slides.length === 0) return;
    const activeSlide = slides[currentSlideIdx];
    const img = activeSlide ? activeSlide.querySelector('img') : null;
    if (!img) return;
    const applyHeight = () => {
        requestAnimationFrame(() => {
            const ratio = img.naturalWidth / img.naturalHeight;
            if (!ratio || !isFinite(ratio)) return;
            const width = sliderWrapperEl.clientWidth;
            let height = Math.max(260, Math.min(width / ratio, 620));
            sliderWrapperEl.style.height = height + 'px';
        });
    };
    if (img.complete && img.naturalWidth) applyHeight();
    else img.addEventListener('load', applyHeight, { once: true });
}

function updateSliderPosition() {
    const trackElement = document.getElementById('slider-track');
    if(trackElement) trackElement.style.transform = `translateX(-${currentSlideIdx * 100}%)`;
    dots.forEach((dot, idx) => { dot.classList.toggle('active', idx === currentSlideIdx); });
    adjustSliderHeight();
}

window.moveSlide = function(direction) {
    if(slides.length === 0) return;
    currentSlideIdx += direction;
    if (currentSlideIdx >= slides.length) currentSlideIdx = 0;
    if (currentSlideIdx < 0) currentSlideIdx = slides.length - 1;
    updateSliderPosition();
}

function jumpToSlide(idx) {
    currentSlideIdx = idx;
    updateSliderPosition();
}

adjustSliderHeight();
window.addEventListener('resize', adjustSliderHeight);

window.generateReason = function() {
    const display = document.getElementById('reason-display');
    if(!display) return;
    display.style.opacity = '0';
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * CONFIG.loveReasons.length);
        display.innerText = CONFIG.loveReasons[randomIndex];
        display.style.opacity = '1';
    }, 250);
}
