export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-500 mb-4">
          Daneshjo
        </h1>
        <p className="text-green-500 text-lg">
          Welcome to Daneshjo App
        </p>
        <p className="text-red-500 text-sm mt-4">
          Colors should work now!
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded">Blue</span>
          <span className="bg-green-500 text-white px-3 py-1 rounded">Green</span>
          <span className="bg-red-500 text-white px-3 py-1 rounded">Red</span>
        </div>
      </div>
    </div>
  );
}
