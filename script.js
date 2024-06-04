class Usuario {
    
    constructor (nome,email,senha) {
        
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        
    }
    
}

class Cliente extends Usuario {
    
    constructor (nome,email,senha,numeroConta,saldo) {
        super(nome,email,senha);
        this.numeroConta = numeroConta;
        this.saldo = saldo;
		this.extratoS = new Array();
    }
    
    	extrato(acao,valor,conta,contaEnviada) {
		
			if (acao == 'saque') {
				this.extratoS.push(`Saque realizado no valor de R$ ${valor}`);
				return 0;
			}
			
			if (acao == 'deposito') {
				this.extratoS.push(`Depósito realizado no valor de R$ ${valor}`);
				return 0;
			}
			
			if (acao == 'transferencia') {
				this.extratoS.push(`Transferência realizada no valor de R$ ${valor} para ${conta.nome}`);
				return 0;
			}
			
			conta.extratoS.push(`Transferência recebida no valor de R$ ${valor} de ${contaEnviada.nome}`);
		
	}
    
    saque(valor) {
        
        this.saldo -= valor;
        
        this.extrato('saque',valor);
        
    }
    
    deposito(valor) {
        this.saldo += valor;
        this.extrato('deposito',valor);
    }
    
    transferencia(valor,conta) {
        
		if (conta != 0) {
		    
		    conta.saldo += valor;
		    this.saldo -= valor;
		
	    	this.extrato('transferencia',valor,conta);
			conta.extrato('transferenciaRecebida',valor,conta,this);
		    return `Transferência realizada com sucesso par ${conta.nome}`;
		
		} 
		
		return 'Conta não encontrada';
		
    }
	
    
}

class ListaClientes {
	
	#lista;
	
	constructor () {
		
		this.#lista = new Array();
		
	}
	
	getLista(){
		return this.#lista;
	}
	
	adicionarCliente(conta) {
		this.#lista.push(conta);
		return "Conta adicionada com sucesso";
	}
	
	removerCliente(conta) {
		
		if (conta != 0) {
		    this.#lista.splice(conta,1);
		    return "Cliente excluído com sucesso";
		}
		
		return "Conta não encontrada";
	}
	
	buscarCliente(nConta) {
		
		for (let item in this.#lista) {
			
			if (this.#lista[item].numeroConta ==  nConta) {
				return this.#lista[item];
			}
			
		}
		
		return 0;
		
	}
	
	realizarLogin(email,senha) {
		
		for (let item in this.#lista) {
			
			if (this.#lista[item].email ==  email) {
				
				if (this.#lista[item].senha == senha) {
					return this.#lista[item];
				}
				
				return 0 // Retorno de 0 significará senha inválida
				
			}
			
		}
		
		return 1 // Retorno de 1 significará conta não encontrada
		
	}
	
}

// Clientes cadastrados

const cliente1 = new Cliente ("Júlio Fernandes","julio@gmail.com","123",14,1400);
const cliente2 = new Cliente ("Marcelo Batista","marcelo@gmail.com","1234",5,1000);

//Lista Clientes

const listaClientes = new ListaClientes();
listaClientes.adicionarCliente(cliente1);
listaClientes.adicionarCliente(cliente2);

// Main Script

const seletor = (tag) => document.querySelector(tag);

document.addEventListener('DOMContentLoaded',function (){
	
	// Tela login tags
	const loginScreen = seletor('.login-screen');
	const btnLogin = seletor('.btnLogin');
	const erroLogin = seletor('.erroLogin');
	
	//Botões de ação dos Clientes
	const btnSacar = seletor('.btnSacar');
	const btnTransferir = seletor('.btnTransferir');
	const btnExtrato = seletor('.btnExtrato');
	const btnDepositar = seletor('.btnDepositar');
	
	//Tela Cliente tags
	clienteScreen = seletor('.cliente-screen');
	const nomeCliente = seletor('.nome-cliente');
	const numeroConta = seletor('.numero-conta-cliente');
	const saldoCliente = seletor ('.saldo-cliente');
	const btnFinalizarSessao = seletor('.btnFinalizarSessao');
	
	let clienteLogado;
	
	// Eventos de click
	btnLogin.addEventListener('click',logar);
	
	btnFinalizarSessao.addEventListener('click',finalizarSessao);
	
	btnSacar.addEventListener('click',sacar);
	
	btnDepositar.addEventListener('click',depositar);
	
	btnTransferir.addEventListener('click',transferir);
	
	btnExtrato.addEventListener('click',extrato);
	
	// Funções que utilizam o DOM 
	
	function logar() {
	
		const email = seletor('.txtemail').value;
		const senha = seletor('.txtsenha').value;
		
		const login = listaClientes.realizarLogin(email,senha);
		
		if (login != 0) {
			
			if (login != 1) {
				erroLogin.textContent = '';
				loginScreen.style.display = 'none';
				clienteScreen.style.display = 'block';
				carregarCliente(login);
				clienteLogado = login;
			} else {
				erroLogin.textContent = 'Usuário não encontrado';
			}
			
		} else {
			erroLogin.textContent ='Senha inválida';
		}
	
	
	}
	
	function carregarCliente(cliente) {
		
		nomeCliente.textContent = `Nome: ${cliente.nome}`;
		saldoCliente.textContent = `Saldo: R$ ${cliente.saldo}`;
		numeroConta.textContent = `Número da conta: ${cliente.numeroConta}`;
		
	}
	
	function finalizarSessao() {
		
		loginScreen.style.display = 'block';
		clienteScreen.style.display = 'none';
		
	}
	
	// Funções de ação dos clientes
	
	function sacar() {
		
		const valorSaque = prompt('Digite o valor a sacar:');
		
		clienteLogado.saque(Number(valorSaque));
		
		saldoCliente.textContent = `Saldo; R$ ${clienteLogado.saldo}`;
		
	}
	
	function depositar() {
		
		const valorDeposito = prompt('Digite o valor a depositar:');
		
		clienteLogado.deposito(Number(valorDeposito));
		
		saldoCliente.textContent = `Saldo; R$ ${clienteLogado.saldo}`;
		
	}
	
	function transferir () {
		
		const numeroContaTransferir = Number(prompt ('Digite o número da conta que deseja transferir'));
		
		const valorTransferir = Number(prompt('Digite o valor a ser transferido'));
		
		const contaTransferir = listaClientes.buscarCliente(numeroContaTransferir);
		
		if (contaTransferir != 0) {
			
			alert(clienteLogado.transferencia(valorTransferir,contaTransferir));
			saldoCliente.textContent = `Saldo: R$ ${clienteLogado.saldo}`;
			return 0;
		}
		
		alert ('Conta não encontrad, Transação cancelada!');
		
	}
	
	function extrato (){
		
		let extratoTexto = '';
		
		clienteLogado.extratoS.slice().reverse().forEach (item => extratoTexto += `\n ${item}`);
		
		alert(extratoTexto);
		
	}
	
});
