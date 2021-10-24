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
import React, { useState } from 'react';
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

  function loadMorePosts(link: string) {
    fetch(link)
      .then(response => {
        return response.json()
      })
      .then(post => {
        console.log("post: ", post.results)
        const { first_publication_date, data, uid } = post.results[0];

        const newPost = {
          uid,
          first_publication_date: format(new Date(first_publication_date), 'PP'),
          data: {
            title: data.title[0].text,
            subtitle: data.subtitle[0].text,
            author: data.author[0].text,
          }
        }

        const postList = [];

        postList.push(newPost);

        setPosts([...posts, ...postList]);
      })
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
      {!!postsPagination.next_page && (
        <button onClick={() => loadMorePosts(postsPagination.next_page)}>
          Carregar mais posts
        </button>
      )}
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'post'),
  ], {
    fetch: ['post.title', 'post.subtitle', 'post.author'],
    pageSize: 1,
  });

  console.log(JSON.stringify(postsResponse, null, 2))

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(new Date(post.first_publication_date), 'PP'),
      data: {
        title: post.data.title[0].text,
        subtitle: post.data.subtitle[0].text,
        author: post.data.author[0].text,
      }
    }
  })

  const postsPagination = {
    results,
    next_page: postsResponse.next_page
  }

  return {
    props: {
      postsPagination
    }
  }
};
