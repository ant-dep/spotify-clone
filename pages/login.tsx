import {InferGetServerSidePropsType} from 'next';
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react'

function Login({providers}: {providers: InferGetServerSidePropsType<typeof getServerSideProps>}) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <img
        className="mb-5 w-44"
        src="https://links.papareact.com/9xl"
        alt="spotify logo"
      />
      {providers && (Object.values(providers) as unknown as ClientSafeProvider[]).map((provider: ClientSafeProvider) => (
        <div
          key={provider.name}
          className="my-5 cursor-pointer rounded-xl bg-[#18D860] px-5 py-3 font-bold text-white active:scale-[0.99]"
          onClick={() => signIn(provider.id, { callbackUrl: '/' })}
        >
          Login with {provider.name}
        </div>
      ))}
    </div>
  )
}

export default Login

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers,
    },
  }
}
