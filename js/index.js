// Elementos da página
const channelElement = document.getElementById("channel");
const multiChannelsElement = document.getElementById("multiChannels");

// Inputs customizados
const checkboxes = document.querySelectorAll("input[name=configs]");

// Elementos de erro
const channelError = document.getElementById("mensagemErro");
const multiError = document.getElementById("mensagemErroMulti");

// Pegar o canal a partir da url
var channel;

// Pegar o canal a partir do input com id channel
document.getElementById("botao").addEventListener("click", function () {
    channel = channelElement.value;
    if (channel == '') {
        channelError.innerHTML = "Digite um canal (Não pode ser vazio)";
    } else {
        channelError.innerHTML = "";
        // Inicialize a variável link
        var link = "stream.html?channel=" + channel;

        // Itere sobre os checkboxes para verificar o estado de seleção e atualizar a variável link
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                link += "&" + checkbox.id;
            }
        });

        // Aqui, você pode usar a variável link conforme necessário (por exemplo, redirecionar para a nova URL)
        console.log("Link final: " + link);
        window.location.href = link;
    }
});

// Pegar os canais a partir do input com id multiChannels
document.getElementById("multiBotao").addEventListener("click", function () {
    var multiChannels = multiChannelsElement.value;
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