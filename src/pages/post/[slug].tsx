import { GetStaticPaths, GetStaticProps } from 'next';

import { FiCalendar, FiUser, FiClock } from "react-icons/fi";
import { RichText } from 'prismic-dom';
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
  console.log("Post: ", post)
  return (
    <>
      <img className={styles.banner} src="/banner.png" alt="banner" />
      <div className={styles.container}>
        <h1>{post.data.title}</h1>

        <div className={styles.info}>
          <div>
            <FiCalendar />
            <span>{post.first_publication_date}</span>
          </div>
          <div>
            <FiUser />
            <span>{post.data.author}</span>
          </div>
          <div>
            <FiClock />
            <span>15 Mar 2021</span>
          </div>
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
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  return {
    paths: [],
    fallback: 'blocking'
  }
};

export const getStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('post', String(slug), {});

  console.log(JSON.stringify(response, null, 2));

  const content = response.data.content.map(content => {
    return {
      heading: RichText.asText(content.heading),
      body: content.body.map(item => {
        return {
          text: item.text
        }
      })
    };
  });

  const post = {
    first_publication_date: format(new Date(response.first_publication_date), 'PP', { locale: pt }),
    data: {
      title: RichText.asText(response.data.title),
      banner: {
        url: response.data.banner.url
      },
      author: RichText.asText(response.data.author),
      content: content
    }
  }

  return {
    props: {
      post
    }
  }
};
