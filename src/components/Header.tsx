import React, { SetStateAction } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/20/solid";
import useRequest from "../hooks/useRequest";
import { UserState } from "../utils/typings";
import { LinkRoutes } from "../utils/enums";

type Props = {
  user: UserState | null;
  open: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
};

const Header = ({ user, open, setOpen }: Props) => {
  const route = useNavigate();
  const location = useLocation();
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      user: !!user,
    },
    {
      label: "Sign out",
      href: "/signout",
      user: !!user,
    },
    {
      label: "Login",
      href: "/login",
      user: !user,
    },
  ];
  console.log(location.pathname);
  const { doRequest: logout, errors: logoutErrors } = useRequest({
    url: `/api/users/signout`,
    method: "post",
    onSuccess: () => {
      route(LinkRoutes.LOGIN);
      window.location.reload();
    },
  });

  return (
    <div className="z-10 flex py-3 bg-blue-400 text-white items-center space-x-3 sticky top-0">
      {/* {location.pathname !== "/" && (
        <div className="ml-4 md:hidden">
          {open ? (
            <XMarkIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() => setOpen(false)}
            />
          ) : (
            <Bars3Icon
              className="w-6 h-6 cursor-pointer"
              onClick={() => setOpen(true)}
            />
          )}
        </div>
      )} */}
      <div className="justify-evenly flex flex-1 items-center">
        <h1 className="text-2xl">
          <Link to={LinkRoutes.HOME}>ZFI</Link>
        </h1>

        <div className="flex space-x-5">
          {links
            .filter((link) => link.user)
            .map((link, i) =>
              link.href !== "/signout" ? (
                <Link key={i + 1} to={link.href}>
                  {link.label}
                </Link>
              ) : (
                <a
                  key={i + 1}
                  onClick={() => logout()}
                  className="cursor-pointer"
                >
                  {link.label}
                </a>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default Header;
