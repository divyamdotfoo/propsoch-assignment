import {
    Search,
    MapPin,
    Home,
    IndianRupee,
    X,
    Building2,
    Trees,
    LayoutGrid,
    Warehouse
} from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "./ui/popover";
import { Slider } from "./ui/slider";
import { formatPrice } from "@/utils/helpers";

type NavbarProps = {
    listingTypes: string[];
    micromarkets: string[];
    priceRange: { min: number; max: number };
};

const LISTING_TYPE_ICONS: Record<string, typeof Building2> = {
    "Apartment": Building2,
    "Villa": Trees,
    "Plot": LayoutGrid,
    "Row House": Warehouse,
};

export function Navbar({ listingTypes, micromarkets, priceRange }: NavbarProps) {

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
            <div className="flex items-center gap-6 px-6 py-3">
                {/* Logo */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        PlotPirate
                    </span>
                </div>

                {/* Center Search Bar */}
                <div className="flex-1 flex items-center gap-4">
                    {/* Location Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide leading-none">Location</span>
                                <span className="text-sm font-semibold text-gray-900 leading-tight">All Areas</span>
                            </div>
                        </button>

                        {/* Location Dropdown Menu */}
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-96 overflow-y-auto">
                            <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-emerald-600 font-semibold bg-emerald-50 cursor-pointer">
                                All Areas
                            </button>
                            {micromarkets.map((area) => (
                                <button
                                    key={area}
                                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
                                >
                                    {area}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Listing Type Pills */}
                    <div className="flex items-center gap-2">
                        {listingTypes.slice(0, 4).map((type) => {
                            const Icon = LISTING_TYPE_ICONS[type] || Building2;
                            return (
                                <button
                                    key={type}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-400 cursor-pointer"
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {type}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Input */}
                    <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 focus-within:border-gray-300 transition-colors">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by project name..."
                            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                        />
                    </div>

                    {/* Search Button */}
                    <Button
                        variant="primary"
                        size="medium"
                        shape="rounded"
                    >
                        <Search className="w-4 h-4" />
                        Search
                    </Button>
                </div>

                {/* Right Section - Budget Filter */}
                <div className="shrink-0">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 hover:border-gray-400 transition-colors text-gray-700 cursor-pointer">
                                <IndianRupee className="w-4 h-4" />
                                <span className="text-sm font-semibold">Budget</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-80">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900">Price Range</h3>
                                    <PopoverClose asChild>
                                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </PopoverClose>
                                </div>

                                {/* Price Labels */}
                                <div className="flex justify-between text-sm font-semibold text-gray-900">
                                    <span>₹{formatPrice(priceRange.min, false)}</span>
                                    <span>₹{formatPrice(priceRange.max, false)}</span>
                                </div>

                                {/* Slider */}
                                <Slider
                                    defaultValue={[priceRange.min, priceRange.max]}
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    step={1000000}
                                />

                                {/* Apply Button */}
                                <Button
                                    variant="primary"
                                    size="medium"
                                    fullWidth
                                >
                                    Apply
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header>
    );
}
