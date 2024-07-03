"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

function AuthWrapper(props: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!props.authStore.userLoading) {
      if (props.authStore.userAuth) {
        if (unAuthenticatedPage.includes(window.location.pathname))
          router.replace("/home");
      } else {
        router.replace("/");
      }
    }
  }, [props.authStore]);

  useEffect(() => {
    props.getAuthListener();
    return () => {
      removeAuthListener();
    };
  }, []);

  if (props.authStore.userLoading) {
    return null;
  } else {
    return props.children;
  }
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
