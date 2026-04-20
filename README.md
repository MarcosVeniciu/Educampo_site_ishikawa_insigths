# **Educampo \- Ishikawa Insights (Front-end)**

Este projeto é o portal de diagnósticos inteligentes da plataforma Educampo, utilizando IA para análise de causa-raiz (6M) em indicadores zootécnicos.

## **🚀 Tecnologias**

* **Next.js 14+** (App Router)  
* **Tailwind CSS** (Estilização)  
* **Lucide React** (Ícones)  
* **Jest & React Testing Library** (TDD)  
* **Docker** (Containerização)

## **🛠️ Como Executar**

### **1\. Localmente (Desenvolvimento)**
```
# Instalar dependências  
npm install

# Rodar os testes (TDD)  
npm run test

# Iniciar servidor de desenvolvimento  
npm run dev
```

### **2\. Via Docker (Recomendado para Produção/Preview)**

Certifique-se de ter o Docker Desktop instalado.
```
# Subir o ambiente completo  
docker-compose up --build -d
```
Acesse em: [http://localhost:3000](http://localhost:3000)

## **🧪 Estrutura de Testes**

Seguimos a filosofia **Shift-Left Security** e **TDD**:

* **tests/unit**: Validação de componentes e lógica de negócio (Simulador, Dashboard, Diagnóstico).  
* **tests/security**: Proteção contra injeção de scripts (XSS) e segurança de autenticação.

## **📂 Arquitetura**

* **app/**: Roteamento e layouts protegidos.  
* **components/**: UI isolada e reutilizável.  
* **config/**: Configurações de navegação baseada em dados.  
* **mock/**: Simulação de backend para prototipagem rápida.

## **☁️ Deploy (Render)**

Ao realizar o *push* para a branch main, o Render detectará automaticamente o Dockerfile e iniciará o *build multi-stage*, garantindo que o ambiente de produção seja idêntico ao local.