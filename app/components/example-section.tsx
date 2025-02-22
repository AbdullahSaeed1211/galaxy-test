'use client';

export function ExampleSection() {
  return (
    <section className="py-16 bg-white" id="examples">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Example Video Transformations</h2>
        
        {/* First Example */}
        <div className="max-w-6xl mx-auto bg-white rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium mb-4">Original Video</h4>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  src="/examples/original1.mp4"
                  controls
                  className="w-full h-full"
                  preload="metadata"
                />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Transformed Video</h4>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  src="/examples/transformed1.mp4"
                  controls
                  className="w-full h-full"
                  preload="metadata"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Second Example */}
        <div className="max-w-6xl mx-auto bg-white rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium mb-4">Original Video</h4>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  src="/examples/original2.mp4"
                  controls
                  className="w-full h-full"
                  preload="metadata"
                />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Transformed Video</h4>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  src="/examples/transformed2.mp4"
                  controls
                  className="w-full h-full"
                  preload="metadata"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

