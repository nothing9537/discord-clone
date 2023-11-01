import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/widgets/mode-toggle';

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  );
}
 