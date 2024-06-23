//simula um banco de dados em memória
var clientes = []

//guarda o objeto que está sendo alterado
var clienteAlterado = null

function adicionar(){
    //libera para digitar o CPF
    document.getElementById("cpf").disabled = false
    clienteAlterado = null
    mostrarModal()
    limparForm()
}
function alterar(cpf){

    //procurar o cliente que tem o CPF clicado no alterar
    for(let i = 0; i < clientes.length; i++){
        let cliente = clientes[i]
        if (cliente.cpf == cpf){
            //achou o cliente, entao preenche o form
            document.getElementById("nome").value = cliente.nome
            document.getElementById("cpf").value = cliente.cpf
            document.getElementById("telefone").value = cliente.telefone
            document.getElementById("datadenascimento").value = cliente.datadenascimento       
            document.getElementById("nomedocachorro").value = cliente.nomedocachorro                       
            clienteAlterado = cliente
        }
    }
    //bloquear o cpf para nao permitir alterá-lo
    document.getElementById("cpf").disabled = true
    mostrarModal()
}
function excluir(cpf){
    if (confirm("Você deseja realmente excluir?")){
    fetch("http://localhost:3002/excluir/" + cpf,{
        headers:{
            "Content-type": "application/json"
            },
            method: "DELETE", 
    }).then((response) => {
    recarregarClientes()
    alert("Cliente excluído com sucesso")
    }).catch((error) => {
        console.log(error)
        alert("Não foi possivel excluir o cliente")
    
    })
        recarregarClientes()
    }
}
function mostrarModal(){
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "flex"
}
function ocultarModal(){
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "none"
}
function cancelar(){
    ocultarModal()
    limparForm()
}
function salvar(){
    let nome = document.getElementById("nome").value
    let cpf = document.getElementById("cpf").value
    let telefone = document.getElementById("telefone").value
    let datadenascimento = document.getElementById("datadenascimento").value
    let nomedocachorro = document.getElementById("nomedocachorro").value   
    //se não estiver alterando ninguém, adiciona no vetor
    if (clienteAlterado == null){
        let cliente = {
            "nome": nome,
            "cpf": cpf,
            "telefone": telefone,
            "datadenascimento": datadenascimento,
            "nomedocachorro": nomedocachorro           
        }



        fetch('http://localhost:3002/cadastrar', {
        headers:{
        "Content-type": "application/json"
        },
        method: "POST", 
        body: JSON.stringify(cliente)
        }).then(() => {
            alert("Cliente cadastrado com sucesso")
        }).catch(() => {
        alert("Ops...Algo deu errado")
        })

        //adiciona o objeto cliente no vetor de clientes
        clientes.push(cliente)
    }else{
        clienteAlterado.nome = nome
        clienteAlterado.cpf = cpf
        clienteAlterado.telefone = telefone
        clienteAlterado.datadenascimento = datadenascimento
        clienteAlterado.nomedocachorro = nomedocachorro        
        fetch('http://localhost:3002/alterar',  {
        headers: {
            "Content-type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(clienteAlterado)
    }).then((response) =>{
        recarregarClientes()
    alert("Cliente alterado com sucesso")
    }).catch((error) => {
    alert("Não foi possível alterar o cliente")
    })
}  

    clienteAlterado = null

    //limpa o form
    limparForm()

    ocultarModal()

    exibirDados()
}

function exibirDados(){

    let tbody = document.querySelector("#table-customers tbody")

    //antes de listar os clientes, limpa todas as linhas
    tbody.innerHTML = ""

    for(let i = 0; i < clientes.length; i++){
        let linha = `
        <tr>
            <td>${clientes[i].nome}</td>
            <td>${clientes[i].cpf}</td>
            <td>${clientes[i].telefone}</td>
            <td>${clientes[i].datadenascimento}</td>
            <td>${clientes[i].nomedocachorro}</td>           
            <td>
                <button onclick="alterar('${clientes[i].cpf}')">Alterar</button>
                <button onclick="excluir('${clientes[i].cpf}')" class="botao-excluir">Excluir</button>
            </td>
        </tr>`
        
        let tr = document.createElement("tr")
        tr.innerHTML = linha

        tbody.appendChild(tr)
    }

}
function limparForm(){
    document.getElementById("nome").value = ""
    document.getElementById("cpf").value = ""
    document.getElementById("telefone").value = ""
    document.getElementById("datadenascimento").value = ""
    document.getElementById("nomedocachorro").value = ""    
}

function recarregarClientes(){
    fetch('http://localhost:3002/listar', {
        headers:{
        "Content-type": "application/json"
        },
        method: "GET", 

}).then((response) => response.json())
.then((response) => {
    clientes = response
    exibirDados()
console.log(response)
}).catch((error) => {
    alert("Erro ao listar os clientes")
    
})
}
