import { Disclosure, Menu, Popover, Transition } from "@headlessui/react";
import { Header } from "blixify-ui-web/lib/components/navigation/header";
import { useRouter } from "next/navigation";
import Logo from "../../public/assets/cookbook_junction.jpg";
import UserIcon from "../../public/assets/userIcon.jpg";
import { handleSignOut as signOut } from "../../store/actions/authActions";

interface Props {
  userName: string;
  page: string;
}

export default function CustomHeader(props: Props) {
  const router = useRouter();
  const navigation = [
    { name: "Cookbook Junction", href: "/home" },
    { name: "Recipe of the Day", href: "/random" },
    { name: "About Us", href: "/aboutUs" },
  ];

  const userNavigation = [
    { name: "My Recipe Book", href: "/recipe" },
    { name: "Sign out", action: "logout", href: "/" },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <Header
      defaultNav="/home"
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
      signOut={handleSignOut}
    />
  );
}
