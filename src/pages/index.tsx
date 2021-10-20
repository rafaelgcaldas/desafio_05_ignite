import { GetStaticProps } from 'next';

import { FiCalendar, FiUser } from "react-icons/fi";

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.posts}>
        <a>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.info}>
            <div>
              <FiCalendar />
              <span>15 Mar 2021</span>
            </div>
            <div>
              <FiUser />
              <span>15 Mar 2021</span>
            </div>
          </div>
        </a>
        <a>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.info}>
            <div>
              <FiCalendar />
              <span>15 Mar 2021</span>
            </div>
            <div>
              <FiUser />
              <span>15 Mar 2021</span>
            </div>
          </div>
        </a>
        <a>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.info}>
            <div>
              <FiCalendar />
              <span>15 Mar 2021</span>
            </div>
            <div>
              <FiUser />
              <span>15 Mar 2021</span>
            </div>
          </div>
        </a>
        <a>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.info}>
            <div>
              <FiCalendar />
              <span>15 Mar 2021</span>
            </div>
            <div>
              <FiUser />
              <span>15 Mar 2021</span>
            </div>
          </div>
        </a>
      </div>
      <button>Carregar mais posts</button>
    </main>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
