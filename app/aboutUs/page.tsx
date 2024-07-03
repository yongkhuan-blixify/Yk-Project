"use client";
import CustomHeader from "app/components/Header";
import { HeroSection } from "blixify-ui-web/lib/components/design/heroSection";
import { Container } from "blixify-ui-web/lib/components/structure/container";
import { Text } from "blixify-ui-web/lib/components/structure/text";
import Image from "next/image";
import { useEffect, useState } from "react";
import VisionImage from "../../public/assets/vision.jpg";

export default function AboutUsPage() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("userName");
      setUserName(storedUserName ? storedUserName : "");
    }
  }, []);

  return (
    <div className="bg-black w-screen h-screen">
      <CustomHeader userName={userName} page="About Us" />
      <Container className="pb-20" bgColor="bg-black">
        <HeroSection
          size="small"
          title=""
          content=""
          image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          design="box"
          callToAction={
            <div>
              <Text size="4xl" type="h1" className="font-extrabold text-white">
                Welcome To Cookbook Junction
              </Text>
              <div className="mt-5">
                <Text size="base" type="h1" className="mt-2 text-primary-500">
                  ~ Your ultimate destination for sharing and discovering
                  delightful recipes from all corners of the world!
                </Text>
                <Text size="base" type="h1" className="mt-2 text-white">
                  At Cookbook Junction, we believe that the joy of cooking and
                  the magic of sharing a homemade meal should be accessible to
                  everyone. Our mission is to bring together a diverse community
                  of food enthusiasts, from seasoned chefs to home cooks, and
                  provide a platform where anyone can publish their favorite
                  recipes and share their culinary creativity with the world.
                </Text>
              </div>
            </div>
          }
        />
        <div className="flex flex-col lg:flex-row">
          <Image
            src={VisionImage.src}
            alt="icon"
            width={600}
            height={300}
            style={{
              objectFit: "contain",
              marginBottom: 40,
              marginTop: 10,
              borderRadius: 10,
              marginRight: 30,
            }}
          />
          <div className="flex flex-col">
            <Text size="4xl" type="h1" className="font-extrabold text-white">
              Our Vision
            </Text>
            <Text size="base" type="h1" className="mt-5 text-white">
              We envision Cookbook Junction as a thriving hub where culinary
              enthusiasts come together to celebrate the art of cooking and the
              joy of sharing meals. Our goal is to foster a supportive
              environment where everyone, regardless of their skill level, feels
              encouraged to contribute and learn. By making recipe sharing free
              and accessible, we hope to inspire creativity, promote cultural
              exchange, and build lasting connections within our community.
            </Text>
            <Text size="base" type="h1" className="mt-5 text-white">
              Join us at Cookbook Junction and become part of a global network
              of food lovers. Share your recipes, discover new favorites, and
              connect with others who appreciate the love and effort that goes
              into every dish. Together, we can create a richer, more flavorful
              world, one recipe at a time.
            </Text>
            <Text size="base" type="h1" className="mt-5 text-primary-500">
              Welcome to the community – happy cooking!
            </Text>
          </div>
        </div>
      </Container>
    </div>
  );
}
