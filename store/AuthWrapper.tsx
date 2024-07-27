"use client";

import CustomHeader from "app/components/Header";
import { Loading } from "blixify-ui-web";
import { useRouter } from "next/navigation";
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

const unAuthenticatedPage = ["/"];
const USER_LOGIN_KEY = "userLogin";

function AuthWrapper(props: Props) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const localLoginStatus = localStorage.getItem(USER_LOGIN_KEY);
    if (localLoginStatus === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    props.getAuthListener();

    return () => {
      removeAuthListener();
    };
  }, [props.getAuthListener]);

  useEffect(() => {
    if (isLoggedIn !== null && !props.authStore.userLoading) {
      if (props.authStore.userAuth) {
        if (unAuthenticatedPage.includes(window.location.pathname)) {
          router.replace("/home");
        }
        localStorage.setItem(USER_LOGIN_KEY, "true");
        setIsLoggedIn(true);
      } else {
        router.replace("/");
        localStorage.removeItem(USER_LOGIN_KEY);
        setIsLoggedIn(false);
      }
    }
  }, [props.authStore, isLoggedIn, router]);

  if (isLoggedIn === null) {
    return (
      <div className="bg-black w-screen h-screen">
        <CustomHeader page="" />
        <div className="h-full flex justify-center items-center">
          <div>
            <Loading />
            <p className="text-white mt-3">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  return <>{props.children}</>;
}

const mapStateToProps = (state: any) => ({
  authStore: state.authStore,
});

const mapDispatchToProps = (dispatch: any) => ({
  getAuthListener: () => dispatch(getAuthListener()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthWrapper);
