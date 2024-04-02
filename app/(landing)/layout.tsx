import { Footer } from "@/components/footer";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col min-h-screen bg-[#111827]">
      <div className="flex-grow">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default LandingLayout;