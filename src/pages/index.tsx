import { GetStaticProps } from 'next';
import Link from 'next/link';

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
}

export default function Home({ postsPagination }: HomeProps) {
  console.log(postsPagination);

  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextpage] = useState<string | null>(postsPagination.next_page);


  async function loadMorePosts() {
    const response = await fetch(nextPage);
    const {results, next_page} = await response.json();

    const newPost = results.map(result => {
      return {
        uid: result.uid,
        first_publication_date: format(new Date(result.first_publication_date), "dd MMM yyyy'", {locale: pt}),
        data: {
          title: RichText.asText(result.data.title),
          subtitle: RichText.asText(result.data.subtitle),
          author: RichText.asText(result.data.author),
        }
      }
    })

    setNextpage(next_page);
    setPosts([...posts, ...newPost]);
  }

  return (
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
                  <span>{post.first_publication_date}</span>
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
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
    }
  );

  const posts = response.results.map(post => ({
    uid: post.uid,
    first_publication_date: format(new Date(post.first_publication_date), "dd MMM yyyy'", {locale: pt}),
    data: {
      title: post.data.title[0].text,
      subtitle: post.data.subtitle[0].text,
      author: post.data.author[0].text,
    },
  }));

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: posts,
      },
    },
    revalidate: 60 * 5, // 5min
  };
};
