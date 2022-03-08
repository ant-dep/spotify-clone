import type { NextPage, GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react';
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center';
import Player from '../components/Player';

const Home: NextPage = () => {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Spotify clone</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="flex">
        <Sidebar />
        <Center />
      </main>
        <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {session},
  };
};