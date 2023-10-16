const countElement = document.getElementById('counts');
const usersElement = document.getElementById('users');
const chat = document.getElementById('chat');
const statusElement = document.getElementById('status');

var listeningForCount = true;
var users = {};

const config = {
    maximo: 20,
    maximoPessoas: 75,
}

const channel = 'tck10';
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
    // Ignore echoed messages.
    if (self) return;
    const { username } = tags;
    var resultado = '';

    // Adicionar icones de mod, sub, vip, etc junto com a mensagem
    if (tags.badges) {
        resultado += gerarBadge(tags.badges);
    }
    // Adicionar emotes junto com a mensagem
    var mensagem = transformMessage(getMessageHTML(message, tags));
    // Adicionar mensagem
    resultado += `
    <h3 style="color: ${tags.color};">
        ${tags['display-name']}: ${mensagem}</h3>`;
    // Adicionar resultado na div
    const div = document.createElement('div');
    div.innerHTML = resultado;

    // Se chegar a numero máximo de mensagens, apagar o final do chat
    if (chat.childElementCount >= config.maximo) {
        chat.removeChild(chat.firstChild);
    }

    chat.appendChild(div);

    if (listeningForCount) {
        users[tags.username] = true;
        // display current count page.
        countElement.innerHTML = `Pessoas únicas: ${Object.keys(users).length}`;
        // display current users.
        usersElement.innerHTML = `<h3>${Object.keys(users).join(", ")}</h3>`;
        if (usersElement.childElementCount >= config.maximo) {
            listeningForCount = false;
        }
    }
});

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
            replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0">`,
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

function transformMessage(message) {
    var resultado = '';
    var mensagem = message.split(' ');
    mensagem.forEach(element => {
        if (emotes[element]) {
            resultado += `<img src="${emotes[element]}" width="20px" height="20px">`;
        } else {
            resultado += element;
        }
        resultado += ' ';
    });
    return resultado;
}

function gerarBadge(badge) {
    var resultado = '';
    for (const key in badge) {
        // Verificar o mês do sub
        if (key == 'subscriber') {
            if (badge[key] == '0') {
                resultado += `<img src="${badgesSubscribers[0]}" width="20px" height="20px">`;
            } else {
                resultado += `<img src="${badgesSubscribers[badge[key]]}" width="20px" height="20px">`;
            }
        }
        else if (badge.hasOwnProperty(key)) {
            const element = badge[key];
            if (element == '1') {
                resultado += `<img src="${badges[key]}" width="20px" height="20px">`;
            }
        }
    }
    return resultado;
}