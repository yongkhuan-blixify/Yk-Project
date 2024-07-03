"use client";
import {
  BareSignIn,
  Loading,
  SignUpTemplate,
  Stepper,
} from "blixify-ui-web/lib";
import { Button } from "blixify-ui-web/lib/components/action/button";
import { CarouselSection } from "blixify-ui-web/lib/components/design/carouselSection";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";
import { useRouter } from "next/navigation";
import { createRef, useState } from "react";
import {
  resetPassword,
  signInWithEmail,
  signUpWithEmail,
} from "../store/actions/authActions";
import {
  ChangeParam,
  DataInputComponent,
  renderModalInput,
} from "../store/utils/input";
import "../styles/globals.css";
import packageJson from "./../package.json";
import CustomModal from "./components/Modal";
import CustomNotification, {
  NotificationState,
} from "./components/Notification";
// import { UserModel } from "./models/User";

export default function Home() {
  const router = useRouter();

  interface UserInput {
    email: string;
    name: string;
    password: string;
  }

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1563822249510-04678c78df85?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      image:
        "https://images.unsplash.com/photo-1551276928-735cffcdcbc8?q=80&w=1952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      image:
        "https://images.unsplash.com/photo-1552346989-e069318e20a5?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [signUpModal, setSignUpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [userCredential, setUserCredential] = useState<UserModel>({
  //   name: "",
  //   phone: "",
  // });
  const [userInput, setUserInput] = useState<UserInput>({
    email: "",
    name: "",
    password: "",
  });

  const userDataInputComponents: DataInputComponent[] = [
    {
      id: "name",
      type: "textInput",
      label: "Name",
      placeholder: "name",
    },
    {
      id: "email",
      type: "emailInput",
      label: "Email",
      placeholder: "hello@example.com",
    },
    {
      id: "password",
      type: "passwordInput",
      label: "Password",
      placeholder: "********",
    },
  ];

  const userForm: any = createRef();
  const userInputRefs = userDataInputComponents.map(() => createRef());

  const userChangeParam: ChangeParam = {
    state: userInput,
    exclude: [],
    hook: setUserInput,
  };

  const handleSetCurrentSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // const handleSubmit = async () => {
  //   if (userCredential.name) {
  //     localStorage.setItem("userName", userCredential.name);
  //     await router.push("/home");
  //   } else {
  //     setNotification({
  //       type: false,
  //       title: "We don't know who you are",
  //       msg: `Please enter your name so we know how to announce you.`,
  //     });
  //   }
  // };

  const handleCreateAccount = async () => {
    try {
      console.log(userInput.email, userInput.password);
      setLoading(true);
      if ((userInput.email, userInput.password)) {
        await signUpWithEmail(userInput.email, userInput.password);
      }
      router.push("/home");
      setLoading(false);
    } catch (err) {
      setNotification({
        type: false,
        title: "Create Account Failed",
        msg: "Your email has existed, please try a new email",
      });
      setLoading(false);
    }
  };

  const handleSubmitSignIn = async (value: any) => {
    const { type, email, password } = value;
    setLoading(true);
    if (type === "signIn") {
      const signMsg = await signInWithEmail(email, password);
      if (signMsg) {
        setLoading(false);
        setNotification({
          type: false,
          title: "Sign In Error",
          msg: signMsg,
        });
      } else {
        setLoading(false);
        setNotification({
          type: true,
          title: "Sign In Successful",
          msg: "You have sign in successfully",
        });
        router.push("/home");
      }
    } else if (type === "resetPassword") {
      const passMsg = await resetPassword(email);
      setLoading(false);
      setNotification({
        type: true,
        title: "Reset Password",
        msg: passMsg,
      });
    }
  };

  const renderSignUpModalContent = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <Loading />
        <h1 className="mt-5 text-white">
          Please wait while we are verifying your account
        </h1>
      </div>
    );
  };

  const renderLeftComponent = () => {
    const steps = [
      {
        title: "Profile Information",
        description: "Help us to understand you better",
      },
      {
        title: "Creation Success",
        description:
          "Explore your team dashboard or contact cookbook.junction@gmail.com for any further questions",
      },
    ];
    const leftComponents: React.ReactElement = (
      <>
        <h3 className="text-lg font-medium text-white">Create Your Account</h3>
        <Stepper
          light={true}
          steps={steps}
          disabled={true}
          className="mt-5"
          stepIndex={stepIndex}
          onChange={(index: number) => {
            setStepIndex(index);
          }}
        />
        {/* Can try mov the button here */}
      </>
    );

    return leftComponents;
  };

  const renderDataInputsComponents = () => {
    let componentView: any = [];

    userDataInputComponents.map((item, index) =>
      componentView.push(
        renderModalInput(item, userInputRefs[index], index, userChangeParam)
      )
    );

    return componentView;
  };

  return (
    <>
      <div className="bg-black w-screen h-screen">
        <CustomNotification
          notification={notification}
          onClose={() => setNotification(null)}
        />
        <CarouselSection
          slides={slides}
          currentSlide={currentSlide}
          handleSetCurrentSlide={handleSetCurrentSlide}
          carouselHeight={350}
        />
        <CustomModal
          open={loading}
          darkMode
          renderContent={renderSignUpModalContent}
        />
        <Container className="my-10 pb-10" bgColor="bg-black">
          <div className="flex justify-between">
            <div>
              <Text size="4xl" type="h1" className="font-extrabold text-white">
                A Cookbook for Everyone, by Everyone
              </Text>
            </div>
            <div className="">
              <Button
                text={
                  signUpModal
                    ? "Already have an account?"
                    : "Don't have an account?"
                }
                size="small"
                type="darkMode"
                onClick={() => setSignUpModal(!signUpModal)}
                className="self-end w-full"
              />
            </div>
          </div>
          {signUpModal ? (
            <SignUpTemplate
              type={"email"}
              stepIndex={stepIndex}
              leftComponents={renderLeftComponent()}
              leftClassName="bg-black"
              handleUpdateStepIndex={(index) => {
                setStepIndex(index);
              }}
              onChangeProvider={() => {}}
              onCompleteEachStep={() => handleCreateAccount()}
              provider={["email"]}
              formList={{
                steps: [
                  {
                    components: renderDataInputsComponents(),
                    formRef: userForm,
                    refs: userInputRefs,
                    onHandleComponents: () => {
                      userForm.current?.handleSubmit();
                    },
                  },
                ],
              }}
              version={packageJson.version}
            />
          ) : (
            <BareSignIn
              version={packageJson.version}
              type={"email"}
              provider={["email"]}
              onChangeProvider={() => {}}
              onComplete={handleSubmitSignIn}
              column="flex"
              className="w-full px-10"
            />
          )}
          {/* <CustomTextInput
          value={userCredential.name}
          label="Please tell us who you are?"
          containerClassName="mt-5"
          labelClassName="text-gray-400 font-semibold"
          inputClassName="border text-black border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition duration-300"
          onChange={(e) => {
            setUserCredential((prevState) => ({
              ...prevState,
              name: e.target.value,
            }));
          }}
        /> */}
          {/* <div className="justify-end flex mt-10">
          <Button
            text="Next"
            type="normal"
            size="small"
            onClick={handleSubmit}
            className="my-5 w-1/5"
          />
        </div> */}
        </Container>
      </div>
    </>
  );
}
