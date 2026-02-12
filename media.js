document.addEventListener('DOMContentLoaded', () => {
    // --- ROBUST MUSIC PLAYER (Simple IFrame Method) ---
    // Instead of using the complex YouTube IFrame API which can fail on local files,
    // we use a direct IFrame src manipulation method.

    const musicButtons = document.querySelectorAll('.genre-btn');
    const musicPlayerContainer = document.getElementById('music-player-wrapper');
    const currentTrackLabel = document.getElementById('current-track');
    const playPauseBtn = document.getElementById('music-play-pause');

    // We will create/replace an iframe directly
    let currentVideoId = 'jfKfPfyJRdk'; // Default Lofi
    let isPlaying = false;

    // Initialize player on first load? Or wait for interaction?
    // Let's create an empty iframe first within the wrapper
    musicPlayerContainer.innerHTML = `<iframe id="music-iframe" width="0" height="0" src="" frameborder="0" allow="autoplay; encrypted-media"></iframe>`;

    const playerIframe = document.getElementById('music-iframe');

    // Genre Button Logic
    musicButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = btn.getAttribute('data-video');
            const genreName = btn.textContent;

            playVideo(videoId, genreName);
        });
    });

    function playVideo(videoId, trackName) {
        currentVideoId = videoId;
        // Construct embed URL with autoplay
        // Using 'ecver=2' sometimes helps with certain controls
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&enablejsapi=1`;

        playerIframe.src = embedUrl;

        if (trackName) {
            currentTrackLabel.textContent = `Now Playing: ${trackName}`;
        }

        isPlaying = true;
        updatePlayPauseIcon();
    }

    function stopVideo() {
        // Clearing src stops the video
        playerIframe.src = '';
        isPlaying = false;
        updatePlayPauseIcon();
        currentTrackLabel.textContent = "Music Paused";
    }

    function updatePlayPauseIcon() {
        playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    }

    // Play/Pause Button Logic
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopVideo();
        } else {
            // Resume/Restart current video
            playVideo(currentVideoId, currentTrackLabel.textContent.replace('Now Playing: ', '').replace('Music Paused', 'Resuming...'));
        }
    });

    // --- SEARCH LOGIC ---
    const searchInput = document.getElementById('music-search-input');
    const searchBtn = document.getElementById('music-search-btn');

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    function handleSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Check for direct link
        const videoId = extractVideoID(query);
        if (videoId) {
            playVideo(videoId, "Shared Song");
            return;
        }

        // Keywords fallback
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('lofi')) playVideo('jfKfPfyJRdk', 'Lofi Beats');
        else if (lowerQuery.includes('jazz')) playVideo('DX7f7c46114', 'Jazz Radio');
        else if (lowerQuery.includes('pop')) playVideo('36YnV9STBqc', 'Pop Mix');
        else if (lowerQuery.includes('classical')) playVideo('mCDSf5Hh8e0', 'Classical');
        else if (lowerQuery.includes('rock')) playVideo('pAtX800eGgg', 'Classic Rock'); // Placeholder
        else {
            alert("For specific songs, please paste a YouTube link! Playing default Lofi.");
            playVideo('jfKfPfyJRdk', 'Lofi Beats (Default)');
        }
    }


    // --- VIDEO SHOWCASE PLAYER (Separate) ---
    const loadVideoBtn = document.getElementById('load-video');
    const videoInput = document.getElementById('video-url');
    const videoFrame = document.getElementById('video-frame');

    if (loadVideoBtn) {
        loadVideoBtn.addEventListener('click', () => {
            const url = videoInput.value;
            const videoId = extractVideoID(url); // Re-use extract function
            if (videoId) {
                videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            } else {
                alert('Please enter a valid YouTube URL');
            }
        });
    }

    // Helper: Extract YouTube Video ID from URL
    function extractVideoID(url) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
});
