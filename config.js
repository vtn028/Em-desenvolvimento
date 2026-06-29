const CONFIG = {
    // --------------------------------------------------
    // 1. CONTROLE DE SEÇÕES (Ligar/Desligar partes do site)
    // --------------------------------------------------
    features: {
        showTotalDays: true,
        showCounterGrid: true,
        showLiveClock: true,
        showMusicPlayer: true,
        showGallery: true,
        showLoveReasons: true,
        showMilestones: false
    },

    // --------------------------------------------------
    // 2. TEXTOS INICIAIS E DATA
    // --------------------------------------------------
    startDate: "2000-01-01T00:00:00",
    
    title: "Título 1",
    subtitle: "Subtítulo 1",
    
    // VARIÁVEIS DO CONTADOR EDITÁVEIS AQUI:
    counterTitle: "Titulo Time:",
    counterSuffix: "dias",
    
    // --------------------------------------------------
    // 3. MÚSICA
    // --------------------------------------------------
    musicMode: "player2", // 'player1' ou 'player2'
    
    // Tempo de atraso entre as músicas (em milissegundos)
    musicDelay: 2000, 
    
    // CONFIGURAÇÃO DA PLAYLIST
    musicPlaylist: [
        {
            title: "Music 1",
            artist: "Autor 1",
            audioSrc: "audio/musica1.mp3"
        },
        {
            title: "Music 2",
            artist: "Autor 2",
            audioSrc: "audio/musica2.mp3"
        }
    ],
    
    // Caso não queira usar playlist, preencha aqui (será ignorado se musicPlaylist tiver itens)
    music: {
        title: "Music",
        artist: "Autor",
        audioSrc: "audio/musica.mp3" 
    },
    
    // --------------------------------------------------
    // 4. FOTOS DO CARROSSEL
    // --------------------------------------------------
    slides: [
        { img: "images/Foto 1.jpg", caption: "Texto da Foto1" },
        { img: "images/Foto 2.jpg", caption: "Texto da Foto2" },
        { img: "images/Foto 3.jpg", caption: "Texto da Foto3" },
        { img: "images/Foto 4.jpg", caption: "Texto da Foto4" }
    ],
    
    // --------------------------------------------------
    // 5. FRASES DA SURPRESA DO DIA
    // --------------------------------------------------
    loveReasons: [
        "Mensagem 1", "Mensagem 2", "Mensagem 3", "Mensagem 4", "Mensagem 5", "Mensagem 6"
    ],
    
    // --------------------------------------------------
    // 6. MARCOS HISTÓRICOS (Linha do Tempo)
    // --------------------------------------------------
    milestones: [
        { icon: "❌❗", title: "Null", date: "Not Found!" },
        { icon: "❌❗", title: "Null", date: "Not Found!" }
    ],
    
    footerBrand: "Victor"
};
