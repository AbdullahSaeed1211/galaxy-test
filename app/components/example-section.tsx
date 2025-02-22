"use client";

import { useState, useEffect } from "react";

export function ExampleSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Array of video examples
  const videoExamples = [
    {
      original: "/examples/original1.mp4",
      transformed: "/examples/transformed1.mp4",
    },
    {
      original: "/examples/original2.mp4",
      transformed: "/examples/transformed2.mp4",
    },
  ];

  return (
    <section className="py-8 bg-white" id="examples ">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4">
          Example Video Transformations
        </h2>

        {videoExamples.map((video, index) => (
          <div
            key={index}
            className="max-w-6xl mx-auto bg-white rounded-lg p-6 ">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Original Video</h4>
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  {isClient && (
                    <video
                      src={video.original}
                      controls
                      className="w-full h-full"
                      preload="metadata"
                    />
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4">Transformed Video</h4>
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  {isClient && (
                    <video
                      src={video.transformed}
                      controls
                      className="w-full h-full"
                      preload="metadata"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <p className="text-center text-lg text-muted-foreground mb-4">
          Transform your videos into stunning new styles using advanced AI.
          Experience the power of technology as you effortlessly create
          captivating content that engages your audience and elevates your
          brand. Whether you&apos;re a content creator, marketer, or just looking to
          enhance your personal videos, our platform provides the tools you need
          to make your vision a reality.
        </p>
      </div>
    </section>
  );
}
