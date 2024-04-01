"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MessageSquare } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "@/components/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formSchema } from "./constants";

const voices = [
  { value: "Rachel", label: "Rachel" },
  { value: "Alice", label: "Alice" },
  { value: "Chris", label: "Chris" },
  { value: "Adam", label: "Adam" },
  { value: "Ethan", label: "Ethan" },
  { value: "James", label: "James" },
];

const SpeechToTextPage = () => {
  const router = useRouter();
  const [audioUrl, setAudioUrl] = useState("");
  const [voice, setVoice] = useState("Adam");

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/speech", {
        message: data.text,
        voice,
      }, {
        responseType: "blob",
      });

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error("Error generating speech:", error);
      toast.error("Something went wrong.");
    } finally {
      router.refresh();
    }
  };

  const handleVoiceChange = (value: string) => {
    setVoice(value);
  };

  return (
    <div className="container mx-auto py-8">
      <Heading
        title="Text to Speech"
        description="Convert text into lifelike speech using a variety of voices."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Generate Speech</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="voice" className="block mb-2 text-sm font-medium">
                Voice
              </label>
              <Select value={voice} onValueChange={handleVoiceChange} disabled={formState.isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.value} value={voice.value}>
                      {voice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <label htmlFor="text" className="block mb-2 text-sm font-medium">
                Text
              </label>
              <Textarea
                id="text"
                {...register("text")}
                placeholder="Enter the text to convert to speech"
                disabled={formState.isSubmitting}
                className="h-32"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? <Loader  /> : null}
                Generate
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {audioUrl && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Speech</CardTitle>
          </CardHeader>
          <CardContent>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpeechToTextPage;