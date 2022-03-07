import type { NextPage } from 'next'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'

const Home: NextPage = () => {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Spotify clone</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="flex">
        <Sidebar />
      </main>
    </div>
  )
}

export default Home
