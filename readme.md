passo 1:
abre o terminal e digita: npm init -y

passo 2:
npm i nodemon express mongoose dotenv body-parser ejs jsonwebtoken bcrypt

passo 3:
acessa https://account.mongodb.com/account/login (se não tiver conta, cria)

passo 4:
New project -> insere um nome -> adição de membros é parte opcional, pode apenas criar -> create -> selecioa o free -> pode renomear o cluster se quiser -> create -> insere nome de usuário e senha e cria usuário (guarda em algum lugar) -> clica em add my current ip address -> finish and close -> connect -> drivers -> copia a string da segunda caixinha (mongodb+srv:// ...) e clica em close

passo 5:
no vscode -> cria um arquivo chamado .env -> escreve dessa forma, tudo junto mesmo
linha 1: DB_USER=seu_usuario
linha 2: DB_PASS=sua_senha
linha 3: SECRET=digita_letras_e_numeros_aleatorios

passo 6:
no arquivo index.js -> no final do arquivo, substitui a string pela string q vc pegou do mongodb atlas -> no início da string tá dessa forma: mongodb+srv://seu_usuario:<sua_senha> -> onde tá seu_usuario:<sua_senha> substitui por ${db_user}:${db_pass} -> mais pra frente na string, tem um ? -> antes desse ponto de interrogação vc pode inserir o nome do seu banco de dados (escreve users, por exemplo)

passo 7:
no terminal, dê o comando npm start (se tudo ocorrer bem, deve aparecer a mensagem "mongodb conectado" no terminal)

passo 8:
no seu navegador, pesquise por localhost:3000