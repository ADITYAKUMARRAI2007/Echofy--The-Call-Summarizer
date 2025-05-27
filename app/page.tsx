import { AudioProcessor } from "@/components/audio-processor";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <AudioProcessor />
      </main>
      <Footer />
    </div>
  );
}


// export default function Home() {
//   return <div>Hello world</div>;
// }



// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
//       {/* <Header /> */}
//       <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
//         {/* <AudioProcessor /> */}
//       </main>
//       {/* <Footer /> */}
//     </div>
//   );
// }