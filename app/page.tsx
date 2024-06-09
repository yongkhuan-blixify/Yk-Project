"use client";
import { TextInput } from "blixify-ui-web/lib";
import { Button } from "blixify-ui-web/lib/components/action/button";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";

import { useRouter } from "next/navigation";

import { CarouselSection } from "blixify-ui-web/lib/components/design/carouselSection";
import { UserModel } from "./models/User";

import { useState } from "react";
import "../styles/globals.css";
import CustomNotification, {
  NotificationState,
} from "./components/Notification";
import CustomTextInput from "./components/TextInput";

export default function Home() {
  const router = useRouter();

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
  const [userCredential, setUserCredential] = useState<UserModel>({
    name: "",
    phone: "",
  });

  const handleSetCurrentSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleSubmit = async () => {
    if (userCredential.name) {
      localStorage.setItem("userName", userCredential.name);
      await router.push("/pages/home");
    } else {
      setNotification({
        type: false,
        title: "We don't know who you are",
        msg: `Please enter your name so we know how to announce you.`,
      });
    }
  };

  return (
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
      <Container className="my-10" bgColor="bg-black">
        <Text size="4xl" type="h1" className="font-extrabold text-white">
          A Cookbook for Everyone, by Everyone
        </Text>
        <TextInput
          id="name"
          value={userCredential.name}
          type="text"
          containerClassName="mt-5"
          label="Please tell us who you are?"
          placeholder="name"
          onChange={(e) => {
            setUserCredential((prevState) => ({
              ...prevState,
              name: e.target.value,
            }));
          }}
        />
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
        <div className="justify-end flex mt-10">
          <Button
            text="Next"
            type="normal"
            size="small"
            onClick={handleSubmit}
            className="my-5 w-1/5"
          />
        </div>
      </Container>
    </div>
  );
}

//First saved works, then refresh error
{
  // <TextInput
  //         id="name"
  //         value={userCredential.name}
  //         type="email"
  //         label="Email"
  //         placeholder="test@gmail.com"
  //         onChange={(e) => {
  //           setUserCredential((prevState) => ({
  //             ...prevState,
  //             name: e.target.value,
  //           }));
  //         }}
  //       />
}
