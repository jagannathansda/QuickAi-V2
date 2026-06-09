"use client";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { TextAnimate } from "./ui/text-animate";
import { LampContainer } from "./ui/lamp";
import { AnimatedShinyButton } from "./ui/animated-shiny-button";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Hero = () => {
const { isSignedIn } = useAuth(); 
  const { openSignIn } = useClerk(); 
  const router = useRouter(); 

  const handleGetStarted = () => {
    if (isSignedIn) {
     
      router.push("/dashboard"); 
    } else {
      openSignIn({
        afterSignInUrl: "/dashboard",
        afterSignUpUrl: "/dashboard",
      });
    }
  };
  
  const words = [
    { text: "Create", color: "#ffffff" },
    { text: "amazing", color: "#ffffff" },
    { text: "content", color: "#ffffff", newline: true },
    { text: "with", color: "#ffffff" },
    { text: "AI", color: "#00B2FF" },
    { text: "tools", color: "#00B2FF" },
  ];

  return (
    <LampContainer>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '0 20px',
        fontFamily: 'Arial, sans-serif',
        marginTop: '-20px'
      }}>
        <TypewriterEffectSmooth words={words} />

        <div style={{
          color: '#a1a1aa',
          fontSize: '16px',
          textAlign: 'center',
          maxWidth: '650px',
          lineHeight: '1.6',
          marginTop: '12px',
          marginBottom: '40px',
          minHeight: '80px' 
        }}>
          <TextAnimate>
            Transform your content creation with our suite of premium AI tools. Write articles, generate stunning images, and streamline your workflow with ease.
          </TextAnimate>
        </div>

        <div onClick={handleGetStarted} style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AnimatedShinyButton>
            Get started
          </AnimatedShinyButton>

          <InteractiveHoverButton>
            Watch demo
          </InteractiveHoverButton>
        </div>
      </div>
    </LampContainer>
  );
}

export default Hero;