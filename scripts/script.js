const CLIENT_ID = '4f6124ce11ce4ce3b36f0daca131fd56';
const REDIRECT_URI = window.location.origin + '/spotify-app/callback.html';
const SCOPES = [
    'user-top-read',
    'user-read-recently-played',
    'user-read-private',
].join(' ');

function generateCodeVerifier(length = 128){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    arr.forEach(v => result += chars[v % chars.length]);
    return result;
}

async function generateCodeChallenge(verifier){
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function startLogin(){
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    sessionStorage.setItem('pkce_verifier', verifier);

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        code_challenge_method: 'S256',
        code_challenge: challenge,
    });

    window.location.href = 'https://accounts.spotify.com/authorize?' + params;
}

async function exchangeCode(code){
    const verifier = sessionStorage.getItem('pkce_verifier');
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: verifier,
    });

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
        body: body,
    });

    const data = await res.json();
    if (data.access_token){
        localStorage.setItem('spotify_token', data.access_token);
        localStorage.setItem('token_expires', Date.now() + data.expires_in * 1000);
        localStorage.removeItem('pkce_verifier');
        return data.access_token;
    }
    throw new Error('falha ao obter token: ' + JSON.stringify(data));
}

function getToken(){
    const token = localStorage.getItem('spotify_token');
    const expires = parseInt(localStorage.getItem('token_expires') || '0');
    if (token && Date.now() < expires) return token;
    return null;
}

function logout(){
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('token_expires');
    location.reload();
}

async function spotifyFetch(path, token){
    const res = await fetch('https://api.spotify.com/v1' + path, {
        headers: {Authorization: 'Bearer ' + token}
    });
    if(res.status === 401) { logout(); return null;}
    return res.json();
}

let currentToken = null;
let currentData = {};

function setLoading(text){
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'none';
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('loading-text').textContent = text;
}

function showApp(){
    document.getElementById('loading').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

async function loadData(range){
    setLoading('Carregando seus dados do Spotify...');

    const [tracks, artistsTop, recent] = await Promise.all([
        spotifyFetch(`/me/top/tracks?time_range=${range}&limit=20`, currentToken),
        spotifyFetch(`/me/top/artists?time_range=${range}&limit=20`, currentToken),
        spotifyFetch('/me/player/recently-played?limit=10', currentToken),
    ]);

    const ids = (artistsTop?.items || []).map(a => a.id).join(',');
    const artistsDetail = ids
        ? await spotifyFetch(`/artists?ids=${ids}`, currentToken)
        : null;

    const artists = {
        ...artistsTop,
        items: artistsDetail?.artists || artistsTop?.items || []
    };

    currentData[range] = {tracks, artists, recent};
    renderAll(range);
    showApp();
}

async function loadUser() {
    const user = await spotifyFetch('/me', currentToken);
    if (!user) return;

    document.getElementById('user-avatar-label').textContent = user.display_name || user.id;
    const wrap = document.getElementById('user-avatar-wrap');
    if (user.images && user.images[0]){
        wrap.innerHTML = `<img src="${user.images[0].url}" alt="">`;
    } else{
        wrap.textContent = (user.display_name || '?')[0].toUpperCase();
    }
}

function renderAll(range){
    const {tracks, artists, recent} = currentData[range];

    document.getElementById('stat-artists').textContent = artists?.items?.length ?? '-';
    document.getElementById('stat-tracks').textContent = tracks?.items?.length ?? '-';

    const artistCount = {};
    (tracks?.items || []).forEach(track => {
        track.artists.forEach(a => { artistCount[a.name] = (artistCount[a.name] || 0) + 1;});
    });

    const sortedGenres = Object.entries(artistCount).sort((a, b) => b[1] - a[1]);
    const topGenre = sortedGenres[0];
    document.getElementById('stat-genre').textContent = topGenre ? topGenre[0] : '-';

    const trackList = document.getElementById('track-list');
    const trackItems = tracks?.items || [];
    document.getElementById('tracks-count').textContent = trackItems.length + ' músicas';
    trackList.innerHTML = trackItems.map((t, i) => {
        const img = t.album?.images?.[2]?.url || t.album?.images?.[0]?.url || '';
        const pop = t.popularity || 50;
        return `
        <div class="track-item">
        <div class="track-num ${i < 3 ? 'top' : ''}">${i + 1}</div>
        ${img ? `<img class="track-cover" src="${img}" alt="">` : '<div class="track-cover"></div>'}
        <div class="track-info">
          <div class="track-name">${t.name}</div>
          <div class="track-artist">${t.artists.map(a => a.name).join(', ')}</div>
        </div>
        <div class="track-bar-wrap">
          <div class="track-bar" style="width:${pop}%"></div>
        </div>
        </div>`;
    }).join('');

    const artistGrid = document.getElementById('artist-grid');
    const artistItems = artists?.items || [];
    document.getElementById('artist-count').textContent = artistItems.length + ' artistas';
    artistGrid.innerHTML = artistItems.slice(0,20).map((a, i) => {
    const img = a.images?.[1]?.url || a.images?.[0]?.url || '';
    const genres = a.genres?.slice(0, 2).join(', ') || '';
    return `
      <div class="artist-card">
        <div class="artist-rank">#${i + 1}</div>
        ${img ? `<img class="artist-img" src="${img}" alt="">` : '<div class="artist-img"></div>'}
        <div class="artist-name">${a.name}</div>
        ${genres ? `<div class="artist-genres">${genres}</div>` : ''}
      </div>`;
    }).join('');

    const genreList = document.getElementById('genre-list');
    const maxCount = sortedGenres[0]?.[1] || 1;
    genreList.innerHTML = sortedGenres.slice(0, 8).map(([name, count]) => `
        <div class="genre-item">
        <div class="genre-name">${name}</div>
        <div class="genre-bar-wrap">
        <div class="genre-bar" style="width:${Math.round(count / maxCount * 100)}%"></div>
        </div>
        <div class="genre-count">${count}</div>
        </div>`
    ).join('');

    const recentList = document.getElementById('recent-list');
    const recentItems = recent?.items || [];
    recentList.innerHTML = recentItems.map(item => {
        const t = item.track;
        const img = t.album?.images?.[2]?.url || '';
        const playedAt = new Date(item.played_at);
        const timeLabel = playedAt.toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
        return `
            <div class="recent-item">
            ${img ? `<img class="recent-cover" src="${img}" alt="">` : '<div class="recent-cover"></div>'}
            <div>
            <div class="recent-name">${t.name}</div>
            <div class="recent-artist">${t.artists.map(a => a.name).join(', ')}</div>
            </div>
            <div class="recent-time">${timeLabel}</div>
            </div>`;
    }).join('');
}

async function switchRange(range, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    if (currentData[range]) {
        renderAll(range);
    } else {
        await loadData(range);
    }
}

async function init(){
    const storedToken = getToken();
    if (storedToken) {
        currentToken = storedToken;
        await loadUser();
        await loadData('short_term');
        return;
    }
    
    document.getElementById('login-screen').style.display = 'flex';
}

init();