export const Footer = () => {
  return (
    <footer className="bg-[#0c1120] text-white py-4">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="pt-4 py-4 sm:py-6">
          <p className="text-center text-gray-400 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Esifi. All rights reserved.
            <span className="ml-2 inline-block">
              <span className="bg-gray-800 text-gray-400 rounded-md px-1 sm:px-2 py-0.5 sm:py-1 hover:bg-gray-700 transition duration-300 text-xs sm:text-sm">
                Powered by{' '}
                <a
                  href="https://favesco.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  Favesco
                </a>
              </span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};