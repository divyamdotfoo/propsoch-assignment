import { SearchBar } from "./search-bar";

export type NavbarProps = {
  totalListings?: number;
};

export function Navbar({ totalListings }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-emerald-600"
            >
              <path d="M12 2L2 7V10H22V7L12 2Z" fill="currentColor" />
              <path d="M4 12V20H9V15H15V20H20V12H4Z" fill="currentColor" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Plot Pirate
            </span>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex-1 max-w-3xl mx-8">
          <SearchBar />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {totalListings !== undefined && (
            <span className="text-sm text-gray-600 px-3 py-1.5">
              {totalListings.toLocaleString()} listings
            </span>
          )}
          <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
