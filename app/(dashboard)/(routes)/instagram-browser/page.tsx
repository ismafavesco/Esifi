import { Inter } from 'next/font/google';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, ExternalLink } from "lucide-react";

const inter = Inter({ subsets: ['latin'] });

const tools = [
  {
    label: "Open in Browser",
    icon: ExternalLink,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "https://esifi-ai.com",
  },
];

export default function InstagramBrowserPage() {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-100`}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center">
            Welcome to Esifi
          </h2>
          <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
            For the best experience, please open this website in a different browser.
          </p>
        </div>
        <div className="space-y-4">
          {tools.map((tool) => (
            <Card
              key={tool.href}
              className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center gap-x-4">
                <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                  <tool.icon className={cn("w-8 h-8", tool.color)} />
                </div>
                <div className="font-semibold">{tool.label}</div>
              </div>
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                <ArrowRight className="w-5 h-5" />
              </a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}