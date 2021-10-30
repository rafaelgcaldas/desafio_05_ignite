import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';

import { FiCalendar, FiUser } from "react-icons/fi";
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import React, { useEffect, useState } from 'react';
import Post from './post/[slug]';
import { PreviewButton } from '../components/PreviewButton';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export default function Home({ postsPagination, preview }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextpage] = useState<string | null>(postsPagination.next_page);

  async function loadMorePosts() {
    fetch(nextPage)
      .then(response => {
        return response.json()
      })
      .then(post => {
        const { first_publication_date, data, uid } = post.results[0];

        setNextpage(post.next_page);

        const newPost = {
          uid,
          first_publication_date: first_publication_date,
          data: {
            title: data.title,
            subtitle: data.subtitle,
            author: data.author,
          }
        }

        const postList = [];

        postList.push(newPost);

        setPosts([...posts, ...postList]);
      })
  }

  return (
    <>
      <Head>
        <title>Home - Spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
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
                      )}</span>
                  </div>
                  <div>
                    <FiUser />
                    <span>{post.data.author}</span>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
        {!!nextPage && (
          <button onClick={() => loadMorePosts()}>
            Carregar mais posts
          </button>
        )}
        {preview && <PreviewButton />}
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false, previewData = null }) => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post2')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
      orderings: '[document.first_publication_date]',
      ref: previewData?.ref ?? null
    }
  );

  const posts = response.results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: posts,
      },
      preview
    },
    revalidate: 60 * 5, // 5min
  };
};
