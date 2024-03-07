import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn
    appearance={{
      elements: {
        formButtonPrimary: 'hover:opacity-90 bg-blue-600 transition-color text-slate-100 text-sm normal-case',
      },
      variables: {
        colorPrimary:"#2563eb"
      }
    }}
  />;
}