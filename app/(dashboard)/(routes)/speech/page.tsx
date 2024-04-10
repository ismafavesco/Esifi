"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MessageSquare, Mic, Upload } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "@/components/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formSchema } from "./constants";
import { z } from "zod";

const voices = [
  { value: "Rachel", label: "Rachel" },
  { value: "Alice", label: "Alice" },
  { value: "Chris", label: "Chris" },
  { value: "Adam", label: "Adam" },
  { value: "Ethan", label: "Ethan" },
  { value: "Sarah", label: "Sarah" },
];

const SpeechToTextPage = () => {
  const router = useRouter();
  const [outputAudioUrl, setOutputAudioUrl] = useState("");
  const [voice, setVoice] = useState("Adam");
  const [inputMode, setInputMode] = useState("text");
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [frequency, setFrequency] = useState(0);
  const outputAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("voice", voice);

      if (inputMode === "text") {
        formData.append("text", data.text);
      } else if (inputMode === "record") {
        if (audioFile) {
          formData.append("audio", audioFile);
        } else {
          toast.error("Please record your audio.");
          return;
        }
      }

      const response = await axios.post("/api/speech", formData, {
        responseType: "blob",
      });

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const newAudioUrl = URL.createObjectURL(audioBlob);
      setOutputAudioUrl(newAudioUrl);
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

  const handleInputModeChange = (mode: string) => {
    setInputMode(mode);
    setAudioFile(null);
    setAudioUrl("");
    chunksRef.current = [];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        chunksRef.current.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
        setAudioFile(audioFile);
        setAudioUrl(URL.createObjectURL(audioBlob));
      });

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      const frequencyData = new Uint8Array(analyser.frequencyBinCount);

      const renderFrame = () => {
        analyser.getByteFrequencyData(frequencyData);
        const frequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
        setFrequency(frequency);
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      };

      mediaRecorder.start();
      setRecording(true);
      renderFrame();
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const deleteRecording = () => {
    setAudioFile(null);
    setAudioUrl("");
  };

  useEffect(() => {
    if (outputAudioRef.current) {
      outputAudioRef.current.load();
    }
  }, [outputAudioUrl]);

  return (
    <div className="container mx-auto py-8">
      <Heading
        title="Speech to Speech"
        description="Convert speech or text into lifelike speech using a variety of voices."
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
              <label className="block mb-2 text-sm font-medium">Input Mode</label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={inputMode === "text" ? "default" : "outline"}
                  onClick={() => handleInputModeChange("text")}
                >
                  Text
                </Button>
                <Button
                  type="button"
                  variant={inputMode === "record" ? "default" : "outline"}
                  onClick={() => handleInputModeChange("record")}
                >
                  Record Audio
                </Button>
              </div>
            </div>

            {inputMode === "text" && (
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
            )}

            {inputMode === "record" && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Record Audio</label>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant={recording ? "destructive" : "default"}
                    onClick={recording ? stopRecording : startRecording}
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    {recording ? "Stop Recording" : "OUT OF SERVICE (We are Currently working to bring you the best quality.)"}
                  </Button>
                  {audioUrl && (
                    <>
                      <audio src={audioUrl} controls className="mr-2" />
                      <Button type="button" variant="outline" onClick={deleteRecording}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
                {recording && (
                  <div className="mt-4">
                    <div className="h-6 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 transition-all duration-100"
                        style={{ width: `${(frequency / 255) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={formState.isSubmitting}>
                Generate
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {formState.isSubmitting ? <Loader /> : null}

      {outputAudioUrl && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Speech</CardTitle>
          </CardHeader>
          <CardContent>
            <audio ref={outputAudioRef} controls controlsList="nodownload" className="lg:w-full">
              <source src={outputAudioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <a
              href={outputAudioUrl}
              download="generated_speech.mp3"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Download Audio
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpeechToTextPage;