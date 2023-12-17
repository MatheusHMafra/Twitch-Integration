/*
- Canal alternativo caso
- Não tenha canal na url
- ou seja o index.html
*/
var channelElement = document.getElementById("channel");
var channelError = document.getElementById("mensagemErro");
var multiError = document.getElementById("mensagemErroMulti");

// Pegar o canal a partir da url
var channel;

// Pegar o canal a partir do input com id channel
document.getElementById("botao").addEventListener("click", function () {
    channel = channelElement.value;
    if (channel == '') {
        channelError.innerHTML = "Digite um canal (Não pode ser vazio)";
    } else {
        channelError.innerHTML = "";
        window.location.href = `stream.html?channel=${channel}`;
    }
});

// Pegar os canais a partir do input com id multiChannels
document.getElementById("multiBotao").addEventListener("click", function () {
    var multiChannels = document.getElementById("multiChannels").value;
    if (multiChannels == '') {
        multiError.innerHTML = "Digite um canal (Não pode ser vazio)";
    } else {
        multiError.innerHTML = "";
        // Separar os canais por vírgula
        multiChannels = multiChannels.split(',');
        // Para cada canal, adicionar o canal na url
        for (var i = 0; i < multiChannels.length; i++) {
            if (i == 0) {
                multiChannels[i] = `?channel=${multiChannels[i]}`;
            } else {
                multiChannels[i] = `&${multiChannels[i]}`;
            }
        }
        // Adicionar o canal na url
        window.location.href = `multistream.html${multiChannels.join('')}`;
    }
});

if (window.location.href.includes('?channel=')) {
    // Pegar o canal apenas apoós o ?channel= e nao pegar o resto da url
    channel = window.location.href.split('?channel=')[1].split('&')[0];

    window.location.href = `stream.html?channel=${channel}`;
}