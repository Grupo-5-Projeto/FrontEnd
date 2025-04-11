const chatBox = document.getElementById("chat-box");
const inputContainer = document.getElementById("input-container");
const optionsContainer = document.getElementById("options");
const inputField = document.getElementById("input-field");
const userInput = document.getElementById("user-input");
let chatStep = 0;

function addMessage(text, className) {
    const message = document.createElement("div");
    message.classList.add("message-wrapper", className);

    const img = document.createElement("img");
    img.src = className === "bot"
        ? "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
        : "https://cdn-icons-png.flaticon.com/512/1144/1144760.png";
    img.alt = className;
    img.className = "avatar";

    const bubble = document.createElement("div");
    bubble.classList.add("message", className);
    message.appendChild(img);
    message.appendChild(bubble);
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;

    let i = 0;
    function typeEffect() {
        if (i < text.length) {
            bubble.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeEffect, 10); // Tempo entre cada letra (ajustável)
        }
    }
    typeEffect();
}

function showOptions() {
    optionsContainer.style.display = "flex";
    inputField.style.display = "none";
    optionsContainer.innerHTML = "";
    const button = document.createElement("button");
    button.classList.add("option-button");
    button.innerText = "Quero saber qual UPA devo ir";
    button.onclick = handleUserChoice;
    optionsContainer.appendChild(button);
}

function handleUserChoice() {
    addMessage("Quero saber qual UPA devo ir", "user");
    setTimeout(() => {
        addMessage("Ótimo! Por favor, informe o seu CEP.", "bot");
        chatStep = 1;
        optionsContainer.style.display = "none";
        inputField.style.display = "flex";
    }, 700);

    userInput.setAttribute("maxlength", "9");
    userInput.setAttribute("placeholder", "Digite seu CEP (XXXXX-XXX)");
    userInput.addEventListener("input", formatarCEP);
}

