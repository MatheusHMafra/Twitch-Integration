/*
Elementos
*/
const liveElement = document.getElementById('lives');

// Multi stream elements
if (window.location.href.includes('?channel=')) {
    // Para cada canal apoós o ?channel= e nao pegar o resto da url
    // Exemplo: ?channel=matheushmafra&channel=felps
    for (let channel of window.location.href.split('?channel=')[1].split('&')) {
        // Criar um iframe para cada canal
        liveElement.innerHTML += `<iframe src="https://player.twitch.tv/?channel=${channel}&parent=matheushmafra.github.io" height="500px"
        width="50%" frameborder="0"></iframe>`;
    }
}