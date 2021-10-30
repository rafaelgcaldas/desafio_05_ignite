import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import Prismic from '@prismicio/client';
import { FiCalendar, FiUser, FiClock } from "react-icons/fi";
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { UtterancesComments } from '../../components/UtterancesComments';

interface Post {
  uid?: string;
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
  previousPost?: Post;
  nextPost?: Post;
  preview: boolean;
}

export default function Post({ post, previousPost, nextPost, preview }: PostProps) {

  console.log("aaaa: ", { previousPost, nextPost })

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
      <Head>
        <title>{post.data.title} - Spacetraveling</title>
      </Head>
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

        <div className={styles.pages} style={{ flexDirection: previousPost ? 'row' : 'row-reverse' }}>
          {previousPost && (
            <a href={`/post/${previousPost?.uid}`}>
              <h4>{previousPost?.data?.title}</h4>
              <p>Post anterior</p>
            </a>
          )}
          {nextPost && (
            <a href={`/post/${nextPost?.uid}`}>
              <h4>{nextPost?.data?.title}</h4>
              <p>Próximo Post</p>
            </a>
          )}
        </div>
      </div>
      <UtterancesComments />
    </>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post2')],
    {
      fetch: [],
      pageSize: 100,
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

export const getStaticProps: GetStaticProps  = async ({ 
  params,
  preview = false,
  previewData = {} 
}) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const response = await prismic.getByUID('post2', String(slug), {
    ref: previewData?.ref ?? null,
  });

  if (!response) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const previousResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post2')],
    {
      fetch: ['post2.title'],
      after: response.id,
      orderings: '[document.first_publication_date desc]',
      pageSize: 1,
      ref: previewData?.ref ?? null,
    }
  );

  const nextResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post2')],
    {
      fetch: ['post2.title'],
      after: response.id,
      orderings: '[document.first_publication_date]',
      pageSize: 1,
      ref: previewData?.ref ?? null,
    }
  );

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
      post,
      previousPost: previousResponse.results.length
        ? {
            uid: previousResponse.results[0].uid,
            data: { title: previousResponse.results[0].data.title },
          }
        : null,
      nextPost: nextResponse.results.length
        ? {
            uid: nextResponse.results[0].uid,
            data: { title: nextResponse.results[0].data.title },
          }
        : null,
      preview
    },
    revalidate: 60 * 10, // 10min
  }
};
