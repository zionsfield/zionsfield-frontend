import React, { SetStateAction } from "react";

type Props = {
  open: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
};

const Menu = ({ open, setOpen }: Props) => {
  return <div>Menu</div>;
};

export default Menu;
