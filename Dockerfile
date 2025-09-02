# Use uma imagem Node.js como base
FROM node:18-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos do backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copie todo o código do backend
COPY backend/ ./backend/

# Copie os arquivos do frontend
COPY frontend/ ./frontend/

# Copie o package.json da raiz se existir
COPY package*.json ./

# Exponha a porta
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "backend/source/config/server.js"]
