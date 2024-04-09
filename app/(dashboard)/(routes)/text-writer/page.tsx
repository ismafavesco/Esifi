"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Edit, Send } from "lucide-react";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProModal } from "@/hooks/use-pro-modal";

const formSchema = z.object({
  content: z.string().min(50).max(15000),
  readability: z.enum(["High School", "University", "Doctorate", "Journalist", "Marketing"]),
  purpose: z.enum(["General Writing", "Essay", "Article", "Marketing Material", "Story", "Cover Letter", "Report", "Business Material", "Legal Material"]),
  strength: z.enum(["Quality", "Balanced", "More Human"]).optional().default("Balanced"),
});

const TextWriterPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      readability: "High School",
      purpose: "General Writing",
      strength: "Balanced",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setGeneratedText("");
      setIsLoading(true);
      const response = await axios.post("/api/text-writer", {
        ...values,
        maxWords: 500, // Add the maxWords parameter
      });
      setGeneratedText(response.data.text);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Anti AI Detection Text Writer"
        description="Turn your Text into better quality writing and anti Ai detection. (Max 500 words output)"
        icon={Edit}
        iconColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              rounded-lg
              border
              w-full
              p-4
              px-3
              md:px-6
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            <FormField
              name="content"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel>Content</FormLabel>
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0   "
                      disabled={isLoading}
                      placeholder="Paste your text here. (500 Words Max) "
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="readability"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-4">
                  <FormLabel>Readability</FormLabel>
                  <Select
  disabled={isLoading}
  onValueChange={field.onChange as (value: string) => void}
  value={field.value}
  defaultValue={field.value}
>
  <FormControl>
    <SelectTrigger>
      <SelectValue defaultValue={field.value} />
    </SelectTrigger>
  </FormControl>
  <SelectContent>
    <SelectItem value="High School">High School</SelectItem>
    <SelectItem value="University">University</SelectItem>
    <SelectItem value="Doctorate">Doctorate</SelectItem>
    <SelectItem value="Journalist">Journalist</SelectItem>
    <SelectItem value="Marketing">Marketing</SelectItem>
  </SelectContent>
</Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-4">
                  <FormLabel>Purpose</FormLabel>
                  <Select
  disabled={isLoading}
  onValueChange={field.onChange as (value: string) => void}
  value={field.value}
  defaultValue={field.value}
>
  <FormControl>
    <SelectTrigger>
      <SelectValue defaultValue={field.value} />
    </SelectTrigger>
  </FormControl>
  <SelectContent>
    <SelectItem value="General Writing">General Writing</SelectItem>
    <SelectItem value="Essay">Essay</SelectItem>
    <SelectItem value="Article">Article</SelectItem>
    <SelectItem value="Marketing Material">Marketing Material</SelectItem>
    <SelectItem value="Story">Story</SelectItem>
    <SelectItem value="Cover Letter">Cover Letter</SelectItem>
    <SelectItem value="Report">Report</SelectItem>
    <SelectItem value="Business Material">Business Material</SelectItem>
    <SelectItem value="Legal Material">Legal Material</SelectItem>
  </SelectContent>
</Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="strength"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-4">
                  <FormLabel>Strength</FormLabel>
                  <Select
  disabled={isLoading}
  onValueChange={field.onChange as (value: string) => void}
  value={field.value}
  defaultValue={field.value}
>
  <FormControl>
    <SelectTrigger>
      <SelectValue defaultValue={field.value} />
    </SelectTrigger>
  </FormControl>
  <SelectContent>
    <SelectItem value="Quality">Quality</SelectItem>
    <SelectItem value="Balanced">Balanced</SelectItem>
    <SelectItem value="More Human">More Human</SelectItem>
  </SelectContent>
</Select>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 w-full"
              type="submit"
              disabled={isLoading}
              size="icon"
            >
              Generate
            </Button>
          </form>
        </Form>
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {!generatedText && !isLoading && <Empty label="No text generated." />}
        {generatedText && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Generated Text:</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{generatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextWriterPage;