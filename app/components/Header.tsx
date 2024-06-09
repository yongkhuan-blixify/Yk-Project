import { Disclosure, Menu, Popover, Transition } from "@headlessui/react";
import { Header } from "blixify-ui-web/lib/components/navigation/header";
import Logo from "../../public/assets/cookbook_junction.jpg";
import UserIcon from "../../public/assets/userIcon.jpg";

interface Props {
  userName: string;
  page: string;
}

export default function CustomHeader(props: Props) {
  const navigation = [
    { name: "Cookbook Junction", href: "/pages/home" },
    { name: "Recipe of the Day", href: "/pages/random" },
    { name: "About Us", href: "/pages/aboutUs" },
  ];

  const userNavigation = [
    { name: "My Recipe Book", href: "/pages/recipe" },
    { name: "Sign out", href: "/" },
  ];

  return (
    <Header
      defaultNav="/pages/home"
      page={props.page}
      logo={Logo.src}
      darkMode
      navigation={navigation}
      userNavigation={userNavigation}
      user={{
        name: props.userName,
        email: "",
        image: UserIcon.src,
      }}
      lib={{
        Disclosure,
        Menu,
        Transition,
        Popover,
      }}
    />
  );
}
