import { Disclosure, Menu, Popover, Transition } from "@headlessui/react";
import { Header } from "blixify-ui-web/lib/components/navigation/header";
import { useRouter } from "next/navigation";
import { connect } from "react-redux";
import { authStateInterface } from "store/reducers/authReducer";
import Logo from "../../public/assets/cookbook_junction.jpg";
import UserIcon from "../../public/assets/userIcon.jpg";
import { handleSignOut as signOut } from "../../store/actions/authActions";

interface Props {
  page: string;
  authStore: authStateInterface;
}

function CustomHeader(props: Props) {
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
    router.push("/");
    localStorage.removeItem("userName");
    await signOut();
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
        name: props.authStore.user ? props.authStore.user.userName : "-",
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

const mapStateToProps = (state: any) => {
  return {
    authStore: state.authStore,
  };
};

export default connect(mapStateToProps)(CustomHeader);
