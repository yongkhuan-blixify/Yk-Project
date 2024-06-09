"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getAuthListener, removeAuthListener } from "./actions/authActions";
import { authStateInterface } from "./reducers/authReducer";
import "./utils/firebase";

interface Props {
  authStore: authStateInterface;
  children: React.ReactNode;
  getAuthListener: () => void;
}

interface SafeProps {
  pathname: string;
  paddingTop: number;
  children: React.ReactNode;
}

function SafeAreaView(props: SafeProps) {
  if (props.pathname === "/") return props.children;
  else
    return (
      <div className="h-screen flex flex-col">
        <div className="w-full" style={{ height: props.paddingTop }}></div>
        <div className="h-full w-full overflow-y-auto">{props.children}</div>
      </div>
    );
}

function AuthWrapper(props: Props) {
  const pathNavigation = usePathname();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const loginPath = ["/", "/auth/verification", "/auth/signIn", "/admin"];
  const nonAuthenticatedPath = JSON.parse(JSON.stringify(loginPath));
  nonAuthenticatedPath.push("/");

  const handleInitaliseApp = () => {
    props.getAuthListener();
  };

  useEffect(() => {
    return () => {
      removeAuthListener();
    };
  }, []);

  useEffect(() => {
    const checkPathInterval = setInterval(() => {
      intervalFunction();
    }, 500);
    const intervalFunction = () => {
      const currentPath = window?.location.pathname;
      if (currentPath) {
        if (!mounted) {
          handleInitaliseApp();
          setMounted(true);
        }
        if (checkPathInterval) clearInterval(checkPathInterval);
      }
    };

    intervalFunction();
    return () => {
      if (checkPathInterval) clearInterval(checkPathInterval);
    };
  }, [pathNavigation]);

  useEffect(() => {
    if (!props.authStore.userLoading) {
      if (props.authStore.user && props.authStore.userAuth) {
        router.replace("/home");
      }
      //   else {
      //     if (!nonAuthenticatedPath.includes(pathname))
      //       router.push("/auth/signIn");
      //   }
    }
  }, [props.authStore]);

  let render = false;

  if (render) return props.children;
}

const mapStateToProps = (state: any) => {
  return {
    authStore: state.authStore,
    utilsStore: state.utilsStore,
    notificationStore: state.notificationStore,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getAuthListener: () => dispatch(getAuthListener()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthWrapper);
