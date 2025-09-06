import { getSession, SessionUser } from "@/lib/session";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  ArrowRightStartOnRectangleIcon,
  ListBulletIcon,
  PencilSquareIcon,
  RectangleStackIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

type Props = {
  user: SessionUser;
};
const Profile = async ({ user }: Props) => {
  const session = await getSession();

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage
            className="rounded-full w-14 border-2 border-white"
            src={user.avatar}
          />
          <AvatarFallback>
            <UserIcon className="w-8 text-slate-500" />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex justify-center items-center gap-3">
          <UserIcon className="w-4" />
          <p>{user.name}</p>
        </div>
        <div className="*:grid *:grid-cols-5 *:gap-3 *:items-center *:my-2 *:py-2 [&>*>span]:col-span-4 [&>*:hover]:bg-sky-500 [&>*:hover]:text-white *:transition *:rounded-md [&>*>*:nth-child(1)]:justify-self-end ">
          <a href="/api/auth/signout">
            <ArrowRightStartOnRectangleIcon className="w-4" />
            <span>Sign Out</span>
          </a>
          {(session?.user.roleName === "admin" ||
            session?.user.roleName === "editor") && (
            <>
              <Link href="/user/create-post">
                <PencilSquareIcon className="w-4 " />
                <span>Create New Post</span>
              </Link>
              <Link href="/user/posts">
                <RectangleStackIcon className="w-4" />
                <span>My Posts</span>
              </Link>
            </>
          )}

          {session?.user.roleName === "admin" && (
            <Link href="/admin/all-posts">
              <ListBulletIcon className="w-4" />
              <span>All Posts</span>
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