function handleUserInput() {
    const inputText = userInput.value.trim();

    if (chatStep === 1) {
        if (inputText.length !== 9) {
            userInput.style.border = "2px solid red";
            const popup = document.createElement("div");
            popup.className = "error-popup";
            popup.innerText = "O CEP deve ter exatamente 9 caracteres no formato XXXXX-XXX.";
            inputContainer.appendChild(popup);

            setTimeout(() => {
                userInput.style.border = "";
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 3000);
            return;
        }
    } else if (chatStep === 2) {
        if (!/^\d+$/.test(inputText) || inputText.length < 1 || inputText.length > 6) {
            alert("O número da residência deve conter entre 1 e 6 dígitos numéricos.");
            return;
        }
    }

    addMessage(inputText, "user");
    userInput.value = "";

    setTimeout(() => {
        if (chatStep === 1) {
            cepInformado = inputText;
            addMessage("Ótimo! Agora, qual o número da sua residência?", "bot");
            chatStep = 2;
            userInput.setAttribute("maxlength", "6");
            userInput.setAttribute("placeholder", "Digite apenas números");
            userInput.removeEventListener("input", formatarCEP);
            userInput.addEventListener("input", bloquearNaoNumeros);
        } else if (chatStep === 2) {
            const numeroResidencia = inputText;

            const loader = document.createElement("div");
            loader.className = "loading-spinner";
            const wrapper = document.createElement("div");
            wrapper.className = "message-wrapper bot";
            const img = document.createElement("img");
            img.src = "https://cdn-icons-png.flaticon.com/512/4712/4712109.png";
            img.className = "avatar";
            wrapper.appendChild(img);
            wrapper.appendChild(loader);
            chatBox.appendChild(wrapper);
            chatBox.scrollTop = chatBox.scrollHeight;

            verificarEnderecoViaCEP(cepInformado, numeroResidencia, wrapper);
        }
    }, 1000);
}


function simulateApiCall(loadingElement) {
    setTimeout(() => {
        chatBox.removeChild(loadingElement); // Remove o loader
        addMessage("Aqui está a melhor UPA para você:", "bot");

        const upaInfo = {
            nome: "UPA Central",
            endereco: "Rua Saúde, 456, Centro",
            distancia: "3 km",
            tempo: "10 minutos",
            transporte: "Carro"
        };

        const upaElement = document.createElement("div");
        upaElement.classList.add("message", "bot");
        upaElement.innerHTML = `
            <strong>${upaInfo.nome}</strong>
            <p>${upaInfo.endereco}</p>
            <p>Distância: ${upaInfo.distancia}</p>
            <p>Tempo estimado: ${upaInfo.tempo}</p>
            <p>Meio de transporte: ${upaInfo.transporte}</p>
            <img src="https://via.placeholder.com/300" alt="Link Maps" style="width:100%;cursor:pointer;" onclick="window.open('https://maps.google.com', '_blank')">
        `;
        chatBox.appendChild(upaElement);

        setTimeout(() => {
            addMessage("Espero ter ajudado! 😊", "bot");
            optionsContainer.style.display = "flex";
            optionsContainer.innerHTML = `
                <button class="restart-button" onclick="startChat()">Recomeçar</button>
            `;
            inputField.style.display = "none";
        }, 1000); // Espera um pouco para a mensagem final aparecer

    }, 3000);
}

function toggleMode() {
    document.body.classList.toggle("dark-mode");
    const modeIcon = document.getElementById("mode-icon");

    if (document.body.classList.contains("dark-mode")) {
        modeIcon.textContent = "☀️"; // Lua
    } else {
        modeIcon.textContent = "🌙"; // Sol
    }
}


function startChat() {
    chatBox.innerHTML = "";
    addMessage("Olá! Seja bem-vindo ao Chat Bot das UPAs. Como posso te ajudar?", "bot");
    showOptions();

    // Define o modo escuro como padrão
    if (!document.body.classList.contains("dark-mode")) {
        document.body.classList.add("dark-mode");
        const modeIcon = document.getElementById("mode-icon");
        modeIcon.textContent = "☀️";
    }
}


function formatarCEP(e) {
    let value = e.target.value.replace(/\D/g, "").slice(0, 8);
    if (value.length > 5) {
        value = value.slice(0, 5) + "-" + value.slice(5);
    }
    e.target.value = value;
}

function bloquearNaoNumeros(e) {
    e.target.value = e.target.value.replace(/\D/g, "");
}

function showError(message) {
    const popup = document.createElement("div");
    popup.className = "error-popup";
    popup.innerText = message;
    inputContainer.appendChild(popup);

    setTimeout(() => {
        userInput.style.border = "";
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 3000);
}

function enviarDadosParaApi(cep, numero, loadingElement) {
    fetch("http://localhost:5000/api/upa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cep: cep, numero: numero })
    })
        .then(response => response.json())
        .then(data => {
            chatBox.removeChild(loadingElement);
            addMessage("Aqui está a melhor UPA para você:", "bot");

            const upaElement = document.createElement("div");
            upaElement.classList.add("message", "bot");
            upaElement.innerHTML = `
            <strong>${data.nome}</strong>
            <p>${data.endereco}</p>
            <p>Distância: ${data.distancia}</p>
            <p>Meio de transporte: ${data.transporte}</p>
            <p>Tempo estimado: ${data.tempo}</p>
            <img src="${data.linkImagem}" alt="Link Maps" style="width:100%;cursor:pointer;" onclick="window.open('${data.linkMaps}', '_blank')">`;
            chatBox.appendChild(upaElement);

            setTimeout(() => {
                addMessage("Obrigado por utilizar o nosso assistente! Se desejar, pode recomeçar a conversa.", "bot");
                inputField.style.display = "none";
                optionsContainer.style.display = "flex";
                optionsContainer.innerHTML = `<button class="restart-button" onclick="startChat()">Recomeçar</button>`;
            }, 500);
        })
        .catch(error => {
            chatBox.removeChild(loadingElement);
            optionsContainer.style.display = "flex";
            optionsContainer.innerHTML = `<button class="restart-button" onclick="startChat()">Recomeçar</button>`;
            inputField.style.display = "none";
            addMessage("Desculpe, houve um erro ao buscar a UPA. Tente novamente mais tarde.", "bot");
            console.error("Erro na comunicação com a API:", error);
        });
}

function verificarEnderecoViaCEP(cep, numero, loadingElement) {
    fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`)
        .then(res => res.json())
        .then(data => {
            if (data.erro) {
                chatBox.removeChild(loadingElement);
                addMessage("Endereço não encontrado. Verifique o CEP e tente novamente.", "bot");

                chatStep = 1; // Volta para o passo do CEP
                inputField.style.display = "flex";
                userInput.setAttribute("maxlength", "9");
                userInput.setAttribute("placeholder", "Digite seu CEP (XXXXX-XXX)");
                userInput.value = "";
                userInput.addEventListener("input", formatarCEP);

                return;
            }

            // Se válido, envia para a sua API Python
            confirmarEndereco(data, cep, numero, loadingElement);

        })
        .catch(error => {
            chatBox.removeChild(loadingElement);
            addMessage("Erro ao verificar o endereço. Tente novamente mais tarde.", "bot");
            optionsContainer.style.display = "flex";
            optionsContainer.innerHTML = `<button class="restart-button" onclick="startChat()">Recomeçar</button>`;
            console.error("Erro na verificação do CEP:", error);
        });
}

function confirmarEndereco(dataViaCep, cep, numero, loadingElement) {
    chatBox.removeChild(loadingElement);

    const enderecoCompleto = `${dataViaCep.logradouro}, ${numero} - ${dataViaCep.bairro}, ${dataViaCep.localidade} - ${dataViaCep.uf}`;

    addMessage(`Confirme seu endereço: ${enderecoCompleto}`, "bot");

    optionsContainer.style.display = "flex";
    optionsContainer.innerHTML = `
        <button class="accept-button" onclick="confirmarEnvioEndereco('${cep}', '${numero}')">Sim</button>
        <button class="restart-button" onclick="repetirEndereco()">Não</button>
    `;

    inputField.style.display = "none";
}

function confirmarEnvioEndereco(cep, numero) {
    optionsContainer.style.display = "none";
    const loader = document.createElement("div");
    loader.className = "loading-spinner";
    const wrapper = document.createElement("div");
    wrapper.className = "message-wrapper bot";
    const img = document.createElement("img");
    img.src = "https://cdn-icons-png.flaticon.com/512/4712/4712109.png";
    img.className = "avatar";
    wrapper.appendChild(img);
    wrapper.appendChild(loader);
    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;

    enviarDadosParaApi(cep, numero, wrapper);
}


function repetirEndereco() {
    addMessage("Certo, vamos tentar novamente. Informe seu CEP (XXXXX-XXX).", "bot");
    chatStep = 1;
    inputField.style.display = "flex";
    optionsContainer.style.display = "none";
    userInput.value = "";
    userInput.setAttribute("maxlength", "9");
    userInput.setAttribute("placeholder", "Digite seu CEP (XXXXX-XXX)");
    userInput.addEventListener("input", formatarCEP);
}


// Ativa o modo escuro por padrão
document.body.classList.add("dark-mode");
startChat();
