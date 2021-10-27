# Desafio 01, Capítulo 3 -  Criando um projeto do zero

### Sobre o desafio

O desafio consiste em criar uma aplicação para treinar o que foi abordado até agora (Capítulo 2) no ReactJS.
Essa será uma aplicação onde o principal objetivo foi criar um blog do zero. A partir de uma aplicação praticamente em branco que deve consumir os dados do Prismic e ter a interface implementada conforme o layout do Figma.

### Template da aplicação
https://github.com/rocketseat-education/ignite-template-reactjs-criando-um-projeto-do-zero


### Features utlizadas

- Prismic;
- Figma;
- fetch;
- react-icons;
- date-fns.


### Para inicializar a aplicação
 
```bash
yarn dev
```

### O que foi editado na aplicação?
- src/pages/_document.tsx;
- src/pages/index.tsx;
- src/pages/home.module.scss;
- src/pages/post/[slug].tsx;
- src/pages/posts/post.module.scss
- src/components/Header/index.tsx;
- src/components/Header/header.module.scss;
- src/styles/global.scss;
- src/styles/common.module.scss


Todos esses arquivos foram migrados de Javascript para Typescript. Além disso, os arquivos que possuíam componentes em classe foram migrados para componentes funcionais.

### Como a aplicação ficou no final

![home](https://user-images.githubusercontent.com/26827923/138990062-839506fd-9e33-494b-883f-d01f481e5565.png)

![post](https://user-images.githubusercontent.com/26827923/138990100-ef6b9a20-8b1f-4267-b480-d10d3f4b1bcc.png)
