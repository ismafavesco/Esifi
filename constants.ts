import { Code, ImageIcon, MessageSquare,Mic ,  Edit, } from "lucide-react";

export const MAX_FREE_COUNTS = 5;

export const tools = [
  {
    label: 'Conversation',
    icon: MessageSquare,
    href: '/conversation',
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: 'Anti Ai Detection',
    icon: Edit,
    href: '/text-writer',
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: '/image',
  },
  {
    label: 'Text To Speech',
    icon: Mic ,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: '/speech',
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: '/code',
  },
];