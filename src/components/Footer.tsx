export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            A product of{' '}
            <a
              href="https://www.pristinex.in"
              target="_blank"
              className="hover:text-purple-700 transition"
            >
              Pristinex Core Labs
            </a> © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
