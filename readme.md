Projeto em grupo da faculdade

Passo 1:
Abre o terminal e digita: npm init -y

Passo 2:
Digite no terminal: npm i nodemon express mongoose dotenv body-parser ejs jsonwebtoken bcrypt

Passo 3:
Acessa https://account.mongodb.com/account/login (se não tiver conta, cria)

Passo 4:
New project -> insere um nome -> adição de membros é parte opcional, pode apenas criar -> create -> selecioa o free -> pode renomear o cluster se quiser -> create -> insere nome de usuário e senha e cria usuário (guarda em algum lugar) -> clica em add my current ip address -> finish and close -> connect -> drivers -> copia a string da segunda caixinha (mongodb+srv:// ...) e clica em close

Passo 5:
No VS Code, cria um arquivo chamado .env (escreve dessa forma, tudo junto mesmo)
Linha 1: DB_USER=seu_usuario
Linha 2: DB_PASS=sua_senha
Linha 3: SECRET=digita_letras_e_numeros_aleatorios

Passo 6:
No arquivo index.js -> no final do arquivo, substitui a string pela string q vc pegou do mongodb atlas -> no início da string está dessa forma: mongodb+srv://seu_usuario:<sua_senha> -> onde tá seu_usuario:<sua_senha> substitui por ${db_user}:${db_pass} -> mais pra frente na string, tem um ? -> antes desse ponto de interrogação vc pode inserir o nome do seu banco de dados (users, por exemplo)

Passo 7:
No terminal, dê o comando npm start (se tudo ocorrer bem, deve aparecer a mensagem "mongodb conectado" no terminal)

Passo 8:
No seu navegador, pesquise por localhost:3000
