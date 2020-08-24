import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { withUnstatedContainers } from '~/client/js/components/UnstatedUtils';
// import AppContainer from '~/client/js/services/AppContainer';
import CounterContainer from '~/client/js/services/CounterContainer';

type Props = {
  // appContainer: AppContainer,
  counterContainer: CounterContainer,

  title: string
  children?: ReactNode
}

const Layout = ({ counterContainer, children, title }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href="/about">
          <a>About</a>
        </Link>{' '}
        |{' '}
        <Link href="/users">
          <a>Users List</a>
        </Link>{' '}
        | <a href="/api/users">Users API</a>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <span>I'm here to stay (Footer)</span>
      <hr />
      <span>{counterContainer.state.count}</span>
    </footer>
  </div>
);

export default withUnstatedContainers(Layout, [CounterContainer]);
