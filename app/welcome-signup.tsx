import { PostSignUpWelcomeView } from '../src/features/auth/PostSignUpWelcomeView';
import { usePostSignUpWelcome } from '../src/features/auth/usePostSignUpWelcome';

export default function PostSignUpWelcomeScreen() {
  return <PostSignUpWelcomeView {...usePostSignUpWelcome()} />;
}
