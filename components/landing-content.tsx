"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Most Advanced ChatBot",
    description: "Powered with GPT-4-turbo and Claude-3 in one conversation combined for best performance.",
  },
  {
    title: "Text to Voice",
    description: "Convert any text into audio with different voices for content creation.",
  },
  {
    title: "AI Solutions",
    description: "Access a wide range of AI capabilities in one software.",
  },
  {
    title: "24/7 Support",
    description: "Our dedicated support team is always ready to assist you.",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 py-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Why Choose Esifi?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="bg-[#192339] border-none text-white">
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className=" text-zinc-300">{feature.description}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};