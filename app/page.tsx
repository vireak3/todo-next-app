import Image from 'next/image';
import Todos from './pages/todos'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Todos/>
    </main>
  );
}
