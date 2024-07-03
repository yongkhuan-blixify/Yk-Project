"use client";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "blixify-ui-web/lib/components/action/button";
import { EmptyState } from "blixify-ui-web/lib/components/display/emptyState";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";
import { useRouter } from "next/navigation";
import CustomHeader from "../components/Header";

export default function RecipePage() {
  const router = useRouter();

  return (
    <div className="bg-black w-screen h-screen">
      <CustomHeader page="My Recipe Book" />

      <Container className="pb-20" bgColor="bg-black">
        <Text size="4xl" type="h1" className="font-extrabold text-white mt-10">
          My Recipe Book
        </Text>
        <Text size="base" type="h1" className="mt-5 text-white">
          This is a dedicated space where you can easily save and organize all
          the recipes you love. Whether you have found a family favorite or
          discovered a new dish that you cannot wait to try, My Recipe Book
          ensures you have all your culinary treasures in one convenient place.
        </Text>

        <EmptyState
          text="Looking for recipe? Check out more recipe at Cookbook Junction and save your interested recipe here!"
          darkMode
          className="mt-10"
          icon={<InformationCircleIcon className="h-10 text-primary-600" />}
          callToAction={
            <Button
              text="Go to Cookbook Junction"
              type="normal"
              size="small"
              onClick={() => router.push("/home")}
              className="my-5 w-4/5"
            />
          }
        />
      </Container>
    </div>
  );
}
