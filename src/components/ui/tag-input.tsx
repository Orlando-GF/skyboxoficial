import * as React from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    tags: string[];
    setTags: (tags: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
    className?: string;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
    ({ tags, setTags, suggestions = [], placeholder, className, ...props }, ref) => {
        const [inputValue, setInputValue] = React.useState("");
        const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([]);
        const [showSuggestions, setShowSuggestions] = React.useState(false);
        const inputRef = React.useRef<HTMLInputElement>(null);

        React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        React.useEffect(() => {
            if (inputValue.trim()) {
                const filtered = suggestions.filter(
                    tag =>
                        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
                        !tags.includes(tag)
                );
                setFilteredSuggestions(filtered);
                setShowSuggestions(true);
            } else {
                setFilteredSuggestions([]);
                setShowSuggestions(false);
            }
        }, [inputValue, suggestions, tags]);

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addTag(inputValue);
            } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
                // Optional: remove last tag? leaving disabled for safety
            }
        };

        const addTag = (tag: string) => {
            const newTag = tag.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
                setInputValue("");
                setShowSuggestions(false);
                inputRef.current?.focus();
            }
        };

        const removeTag = (tagToRemove: string) => {
            setTags(tags.filter((tag) => tag !== tagToRemove));
        };

        return (
            <div className={cn("space-y-3 relative", className)}>
                <div className="relative">
                    <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder || "ADICIONAR TAG + ENTER"}
                        className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all uppercase text-xs tracking-widest placeholder:text-slate-600"
                        onBlur={() => {
                            // Delay hiding to allow click event on suggestion
                            setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        onFocus={() => {
                            if (inputValue.trim()) setShowSuggestions(true);
                        }}
                        {...props}
                    />

                    {/* Suggestions Dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-50 bg-black border border-white/10 border-t-0 max-h-40 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200 shadow-2xl">
                            {filteredSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => addTag(suggestion)}
                                    className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex items-center justify-between group"
                                >
                                    {suggestion}
                                    <Plus size={10} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="default"
                                className="bg-primary text-black hover:bg-primary/90 rounded-none px-2 py-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-default shadow-[2px_2px_0px_#000000]"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 outline-none text-black/50 hover:text-black transition-colors"
                                >
                                    <X size={10} />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

TagInput.displayName = "TagInput";
