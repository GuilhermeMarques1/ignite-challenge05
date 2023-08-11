import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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
  // console.log(JSON.stringify(post, null, 2));
  console.log(post);

  return (
    <main>
      <article>
        <section>
          <img src={post.data.banner.url} alt="imagem do post" />
        </section>

        <header>
          <h1>{post.data.title}</h1>
          <time>{post.first_publication_date}</time>
          <p>
            <span>{post.data.author}</span>
          </p>
          <time>4 min</time>
        </header>
        

        <section>
          <h2></h2>
          <p></p>
          <p></p>
          <p></p>
        </section>
        <section>

        </section>
      </article>
    </main>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  // const posts = await prismic.getByType(TODO);

  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', slug);

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      "d LLL y",
      { locale: ptBR }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url
      },
      author: response.data.author,
      content: response.data.content
    }
  } as Post

  return {
    props: {
      post: post
    }
  }
};
