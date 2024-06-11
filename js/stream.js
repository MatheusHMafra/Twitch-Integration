/*
Elementos
*/

const liveElement = document.getElementById('live');
const countElement = document.getElementById('counts');
const usersElement = document.getElementById('users');
const chat = document.getElementById('chat');
const statusElement = document.getElementById('status');
const streamerElement = document.getElementById('streamer');
const mainElement = document.getElementById('main');

/*
Configurações

- Emotes e Badges estão em outro arquivo
(Arquivo: js/array.js)
- Variáveis
- Configurações gerais
*/
var listeningForCount = false;
var users = {};

// Pegar o canal a partir da url
var channel;

// E/ou pegar o canal a partir da url
if (window.location.href.includes('?channel=')) {
    // Pegar o canal apenas apoós o ?channel= e nao pegar o resto da url
    channel = window.location.href.split('?channel=')[1].split('&')[0];
    // Mostrar quem é o streamer e mostrar o chat
    streamerElement.innerHTML = `Streamer: ${channel}`;

    // Mostar a live do canal
    liveElement.innerHTML = `<iframe src="https://player.twitch.tv/?channel=${channel}&parent=${config.link}" height="600px"
    width="60%" frameborder="0"></iframe>`;
}

if (!channel) {
    mainElement.innerHTML = `Canal não encontrado`;
}

// Se tiver &count na url, não mostrar o contador de pessoas
if (!window.location.href.includes('&count')) {
    countElement.remove();
    usersElement.remove();
    chat.style.width = '100%';
}

if (window.location.href.includes('&nochat')) {
    chat.remove();
    document.querySelector('iframe').style.width = '70%';
    document.querySelector('iframe').style.height = '700px';
}

if (window.location.href.includes('&noemotes')) {
    emotes = {};
}

// Conectar ao chat
const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: [channel]
});

client.connect().then(() => {
    statusElement.innerHTML = `Status: <span style="color: green;">Online</span>`;
}).catch((err) => {
    statusElement.innerHTML = `Status: <span style="color: red;">Offline</span>`;
    console.error('Erro ao conectar ao chat');
    console.error(err);
    console.error(err.message);
});

client.on('message', (channel, tags, message, self) => {
    // Ignora mensagens de si mesmo
    if (self) return;

    // Se for o dono do canal e ele mandar !count, mostrar quantas pessoas únicas tem no chat
    if (tags.username === channel && message === '!count') {
        listeningForCount = true;
        users = {};
        return;
    }

    // Resultado final
    var resultado = '';

    // Adicionar icones de mod, sub, vip, etc junto com a mensagem
    if (tags.badges) {
        resultado += gerarBadge(tags.badges);
    }

    // Adicionar emotes junto com a mensagem
    var mensagem = transformMessage(getMessageHTML(message, tags));

    // Adicionar mensagem
    resultado += `
        <h3 style = "color: ${tags.color};">
            ${tags['display-name']}: ${mensagem}</h3> `;

    // Adicionar resultado na div
    const div = document.createElement('div');
    div.innerHTML = resultado;

    // Se chegar a numero máximo de mensagens, apagar o final do chat
    if (chat.childElementCount >= config.maximo) {
        chat.removeChild(chat.firstChild);
    }

    // Se chegar ao número máximo de usuários no elemento, remover os mais antigos
    if (usersElement.childElementCount >= config.maximoPessoas) {
        usersElement.removeChild(usersElement.firstElementChild);
    }

    // Adicionar mensagem no chat
    chat.appendChild(div);

    // Listar usuários unicos
    if (listeningForCount) {
        users[tags.username] = true;
        // Mostrar pessoas únicas
        countElement.innerHTML = `Pessoas únicas: ${Object.keys(users).length} `;
        // Mostrar quantidade de pessoas
        usersElement.innerHTML = `${Object.keys(users).join(', ')} `;

        if (Object.keys(users).length >= config.maximoPessoas) {
            listeningForCount = false;
        }
    }
});

/*
Funções

- getMessageHTML: Transforma a mensagem caso tenha emotes da twitch
- transformMessage: Transforma a mensagem caso tenha emotes no array emotes
- gerarBadge: Gera as badges
*/

//---------------------------------------------------------------\\
function getMessageHTML(message, { emotes }) {
    if (!emotes) return message;

    // store all emote keywords
    // ! you have to first scan through 
    // the message string and replace later
    const stringReplacements = [];

    // iterate of emotes to access ids and positions
    Object.entries(emotes).forEach(([id, positions]) => {
        // use only the first position to find out the emote key word
        const position = positions[0];
        const [start, end] = position.split("-");
        const stringToReplace = message.substring(
            parseInt(start, 10),
            parseInt(end, 10) + 1
        );

        stringReplacements.push({
            stringToReplace: stringToReplace,
            replacement: `<img src = "https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0"> `,
        });
    });

    // generate HTML and replace all emote keywords with image elements
    const messageHTML = stringReplacements.reduce(
        (acc, { stringToReplace, replacement }) => {
            // obs browser doesn't seam to know about replaceAll
            return acc.split(stringToReplace).join(replacement);
        },
        message
    );

    return messageHTML;
}

//---------------------------------------------------------------\\
function transformMessage(message) {
    var resultado = '';
    var mensagem = message.split(' ');
    mensagem.forEach(element => {
        if (emotes[element]) {
            resultado += `<img src = "${emotes[element]}" width = "20px" height = "20px"> `;
        } else {
            resultado += element;
        }
        resultado += ' ';
    });
    return resultado;
}

//---------------------------------------------------------------\\
function gerarBadge(badge) {
    var resultado = '';
    for (const key in badge) {
        if (key == 'subscriber') {
            if (badge[key] == '0') {
                resultado += `<img src = "${badgesSubscribers[0]}" alt = "${badgesSubscribers[0]}" width = "20px" height = "20px"> `;
            } else if (badgesSubscribers[badge[key]]) {
                resultado += `<img src = "${badgesSubscribers[badge[key]]}" alt = "${badgesSubscribers[badge[key]]}" width = "20px" height = "20px"> `;
            }
        } else if (badge.hasOwnProperty(key) && badges.hasOwnProperty(key) && badge[key] === '1') {
            if (badges[key]) {
                resultado += `<img src = "${badges[key]}" alt = "${badges[key]}" width = "20px" height = "20px"> `;
            }
        }
    }
    return resultado;
}