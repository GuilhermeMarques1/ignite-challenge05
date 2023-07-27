import { GetStaticProps } from 'next';

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

export default function Home({ postsPagination }: HomeProps) {
  console.log(postsPagination);

  return (
    <main className={styles.contentContainer}>
      {
        postsPagination.results.map((post) => (
            <div className={styles.postContainer} key={post.uid}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <time>{post.first_publication_date}</time>
              <p>{post.data.author}</p>
            </div>
          )
        )
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
