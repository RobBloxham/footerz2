import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <article className='mt-20 flex flex-col justify-start gap-10'>
      <div className='flex flex-col gap-10 items-center'> 
        <SignUp path="/sign-up" />;
      </div>
    </article>
  );
}