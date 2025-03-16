FROM node:lts

WORKDIR /app

# package.json과 package-lock.json을 먼저 복사하여 npm install 실행
COPY backend/package.json /app/
COPY backend/package-lock.json /app/

RUN npm install

# 그 외 필요한 파일들 복사
COPY backend/ /app/

CMD ["npm", "start"]