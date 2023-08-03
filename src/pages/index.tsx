import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from "react-icons/fi";

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

export default function Home({ postsPagination }: HomeProps) {
  console.log(postsPagination);

  const handleClick = async () => {
    console.log("chamou!")

    await fetch(postsPagination.next_page)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <main className={styles.contentContainer}>
      {
        postsPagination.results.map((post) => (
            <div className={styles.postContainer} key={post.uid}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div className={styles.info}>
                <FiCalendar size={20}/>
                <time>
                  {
                    format(
                      new Date(post.first_publication_date),
                      "d LLL y",
                      {
                        locale: ptBR
                      }
                    )
                  }
                </time>
                <FiUser size={20}/>
                <p>{post.data.author}</p>
              </div>
            </div>
          )
        )
      }
      {
        postsPagination.next_page ? (
          <div className={styles.loadMore}>
            <button onClick={() => handleClick}>
              Carregar mais posts
            </button>
          </div>
        ) : <></>
      }
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 2
  });

  const posts: Post[] = postsResponse.results.map((post) => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        author: post.data.author,
        subtitle: post.data.subtitle,
        title: post.data.title
      }
    }
  });

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: posts
  }

  return {
    props: {
      postsPagination
    },
    revalidate: 60 * 60 * 24,
  };
};
