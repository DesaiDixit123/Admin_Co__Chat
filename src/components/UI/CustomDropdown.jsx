import React, { useEffect, useRef, useState, useMemo } from "react";

const CustomDropdown = ({
    value,
    options,
    onChange,
    placeholder = "Search...",
    getOptionLabel = (opt) => opt.label,
    getOptionValue = (opt) => opt.value,
    className = "",
    searchable = false,
    readOnly = false,
}) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef([]);

    const selectedOption = options?.find(
        (opt) => getOptionValue(opt) === value
    );

    // Filter options
    const filteredOptions = useMemo(() => {
        if (!searchable) return options;
        if (!search) return options;
        return options.filter((opt) =>
            getOptionLabel(opt).toLowerCase().includes(search.toLowerCase())
        );
    }, [search, options]);

    const selectItem = (item) => {
        onChange(getOptionValue(item));      // update Formik or parent
        setOpen(false);                       // close dropdown
        setActiveIndex(-1);                   // reset active index
        setSearch(getOptionLabel(item));      // show selected value

        // 🔥 remove focus from input
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };
    const handleKeyDown = (e) => {
        if (!open && e.key === "ArrowDown") {
            setOpen(true);
            setActiveIndex(0);
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((prev) =>
                    prev < filteredOptions.length - 1 ? prev + 1 : 0
                );
                break;

            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredOptions.length - 1
                );
                break;

            case "Enter":
                e.preventDefault();
                if (open && activeIndex >= 0) {
                    selectItem(filteredOptions[activeIndex]);
                }
                break;

            case "Escape":
                setOpen(false);
                setActiveIndex(-1);
                break;

            default:
                break;
        }
    };

    const toggleDropdown = () => {
        // optional ref to force open if needed
        // forceOpenRef.current = true;
        if (readOnly) return;
        if (open) {
            // close dropdown
            setOpen(false);
            setActiveIndex(-1);
            if (inputRef.current) {
                inputRef.current.blur();
            }
            return;
        }

        // fetch suggestions or filtered options if needed
        // (replace fetchSuggestions with your function or leave as comment)
        // fetchSuggestions?.(search || "");

        // open dropdown
        setOpen(true);
    };

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Show selected value in input when closed
    useEffect(() => {
        if (!open) {
            if (value) {
                const opt = options.find(
                    (o) => getOptionValue(o) === value
                );
                setSearch(opt ? getOptionLabel(opt) : "");
            } else {
                setSearch("");
            }
        }
    }, [value, open, options]);

    useEffect(() => {
        if (activeIndex >= 0 && listRef.current[activeIndex]) {
            listRef.current[activeIndex].scrollIntoView({
                block: "nearest",
            });
        }
    }, [activeIndex]);
    return (
        <div ref={wrapperRef} className="relative w-full">
            {/* Search Input */}
            <div className={` flex items-center justify-between ${className}`}>
                <input
                    ref={inputRef}
                    type="text"
                    value={open ? search : selectedOption ? getOptionLabel(selectedOption) : ""}
                    placeholder={placeholder}
                    className="bg-transparent w-full outline-none"
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSearch(val);
                        setOpen(true);

                        // 🔥 user cleared text manually
                        if (val === "") {
                            onChange("");       // clear Formik value
                            setActiveIndex(-1);
                        }
                    }}
                    readOnly={!searchable && !value}
                    disabled={readOnly}
                />
                <span
                    className="icon-arrow-down cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()} // prevent blur
                    onClick={toggleDropdown}

                />
            </div>


            {/* Dropdown */}
            {open && (
                <ul className="absolute z-20 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                    {filteredOptions.length === 0 && (
                        <li className="px-3 py-2 text-gray-400">No results</li>
                    )}

                    {filteredOptions.map((item, index) => {
                        const isActive = index === activeIndex;
                        const isSelected = getOptionValue(item) === value; // 🔥 check selected

                        return (
                            <li
                                ref={(el) => (listRef.current[index] = el)}
                                key={index}
                                className={`px-3 py-2 cursor-pointer text-14 text-left
                        ${isActive ? "bg-gray-200" : ""}
                        ${!isActive && isSelected ? "bg-primary font-bold" : "hover:bg-gray-200"}
                    `}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => selectItem(item)}
                            >
                                {getOptionLabel(item)}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default CustomDropdown;
