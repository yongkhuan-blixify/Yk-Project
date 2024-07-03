"use client";
import CustomHeader from "../components/Header";
// import { Button } from "blixify-ui-web/lib/components/action/button";
import { Breadcrumb } from "blixify-ui-web/lib/components/navigation/breadcrumb";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";
// import { useRouter } from "next/navigation";

export default function RecipeDetailPage() {
  const pages = [
    { name: "Cookbook Junction", href: "/home", current: false },
    { name: "Recipe Detail", href: "#", current: true },
  ];

  return (
    <div className="bg-black w-screen h-screen">
      <CustomHeader page="Recipe Detail" />

      <Container className="pb-20" bgColor="bg-black">
        <div className="mt-10">
          <Breadcrumb pages={pages} darkMode={true} />
        </div>
        <Text size="4xl" type="h1" className="font-extrabold text-white mt-10">
          Recipe Detail
        </Text>
        <Text size="base" type="h1" className="mt-5 text-white">
          This page provides an in-depth look at each recipe, offering you all
          the information and insights you need to bring the dish to life in
          your own kitchen. This page is designed to give you a comprehensive
          understanding of the recipe, ensuring your cooking experience is as
          smooth and enjoyable as possible.
        </Text>
      </Container>
    </div>
  );
}
