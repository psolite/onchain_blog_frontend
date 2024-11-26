import HomePage from "@/components/pages/home";

export default function Home() {
  return (
    <div className="container mx-auto p-4 my-8 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center">User Post</h1>
        <p className='text-center mb-8'>Designed on solana devnet By Psolite</p>
        <HomePage />
      </div>
    </div>
  );
}
