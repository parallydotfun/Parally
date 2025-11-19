import DynamicBackground from '../components/DynamicBackground';

export default function BackgroundDemoPage() {
  return (
    <DynamicBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        {/* Demo Content */}
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h1 className="text-6xl md:text-8xl font-everett text-white mb-6">
            Dynamic Background
          </h1>

          <p className="text-xl md:text-2xl font-everett-mono text-gray-300 leading-relaxed">
            Move your cursor around to see the gradient effect follow your movement.
            The subtle grid pattern adds depth while maintaining readability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 p-8 rounded-lg">
              <div className="w-12 h-1 mb-4" style={{ backgroundColor: '#FF4D00' }}></div>
              <h3 className="text-2xl font-everett text-white mb-4">Smooth Tracking</h3>
              <p className="text-gray-400 font-basel">
                The gradient follows your cursor with smooth interpolation for a natural feel.
              </p>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 p-8 rounded-lg">
              <div className="w-12 h-1 mb-4" style={{ backgroundColor: '#FF4D00' }}></div>
              <h3 className="text-2xl font-everett text-white mb-4">Grid Pattern</h3>
              <p className="text-gray-400 font-basel">
                Subtle grid overlay adds visual depth without overwhelming the content.
              </p>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 p-8 rounded-lg">
              <div className="w-12 h-1 mb-4" style={{ backgroundColor: '#FF4D00' }}></div>
              <h3 className="text-2xl font-everett text-white mb-4">Performance</h3>
              <p className="text-gray-400 font-basel">
                Optimized with requestAnimationFrame for 60fps smooth rendering.
              </p>
            </div>
          </div>

          <div className="mt-16 space-y-4">
            <h2 className="text-3xl font-everett text-white">Technical Details</h2>
            <div className="bg-black bg-opacity-50 border border-white border-opacity-20 p-6 rounded-lg text-left">
              <ul className="space-y-3 text-gray-300 font-everett-mono text-sm">
                <li className="flex items-start">
                  <span className="mr-3 text-orange-500">•</span>
                  <span>Base Color: Black (#000000)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-orange-500">•</span>
                  <span>Grid Pattern: 50px squares at 8% opacity</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-orange-500">•</span>
                  <span>Gradient: 600px radial at 15% opacity with screen blend mode</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-orange-500">•</span>
                  <span>Animation: Linear interpolation (lerp) at 0.15 smoothing factor</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-orange-500">•</span>
                  <span>Performance: requestAnimationFrame for optimal 60fps rendering</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16">
            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 font-everett-mono text-sm text-white border-2 hover:bg-white hover:text-black transition-all duration-300"
              style={{ borderColor: '#FF4D00' }}
            >
              ← BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    </DynamicBackground>
  );
}
