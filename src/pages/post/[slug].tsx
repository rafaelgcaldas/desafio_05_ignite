import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import Prismic from '@prismicio/client';
import { FiCalendar, FiUser, FiClock } from "react-icons/fi";
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const wordsPerMinute = 200;
  const totalWords = Math.round(
    post?.data.content.reduce(
      (acc, contentItem) =>
        acc +
        contentItem.heading.split(' ').length +
        contentItem.body.reduce(
          (acc2, bodyItem) => acc2 + bodyItem.text.split(' ').length,
          0
        ),
      0
    )
  );

  const totalMinutes = Math.ceil(totalWords / wordsPerMinute);

  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <span>Carregando...</span>
      </div>
    )
  }
  
  return (
    <>
      <img className={styles.banner} src="/banner.png" alt="banner" />
      <div className={styles.container}>
        <h1>{post.data.title}</h1>

        <div className={styles.info}>
          <div>
            <FiCalendar />
            <span>
              {format(
                new Date(post.first_publication_date),
                'dd MMM yyyy',
                {
                  locale: pt,
                }
              )}
            </span>
          </div>
          <div>
            <FiUser />
            <span>{post.data.author}</span>
          </div>
          <div>
            <FiClock />
            <span>{totalMinutes} min</span>
          </div>
        </div>

        <div className={styles.editDate}>
          <p>*editado em 19 de mar 2021, às 15:49</p>
        </div>

        <div className={styles.content}>
          {post.data.content.map(item => (
            <div key={item.heading}>
              <h1>{item.heading}</h1>
              {item.body.map(item => (
                <p key={item.text}>{item.text}</p>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.pages}>
          <div>
            <h4>Como utilizar Hooks</h4>
            <p>Post anterior</p>
          </div>
          <div>
            <h4>Criando um app CRA do Zero</h4>
            <p>Próximo Post</p>
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post2')],
    {
      fetch: [],
      pageSize: 1,
    }
  );

  const paths = response.results.map(post => {
    return {
      params: { slug: post.uid }
    }
  });

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps  = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('post2', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      author: response.data.author,
      title: response.data.title,
      subtitle: response.data.subtitle,
      content: response.data.content,
      banner: {
        url: response.data.banner.url
      },
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 5, // 5min
  }
};
