
import { usePage } from '@inertiajs/react';
import HeadTab from './tabs/LoginTabs'

export default function logger() {

  const {club} = usePage().props as unknown as{

    club: {club:string;created_at:string}[]
  }

  

  return (
    <div>
    <HeadTab club={club}/>
    
    </div>
  );
}

