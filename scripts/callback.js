const CLIENT_ID = '4f6124ce11ce4ce3b36f0daca131fd56';
const REDIRECT_URI = window.location.origin + '/callback.html';

async function handleCallback(){
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if(error){
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('msg').className = 'error';
        document.getElementById('msg').textContent = 'Acesso negado. Volte e tente novamente';
        setTimeout(() => window.location.href = '/', 3000);
        return;
    }

    if(!code){
        window.location.href = '/index.html';
        return;
    }

    const verifier = localStorage.getItem('pkce_verifier');
    if(!verifier){
        window.location.href = '/index.html';
        return;
    }
    
    try{
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            code_verifier: verifier,
        });

        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body,
        });

        const data = await res.json();

        if(data.access_token){
            localStorage.setItem('spotify_token', data.access_token);
            localStorage.setItem('token_expires', Date.now() + data.expires_in * 1000);
            localStorage.removeItem('pkce_verifier');
            window.location.href = '/index.html';
        } else {
            throw new Error(data.error_description || 'Erro desconhecido');
        }
    } catch (err) {
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('msg').className = 'error';
        document.getElementById('msg').textContent = 'Erro ao autenticar: ' + err.message;
        setTimeout(() => window.location.href = '/', 4000);
    }
}

handleCallback();