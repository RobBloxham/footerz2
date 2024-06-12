"use client";
import { SignedIn, SignOutButton, useAuth, SignInButton, SignedOut } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarLinks } from "../../constants";

function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  
  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
        <Image src='/assets/logo-no-background.svg' alt='logo' width={28} height={28} />
        <p className='text-heading3-bold text-light-1 max-xs:hidden'>Footerz</p>
      </Link>
          <SignedIn>
          {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <div className="max-md:hidden">
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive &&""}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className='object-contain'
              />

              <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
            </div>
          );
        })}
            <SignOutButton>
              <div className='flex cursor-pointer text-white'>
                <Image
                  src='/assets/logout.svg'
                  alt='logout'
                  width={24}
                  height={24}
                /> sign out
              </div>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
          <SignInButton
          >
            <div className='flex cursor-pointer text-white'>
              <Image
                src='/assets/members.svg'
                alt='login'
                width={24}
                height={24}
              /> sign in
            </div>
          </SignInButton>
          </SignedOut>
    </nav>
  );
}

export default Topbar;