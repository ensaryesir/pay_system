import { permanentRedirect } from 'next/navigation';

export default function NotFound() {
  // Use permanentRedirect for immediate server-side redirect without showing content
  permanentRedirect('/error');
}