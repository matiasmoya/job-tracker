export default function HelloWorld() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Hello World!
        </h1>
        <p className="text-gray-600">
          Welcome to your Rails 8.1 + React + Inertia.js application.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          This is rendered by React using Inertia.js
        </p>
      </div>
    </div>
  )
}
